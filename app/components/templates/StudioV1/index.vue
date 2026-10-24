<script setup lang="ts">
const props = defineProps<{
  site: SitePayload
  pageKey: PageKey
}>()

// On a custom domain pages live at the root, otherwise under the site slug
const customDomain = useState<{ slug: string } | null>('customDomain', () => null)
provide('siteBase', customDomain.value ? '' : `/${props.site.slug}`)

const page = computed(() => props.site.data.pages[props.pageKey])

const sectionComponents = {
  hero: resolveComponent('TemplatesStudioV1Hero'),
  projects: resolveComponent('TemplatesStudioV1Projects'),
  pricing: resolveComponent('TemplatesStudioV1Pricing'),
  'about-contact': resolveComponent('TemplatesStudioV1AboutContact'),
}
</script>

<template>
  <div class="min-h-screen bg-brand-bg font-brand text-brand-text">
    <TemplatesStudioV1Header :site="site" />
    <main>
      <component :is="sectionComponents[section.type]" v-for="section in page.sections" :key="section.id" :section="section" />
    </main>
    <TemplatesStudioV1Footer :site="site" />
  </div>
</template>
