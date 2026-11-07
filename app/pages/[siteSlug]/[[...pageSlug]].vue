<script setup lang="ts">
const { site, pageKey } = await useSitePage()
</script>

<template>
  <SiteRenderer :site="site" :page-key="pageKey" />
</template>
