<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError<{ notFound?: { brand: BrandPayload; imageUrl: string; homeHref: string } }>
}>()

// A page that does not exist on a site is answered in the look of that site, anything else with the plain error
const notFound = computed(() => props.error.data?.notFound)

if (notFound.value) {
  useBrandHead(notFound.value.brand)
  useHead({ title: `Page not found | ${notFound.value.brand.name}`, meta: [{ name: 'robots', content: 'noindex' }] })
}
</script>

<template>
  <TemplatesContactSheetNotFound v-if="notFound" :brand-name="notFound.brand.name" :image-url="notFound.imageUrl" :home-href="notFound.homeHref" />
  <main v-else style="padding: 3rem 1.5rem; font-family: sans-serif">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
  </main>
</template>
