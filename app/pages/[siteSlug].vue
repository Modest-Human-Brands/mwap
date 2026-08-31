<script setup lang="ts">
import type { ConcreteComponent } from 'vue'

const route = useRoute()
const siteSlug = computed(() => route.params.siteSlug as string)

const { data: site, error } = await useAsyncData(`site-${siteSlug.value}`, () => $fetch(`/api/sites/${siteSlug.value}`), {
  watch: [siteSlug],
})

if (error.value || !site.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Site "${siteSlug.value}" could not be found.`,
    fatal: true,
  })
}

const TemplatesUiCommercialV1 = resolveComponent('TemplatesUiCommercialV1') as ConcreteComponent
const TemplatesUiWeddingV1 = resolveComponent('TemplatesUiWeddingV1') as ConcreteComponent

const templateRegistry: Record<string, ConcreteComponent> = {
  'service-lead-gen': TemplatesUiCommercialV1,
  'creator-portfolio': TemplatesUiWeddingV1,
}

const activeTemplateComponent = computed(() => {
  if (!site.value) return null
  return templateRegistry[site.value.templateId] || null
})

if (!templateRegistry[site.value.templateId] || typeof activeTemplateComponent.value === 'string') {
  throw createError({
    statusCode: 500,
    statusMessage: `Template "${site.value.templateId}" is not registered or cannot be resolved.`,
    fatal: true,
  })
}
</script>

<template>
  <main v-if="site && activeTemplateComponent" class="min-h-screen">
    <component :is="activeTemplateComponent" :site="site" />
  </main>
</template>
