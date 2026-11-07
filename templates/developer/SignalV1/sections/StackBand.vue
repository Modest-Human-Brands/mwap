<script setup lang="ts">
import type { StackSlot } from '~~/templates/developer/SignalV1/schema'

defineProps<{ slotContent: StackSlot }>()
</script>

<template>
  <section id="stack" class="stack">
    <p class="sg-eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="title sg-display">{{ slotContent.title }}</h2>
    <div class="columns">
      <div v-for="column in slotContent.columns" :key="column.title" class="column">
        <h3 class="label sg-mono">{{ column.title }}</h3>
        <p class="items sg-display">{{ column.items }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack {
  padding: 4rem var(--sg-pad);
  background: var(--sg-sunken);
}

.title {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 8vw, 3rem);
  line-height: 1.2;
}

.columns {
  display: grid;
  gap: 2rem;
  margin-top: 2.5rem;
}

.column {
  padding-top: 1.25rem;
  border-top: 1px solid var(--sg-line);
}

.label {
  color: var(--sg-accent);
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.14em;
}

.items {
  margin-top: 0.75rem;
  color: var(--sg-muted);
  font-size: 1.125rem;
  font-weight: 400;
}

@media (min-width: 64rem) {
  .stack {
    padding-block: 6rem;
  }

  .columns {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3rem;
  }
}
</style>
