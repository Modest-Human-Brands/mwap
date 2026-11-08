<script setup lang="ts">
import type { StorySlot } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'

defineProps<{ slotContent: StorySlot }>()
</script>

<template>
  <section id="story" class="story">
    <p class="ed-eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', start: 'top 85%' }" class="title ed-display">{{ slotContent.title }}</h2>
    <div v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.12, start: 'top 90%' }" class="columns">
      <p v-for="column in slotContent.columns" :key="column">{{ column }}</p>
    </div>
  </section>
</template>

<style scoped>
.story {
  padding: 4rem var(--ed-pad);
}

.title {
  max-width: 17em;
  margin-top: 1.25rem;
  font-size: clamp(2.125rem, 8.7vw, 4.25rem);
  line-height: 1.14;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.columns {
  display: grid;
  gap: 1.5rem;
  margin-top: 2.5rem;
  color: var(--ed-muted);
  line-height: 1.65;
}

.columns p {
  max-width: 30rem;
  margin: 0;
  font-size: 1rem;
}

@media (min-width: 64rem) {
  .story {
    padding-block: 6.5rem 7.5rem;
  }

  .title {
    max-width: 17.5em;
    margin-top: 2.5rem;
    font-size: clamp(3rem, 4.72vw, 4.25rem);
    line-height: 1.15;
  }

  .columns {
    grid-template-columns: 53% minmax(0, 1fr);
    margin-top: 4.75rem;
  }

  .columns p {
    font-size: 1.125rem;
    line-height: 1.67;
  }
}
</style>
