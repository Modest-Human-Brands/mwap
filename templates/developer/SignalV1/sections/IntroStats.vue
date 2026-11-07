<script setup lang="ts">
import type { IntroSlot } from '~~/templates/developer/SignalV1/schema'

defineProps<{ slotContent: IntroSlot }>()
</script>

<template>
  <section class="intro">
    <p v-gsap.whenVisible.once.from="{ opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="body">{{ slotContent.body }}</p>
    <dl v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.1, start: 'top 90%' }" class="stats">
      <div v-for="stat in slotContent.stats" :key="stat.label" class="stat">
        <dt class="value sg-display">{{ stat.value }}</dt>
        <dd class="label">{{ stat.label }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.intro {
  padding: 4rem var(--sg-pad) 3rem;
}

.body {
  max-width: 44rem;
  color: var(--sg-muted);
  font-size: 1.125rem;
  line-height: 1.6;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin-top: 3rem;
  border-block: 1px solid var(--sg-line);
}

.stat {
  display: grid;
  gap: 0.25rem;
  padding: 1.5rem 0;
}

.stat:nth-child(n + 3) {
  border-top: 1px solid var(--sg-line);
}

.value {
  font-size: clamp(2rem, 9vw, 3rem);
  line-height: 1.1;
}

.label {
  color: var(--sg-muted);
  font-size: 0.875rem;
}

@media (min-width: 64rem) {
  .intro {
    padding-block: 6rem 4rem;
  }

  .stats {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    grid-template-columns: none;
  }

  .stat:nth-child(n + 3) {
    border-top: 0;
  }

  .stat {
    padding: 2.5rem 0;
  }

  .stat + .stat {
    padding-left: 2.5rem;
    border-left: 1px solid var(--sg-line);
  }
}
</style>
