<script setup lang="ts">
// Rendered in-process by POST /api/site/template/preview; without a valid single-use token the route is a 404
const route = useRoute()
const pageKey = (route.query.page as PageKey | undefined) ?? 'home'

const { data: site } = await useAsyncData('preview-site', () => $fetch<SitePayload>(`/api/site/template/preview/${route.query.token}`))

if (!site.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

useSiteHead(site as Ref<SitePayload>, site.value.data.pages[pageKey])
useHead({ meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <SiteRenderer :site="site!" :page-key="pageKey" />
</template>
