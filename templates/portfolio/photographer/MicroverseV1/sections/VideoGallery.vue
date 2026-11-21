<script setup lang="ts">
import type { MicroverseHome, MicroverseVideo } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import MediaPlayer from '~~/templates/_shared/MediaPlayer.vue'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import { useCharReveal } from '../useMicroverse'

// An immersive stage the height of the screen: the active reel plays muted in the middle (9:16, story style) with its neighbours
// on both sides and the same reel, blurred, as the backdrop. A story bar above it counts the reels, the control bar under it plays,
// pauses and scrubs. Arrows, a tap on a neighbour or a swipe change the reel; when one ends the next starts.
const props = defineProps<{ slotContent: MicroverseHome['videoGallery']; videos: MicroverseVideo[] }>()

const siteHref = useSiteHref()
const root = ref<HTMLElement>()
const player = ref<InstanceType<typeof MediaPlayer>>()
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
const progress = computed(() => (length.value ? Math.min(time.value / length.value, 1) : 0))
const label = computed(() => `${active.value.category}  ·  ${active.value.title}`)

function go(step: number) {
  index.value = (((index.value + step) % count.value) + count.value) % count.value
  time.value = 0
  length.value = 0
  playing.value = true
}

// Plays only while the stage is on screen and the reel is not paused by the visitor
watch([visible, playing, index, player], async () => {
  await nextTick()
  const el = player.value?.media
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

      <!-- The reel plays in Video.js: its skin has the play, seek, volume and fullscreen controls -->
      <MediaPlayer
        :key="active.slug"
        ref="player"
        class="reel"
        :src="active.videoUrl"
        :poster="active.posterUrl"
        :muted="muted"
        @timeupdate="time = ($event.target as HTMLMediaElement).currentTime"
        @loadedmetadata="length = ($event.target as HTMLMediaElement).duration"
        @play="playing = true"
        @pause="playing = false"
        @ended="go(1)" />
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

  .active {
    left: 50%;
    width: var(--w);
    height: var(--h);
    transform: translateX(-50%);
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
