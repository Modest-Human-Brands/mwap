import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(() => listSitePaths().map((loc) => ({ loc, _sitemap: 'sitemap' }) satisfies SitemapUrlInput))
