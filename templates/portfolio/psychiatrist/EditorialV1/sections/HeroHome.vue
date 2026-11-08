<script setup lang="ts">
import type { HeroSlot } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

const props = defineProps<{ slotContent: HeroSlot; pageKey: string }>()

const siteHref = useSiteHref()
const resolve = (href: string) => (href.startsWith('/#') ? href.slice(1) : siteHref(href))
const external = (href: string) => /^https?:\/\//.test(href)
const hero = computed(() => props.slotContent)
</script>

<template>
  <section class="hero">
    <div class="media">
      <img class="ed-photo" :src="hero.imageUrl" alt="" width="740" height="960" fetchpriority="high" />
    </div>
    <div v-gsap.parallax.slower-1 class="orb" aria-hidden="true"></div>
    <div class="fade fade-left" aria-hidden="true"></div>
    <div class="fade fade-bottom" aria-hidden="true"></div>

    <div class="content">
      <p class="ed-eyebrow ed-eyebrow--warm ed-reveal" style="animation-delay: 0.1s">{{ hero.eyebrow }}</p>
      <h1 class="title ed-display ed-reveal" style="animation-delay: 0.2s">
        <span v-for="line in hero.titleLines" :key="line" class="line">{{ line }}</span>
      </h1>
      <p class="tagline ed-reveal" style="animation-delay: 0.35s">{{ hero.tagline }}</p>
      <div class="actions ed-reveal" style="animation-delay: 0.45s">
        <a class="ed-button cta" :href="resolve(hero.primaryCta.href)">{{ hero.primaryCta.label }} <span aria-hidden="true">→</span></a>
        <a
          class="ed-link secondary"
          :href="resolve(hero.secondaryLink.href)"
          :target="external(hero.secondaryLink.href) ? '_blank' : undefined"
          :rel="external(hero.secondaryLink.href) ? 'noopener' : undefined">
          {{ hero.secondaryLink.label }} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>

    <aside v-if="hero.rating" class="chip">
      <p class="value ed-display">★ {{ hero.rating.value }}</p>
      <p class="caption">{{ hero.rating.caption }}</p>
    </aside>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 50rem;
  padding: 25rem var(--ed-pad) 2.5rem;
  overflow: hidden;
  background: var(--ed-deep);
  color: var(--ed-on-deep);
}

.media {
  position: absolute;
  inset: 0 0 auto;
  height: 32.5rem;
}

.media img {
  position: absolute;
  inset: 0;
}

.fade {
  position: absolute;
  pointer-events: none;
}

.fade-bottom {
  inset: 16.25rem 0 auto;
  height: 18.75rem;
  background: linear-gradient(to bottom, transparent, var(--ed-deep));
}

.fade-left,
.orb {
  display: none;
}

.content {
  position: relative;
  width: 100%;
}

.title {
  margin-top: 0.75rem;
  font-size: var(--ed-fs-hero);
  line-height: 0.94;
  letter-spacing: -0.03em;
}

.line {
  display: block;
}

.tagline {
  max-width: 21rem;
  margin: 1.5rem 0 0;
  color: color-mix(in srgb, var(--ed-on-deep) 85%, var(--ed-deep));
  font-size: 0.9375rem;
  line-height: 1.55;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.25rem;
  margin-top: 2.5rem;
}

.secondary {
  font-size: 0.875rem;
}

.chip {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  .media img {
    animation: ed-photo-in 1.8s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
}

@media (min-width: 48rem) {
  .media {
    height: 36rem;
  }

  .fade-bottom {
    top: 18rem;
  }

  .tagline {
    max-width: 28rem;
    font-size: 1.125rem;
  }
}

@media (min-width: 64rem) {
  .hero {
    min-height: clamp(44rem, 66.7vw, 60rem);
    padding-block: 12rem 4rem;
  }

  .media {
    inset: 0 0 0 48.6%;
    height: auto;
  }

  .fade-bottom {
    inset: auto 0 0 48.6%;
    height: 25rem;
    background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ed-deep) 85%, transparent));
  }

  .fade-left {
    display: block;
    inset: 0 auto 0 48.6%;
    width: 22.5rem;
    background: linear-gradient(to right, var(--ed-deep), transparent);
  }

  .orb {
    position: absolute;
    display: block;
    top: 50%;
    left: -14%;
    width: 48.6%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: color-mix(in srgb, var(--ed-teal) 35%, transparent);
    filter: blur(10rem);
    pointer-events: none;
  }

  .tagline {
    max-width: 24rem;
    margin-top: 2.5rem;
    font-size: 1.25rem;
    line-height: 1.5;
  }

  .actions {
    flex-direction: row;
    align-items: center;
    gap: 3.5rem;
    margin-top: 2.5rem;
  }

  .secondary {
    font-size: 1rem;
  }

  .chip {
    position: absolute;
    right: clamp(2rem, 11vw, 10rem);
    bottom: 4.2rem;
    display: block;
    padding: 1.125rem 1.5rem;
    border: 1px solid color-mix(in srgb, var(--ed-on-deep) 40%, transparent);
    border-radius: 1.375rem;
    background: color-mix(in srgb, var(--ed-on-deep) 16%, transparent);
    backdrop-filter: blur(12px);
  }

  .chip p {
    margin: 0;
  }

  .value {
    font-size: 1.75rem;
    line-height: 1.25;
  }

  .caption {
    margin-top: 0.25rem;
    color: color-mix(in srgb, var(--ed-on-deep) 80%, var(--ed-deep));
    font-size: 0.8125rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    .chip {
      animation: ed-float 6s ease-in-out infinite;
    }
  }
}
</style>
