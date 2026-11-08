<script setup lang="ts">
import type { CoverSlot } from '~~/templates/portfolio/model/ContactSheetV1/schema'
const props = defineProps<{
  slotContent: CoverSlot
}>()

const words = computed(() => props.slotContent.title.split(/\s+/).filter(Boolean))
// The title is sized so its longest word spans the width of the page
const chars = computed(() => Math.max(4, ...words.value.map((word) => word.length)))
</script>

<template>
  <section id="cover" class="cover" :style="{ '--chars': chars }">
    <h1
      v-gsap.whenVisible.to="{ backgroundPosition: '50% 75%', ease: 'none', start: 'top top', end: 'bottom top', scrub: true }"
      class="title"
      :style="{ '--image': `url(${JSON.stringify(slotContent.imageUrl)})` }">
      <span v-for="word in words" :key="word" class="word">{{ word }}</span>
    </h1>

    <div class="info">
      <p class="cs-eyebrow">{{ slotContent.label }}</p>
      <p class="tagline">{{ slotContent.tagline }}</p>
      <p v-if="slotContent.availability" class="availability">{{ slotContent.availability }}</p>
    </div>

    <img v-gsap.parallax.faster-1 class="portrait" :src="slotContent.portraitUrl" alt="" width="230" height="300" loading="eager" />
  </section>
</template>

<style scoped>
.cover {
  position: relative;
  padding: 2.5rem var(--cs-pad) 3.5rem;
}

.title {
  margin: 0;
  font: 400 min(500px, calc((100vw - 2 * var(--cs-pad)) / (0.515 * var(--chars)))) / 0.84 var(--cs-display);
  letter-spacing: -0.01em;
  text-transform: uppercase;
  /* The photo shows through the letters; until it loads, and where clipping is unsupported, they are plain */
  color: var(--brand-text);
}

.word {
  display: block;
}

@supports (background-clip: text) or (-webkit-background-clip: text) {
  .title {
    background:
      var(--image) center / cover no-repeat,
      var(--cs-frame);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
}

.info {
  position: relative;
  margin-top: 1.75rem;
}

.tagline {
  max-width: 20rem;
  margin: 0.75rem 0 1.25rem;
  font: 400 1.625rem/1.12 var(--cs-serif);
}

.availability {
  display: inline-block;
  margin: 0;
  padding: 0.5rem 0.875rem;
  background: var(--brand-primary);
  color: var(--cs-on-primary);
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.portrait {
  display: none;
}

@media (min-width: 64rem) {
  .cover {
    padding-bottom: 5rem;
  }

  .info {
    position: absolute;
    top: 3.5rem;
    left: 69%;
    width: 22rem;
    margin: 0;
  }

  .tagline {
    margin: 0.75rem 0 1.25rem;
    font-size: 2.125rem;
    line-height: 1.12;
  }

  .portrait {
    position: absolute;
    top: 13rem;
    right: 3.75rem;
    display: block;
    width: 14.375rem;
    height: auto;
    aspect-ratio: 230 / 300;
    object-fit: cover;
    border: 6px solid var(--brand-secondary);
    box-shadow: 0 12px 24px rgb(0 0 0 / 0.5);
    transform: rotate(5deg);
  }
}
</style>
