import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async () => (await listSitePaths()).map((loc) => ({ loc, _sitemap: 'sitemap' }) satisfies SitemapUrlInput))
