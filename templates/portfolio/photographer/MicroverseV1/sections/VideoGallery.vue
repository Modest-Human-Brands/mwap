<script setup lang="ts">
import type { MicroverseHome, MicroverseVideo } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import { useCharReveal } from '../useMicroverse'

// An immersive stage the height of the screen: the active reel plays muted in the middle (9:16, story style) with its neighbours
// on both sides and the same reel, blurred, as the backdrop. A story bar above it counts the reels, the control bar under it plays,
// pauses and scrubs. Arrows, a tap on a neighbour or a swipe change the reel; when one ends the next starts.
const props = defineProps<{ slotContent: MicroverseHome['videoGallery']; videos: MicroverseVideo[] }>()

const siteHref = useSiteHref()
const root = ref<HTMLElement>()
const player = ref<HTMLVideoElement>()
const title = ref<HTMLElement>()
useCharReveal(title)

const index = ref(0)
const visible = ref(false)
const playing = ref(true)
const muted = ref(true)
const time = ref(0)
const length = ref(0)
const reduced = ref(false)

const count = computed(() => props.videos.length)
const at = (offset: number) => props.videos[(((index.value + offset) % count.value) + count.value) % count.value]!
const active = computed(() => at(0))
const sides = computed(() => [-2, -1, 1, 2].filter((offset) => count.value >= 2 * Math.abs(offset) + 1).map((offset) => ({ offset, video: at(offset) })))
const pad = (n: number) => String(n).padStart(2, '0')
const stamp = (seconds: number) => `${pad(Math.floor(seconds / 60))}:${pad(Math.floor(seconds % 60))}`
const progress = computed(() => (length.value ? Math.min(time.value / length.value, 1) : 0))
const label = computed(() => `${active.value.category}  ·  ${active.value.title}`)

function go(step: number) {
  index.value = (((index.value + step) % count.value) + count.value) % count.value
  time.value = 0
  length.value = 0
  playing.value = true
}

function toggle() {
  const el = player.value
  if (!el) return
  if (el.paused) el.play().catch(() => undefined)
  else el.pause()
}

function seek(event: MouseEvent) {
  const el = player.value
  const bar = event.currentTarget as HTMLElement
  if (!el || !length.value) return
  const box = bar.getBoundingClientRect()
  el.currentTime = ((event.clientX - box.left) / box.width) * length.value
}

// Plays only while the stage is on screen and the reel is not paused by the visitor
watch([visible, playing, index, player], async () => {
  await nextTick()
  const el = player.value
  if (!el || reduced.value) return
  if (visible.value && playing.value) el.play().catch(() => undefined)
  else el.pause()
})

let startX = 0
const onTouchStart = (event: TouchEvent) => (startX = event.touches[0]?.clientX ?? 0)
const onTouchEnd = (event: TouchEvent) => {
  const dx = (event.changedTouches[0]?.clientX ?? 0) - startX
  if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
}

