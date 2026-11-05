/** Web app manifest of one site, so installing it uses the brand of the site and not MWap's own identity */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const site = await getSite(slug)

  if (!site) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  const { brand } = site
  // On a custom domain the site is served from the root
  const scope = event.context.customDomain ? '/' : `/${site.slug}`
  const iconType = new URL(brand.faviconUrl).pathname.endsWith('.svg') || brand.faviconUrl.includes('.svg') ? 'image/svg+xml' : undefined

  setHeader(event, 'Content-Type', 'application/manifest+json')
  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  return {
    name: brand.name,
    short_name: brand.name.slice(0, 12),
    start_url: scope,
    scope,
    display: 'standalone',
    background_color: brand.colors.background,
    theme_color: brand.colors.background,
    icons: [{ src: brand.faviconUrl, sizes: 'any', ...(iconType ? { type: iconType } : {}), purpose: 'any' }],
  }
})
