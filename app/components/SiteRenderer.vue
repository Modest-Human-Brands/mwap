<script setup lang="ts">
import { templateComponents } from '~~/templates/components'

const props = defineProps<{
  site: SitePayload
  pageKey: PageKey
}>()

// Loaded on demand, one component per template id (see templates/components.ts)
const TemplateComponent = computed(() => defineAsyncComponent(templateComponents[props.site.templateId]!))
</script>

<template>
  <component :is="TemplateComponent" :site="site" :page-key="pageKey" />
</template>
