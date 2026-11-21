<script setup lang="ts">
import type { MicroversePhoto, MicroverseVideo } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import CausticsCanvas from './CausticsCanvas.vue'
import { aspectLabel, clock, shortDate, useDefaultLogo } from '../useMicroverse'

// One photo or one video: the media at full height, a strip with its neighbours, a details panel and a caption.
// Keys: ← → browse, I details, Esc close (back to the gallery on the home page). On a phone the details are a bottom sheet.
const props = defineProps<{
  kind: 'photo' | 'video'
  item: MicroversePhoto | MicroverseVideo
  items: (MicroversePhoto | MicroverseVideo)[]
  brandName: string
  logoUrl: string
}>()

const siteHref = useSiteHref()
const details = ref(false)
const stage = ref<HTMLElement>()
const player = ref<HTMLVideoElement>()
const playing = ref(false)
const muted = ref(false)
const time = ref(0)
const length = ref(0)
const copied = ref(false)

const index = computed(() => props.items.findIndex((entry) => entry.slug === props.item.slug))
const total = computed(() => props.items.length)
const wrap = (i: number) => ((i % total.value) + total.value) % total.value
const previous = computed(() => props.items[wrap(index.value - 1)]!)
const next = computed(() => props.items[wrap(index.value + 1)]!)
const pageOf = (slug: string) => siteHref(`/${props.kind}/${slug}`)
const homeHref = computed(() => siteHref('/') + (props.kind === 'photo' ? '#photos' : '#videos'))
const pad = (n: number) => String(n).padStart(2, '0')

const photo = computed(() => (props.kind === 'photo' ? (props.item as MicroversePhoto) : undefined))
const video = computed(() => (props.kind === 'video' ? (props.item as MicroverseVideo) : undefined))
const mediaId = computed(() => props.item.mediaId ?? `${props.kind}-${props.item.slug}`)
const ratio = computed(() => (props.kind === 'video' ? aspectLabel(props.item.aspectRatio, { portrait: 'Vertical', landscape: 'Horizontal', square: 'Square' }) : aspectLabel(props.item.aspectRatio)))

// The strip shows the current item with two neighbours on each side (all of them when there are fewer than five)
const strip = computed(() => {
  const count = Math.min(total.value, 5)
  const first = total.value <= 5 ? 0 : index.value - 2
  return Array.from({ length: count }, (_, i) => props.items[wrap(first + i)]!)
})

const rows = computed(() => {
  const list: [string, string][] = [
    ['MEDIA ID', mediaId.value],
    ['TYPE', props.kind === 'photo' ? 'Photo' : 'Video'],
    ['CATEGORY', props.item.category.charAt(0).toUpperCase() + props.item.category.slice(1)],
    ['ASPECT RATIO', ratio.value],
  ]
  if (photo.value) {
    if (photo.value.width && photo.value.height) list.push(['DELIVERED SIZE', `${photo.value.width} × ${photo.value.height} px`])
    if (photo.value.project) list.push(['PROJECT', `${photo.value.project} · frame ${index.value + 1} of ${total.value}`])
    list.push(['FEATURED', photo.value.featured === null ? 'No' : `Yes · #${photo.value.featured}`])
  }
  if (video.value) {
    const s = video.value.durationSeconds
    list.push(['DURATION', `${clock(s)}${Number.isInteger(s) ? '' : `  (${s} s)`}`])
    if (video.value.uploadedAt) list.push(['UPLOADED', shortDate(video.value.uploadedAt)])
  }
  return list
})

