<script setup lang="ts">
// A filled social mark for a link, picked from its label (a platform name); unknown labels get a plain link icon.
// The marks are custom icons (app/assets/icons, collection `local`) rendered by the official Nuxt Icon module, and take the text color.
const props = defineProps<{ label: string }>()

// Literal names, so the module's client bundle scan finds every icon
const icon = computed(() => {
  const name = props.label.trim().toLowerCase()
  if (name.includes('insta')) return 'local:instagram'
  if (name.includes('youtube') || name === 'yt') return 'local:youtube'
  if (name.includes('facebook') || name === 'fb') return 'local:facebook'
  if (name.includes('linkedin')) return 'local:linkedin'
  if (name === 'x' || name.includes('twitter')) return 'local:x'
  if (name.includes('github')) return 'local:github'
  if (name.includes('whatsapp')) return 'local:whatsapp'
  if (name.includes('map')) return 'local:maps'
  if (name.includes('mail')) return 'local:mail'
  return 'local:link'
})
</script>

<template>
  <NuxtIcon class="social-icon" :name="icon" aria-hidden="true" />
</template>

<style scoped>
.social-icon {
  width: 100%;
  height: 100%;
}
</style>
