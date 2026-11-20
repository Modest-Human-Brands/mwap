import type { H3Event } from 'h3'

/** What a template read is cached as: public like the site page itself */
export const TEMPLATE_READ_CACHE = 's-maxage=60, stale-while-revalidate=300'

/**
 * The site of a template route (/api/site/:slug/...). A site whose template does not own the route answers 404, exactly like an
 * unknown slug, so the routes of one template are never visible on another.
 */
export async function requireTemplateSite(event: H3Event, templateIds: readonly string[]) {
  const slug = getRouterParam(event, 'slug') ?? ''
  const site = await getSite(slug)
  if (!site || !templateIds.includes(site.templateId)) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })
  return site
}

/** A template read: the site is public, so is the answer */
export function cacheTemplateRead(event: H3Event) {
  setHeader(event, 'Cache-Control', TEMPLATE_READ_CACHE)
}
