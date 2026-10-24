<script setup lang="ts">
defineProps<{
  section: SiteSectionOf<'hero'>
}>()
</script>

<template>
  <section :id="section.id" class="relative isolate flex min-h-[70vh] items-center overflow-hidden">
    <img :src="section.mediaUrl" alt="" class="absolute inset-0 -z-10 size-full object-cover opacity-40" />
    <div class="mx-auto w-full max-w-6xl px-6 py-24">
      <h1 class="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{{ section.title }}</h1>
      <p class="mt-6 max-w-xl text-lg opacity-80">{{ section.subtitle }}</p>
      <SiteLink :href="section.cta.href" class="mt-8 inline-block rounded-lg bg-brand-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110">
        {{ section.cta.label }}
      </SiteLink>
    </div>
  </section>
</template>
