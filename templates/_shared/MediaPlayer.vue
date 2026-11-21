<script setup lang="ts">
import '@videojs/html/video/player'
import '@videojs/html/video/skin'
import '@videojs/html/live-video/player'
import '@videojs/html/live-video/skin'
import '@videojs/html/media/hls-video'

// The one video player of every template: Video.js 10 (custom elements, server-rendered by Nuxt and upgraded on load). A `.m3u8` source
// plays through the HLS media element, a live stream gets the live skin (live-edge button, no time slider). The brand drives the skin:
// its accent color and its font. The picture is never touched: no tint, no filter.
const props = withDefaults(
  defineProps<{
    src: string
    poster?: string
    /** A live stream: the live skin and the live-edge button */
    live?: boolean
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    /** How the picture fills the box: `cover` for fixed shapes, `contain` to show every pixel */
    fit?: 'cover' | 'contain'
  }>(),
  { poster: undefined, fit: 'cover' }
)

const emit = defineEmits<{
  timeupdate: [event: Event]
  loadedmetadata: [event: Event]
  play: [event: Event]
  pause: [event: Event]
  ended: [event: Event]
}>()

const media = ref<HTMLMediaElement>()
const isHls = computed(() => /\.m3u8(\?|$)/i.test(props.src))
const playerTag = computed(() => (props.live ? 'live-video-player' : 'video-player'))
const skinTag = computed(() => (props.live ? 'live-video-skin' : 'video-skin'))

defineExpose({
  media,
  play: () => media.value?.play().catch(() => undefined),
  pause: () => media.value?.pause(),
  seek: (seconds: number) => {
    if (media.value) media.value.currentTime = seconds
  },
})
</script>

<template>
  <component :is="playerTag" :poster="poster" class="vp" :style="{ '--media-object-fit': fit }">
    <component :is="skinTag">
      <hls-video
        v-if="isHls"
        ref="media"
        :src="src"
        :autoplay="autoplay"
        :muted="muted"
        :loop="loop"
        playsinline
        crossorigin="anonymous"
        @timeupdate="emit('timeupdate', $event)"
        @loadedmetadata="emit('loadedmetadata', $event)"
        @play="emit('play', $event)"
        @pause="emit('pause', $event)"
        @ended="emit('ended', $event)"></hls-video>
      <video
        v-else
        ref="media"
        :src="src"
        :autoplay="autoplay"
        :muted="muted"
        :loop="loop"
        playsinline
        preload="metadata"
        @timeupdate="emit('timeupdate', $event)"
        @loadedmetadata="emit('loadedmetadata', $event)"
        @play="emit('play', $event)"
        @pause="emit('pause', $event)"
        @ended="emit('ended', $event)"></video>
    </component>
  </component>
</template>

<style scoped>
.vp {
  --media-accent-color: var(--brand-primary, #fb3737);
  --media-accent-text-color: rgb(var(--brand-on-primary-rgb, 255 255 255));
  --media-font-family: var(--brand-font, system-ui, sans-serif);
  --media-border-radius: 0;
  --media-border-color: transparent;

  display: block;
  width: 100%;
  height: 100%;
}

.vp :deep(video-skin),
.vp :deep(live-video-skin) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
