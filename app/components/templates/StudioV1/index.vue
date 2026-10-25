<script setup lang="ts">
const props = defineProps<{
  site: SitePayload
  pageKey: PageKey
}>()

// On a custom domain pages live at the root, otherwise under the site slug
const customDomain = useState<{ slug: string } | null>('customDomain', () => null)
provide('siteBase', customDomain.value ? '' : `/${props.site.slug}`)

const page = computed(() => props.site.data.pages[props.pageKey])

// The layout is fixed: each page renders these slots in this order; the payload only edits their content
const layout: Record<PageKey, string[]> = {
  home: ['hero', 'projects', 'pricing', 'contact'],
  projects: ['projects', 'contact'],
  about: ['hero', 'story', 'contact'],
}

const slotComponents: Record<string, Component> = {
  hero: resolveComponent('TemplatesStudioV1Hero') as Component,
  projects: resolveComponent('TemplatesStudioV1Projects') as Component,
  pricing: resolveComponent('TemplatesStudioV1Pricing') as Component,
  story: resolveComponent('TemplatesStudioV1AboutContact') as Component,
  contact: resolveComponent('TemplatesStudioV1AboutContact') as Component,
}

// A hidden slot (`enabled: false`) is skipped, its content is kept in the payload
const slots = computed(() => layout[props.pageKey].map((name) => ({ name, content: (page.value as Record<string, { enabled: boolean }>)[name] })).filter(({ content }) => content?.enabled))
</script>

<template>
  <div class="min-h-screen bg-brand-bg font-brand text-brand-text">
    <TemplatesStudioV1Header :site="site" />
    <main>
      <component :is="slotComponents[slot.name]" v-for="slot in slots" :id="slot.name" :key="slot.name" :section="slot.content" />
    </main>
    <TemplatesStudioV1Footer :site="site" />
  </div>
</template>
