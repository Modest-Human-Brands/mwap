<script setup lang="ts">
import type { MicroverseHome } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import LensVideo from './LensVideo.vue'
import TrustedStrip from './TrustedStrip.vue'
import { clock } from '../useMicroverse'

defineProps<{
  slotContent: MicroverseHome['hero']
  trusted: { name: string; logoUrl: string }[]
}>()

const seconds = ref(0)
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')
// REC  00:00:07:12 · hours are not needed, so minutes:seconds:frames at 24 fps
const timecode = computed(() => `${pad(seconds.value / 3600)}:${clock(seconds.value).padStart(5, '0')}:${pad((seconds.value % 1) * 24)}`)
</script>

<template>
  <section id="hero" class="hero">
    <LensVideo :video-url="slotContent.videoUrl" :poster-url="slotContent.posterUrl" @time="seconds = $event" />

    <div class="marks" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <p class="rec" aria-hidden="true"><i class="dot"></i>REC&nbsp; {{ timecode }} &nbsp;·&nbsp; 4K &nbsp;·&nbsp; 24 FPS</p>

    <div class="body">
      <h1 class="headline">
        <span v-for="(line, index) in slotContent.titleLines" :key="line" :class="{ band: index === 1 }">{{ line }}</span>
      </h1>
      <p class="tagline">{{ slotContent.tagline }}</p>
    </div>

    <div class="hud">
      <hr />
      <div class="row">
        <a class="scroll" href="#manifesto" aria-label="Scroll down"><span aria-hidden="true">↓</span></a>
      </div>
    </div>

    <TrustedStrip v-if="trusted.length" class="trusted" :label="slotContent.trustedLabel" :clients="trusted" />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2.5rem;
  min-height: max(100svh, 52rem);
  padding: 8rem 0 4.5rem;
  isolation: isolate;
}

/* The picture is never scrimmed: text over footage gets a soft shadow instead */
.body {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 0 1.5rem;
  text-shadow:
    0 1px 4px rgb(0 0 0 / 0.95),
    0 2px 24px rgb(0 0 0 / 0.9);
  animation: rise 1s var(--mv-ease) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
}

.headline {
  display: flex;
  flex-direction: column;
  font-size: clamp(2.5rem, 7.2vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
  text-shadow: 0 4px 40px rgb(0 0 0 / 0.55);
  text-transform: uppercase;
}

/* The second line sits on a red band that fades out to the right, starting at the screen edge */
.headline .band {
  position: relative;
  isolation: isolate;
}

.headline .band::before {
  content: '';
  position: absolute;
  top: -0.075em;
  bottom: -0.075em;
  left: -1.5rem;
  z-index: -1;
  width: min(52rem, 90vw);
  background: linear-gradient(90deg, var(--mv-red), color-mix(in srgb, var(--mv-red) 85%, transparent) 45%, transparent);
}

.tagline {
  max-width: 32.5rem;
  font-size: clamp(0.9375rem, 1.4vw, 1.25rem);
  font-weight: 500;
  line-height: 1.5;
}

.marks,
.rec,
.hud {
  display: none;
}

.trusted {
  position: relative;
}

@media (min-width: 880px) {
  .hero {
    gap: 5.125rem;
    padding: 8rem 0 6.75rem;
  }

  .body {
    gap: 1.25rem;
    padding: 0 4rem;
  }

  .headline .band::before {
    left: -4rem;
  }

  .marks {
    position: absolute;
    inset: 7.5rem 2.5rem 13rem;
    display: block;
    pointer-events: none;
  }

  .marks span {
    position: absolute;
    width: 1.75rem;
    height: 1.75rem;
    border: 0 solid color-mix(in srgb, #fff 70%, transparent);
  }

  .marks span:nth-child(1) {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
  }

  .marks span:nth-child(2) {
    top: 0;
    right: 0;
    border-width: 2px 2px 0 0;
  }

  .marks span:nth-child(3) {
    bottom: 0;
    left: 0;
    border-width: 0 0 2px 2px;
  }

  .marks span:nth-child(4) {
    right: 0;
    bottom: 0;
    border-width: 0 2px 2px 0;
  }

  .rec {
    position: absolute;
    top: 6.75rem;
    left: 72.2%;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin: 0;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-shadow: 0 1px 12px rgb(0 0 0 / 0.8);
  }

  .dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 999px;
    background: var(--mv-hot);
    animation: blink 1.2s steps(2, jump-none) infinite;
  }

  .hud {
    position: absolute;
    right: 4rem;
    bottom: 15.6rem;
    display: block;
    width: 21rem;
    text-shadow:
      0 1px 4px rgb(0 0 0 / 0.95),
      0 2px 20px rgb(0 0 0 / 0.9);
  }

  .hud hr {
    width: 260px;
    margin: 0 0 0.75rem;
    border: 0;
    border-top: 1px solid color-mix(in srgb, #fff 25%, transparent);
  }

  .row {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 1rem;
  }

  .scroll {
    display: grid;
    flex: none;
    place-items: center;
    width: 3rem;
    height: 3rem;
    margin-top: 0;
    border: 1px solid color-mix(in srgb, #fff 40%, transparent);
    border-radius: 999px;
    transition: background-color 0.25s ease;
  }

  .scroll:hover {
    background: var(--mv-red);
  }
}

@keyframes blink {
  50% {
    opacity: 0.15;
  }
}
</style>
