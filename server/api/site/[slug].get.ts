export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const site = await getSite(slug)

  // With the access headers only the caller's own site is visible; another organization's answers like a missing one
  const access = optionalAccess(event)
  if (!site || (access && site.orgId !== access.orgId)) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  // A scoped answer depends on the key in the request, so it is never shared through a cache
  setHeader(event, 'Cache-Control', access ? 'no-store' : 's-maxage=60, stale-while-revalidate=300')
  // Who owns a site is shown only to its own organization
  return access ? site : withoutOwner(site)
})
