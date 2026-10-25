<script setup lang="ts">
defineProps<{
  id: string
  section: AboutContactSlot
}>()
</script>

<template>
  <section :id="id" class="mx-auto w-full max-w-6xl px-6 py-20">
    <h2 class="text-3xl font-bold">{{ section.title }}</h2>
    <p class="mt-4 max-w-2xl opacity-80">{{ section.body }}</p>
    <ul class="mt-8 space-y-2 text-sm">
      <li>
        <a :href="`mailto:${section.contact.email}`" class="text-brand-primary hover:underline">{{ section.contact.email }}</a>
      </li>
      <li v-if="section.contact.phone">
        <a :href="`tel:${section.contact.phone}`" class="hover:underline">{{ section.contact.phone }}</a>
      </li>
      <li v-for="link in section.contact.links" :key="link.href">
        <a :href="link.href" target="_blank" rel="noopener" class="hover:underline">{{ link.label }}</a>
      </li>
    </ul>
  </section>
</template>
