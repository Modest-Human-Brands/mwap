<script setup lang="ts">
import '@videojs/html/media/background-video'
import '@videojs/html/media/hls-background-video'

// A decorative, muted, looping video (Video.js 10 background video): hero reels, project cards. It fills the box it is given and never
// carries controls or a color treatment. `video` is the native element inside it (a WebGL texture needs it), once the element is upgraded.
const props = defineProps<{ src: string; poster?: string; paused?: boolean }>()

const el = ref<HTMLElement & { target?: HTMLVideoElement }>()
const isHls = computed(() => /\.m3u8(\?|$)/i.test(props.src))
const tag = computed(() => (isHls.value ? 'hls-background-video' : 'background-video'))

/** The native video, resolved once the custom element has been upgraded on the client */
async function native(): Promise<HTMLVideoElement | undefined> {
  await customElements.whenDefined(isHls.value ? 'hls-background-video' : 'background-video')
  for (let tries = 0; tries < 20 && !el.value?.target; tries++) await new Promise((resolve) => setTimeout(resolve, 50))
  return el.value?.target
}

defineExpose({ native })
</script>

<template>
  <component :is="tag" ref="el" class="bgv" :src="src" :noautoplay="paused || undefined" crossorigin="anonymous"></component>
</template>

<style scoped>
.bgv {
  --media-object-fit: cover;
  --media-object-position: center;

  display: block;
  width: 100%;
  height: 100%;
}
</style>
