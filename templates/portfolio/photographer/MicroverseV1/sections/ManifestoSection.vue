<script setup lang="ts">
import type { MicroverseHome } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import CausticsCanvas from './CausticsCanvas.vue'

// No per-character reveal here: split spans are separate boxes and break the text-clipped gradient
defineProps<{ slotContent: MicroverseHome['manifesto'] }>()
</script>

<template>
  <section id="manifesto" class="mv-section manifesto">
    <CausticsCanvas />
    <p class="mv-eyebrow label">{{ slotContent.eyebrow }}</p>
    <div class="copy">
      <h2 class="mv-title headline">{{ slotContent.title }}</h2>
      <p class="body">{{ slotContent.body }}</p>
      <ul class="bullets">
        <li v-for="bullet in slotContent.bullets" :key="bullet">{{ bullet }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.manifesto {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: max(100svh, 40rem);
  padding-top: 3.5rem;
  padding-bottom: 6rem;
  background: var(--mv-bg);
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 73.75rem;
}

/* Red across, turning white at the far edge */
.headline {
  max-width: 73.75rem;
  background: linear-gradient(90deg, var(--mv-red), var(--mv-red) 50%, #fff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 0.96;
}

.body {
  max-width: 47.5rem;
  font-size: clamp(1rem, 1.53vw, 1.375rem);
  line-height: 1.6;
}

.bullets {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 47.5rem;
  font-size: 1rem;
  line-height: 1.7;
}

.bullets li {
  display: flex;
  gap: 0.75rem;
}

.bullets li::before {
  content: '•';
  flex: none;
}

@media (min-width: 880px) {
  .manifesto {
    gap: 1.375rem;
    padding-top: 8.75rem;
    padding-bottom: 6.5rem;
  }

  .copy {
    gap: 2.5rem;
  }
}
</style>
