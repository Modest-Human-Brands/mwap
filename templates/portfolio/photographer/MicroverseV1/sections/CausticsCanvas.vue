<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useMicroverseMotion, useVisibleLoop } from '../useMicroverse'

// Light through molten glass: a 5-iteration trigonometric caustic, screen-blended into the background and strongest at the
// bottom of the section. A CSS glow is always there; the TresJS canvas fades in on top once WebGL runs, so the server render,
// previews, reduced motion and browsers without WebGL keep the glow. The scene (and three.js with it) loads on demand.
withDefaults(defineProps<{ strength?: number; position?: 'bottom' | 'full' }>(), { strength: 1, position: 'bottom' })

const Stage = defineAsyncComponent(() => import('./CausticsStage.vue'))

const motion = useMicroverseMotion()
const root = ref<HTMLElement>()
const stage = ref<{ frame: (time: number) => void }>()
const live = ref(false)
const failed = ref(false)

useVisibleLoop(root, (time) => stage.value?.frame(time))

function fail() {
  failed.value = true
  live.value = false
}
</script>

<template>
  <div ref="root" class="caustics" :class="[`is-${position}`, { 'is-live': live }]" aria-hidden="true">
    <div class="glow"></div>
    <Stage v-if="motion.gl.value && !failed" ref="stage" class="canvas" :strength="strength" :full="position === 'full'" @ready="live = true" @error="fail" />
  </div>
</template>

<style scoped>
.caustics {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 45% at 25% 100%, color-mix(in srgb, var(--mv-red) 55%, transparent), transparent 70%),
    radial-gradient(50% 40% at 80% 95%, color-mix(in srgb, var(--mv-hot) 40%, transparent), transparent 70%);
}

.is-full .glow {
  background:
    radial-gradient(70% 60% at 30% 40%, color-mix(in srgb, var(--mv-red) 35%, transparent), transparent 70%),
    radial-gradient(60% 50% at 80% 70%, color-mix(in srgb, var(--mv-hot) 25%, transparent), transparent 70%);
}

.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 1.2s ease;
}

.is-live .canvas {
  opacity: 0.9;
}
</style>
