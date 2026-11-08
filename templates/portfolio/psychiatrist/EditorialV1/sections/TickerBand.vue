<script setup lang="ts">
import type { TickerSlot } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'

const props = defineProps<{ slotContent: TickerSlot }>()

// Two identical halves slide left by one half, so the loop has no seam; each half is long enough to cover a wide screen
const half = computed(() => [...props.slotContent.items, ...props.slotContent.items])
</script>

<template>
  <section class="ticker" aria-label="Areas of care">
    <ul class="track">
      <template v-for="copy in 2" :key="copy">
        <li v-for="(item, i) in half" :key="`${copy}-${i}`" class="item ed-display" :aria-hidden="copy === 2 || undefined">{{ item }}<span class="sep" aria-hidden="true">✦</span></li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
.ticker {
  overflow: hidden;
  background: var(--ed-teal);
  color: #fff;
}

.track {
  display: flex;
  width: max-content;
  margin: 0;
  padding: 0.9rem 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  font-size: clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem);
  font-style: italic;
  line-height: 1.25;
  white-space: nowrap;
}

.sep {
  padding-inline: clamp(1rem, 0.5rem + 2vw, 2.25rem);
  font-size: 0.7em;
  font-style: normal;
}

@media (min-width: 64rem) {
  .track {
    padding-block: 1.6rem;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .track {
    animation: ed-marquee 40s linear infinite;
  }

  .ticker:hover .track {
    animation-play-state: paused;
  }
}
</style>
