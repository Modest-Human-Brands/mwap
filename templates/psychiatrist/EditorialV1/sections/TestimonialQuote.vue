<script setup lang="ts">
import type { TestimonialSlot } from '~~/templates/psychiatrist/EditorialV1/schema'

defineProps<{ slotContent: TestimonialSlot }>()
</script>

<template>
  <section id="testimonial" class="testimonial">
    <p class="ed-eyebrow">{{ slotContent.eyebrow }}</p>
    <blockquote v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 1, ease: 'power3.out', start: 'top 85%' }" class="quote ed-display">“{{ slotContent.quote }}”</blockquote>
    <p class="author">
      <span class="stars" role="img" :aria-label="`${slotContent.rating} out of 5`">{{ '★'.repeat(slotContent.rating) }}</span>
      {{ slotContent.author }}
    </p>
  </section>
</template>

<style scoped>
.testimonial {
  padding: 4rem var(--ed-pad) 4.5rem;
}

.quote {
  max-width: 19em;
  margin: 1.5rem 0 0;
  font-size: clamp(2rem, 8.7vw, 4.5rem);
  line-height: 1.14;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.author {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 2rem 0 0;
  color: var(--ed-teal);
  font-size: 1rem;
}

.stars {
  letter-spacing: 0.1em;
}

@media (min-width: 64rem) {
  .testimonial {
    padding-block: 6.25rem 7.5rem;
  }

  .quote {
    margin-top: 2.5rem;
    font-size: clamp(3.5rem, 5vw, 4.5rem);
    line-height: 1.14;
  }

  .author {
    margin-top: 2.5rem;
  }
}
</style>
