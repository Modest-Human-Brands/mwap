export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'siteSlug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Site slug parameter is required' })
  }

  const site = getSite(slug)

  if (!site) {
    throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })
  }

  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  return site
})
