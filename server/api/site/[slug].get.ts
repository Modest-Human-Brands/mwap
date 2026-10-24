export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const site = await getSite(slug)

  if (!site) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  return site
})