let observer: IntersectionObserver | undefined
onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) playing.value = false
  if (!root.value) return
  observer = new IntersectionObserver(([entry]) => (visible.value = !!entry?.isIntersecting), { threshold: 0.4 })
  observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section id="videos" ref="root" class="stage">
    <img class="backdrop" :src="active.posterUrl" alt="" aria-hidden="true" />

    <header class="head">
      <p class="mv-eyebrow">{{ slotContent.eyebrow }}</p>
      <h2 ref="title" class="mv-title">{{ slotContent.title }}</h2>
    </header>
    <p class="figure">{{ slotContent.caption }}</p>

    <button
      v-for="side in sides"
      :key="side.offset"
      type="button"
      class="side"
      :class="`o${side.offset < 0 ? 'm' : 'p'}${Math.abs(side.offset)}`"
      :aria-label="`Show ${side.video.title}`"
      @click="go(side.offset)">
      <img :src="side.video.posterUrl" alt="" loading="lazy" />
    </button>

    <div class="active" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <ol class="story" aria-hidden="true">
        <li v-for="(video, i) in videos" :key="video.slug" :class="{ seen: i < index, now: i === index }">
          <i v-if="i === index" :style="{ width: `${progress * 100}%` }"></i>
        </li>
      </ol>

      <video
        :key="active.slug"
        ref="player"
        class="reel"
        :src="active.videoUrl"
        :poster="active.posterUrl"
        :muted="muted"
        playsinline
        preload="metadata"
        @timeupdate="time = ($event.target as HTMLVideoElement).currentTime"
        @loadedmetadata="length = ($event.target as HTMLVideoElement).duration"
        @play="playing = true"
        @pause="playing = false"
        @ended="go(1)"
        @click="toggle"></video>

      <button type="button" class="mute mv-icon-button" :aria-pressed="muted" :aria-label="muted ? 'Unmute' : 'Mute'" @click="muted = !muted">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
          <path d="M2.7 6h2.2L8.7 3v10L4.9 10H2.7z" fill="currentColor" />
          <path v-if="muted" d="M11.5 6.2l3 3.6M14.5 6.2l-3 3.6" />
          <path v-else d="M11.3 6a3 3 0 0 1 0 4" />
        </svg>
      </button>

      <div class="bar">
        <button type="button" class="pause" :aria-label="playing ? 'Pause' : 'Play'" @click="toggle">
          <svg v-if="playing" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
            <rect x="4" y="3" width="2.5" height="10" />
            <rect x="9.5" y="3" width="2.5" height="10" />
          </svg>
          <svg v-else viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M5 3l8 5-8 5z" /></svg>
        </button>
        <span class="time">{{ stamp(time) }} / {{ stamp(length || active.durationSeconds) }}</span>
        <div class="scrub" role="slider" aria-label="Seek" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100" @click="seek">
          <i :style="{ width: `${progress * 100}%` }"></i>
        </div>
        <span class="pos">{{ pad(index + 1) }} / {{ pad(count) }}</span>
      </div>
    </div>

    <button type="button" class="arrow prev mv-icon-button" aria-label="Previous reel" @click="go(-1)">←</button>
    <button type="button" class="arrow next mv-icon-button" aria-label="Next reel" @click="go(1)">→</button>

    <a class="caption" :href="siteHref(`/video/${active.slug}`)">{{ label }}</a>
    <p class="swipe" aria-hidden="true">SWIPE →</p>
  </section>
</template>

<style scoped>
.stage {
  --h: calc(100svh - 3.5rem);
  --w: calc(var(--h) * 0.5625);

  position: relative;
  min-height: max(100svh, 34rem);
  overflow: hidden;
  background: #000;
  isolation: isolate;
}

/* The same reel, blurred, original colour */
.backdrop {
  position: absolute;
  inset: -5rem;
  z-index: -1;
  width: calc(100% + 10rem);
  height: calc(100% + 10rem);
  max-width: none;
  object-fit: cover;
  opacity: 0.45;
  filter: blur(7.5rem);
}

.head {
  position: absolute;
  top: 2.75rem;
  left: 1.5rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-shadow: 0 1px 12px rgb(0 0 0 / 0.85);
}

.head .mv-title {
  font-size: clamp(2.5rem, 12vw, 4rem);
  text-shadow: 0 2px 24px rgb(0 0 0 / 0.8);
}

.figure {
  display: none;
  margin: 0;
  color: color-mix(in srgb, #fff 50%, transparent);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  line-height: 1.6;
  text-transform: uppercase;
  white-space: pre-line;
}

.active {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 0rem);
  background: #000;
}

.reel {
  flex: 1;
  width: 100%;
  min-height: 0;
  object-fit: cover;
  cursor: pointer;
  box-shadow: 0 2.5rem 6.25rem color-mix(in srgb, var(--mv-red) 50%, transparent);
}

.story {
  position: absolute;
  top: 1rem;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 0.5rem;
  width: min(19.875rem, calc(100% - 4.5rem));
  transform: translateX(-50%);
}

