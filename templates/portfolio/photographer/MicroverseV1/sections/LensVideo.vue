<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import LoopVideo from '~~/templates/_shared/LoopVideo.vue'
import { useMicroverseMotion, useVisibleLoop } from '../useMicroverse'

// The hero reel: a looping Video.js background video. With WebGL, a TresJS scene (LensStage) draws it on a full-screen plane so the
// cursor can act as a lens (a barrel warp) and the scroll velocity adds a short smear. The picture itself is never graded or tinted:
// it keeps the colors of the file. Fallback (server render, previews, reduced motion, no WebGL): the plain video, or its poster.
defineProps<{ videoUrl: string; posterUrl: string }>()
const emit = defineEmits<{ time: [seconds: number] }>()

const Stage = defineAsyncComponent(() => import('./LensStage.vue'))

const motion = useMicroverseMotion()
const root = ref<HTMLElement>()
const source = ref<InstanceType<typeof LoopVideo>>()
const video = ref<HTMLVideoElement>()
const stage = ref<{ frame: (time: number) => void }>()
const live = ref(false)
const failed = ref(false)

const fallBack = () => {
  failed.value = true
  live.value = false
}
const onTime = () => video.value && emit('time', video.value.currentTime)

onMounted(async () => {
  const el = await source.value?.native()
  if (!el) return fallBack()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.pause()
  el.addEventListener('timeupdate', onTime)
  // A video that cannot load (or be a texture) stays a plain video
  el.addEventListener('error', fallBack)
  video.value = el
})

onBeforeUnmount(() => {
  video.value?.removeEventListener('timeupdate', onTime)
  video.value?.removeEventListener('error', fallBack)
})

useVisibleLoop(root, (time) => stage.value?.frame(time))
</script>

<template>
  <div ref="root" class="lens" :class="{ 'is-live': live }" aria-hidden="true">
    <img class="poster" :src="posterUrl" alt="" />
    <LoopVideo ref="source" class="video" :src="videoUrl" />
    <Stage v-if="video && motion.gl.value && !failed" ref="stage" class="canvas" :video="video" :root="root!" @ready="live = true" @error="fallBack" />
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

.poster,
.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease;
}

/* The poster fades out once the video plays; the canvas takes over from the video when it runs */
.lens:not(.is-live) .video {
  opacity: 1;
}

.is-live .canvas {
  opacity: 1;
}

.is-live .poster {
  opacity: 0;
}

/* The video is only the texture when the canvas runs: it stays out of sight */
.is-live .video {
  opacity: 0;
  pointer-events: none;
}
</style>
