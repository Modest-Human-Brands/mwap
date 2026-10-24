<script setup lang="ts">
const props = defineProps<{
  href: string
}>()

const siteBase = inject<string>('siteBase', '')

// Site-relative paths ("/", "/projects", "/#pricing") are prefixed with the site's base path
const to = computed(() => {
  if (!props.href.startsWith('/')) return null
  const rest = props.href.slice(1)
  if (!siteBase) return `/${rest}`
  return `${siteBase}${rest && !rest.startsWith('#') ? '/' : ''}${rest}`
})
</script>

<template>
  <NuxtLink v-if="to" :to="to"><slot /></NuxtLink>
  <a v-else :href="href"><slot /></a>
</template>
