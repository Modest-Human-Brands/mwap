<script setup lang="ts">
// A line icon for a social link, picked from its label (a platform name); unknown labels get a plain link icon.
// Inline paths: no icon font, no request, and the mark takes the text color.
const props = defineProps<{ label: string }>()

const kind = computed(() => {
  const name = props.label.trim().toLowerCase()
  if (name.includes('insta')) return 'instagram'
  if (name.includes('youtube') || name === 'yt') return 'youtube'
  if (name.includes('facebook') || name === 'fb') return 'facebook'
  if (name.includes('linkedin')) return 'linkedin'
  if (name === 'x' || name.includes('twitter')) return 'x'
  if (name.includes('github')) return 'github'
  if (name.includes('whatsapp')) return 'whatsapp'
  if (name.includes('map')) return 'maps'
  if (name.includes('mail')) return 'mail'
  return 'link'
})
</script>

<template>
  <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="kind === 'instagram'">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </template>
    <template v-else-if="kind === 'youtube'">
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </template>
    <path v-else-if="kind === 'facebook'" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    <template v-else-if="kind === 'linkedin'">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </template>
    <template v-else-if="kind === 'x'">
      <path d="M4 4l11.7 16H20L8.3 4z" />
      <path d="M4 20l6.8-6.8m2.4-2.4L20 4" />
    </template>
    <template v-else-if="kind === 'github'">
      <path
        d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5a13.4 13.4 0 0 0-8 0C6 2 5 2 5 2c-.3 1.1-.3 2.3 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1.1-.9 1.7-.2.6-.2 1.2-.1 1.8v4" />
      <path d="M9 18c-4.5 2-5-2-7-2" />
    </template>
    <path v-else-if="kind === 'whatsapp'" d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
    <template v-else-if="kind === 'maps'">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </template>
    <template v-else-if="kind === 'mail'">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.9 1.9 0 0 1-2.06 0L2 7" />
    </template>
    <template v-else>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </template>
  </svg>
</template>
