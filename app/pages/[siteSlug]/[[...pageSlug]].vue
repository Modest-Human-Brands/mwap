<script setup lang="ts">
// One page at a time: moving to another page of the site swaps it (with the view transition of app.vue)
definePageMeta({ key: (route) => route.fullPath })

const { site, pageKey } = await useSitePage()
</script>

<template>
  <SiteRenderer :site="site" :page-key="pageKey" />
</template>
