<script setup lang="ts">
defineProps<{
  site: SitePayload
}>()
</script>

<template>
  <footer class="border-t border-brand-text/10 py-8 text-center text-xs opacity-60">© {{ new Date().getFullYear() }} {{ site.brand.name }}</footer>
</template>
