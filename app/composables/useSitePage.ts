/**
 * Resolves the site and page of the current route. On a custom domain (see server/middleware/domain.ts)
 * the first path segment is the page; otherwise it is `/:siteSlug/:pageSlug?`.
 */
export async function useSitePage() {
  const nuxtApp = useNuxtApp()
  const route = useRoute()

  // Set by the server middleware, then carried to the client in the payload so hydration matches
  const customDomain = useState<{ slug: string; origin: string } | null>('customDomain', () => useRequestEvent()?.context.customDomain ?? null)

  const siteSlug = customDomain.value?.slug ?? (route.params.siteSlug as string | undefined)
  const pageSlug = (customDomain.value ? route.params.siteSlug : route.params.pageSlug) as string | undefined
  const extraSegment = customDomain.value ? route.params.pageSlug : undefined
  const pageKey = (pageSlug || 'home') as PageKey

  const { data: site } = await useFetch<SitePayload>(`/api/site/${siteSlug}`, { key: `site-${siteSlug}` })

  if (!site.value?.data) {
    throw createError({ statusCode: 404, statusMessage: `Site "${siteSlug}" not found.`, fatal: true })
  }

  const page = extraSegment ? undefined : sitePage(site.value.data, pageKey)

  if (!page) {
    // The error page answers in the look of the site, so it needs its brand and, for some templates, a picture
    const { brand, data, templateId } = site.value
    throw createError({
      statusCode: 404,
      statusMessage: `Page "${pageKey}" not found.`,
      fatal: true,
      data: { notFound: { templateId, brand, imageUrl: templates[templateId]?.notFoundImage?.(data) ?? '', homeHref: customDomain.value ? '/' : `/${site.value.slug}` } },
    })
  }

  // The Nuxt context is lost after the await above
  nuxtApp.runWithContext(() => {
    // Canonical URL and og:url follow the domain the visitor is on
    if (customDomain.value) {
      const url = `${customDomain.value.origin}${route.path === '/' ? '' : route.path}`
      useHead({ link: [{ rel: 'canonical', href: url }] })
      useSeoMeta({ ogUrl: url })
    }

    // Installing the site uses its own identity; MWap's manifest is not linked from site pages
    useHead({ link: [{ rel: 'manifest', href: `/api/site/${site.value!.slug}/manifest` }] })
    // Each site reports to its own property; a site without an id sends nothing
    if (site.value!.googleAnalyticsId) useScriptGoogleAnalytics({ id: site.value!.googleAnalyticsId })
    useSiteHead(site as Ref<SitePayload>, page)
  })

  return { site: site as Ref<SitePayload>, pageKey }
}
