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

  const page = extraSegment ? undefined : site.value.data.pages[pageKey]

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: `Page "${pageKey}" not found.`, fatal: true })
  }

  // The Nuxt context is lost after the await above
  nuxtApp.runWithContext(() => {
    // Canonical URL and og:url follow the domain the visitor is on
    if (customDomain.value) {
      const url = `${customDomain.value.origin}${route.path === '/' ? '' : route.path}`
      useHead({ link: [{ rel: 'canonical', href: url }] })
      useSeoMeta({ ogUrl: url })
    }

    useSiteHead(site as Ref<SitePayload>, page)
  })

  return { site: site as Ref<SitePayload>, pageKey }
}
