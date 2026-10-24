<script setup lang="ts">
const route = useRoute()
const siteSlug = route.params.siteSlug as string
const pageKey = ((route.params.pageSlug as string | undefined) || 'home') as PageKey

const { data: site } = await useFetch(`/api/sites/${siteSlug}`, { key: `site-${siteSlug}` })

if (!site.value) {
  throw createError({ statusCode: 404, statusMessage: `Site "${siteSlug}" not found.`, fatal: true })
}

const page = site.value.pages[pageKey]

if (!page) {
  throw createError({ statusCode: 404, statusMessage: `Page "${pageKey}" not found.`, fatal: true })
}

useSiteHead(site as Ref<SitePayload>, page)

const sectionComponents = {
  hero: resolveComponent('SiteHero'),
  projects: resolveComponent('SiteProjects'),
  pricing: resolveComponent('SitePricing'),
  'about-contact': resolveComponent('SiteAboutContact'),
}
</script>

<template>
  <div class="min-h-screen bg-brand-bg font-brand text-brand-text">
    <SiteHeader :site="site!" />
    <main>
      <component :is="sectionComponents[section.type]" v-for="section in page.sections" :key="section.id" :section="section" />
    </main>
    <SiteFooter :site="site!" />
  </div>
</template>
