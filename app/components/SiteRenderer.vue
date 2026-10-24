<script setup lang="ts">
defineProps<{
  site: SitePayload
  pageKey: PageKey
}>()

// One entry per template in the shared registry
const templateComponents: Record<string, Component> = {
  'studio-v1': resolveComponent('TemplatesStudioV1') as Component,
}
</script>

<template>
  <component :is="templateComponents[site.templateId]" :site="site" :page-key="pageKey" />
</template>
