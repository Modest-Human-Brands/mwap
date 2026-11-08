import { timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

/** Guards write endpoints: x-api-key must equal NUXT_MWAP_PRIVATE_API_KEY (read at runtime); with no key configured writes stay disabled */
export function requireApiKey(event: H3Event) {
  const expected = useRuntimeConfig().mwap.private.apiKey
  const received = getHeader(event, 'x-api-key') ?? ''

  const valid = expected.length > 0 && received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected))
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Missing or invalid API key' })
  }
}
