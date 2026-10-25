import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { templateId, brand, data, page } = parseSiteInput(await readBody(event), { page: z.string().default('home') })

  if (!(page in data.pages)) throw validationError([{ field: 'page', message: `Unknown page "${page}"`, code: 'invalid_value' }])

  const site: SitePayload = { slug: 'preview', orgId: DEFAULT_ORG_ID, templateId, brand, data, domains: [], updatedAt: new Date().toISOString() }

  // The page is rendered by the app itself, in this process
  const response = await useNitroApp().localFetch(`/_preview?page=${encodeURIComponent(page)}&token=${putPreview(site)}`)
  if (!response.ok) throw createError({ statusCode: 500, statusMessage: 'Preview rendering failed' })

  return { html: toStandaloneHtml(await response.text(), getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin), page }
})
