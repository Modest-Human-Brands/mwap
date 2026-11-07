<script setup lang="ts">
import type { ApproachSlot } from '~~/templates/psychiatrist/EditorialV1/schema'

defineProps<{ slotContent: ApproachSlot }>()
</script>

<template>
  <section id="approach" class="band">
    <div class="media">
      <img
        v-gsap.whenVisible.to="{ yPercent: -12, ease: 'none', scrub: true, start: 'top bottom', end: 'bottom top' }"
        class="ed-photo"
        :src="slotContent.imageUrl"
        alt=""
        width="1440"
        height="760"
        loading="lazy" />
    </div>
    <div class="overlay" aria-hidden="true"></div>
    <div class="content">
      <p class="ed-eyebrow ed-eyebrow--warm">{{ slotContent.eyebrow }}</p>
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="title ed-display">{{ slotContent.title }}</h2>
    </div>
  </section>
</template>

<style scoped>
.band {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 27.5rem;
  padding: 2rem var(--ed-pad) 1.5rem;
  overflow: hidden;
  background: var(--ed-deep);
  color: var(--ed-on-deep);
}

.media {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Taller than the band, so the scrub has room to move the photo */
.media img {
  position: absolute;
  inset: -12% 0 auto;
  height: 124%;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, color-mix(in srgb, var(--ed-deep) 10%, transparent), color-mix(in srgb, var(--ed-deep) 92%, transparent));
}

.content {
  position: relative;
}

.title {
  max-width: 11em;
  margin-top: 1rem;
  font-size: var(--ed-fs-band);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@media (min-width: 48rem) {
  .band {
    min-height: 36rem;
    padding-bottom: 3rem;
  }
}

@media (min-width: 64rem) {
  .band {
    min-height: clamp(36rem, 52.8vw, 47.5rem);
    padding-bottom: 5.5rem;
  }

  .title {
    max-width: 11.5em;
    margin-top: 1.5rem;
    line-height: 1.04;
  }
}
</style>
