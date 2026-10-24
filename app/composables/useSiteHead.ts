export function useSiteHead(site: MaybeRefOrGetter<SitePayload>, page: PagePayload) {
  // `meta` is private runtime config: it only exists during SSR
  const buildTime = useRuntimeConfig().meta?.buildTime

  useHead(() => {
    const { brand } = toValue(site)
    const { colors } = brand

    return {
      titleTemplate: '%s',
      link: [
        { rel: 'icon', href: brand.faviconUrl },
        { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?family=${brand.fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap` },
      ],
      style: [
        {
          textContent: `:root{--brand-primary:${colors.primary};--brand-secondary:${colors.secondary};--brand-accent:${colors.accent};--brand-bg:${colors.background};--brand-text:${colors.text};--brand-font:'${brand.fontFamily}',sans-serif;}`,
        },
      ],
    }
  })

  useSeoMeta({
    title: page.title,
    description: page.description,
    ogTitle: page.title,
    ogDescription: page.description,
    ogImage: () => toValue(site).data.seo.ogImage,
    ogSiteName: () => toValue(site).brand.name,
  })

  useSchemaOrg([
    defineWebSite({
      name: () => toValue(site).brand.name,
      url: () => toValue(site).data.seo.canonicalUrl,
    }),
    defineWebPage({
      name: page.title,
      description: page.description,
      datePublished: buildTime || undefined,
      dateModified: buildTime || undefined,
    }),
  ])
}
