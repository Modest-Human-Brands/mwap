<script setup lang="ts">
import type { AboutHeroSlot } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'

const props = defineProps<{ slotContent: AboutHeroSlot }>()
const external = computed(() => /^https?:\/\//.test(props.slotContent.link.href))
</script>

<template>
  <section class="hero">
    <div v-gsap.parallax.slower-1 class="orb" aria-hidden="true"></div>

    <div class="content">
      <p class="ed-eyebrow ed-eyebrow--warm ed-reveal" style="animation-delay: 0.1s">{{ slotContent.eyebrow }}</p>
      <h1 class="title ed-display ed-reveal" style="animation-delay: 0.2s">
        <span v-for="line in slotContent.titleLines" :key="line" class="line">{{ line }}</span>
      </h1>
      <p class="intro ed-reveal" style="animation-delay: 0.35s">{{ slotContent.intro }}</p>
      <a class="ed-link link ed-reveal" style="animation-delay: 0.45s" :href="slotContent.link.href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener' : undefined">
        {{ slotContent.link.label }} <span aria-hidden="true">↗</span>
      </a>
    </div>

    <figure class="portrait">
      <div v-gsap.whenVisible.once.from="{ clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', start: 'top 95%' }" class="frame">
        <img class="ed-photo" :src="slotContent.imageUrl" alt="" width="496" height="700" fetchpriority="high" />
      </div>
      <div v-gsap.whenVisible.once.from="{ scale: 0, rotate: -40, duration: 0.9, delay: 0.7, ease: 'back.out(1.7)', start: 'top 90%' }" class="badge">
        <span class="value ed-display">{{ slotContent.badge.value }}</span>
        <span class="label">{{ slotContent.badge.label }}</span>
      </div>
    </figure>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 8rem var(--ed-pad) 4rem;
  overflow: hidden;
  background: var(--ed-deep);
  color: var(--ed-on-deep);
}

.orb {
  display: none;
}

.content {
  position: relative;
}

.title {
  margin-top: 0.75rem;
  font-size: clamp(3.5rem, 14.4vw, 7rem);
  line-height: 0.96;
  letter-spacing: -0.03em;
}

.line {
  display: block;
}

.intro {
  max-width: 24rem;
  margin: 1.5rem 0 0;
  color: color-mix(in srgb, var(--ed-on-deep) 85%, var(--ed-deep));
  line-height: 1.5;
}

.link {
  display: inline-block;
  margin-top: 1.75rem;
  font-size: 0.9375rem;
}

.portrait {
  position: relative;
  width: min(100%, 24rem);
  margin: 0 auto;
}

.frame {
  aspect-ratio: 496 / 700;
  overflow: hidden;
  border-radius: 999px 999px 1.5rem 1.5rem / 50% 50% 1.5rem 1.5rem;
}

.frame img {
  height: 100%;
}

.badge {
  position: absolute;
  bottom: 2rem;
  left: -0.75rem;
  display: grid;
  place-content: center;
  gap: 0.125rem;
  width: 7.5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--ed-warm);
  color: var(--ed-deep);
  text-align: center;
}

.value {
  font-size: 2.5rem;
  line-height: 1;
}

.label {
  font-size: 0.75rem;
}

@media (min-width: 48rem) {
  .hero {
    padding-top: 9rem;
  }

  .portrait {
    width: 28rem;
  }

  .badge {
    left: -2rem;
    width: 9rem;
  }
}

@media (min-width: 64rem) {
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(26rem, 34.4vw, 31rem);
    align-items: center;
    column-gap: 4rem;
    min-height: clamp(46rem, 63.9vw, 57.5rem);
    padding-block: 9rem 4.5rem;
  }

  .orb {
    position: absolute;
    display: block;
    top: 52%;
    left: -15%;
    width: 48.6%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: color-mix(in srgb, var(--ed-teal) 35%, transparent);
    filter: blur(10rem);
    pointer-events: none;
  }

  .title {
    font-size: clamp(6.5rem, 12.2vw, 11rem);
    line-height: 0.955;
  }

  .intro {
    max-width: 27.5rem;
    margin-top: 2.5rem;
    font-size: 1.25rem;
    line-height: 1.5;
  }

  .link {
    margin-top: 3.25rem;
    font-size: 1rem;
  }

  .portrait {
    width: 100%;
    margin: 0;
  }

  .badge {
    bottom: 0.65rem;
    left: auto;
    right: calc(100% - 4.5rem);
    width: 10.625rem;
  }

  .value {
    font-size: 3.5rem;
  }

  .label {
    font-size: 0.875rem;
  }
}
</style>
