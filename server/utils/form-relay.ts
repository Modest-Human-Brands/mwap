import type { z } from 'zod'
import type { H3Event } from 'h3'

/**
 * Checks a public form body and hands it to the URL the site owner configured. MWap stores nothing: 202 means the receiver
 * accepted it. A site without that URL answers 422, an unreachable or refusing receiver 502.
 */
export async function relayForm<Schema extends z.ZodType>(event: H3Event, { schema, endpoint, kind, slug }: { schema: Schema; endpoint: string | undefined; kind: string; slug: string }) {
  const parsed = schema.safeParse(await readBody(event).catch(() => undefined))
  if (!parsed.success) throw validationError(parsed.error.issues.map(({ path, message, code }) => ({ field: path.join('.'), message, code })))
  if (!endpoint) throw createError({ statusCode: 422, statusMessage: 'Unprocessable Content', message: `This site has no ${kind} endpoint configured` })

  try {
    // No redirects: a receiver must not be able to send the relay to another host
    await $fetch(endpoint, { method: 'POST', body: { type: kind, site: slug, receivedAt: new Date().toISOString(), ...(parsed.data as object) }, timeout: 8000, redirect: 'error', retry: 0 })
  } catch (error) {
    console.error(`relay ${kind} for ${slug} failed`, (error as Error).message)
    throw createError({ statusCode: 502, statusMessage: 'Bad Gateway', message: 'The receiver of this form did not accept it' })
  }

  setHeader(event, 'Cache-Control', 'no-store')
  setResponseStatus(event, 202)
  return { delivered: true as const }
}
