<script setup lang="ts">
const props = defineProps<{
  href: string
}>()

const siteSlug = useRoute().params.siteSlug as string

// Site-relative paths ("/", "/projects", "/#pricing") are prefixed with the site slug
const to = computed(() => {
  if (!props.href.startsWith('/')) return null
  const rest = props.href.slice(1)
  return `/${siteSlug}${rest && !rest.startsWith('#') ? '/' : ''}${rest}`
})
</script>

<template>
  <NuxtLink v-if="to" :to="to"><slot /></NuxtLink>
  <a v-else :href="href"><slot /></a>
</template>
