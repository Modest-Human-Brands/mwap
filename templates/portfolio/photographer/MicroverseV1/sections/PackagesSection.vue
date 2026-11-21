<script setup lang="ts">
import type { MicroverseHome, MicroversePackage } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useCharReveal } from '../useMicroverse'

const props = defineProps<{ slotContent: MicroverseHome['packages']; packages: MicroversePackage[] }>()

const title = ref<HTMLElement>()
useCharReveal(title)
const open = inject<((message?: string) => void) | undefined>('openBooking', undefined)

// On a phone the cards are a swipe carousel that snaps per card
const track = ref<HTMLElement>()
const slide = ref(0)
function onScroll() {
  const el = track.value
  const first = el?.firstElementChild as HTMLElement | null
  if (!el || !first) return
  slide.value = Math.min(Math.round(el.scrollLeft / (first.offsetWidth + 16)), props.packages.length - 1)
}
</script>

<template>
  <section id="packages" class="mv-section packages">
    <header class="head">
      <p class="mv-eyebrow">{{ slotContent.eyebrow }}</p>
      <h2 ref="title" class="mv-title">{{ slotContent.title }}</h2>
    </header>

    <ul ref="track" class="cards" @scroll.passive="onScroll">
      <li v-for="(pack, index) in packages" :key="pack.slug" class="card" :class="{ alt: index % 2 === 1 }">
        <div class="title">
          <h3 class="name">{{ pack.title }}</h3>
          <p class="sub">{{ pack.subtitle }}</p>
        </div>
        <p class="price">
          <span class="amount">{{ pack.price }}</span
          ><span class="unit">/ {{ pack.unit }}</span>
        </p>
        <button type="button" class="cta" @click="open?.(`I am interested in the ${pack.title}.`)">{{ slotContent.ctaLabel }}</button>
        <ul class="features">
          <li v-for="feature in pack.features" :key="feature">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" /></svg>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="packages.length > 1" class="dots" aria-hidden="true">
      <p class="dashes"><i v-for="(pack, index) in packages" :key="pack.slug" :class="{ on: index === slide }"></i></p>
      <p class="hint">{{ slide + 1 }} / {{ packages.length }} · SWIPE <span>→</span></p>
    </div>
  </section>
</template>

<style scoped>
.packages {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 3.5rem;
  padding-bottom: 4rem;
  background: var(--mv-bg);
}

.head {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cards {
  display: flex;
  gap: 1rem;
  margin: 0 calc(var(--mv-gutter) * -1);
  padding: 0 var(--mv-gutter);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--mv-gutter);
  scrollbar-width: none;
}

.cards::-webkit-scrollbar {
  display: none;
}

.card {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 1rem;
  width: min(18.75rem, 80vw);
  padding: 9.5rem 4.625rem 1.5rem 1.5rem;
  border: 1px solid color-mix(in srgb, #fff 12%, transparent);
  background: linear-gradient(180deg, color-mix(in srgb, var(--mv-red) 55%, transparent), transparent 35%), rgb(23 8 8 / 0.55);
  backdrop-filter: blur(40px);
  scroll-snap-align: start;
}

.card.alt {
  background: linear-gradient(180deg, color-mix(in srgb, var(--mv-hot) 35%, transparent), transparent 35%), rgb(23 8 8 / 0.55);
}

.title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
}

.sub {
  font-size: 0.875rem;
  line-height: 1.2;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  height: 6.25rem;
}

.amount {
  font-size: 2rem;
  line-height: 1.25;
}

.unit {
  font-size: 1.25rem;
  line-height: 1.25;
}

.cta {
  height: 2.6875rem;
  border: 1px solid #404040;
  background: rgb(64 64 64 / 0.4);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease;
}

.cta:hover {
  border-color: var(--mv-hot);
  background: var(--mv-red);
}

.features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.2;
}

.features li {
  display: flex;
  gap: 0.5rem;
}

.features svg {
  flex: none;
  color: var(--mv-hot);
}

.dots {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashes {
  display: flex;
  gap: 0.375rem;
  margin: 0;
}

.dashes i {
  width: 0.875rem;
  height: 3px;
  background: color-mix(in srgb, #fff 24%, transparent);
  transition: width 0.3s var(--mv-ease);
}

.dashes i.on {
  width: 1.75rem;
  background: var(--mv-red);
}

.hint {
  margin: 0;
  color: var(--mv-hot);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
}

@media (min-width: 880px) {
  .packages {
    gap: 2rem;
    min-height: 56.25rem;
    padding-top: 4rem;
    padding-bottom: 3rem;
  }

  .cards {
    justify-content: center;
    gap: 2.5rem;
    margin: 0;
    padding: 0;
    overflow: visible;
  }

  .card {
    width: 26.125rem;
    min-height: 42.25rem;
  }

  .dots {
    display: none;
  }
}
</style>