function play() {
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

async function share() {
  try {
    if (navigator.share) await navigator.share({ title: props.item.title, url: location.href })
    else await copy()
  } catch {
    // The visitor closed the share sheet
  }
}

async function copy() {
  try {
    await navigator.clipboard.writeText(location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    // Clipboard access can be denied
  }
}

function fullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else stage.value?.requestFullscreen?.().catch(() => undefined)
}

function onKey(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (target.closest('input, textarea, dialog')) return
  if (event.key === 'ArrowLeft') window.location.href = pageOf(previous.value.slug)
  else if (event.key === 'ArrowRight') window.location.href = pageOf(next.value.slug)
  else if (event.key.toLowerCase() === 'i') details.value = !details.value
  else if (event.key === 'Escape') {
    if (details.value) details.value = false
    else window.location.href = homeHref.value
  }
}

// A swipe up on the handle opens the phone sheet, a swipe down on the sheet closes it
let startY = 0
const onTouchStart = (event: TouchEvent) => (startY = event.touches[0]?.clientY ?? 0)
const onHandleEnd = (event: TouchEvent) => {
  if (startY - (event.changedTouches[0]?.clientY ?? 0) > 30) details.value = true
}
const onSheetEnd = (event: TouchEvent) => {
  if ((event.changedTouches[0]?.clientY ?? 0) - startY > 40) details.value = false
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <main class="media" :class="{ 'is-open': details, 'is-video': !!video }">
    <CausticsCanvas position="full" :strength="0.7" />
    <div class="tint" aria-hidden="true"></div>

    <a class="logo" :href="siteHref('/')" :aria-label="brandName"><img :src="logoUrl" :alt="brandName" width="96" height="96" @error="useDefaultLogo" /></a>

    <nav class="strip" aria-label="Media strip">
      <a class="step mv-icon-button" :href="pageOf(previous.slug)" aria-label="Previous">
        <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4.5 11.5L9 7l4.5 4.5" /></svg>
      </a>
      <a
        v-for="entry in strip"
        :key="entry.slug"
        class="thumb"
        :class="{ 'is-current': entry.slug === item.slug }"
        :href="pageOf(entry.slug)"
        :aria-label="entry.title"
        :aria-current="entry.slug === item.slug ? 'page' : undefined">
        <img :src="'imageUrl' in entry ? entry.imageUrl : entry.posterUrl" alt="" loading="lazy" />
      </a>
      <a class="step mv-icon-button" :href="pageOf(next.slug)" aria-label="Next">
        <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4.5 6.5L9 11l4.5-4.5" /></svg>
      </a>
      <p class="position">{{ kind === 'video' ? `VIDEO ${pad(index + 1)}` : `${pad(index + 1)} / ${pad(total)}` }}</p>
    </nav>

    <figure ref="stage" class="stage" :style="{ '--ratio': item.aspectRatio }">
      <img v-if="photo" class="photo" :src="photo.imageUrl" :alt="photo.title" :width="photo.width" :height="photo.height" />
      <template v-else-if="video">
        <div class="clip">
          <video
            ref="player"
            :src="video.videoUrl"
            :poster="video.posterUrl"
            :muted="muted"
            preload="metadata"
            playsinline
            @click="play"
            @play="playing = true"
            @pause="playing = false"
            @ended="playing = false"
            @timeupdate="time = ($event.target as HTMLVideoElement).currentTime"
            @loadedmetadata="length = ($event.target as HTMLVideoElement).duration"></video>
          <button v-if="!playing" type="button" class="play" aria-label="Play video" @click="play">
            <svg viewBox="0 0 26 26" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M7 4l15 9-15 9z" /></svg>
          </button>
        </div>
        <div class="bar">
          <span class="now">{{ clock(time) }}</span>
          <div class="scrub" role="slider" aria-label="Seek" :aria-valuenow="length ? Math.round((time / length) * 100) : 0" aria-valuemin="0" aria-valuemax="100" @click="seek">
            <i :style="{ width: length ? `${(time / length) * 100}%` : '0%' }"></i>
          </div>
          <span class="end">{{ clock(length || video.durationSeconds) }}</span>
          <button type="button" class="mute mv-icon-button" :aria-pressed="muted" :aria-label="muted ? 'Unmute' : 'Mute'" @click="muted = !muted">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
              <path d="M2.7 6h2.2L8.7 3v10L4.9 10H2.7z" fill="currentColor" />
              <path v-if="muted" d="M11.5 6.2l3 3.6M14.5 6.2l-3 3.6" />
              <path v-else d="M11.3 6a3 3 0 0 1 0 4" />
            </svg>
          </button>
        </div>
      </template>

      <a class="nav prev mv-icon-button" :href="pageOf(previous.slug)" aria-label="Previous">
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.67" aria-hidden="true"><path d="M12.5 5l-5 5 5 5" /></svg>
      </a>
      <a class="nav next mv-icon-button" :href="pageOf(next.slug)" aria-label="Next">
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.67" aria-hidden="true"><path d="M7.5 5l5 5-5 5" /></svg>
      </a>

      <figcaption class="caption">
        <p class="meta">{{ item.category }} · {{ mediaId.toUpperCase() }}{{ video ? `  ·  ${clock(video.durationSeconds)}` : '' }}</p>
        <h1 class="name">{{ item.title }}</h1>
      </figcaption>
    </figure>

    <!-- Desktop: the collapsed details rail -->
    <aside class="rail" aria-label="Details">
      <button type="button" class="info mv-icon-button" :aria-expanded="details" aria-controls="media-details" aria-label="Open details" @click="details = true">
        <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="9" cy="9" r="6.75" />
          <path d="M9 8.25V12.75M9 5.25h.01" />
        </svg>
      </button>
      <span class="vertical">DETAILS</span>
      <button type="button" class="share mv-icon-button" aria-label="Share" @click="share">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" aria-hidden="true"><path d="M8 10V2m0 0L5 5m3-3l3 3M3.5 8v5h9V8" /></svg>
      </button>
    </aside>

    <!-- Phone: the top-right info button and the handle at the foot -->
    <button type="button" class="info-top mv-icon-button" aria-label="Open details" @click="details = true">
      <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="9" cy="9" r="6.75" />
        <path d="M9 8.25V12.75M9 5.25h.01" />
      </svg>
    </button>
    <div class="handle" @touchstart.passive="onTouchStart" @touchend.passive="onHandleEnd">
      <i class="grabber" aria-hidden="true"></i>
      <span class="label">MEDIA DETAILS</span>
      <button type="button" class="expand mv-icon-button" aria-label="Open details" @click="details = true">
        <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4.5 11.5L9 7l4.5 4.5" /></svg>
      </button>
    </div>

    <div class="scrim" aria-hidden="true" @click="details = false"></div>

    <aside id="media-details" class="sidebar" :aria-hidden="!details" :inert="!details" @touchstart.passive="onTouchStart" @touchend.passive="onSheetEnd">
      <div class="side-header">
        <h2 class="side-head">MEDIA DETAILS</h2>
        <button type="button" class="close mv-icon-button" aria-label="Close details" @click="details = false">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.47" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
      </div>
      <p class="side-title">{{ item.title }}</p>
      <div class="chips">
        <span class="category">{{ item.category }}</span>
        <span v-if="photo?.gallery">IN GALLERY</span>
      </div>
      <dl class="facts">
        <div v-for="[term, value] in rows" :key="term">
          <dt>{{ term }}</dt>
          <dd>{{ value }}</dd>
        </div>
      </dl>
      <div class="desc">
        <h3>DESCRIPTION</h3>
        <p>{{ item.description ?? `No description has been added for this ${kind === 'photo' ? 'frame' : 'video'} yet.` }}</p>
      </div>
      <div class="actions">
        <button type="button" class="mv-icon-button" aria-label="Share" @click="share">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" aria-hidden="true"><path d="M8 10V2m0 0L5 5m3-3l3 3M3.5 8v5h9V8" /></svg>
        </button>
        <button type="button" class="mv-icon-button" :aria-label="copied ? 'Link copied' : 'Copy link'" @click="copy">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" aria-hidden="true">
            <path d="M7 9a2.5 2.5 0 0 0 3.5 0l2-2A2.5 2.5 0 0 0 9 3.5L8.2 4.3M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.8-.8" />
          </svg>
        </button>
        <button type="button" class="mv-icon-button" aria-label="Fullscreen" @click="fullscreen">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.33" aria-hidden="true">
            <path d="M2.7 6V2.7H6M10 2.7h3.3V6M13.3 10v3.3H10M6 13.3H2.7V10" />
          </svg>
        </button>
        <p class="keys"><span class="desktop-keys">← → browse · I details · Esc close</span><span class="phone-keys">Swipe down to close</span></p>
      </div>
    </aside>
  </main>
</template>

<style scoped>
.media {
  --strip: 3rem;

  position: relative;
  display: grid;
  height: 100svh;
  min-height: 34rem;
  overflow: hidden;
  place-items: center;
  isolation: isolate;
  background: var(--mv-bg);
}

.tint {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--mv-red);
  mix-blend-mode: color;
}

.logo {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 3;
  width: 3.5rem;
  height: 3.5rem;
  overflow: hidden;
  border-radius: 999px;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The strip of neighbours: a column of thumbnails with the current one framed in red */
.strip {
  position: absolute;
  top: 12.5rem;
  left: 0.625rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: var(--strip);
}

.step {
  width: 2.25rem;
  height: 2.25rem;
  border-color: #404040;
  background: #262626;
}

.thumb {
  display: block;
  width: 2.5rem;
  height: 3.75rem;
  overflow: hidden;
  opacity: 0.45;
  border: 0 solid transparent;
  transition: opacity 0.25s ease;
}

.thumb:hover {
  opacity: 0.8;
}

.thumb.is-current {
  width: 3rem;
  height: 4.5rem;
  opacity: 1;
  border: 2px solid var(--mv-red);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.position {
  margin: 0.5rem 0 0;
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

/* Only the media itself is full colour: no scrim, text over it gets a shadow */
.stage {
  --bar: 0rem;

  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  transform: translateX(1.5rem);
}

.is-video .stage {
  --bar: 3rem;
}

.photo {
  display: block;
  width: min(19.625rem, calc(100vw - 6rem));
  max-height: calc(100svh - 18rem);
  aspect-ratio: var(--ratio);
  object-fit: cover;
}

.clip {
  position: relative;
  width: min(18.75rem, calc(100vw - 7rem));
  aspect-ratio: var(--ratio);
  max-height: calc(100svh - 21rem);
  background: #000;
}

.clip video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  padding: 0 0 0 0.25rem;
  border: 1px solid color-mix(in srgb, #fff 50%, transparent);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.14);
  color: #fff;
  cursor: pointer;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(6px);
}

.bar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 0.875rem;
  height: var(--bar);
  padding: 0 0.75rem;
  background: #000;
  font-size: 0.75rem;
  font-weight: 500;
}

.end {
  color: #cbd5e1;
}

.scrub {
  position: relative;
  flex: 1;
  height: 3px;
  background: color-mix(in srgb, #fff 25%, transparent);
  cursor: pointer;
}

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

.mute {
  width: 2.25rem;
  height: 2.25rem;
  border-color: transparent;
  background: #fff;
  color: #000;
  backdrop-filter: none;
}

.nav {
  display: none;
}

.caption {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;
  text-shadow: 0 1px 14px rgb(0 0 0 / 0.85);
}

.meta {
  margin: 0;
  color: var(--mv-hot);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.name {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
}

.rail,
.handle {
  position: absolute;
}

.rail {
  display: none;
}

.info-top {
  position: absolute;
  top: 1.625rem;
  right: 1.25rem;
  z-index: 3;
  width: 2.25rem;
  height: 2.25rem;
  border-color: transparent;
  background: #fff;
  color: #000;
  backdrop-filter: none;
}

.handle {
  inset: auto 0 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
  padding: 0 1.25rem 0 1.5625rem;
  background: rgb(0 0 0 / 0.35);
  border-top: 1px solid #404040;
  backdrop-filter: blur(12px);
}

.grabber {
  position: absolute;
  top: 0.375rem;
  left: 50%;
  width: 2.5rem;
  height: 3px;
  background: color-mix(in srgb, #fff 40%, transparent);
  transform: translateX(-50%);
}

.label {
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.expand {
  width: 2.5rem;
  height: 2.5rem;
  border-color: #404040;
  background: #262626;
}

.scrim {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 0.6);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.is-open .scrim {
  opacity: 1;
  pointer-events: auto;
}

/* The details: a bottom sheet on a phone, a sidebar from the right on a desktop */
.sidebar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 55;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  height: calc(100svh - 7.5rem);
  padding: 1.5625rem 1.5625rem 2rem;
  overflow-y: auto;
  border-top: 1px solid #404040;
  background: rgb(15 15 15 / 0.92);
  backdrop-filter: blur(24px);
  transform: translateY(100%);
  transition: transform 0.6s var(--mv-ease);
}

.is-open .sidebar {
  transform: none;
}

.side-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.side-head {
  color: #cbd5e1;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.close {
  width: 2.25rem;
  height: 2.25rem;
  border-color: transparent;
  background: #fff;
  color: #000;
  backdrop-filter: none;
}

.side-title {
  font-size: 1.625rem;
  font-weight: 600;
  line-height: 1.18;
}

.chips {
  display: flex;
  gap: 0.5rem;
}

.chips span {
  padding: 0.3125rem 0.625rem;
  border: 1px solid #404040;
  color: #cbd5e1;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.chips .category {
  border-color: var(--mv-red);
  background: var(--mv-red);
  color: #fff;
}

.facts {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #404040;
}

.facts div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8125rem 0;
  border-bottom: 1px solid #404040;
  font-size: 0.9375rem;
}

.facts dt {
  color: #8c8c8c;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.facts dd {
  font-weight: 500;
  text-align: right;
}

.desc h3 {
  color: #8c8c8c;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.desc p {
  margin-top: 0.5rem;
  color: #8c8c8c;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: auto;
}

.actions .mv-icon-button {
  width: 2.5rem;
  height: 2.5rem;
  border-color: #404040;
  background: #262626;
}

.keys {
  flex: 1;
  margin: 0;
  color: #737373;
  font-size: 0.6875rem;
  text-align: right;
}

.desktop-keys {
  display: none;
}

@media (min-width: 880px) {
  .media {
    --strip: 5rem;
  }

  .logo {
    top: 1rem;
    left: 4rem;
    width: 6rem;
    height: 6rem;
  }

  .strip {
    top: 8.5rem;
    left: 2.5rem;
    gap: 0.5rem;
  }

  .step {
    width: 2.25rem;
    height: 2.25rem;
  }

  .thumb {
    width: 4rem;
    height: 6rem;
  }

  .thumb.is-current {
    width: 5rem;
    height: 7.5rem;
  }

  .is-video .thumb {
    width: 3.5rem;
    height: 6.25rem;
  }

  .is-video .thumb.is-current {
    width: 4.5rem;
    height: 8rem;
  }

  .stage {
    height: 100svh;
    transform: none;
  }

  .photo {
    width: auto;
    max-width: calc(100vw - 20rem);
    height: 100svh;
    max-height: none;
    object-fit: contain;
  }

  .clip {
    width: auto;
    max-width: calc(100vw - 20rem);
    height: calc(100svh - 3.5rem);
    max-height: none;
  }

  .is-video .stage {
    --bar: 3.5rem;
  }

  .bar {
    padding: 0 1rem;
  }

  .nav {
    position: absolute;
    top: calc((100% - var(--bar)) / 2 - 1.375rem);
    display: inline-grid;
    width: 2.75rem;
    height: 2.75rem;
    border-color: color-mix(in srgb, #fff 18%, transparent);
    background: rgb(0 0 0 / 0.55);
  }

  .prev {
    right: 100%;
    margin-right: 1rem;
  }

  .next {
    left: 100%;
    margin-left: 1rem;
  }

  .caption {
    position: absolute;
    right: 1.5rem;
    bottom: calc(var(--bar) + 1.125rem);
    left: 1.5rem;
    margin-top: 0;
  }

  .is-video .caption {
    bottom: calc(var(--bar) + 2rem);
  }

  .rail {
    inset: 0 0 0 auto;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    width: 3.5rem;
    border-left: 1px solid #404040;
    background: rgb(0 0 0 / 0.35);
  }

  .vertical {
    margin-bottom: 0;
    color: #cbd5e1;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }

  .rail .info {
    width: 2.25rem;
    height: 2.25rem;
    border-color: transparent;
    background: #fff;
    color: #000;
    backdrop-filter: none;
  }

  .rail .share {
    position: absolute;
    bottom: 1.8125rem;
    width: 2.25rem;
    height: 2.25rem;
    border-color: #404040;
    background: #262626;
  }

  .info-top,
  .handle,
  .scrim {
    display: none;
  }

  .sidebar {
    top: 0;
    left: auto;
    width: 27.5rem;
    height: auto;
    padding: 2.5rem;
    border-top: 0;
    border-left: 1px solid #404040;
    box-shadow: -1.5rem 0 3.75rem rgb(0 0 0 / 0.5);
    transform: translateX(100%);
  }

  .desktop-keys {
    display: inline;
  }

  .phone-keys {
    display: none;
  }
}
</style>