.story li {
  position: relative;
  flex: 1;
  height: 0.125rem;
  background: color-mix(in srgb, #fff 35%, transparent);
}

.story li.seen {
  background: #fff;
}

.story i {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--mv-red);
}

.mute {
  position: absolute;
  top: 2.75rem;
  right: 1.5rem;
  z-index: 3;
  width: 2.25rem;
  height: 2.25rem;
  border-color: transparent;
  background: #fff;
  color: #000;
  backdrop-filter: none;
}

.bar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 0.75rem;
  height: 3.5rem;
  padding: 0 1rem;
  background: #000;
  font-size: 0.75rem;
  font-weight: 500;
}

.pause {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  background: none;
  color: #fff;
  cursor: pointer;
}

.time {
  color: color-mix(in srgb, #fff 82%, transparent);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.scrub {
  position: relative;
  flex: 1;
  height: 3px;
  background: color-mix(in srgb, #fff 20%, transparent);
  cursor: pointer;
}

/* A bigger hit area than the line */
.scrub::before {
  content: '';
  position: absolute;
  inset: -0.75rem 0;
}

.scrub i {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--mv-hot);
}

.pos {
  color: var(--mv-hot);
  font-weight: 600;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.side,
.arrow,
.swipe {
  display: none;
}

.caption {
  position: absolute;
  bottom: 4.75rem;
  left: 1.5rem;
  z-index: 3;
  max-width: 11.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1.5;
  text-shadow: 0 1px 12px rgb(0 0 0 / 0.85);
  text-transform: uppercase;
}

.caption:hover {
  color: var(--mv-hot);
}

.swipe {
  position: absolute;
  right: 2.25rem;
  bottom: 5.5rem;
  z-index: 3;
  display: block;
  margin: 0;
  color: var(--mv-hot);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
}

@media (min-width: 880px) {
  .stage {
    min-height: max(100svh, 40rem);
  }

  .head {
    top: 4rem;
    left: 5rem;
    gap: 0.25rem;
  }

  .head .mv-title {
    font-size: 4rem;
  }

  .figure {
    position: absolute;
    top: 4rem;
    right: 2rem;
    z-index: 3;
    display: block;
    max-width: 24.5rem;
  }

  .active {
    left: 50%;
    width: var(--w);
    height: calc(var(--h) + 3.5rem);
    transform: translateX(-50%);
  }

  .mute {
    top: 2rem;
    right: 1rem;
  }

  .side {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    display: block;
    padding: 0;
    border: 0;
    background: #000;
    cursor: pointer;
    aspect-ratio: 9 / 16;
    transition:
      opacity 0.4s ease,
      transform 0.6s var(--mv-ease);
  }

  .side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .side:hover {
    opacity: 0.85 !important;
  }

  .op1,
  .om1 {
    width: calc(var(--w) * 0.6316);
    opacity: 0.6;
  }

  .op2,
  .om2 {
    width: calc(var(--w) * 0.4632);
    opacity: 0.35;
  }

  .om1 {
    transform: translate(calc(-50% - (var(--w) * 0.8158 + 1.5rem)), -50%);
  }

  .op1 {
    transform: translate(calc(-50% + (var(--w) * 0.8158 + 1.5rem)), -50%);
  }

  .om2 {
    transform: translate(calc(-50% - (var(--w) * 1.3632 + 3rem)), -50%);
  }

  .op2 {
    transform: translate(calc(-50% + (var(--w) * 1.3632 + 3rem)), -50%);
  }

  .arrow {
    position: absolute;
    bottom: 1.5rem;
    z-index: 3;
    display: inline-grid;
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.25rem;
  }

  .prev {
    left: calc(50% - var(--w) / 2 - 5rem);
    border-color: color-mix(in srgb, #fff 35%, transparent);
    background: transparent;
  }

  .next {
    left: calc(50% + var(--w) / 2 + 1.5rem);
    border-color: transparent;
    background: var(--mv-red);
  }

  .caption {
    bottom: 3.9rem;
    left: 5rem;
    max-width: 18rem;
  }

  .swipe {
    display: none;
  }
}
</style>
