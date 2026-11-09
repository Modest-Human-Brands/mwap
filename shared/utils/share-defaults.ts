type Brand = { name: string; logoUrl: string }

const humanize = (key: string) => key.charAt(0).toUpperCase() + key.slice(1).replace(/[-_]+/g, ' ')

/**
 * What link previews and search results show when a site does not send it. These come from the brand and the site URL and never from
 * the template sample, which belongs to someone else: the title is the brand name, the description is built from it, the share
 * image is the brand logo and the canonical URL is the site itself. Merge it over the sample, then the input over it.
 */
export function shareDefaults(sample: unknown, brand: Brand, slug: string, siteUrl: string) {
  const pages = (sample as { pages?: Record<string, unknown> } | null)?.pages ?? {}
  return {
    seo: { ogImage: brand.logoUrl, ...(siteUrl && { canonicalUrl: `${siteUrl.replace(/\/+$/, '')}/${slug}` }) },
    pages: Object.fromEntries(Object.keys(pages).map((key) => [key, { title: key === 'home' ? brand.name : `${humanize(key)} | ${brand.name}`, description: `${brand.name}'s portfolio.` }])),
  }
}
