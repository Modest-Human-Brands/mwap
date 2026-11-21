<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useMicroverseMotion, useVisibleLoop } from '../useMicroverse'

// The hero reel: a looping video mapped onto a full-screen plane by a TresJS scene (LensStage). A fragment shader grades it to a
// red/black duotone, the cursor is a lens (a barrel warp with an RGB split that grows with its speed) and the scroll velocity
// adds a short vertical smear. Fallback (server render, previews, reduced motion, no WebGL, a video that cannot be a texture):
// the poster with a CSS duotone, and the plain video graded with the same CSS when it can play.
defineProps<{ videoUrl: string; posterUrl: string }>()
const emit = defineEmits<{ time: [seconds: number] }>()

const Stage = defineAsyncComponent(() => import('./LensStage.vue'))

const motion = useMicroverseMotion()
const root = ref<HTMLElement>()
const video = ref<HTMLVideoElement>()
const stage = ref<{ frame: (time: number) => void }>()
const live = ref(false)
const playing = ref(false)
// Set once the client has the elements: the scene needs the video element and the root to exist
const mounted = ref(false)
const failed = ref(false)

const fallBack = () => {
  failed.value = true
  live.value = false
}
const onTime = () => video.value && emit('time', video.value.currentTime)

onMounted(() => {
  const el = video.value
  if (!root.value || !el) return
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    el.play()
      .then(() => (playing.value = true))
      .catch(() => undefined)
  el.addEventListener('timeupdate', onTime)
  // A video that cannot load (or be a texture) leaves the CSS grade
  el.addEventListener('error', fallBack)
  mounted.value = !el.error
})

onBeforeUnmount(() => {
  video.value?.removeEventListener('timeupdate', onTime)
  video.value?.removeEventListener('error', fallBack)
})

useVisibleLoop(root, (time) => stage.value?.frame(time))
</script>

<template>
  <div ref="root" class="lens" :class="{ 'is-live': live, 'is-playing': playing }" aria-hidden="true">
    <img class="poster" :src="posterUrl" alt="" />
    <video ref="video" class="video" :src="videoUrl" :poster="posterUrl" crossorigin="anonymous" muted loop playsinline preload="metadata"></video>
    <Stage v-if="mounted && motion.gl.value && !failed" ref="stage" class="canvas" :video="video!" :root="root!" @ready="live = true" @error="fallBack" />
    <div class="tint"></div>
  </div>
</template>

<style scoped>
.lens {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: var(--mv-bg);
}

/* CSS duotone: grey, then multiplied by the red */
.poster,
.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.15) brightness(0.9);
}

.video {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.is-playing:not(.is-live) .video {
  opacity: 1;
}

.tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, color-mix(in srgb, var(--mv-red) 78%, var(--mv-bg)), var(--mv-bg));
  mix-blend-mode: multiply;
}

.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.is-live .canvas {
  opacity: 1;
}

.is-live .tint,
.is-live .poster {
  opacity: 0;
}

/* The video is only the texture when the canvas runs: it stays out of sight */
.is-live .video {
  opacity: 0;
  pointer-events: none;
}
</style>
