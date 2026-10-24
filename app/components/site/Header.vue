<script setup lang="ts">
defineProps<{
  site: SitePayload
}>()
</script>

<template>
  <header class="bg-brand-bg/90 sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <SiteLink href="/" class="flex items-center gap-3">
        <img :src="site.brand.logoUrl" :alt="site.brand.name" class="size-9 rounded-md object-cover" />
        <span class="text-lg font-bold uppercase tracking-tight">{{ site.brand.name }}</span>
      </SiteLink>
      <nav class="hidden items-center gap-8 md:flex">
        <SiteLink v-for="link in site.navigation" :key="link.href" :href="link.href" class="text-xs font-bold uppercase tracking-wide opacity-70 transition hover:opacity-100">
          {{ link.label }}
        </SiteLink>
      </nav>
    </div>
  </header>
</template>
