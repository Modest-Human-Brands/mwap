<script setup lang="ts">
defineProps<{
  section: SiteSectionOf<'projects'>
}>()
</script>

<template>
  <section :id="section.id" class="mx-auto w-full max-w-6xl px-6 py-20">
    <h2 class="text-3xl font-bold">{{ section.title }}</h2>
    <p v-if="section.subtitle" class="mt-3 max-w-xl opacity-70">{{ section.subtitle }}</p>
    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in section.items" :key="item.title" class="overflow-hidden rounded-xl bg-brand-secondary">
        <img :src="item.imageUrl" :alt="item.title" loading="lazy" class="aspect-video w-full object-cover" />
        <div class="p-5">
          <p class="text-xs font-bold uppercase tracking-wide text-brand-accent">{{ item.category }}</p>
          <h3 class="mt-1 text-xl font-bold">{{ item.title }}</h3>
          <p class="mt-2 text-sm opacity-70">{{ item.description }}</p>
        </div>
      </article>
    </div>
    <SiteLink v-if="section.cta" :href="section.cta.href" class="mt-10 inline-block text-sm font-bold uppercase tracking-wide text-brand-primary hover:underline"> {{ section.cta.label }} → </SiteLink>
  </section>
</template>
