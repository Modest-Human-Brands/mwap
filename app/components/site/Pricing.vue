<script setup lang="ts">
defineProps<{
  section: SiteSectionOf<'pricing'>
}>()
</script>

<template>
  <section :id="section.id" class="mx-auto w-full max-w-6xl px-6 py-20">
    <h2 class="text-3xl font-bold">{{ section.title }}</h2>
    <p v-if="section.subtitle" class="mt-3 max-w-xl opacity-70">{{ section.subtitle }}</p>
    <div class="mt-10 grid gap-6 md:grid-cols-3">
      <article v-for="tier in section.tiers" :key="tier.name" class="flex flex-col rounded-xl border bg-brand-secondary p-6" :class="tier.highlighted ? 'border-brand-primary' : 'border-white/10'">
        <h3 class="text-xl font-bold">{{ tier.name }}</h3>
        <p class="mt-2 text-2xl font-bold text-brand-primary">{{ tier.price }}</p>
        <p class="mt-2 text-sm opacity-70">{{ tier.description }}</p>
        <ul class="mt-4 flex-1 space-y-2 text-sm">
          <li v-for="feature in tier.features" :key="feature">• {{ feature }}</li>
        </ul>
        <SiteLink :href="tier.cta.href" class="mt-6 rounded-lg bg-brand-primary px-5 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition hover:brightness-110">
          {{ tier.cta.label }}
        </SiteLink>
      </article>
    </div>
  </section>
</template>
