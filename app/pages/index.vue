<script setup lang="ts">
// Only a custom domain has a home page at `/`; on the app's own host there is nothing here
if (!useState('customDomain', () => useRequestEvent()?.context.customDomain ?? null).value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

const { site, pageKey } = await useSitePage()
</script>

<template>
  <SiteRenderer :site="site" :page-key="pageKey" />
</template>
