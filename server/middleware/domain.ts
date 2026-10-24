// Paths that never belong to a site's public pages
const INTERNAL = /^\/(api|_nuxt|_ipx|_preview|__sitemap__|mcp)(\/|$)/

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Custom domains: `example.com/projects` serves the site that owns `example.com`.
 * - `www.<domain>` and `/<slug>/...` on a domain redirect (301) to the clean URL
 * - `/sitemap.xml` lists only that site's pages
 * - the owning site is handed to the app through `event.context.customDomain`
 * An unknown host keeps the `/<slug>/...` routes.
 */
export default defineEventHandler(async (event) => {
  const { pathname, search } = getRequestURL(event)
  if (INTERNAL.test(pathname)) return

  const host = getRequestHost(event, { xForwardedHost: true }).toLowerCase().replace(/:\d+$/, '')
  const protocol = getRequestProtocol(event, { xForwardedProto: true })

  const apex = host.startsWith('www.') ? host.slice(4) : host
  const slug = await getSlugByDomain(apex)
  if (!slug) return

  if (apex !== host) return sendRedirect(event, `${protocol}://${apex}${pathname}${search}`, 301)

  const site = await getSite(slug)
  if (!site) return

  const origin = `${protocol}://${host}`

  if (pathname === '/sitemap.xml') {
    const urls = Object.keys(site.data.pages).map((page) => `  <url><loc>${escapeXml(page === 'home' ? `${origin}/` : `${origin}/${page}`)}</loc></url>`)
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  }

  // `/<slug>/projects` -> `/projects`, unless the slug is also the name of one of the pages
  const [first, ...rest] = pathname.split('/').filter(Boolean)
  if (first === slug && !(first in site.data.pages)) return sendRedirect(event, `/${rest.join('/')}${search}`, 301)

  event.context.customDomain = { slug, origin }
})
