<script setup lang="ts">
import type { NuxtError } from '#app'
import { templateNotFound } from '~~/templates/components'

const props = defineProps<{
  error: NuxtError<{ notFound?: { templateId: string; brand: BrandPayload; imageUrl: string; homeHref: string } }>
}>()

// A page that does not exist on a site is answered in the look of that site, anything else with the plain error
const notFound = computed(() => props.error.data?.notFound)
const NotFound = computed(() => (notFound.value ? defineAsyncComponent(templateNotFound[notFound.value.templateId]!) : undefined))

if (notFound.value) {
  useBrandHead(notFound.value.brand)
  useHead({ title: `Page not found | ${notFound.value.brand.name}`, meta: [{ name: 'robots', content: 'noindex' }] })
}
</script>

<template>
  <component :is="NotFound" v-if="notFound && NotFound" :brand-name="notFound.brand.name" :image-url="notFound.imageUrl" :home-href="notFound.homeHref" />
  <main v-else style="padding: 3rem 1.5rem; font-family: sans-serif">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
  </main>
</template>
