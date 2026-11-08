<script setup lang="ts">
// A static glow (plain CSS) is always there; the shader fades in on top once the browser has loaded it,
// so the server render, previews, reduced motion and browsers without WebGPU keep the glow
defineProps<{ variant: 'hero' | 'contact' | 'swirl' | 'ambient' }>()

const ShaderLayer = defineAsyncComponent(() => import('./ShaderLayer.vue'))
const root = ref<HTMLElement>()
const allowed = ref(false)
const inView = ref(true)
// A canvas only runs while its section is on screen
const live = computed(() => allowed.value && inView.value)
let observer: IntersectionObserver | undefined

// The backdrop sits behind the content, so the shader never receives the mouse itself:
// the section listens instead and hands every mouse event on to the canvas
const mouseEvents = ['mousemove', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup'] as const
const forward = (event: MouseEvent) => {
  const canvas = root.value?.querySelector('canvas')
  if (!canvas) return
  canvas.dispatchEvent(new MouseEvent(event.type, { clientX: event.clientX, clientY: event.clientY, buttons: event.buttons, bubbles: false }))
}
let host: HTMLElement | null = null
const colors = ref({ primary: '#0593fa', accent: '#5bbbff', bg: '#171717', text: '#f8fafc' })

onMounted(() => {
  // The shader takes hex values: read them from the brand variables
  const style = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback
  colors.value = {
    primary: read('--brand-primary', colors.value.primary),
    accent: read('--brand-accent', colors.value.accent),
    bg: read('--brand-bg', colors.value.bg),
    text: read('--brand-text', colors.value.text),
  }
  allowed.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  host = root.value?.parentElement ?? null
  for (const type of mouseEvents) host?.addEventListener(type, forward, { passive: true })
  if (root.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => (inView.value = !!entry?.isIntersecting), { rootMargin: '200px 0px' })
    observer.observe(root.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  for (const type of mouseEvents) host?.removeEventListener(type, forward)
})
</script>

<template>
  <div ref="root" class="backdrop" :class="`is-${variant}`" aria-hidden="true">
    <div class="glow"></div>
    <div v-if="variant === 'hero'" class="dots"></div>
    <ShaderLayer v-if="live" :variant="variant" :colors="colors" class="shader" @unavailable="allowed = false" />
    <div class="scrim"></div>
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--sg-bg);
  pointer-events: none;
}

.glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 55% at 70% 20%, rgb(var(--brand-primary-rgb) / 0.55), transparent 70%), radial-gradient(45% 45% at 85% 60%, rgb(var(--brand-accent-rgb) / 0.4), transparent 70%),
    radial-gradient(50% 50% at 10% 85%, color-mix(in srgb, var(--sg-line) 80%, transparent), transparent 70%);
}

.is-contact .glow {
  background: radial-gradient(50% 80% at 20% 50%, rgb(var(--brand-primary-rgb) / 0.5), transparent 70%), radial-gradient(45% 70% at 85% 40%, rgb(var(--brand-primary-rgb) / 0.4), transparent 70%);
}

.dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(var(--brand-text-rgb) / 0.22) 1px, transparent 1.5px);
  background-size: 28px 28px;
  mask-image: linear-gradient(to bottom, #000, transparent 85%);
}

.shader {
  opacity: 0.6;
  animation: fade-in 1.2s ease both;
}

.is-ambient {
  background: transparent;
}

.is-ambient .glow {
  background: radial-gradient(45% 50% at 12% 30%, rgb(var(--brand-primary-rgb) / 0.22), transparent 70%), radial-gradient(40% 45% at 90% 75%, rgb(var(--brand-accent-rgb) / 0.16), transparent 70%);
}

.is-ambient .shader {
  opacity: 0.32;
}

/* The section fades into the page background above and below the shader */
.is-ambient .scrim {
  background: linear-gradient(to bottom, var(--sg-bg), transparent 25%, transparent 70%, var(--sg-bg));
}

.scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.55), transparent 22%, transparent 45%, rgb(0 0 0 / 0.8));
}

.is-contact .scrim {
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.45), rgb(0 0 0 / 0.1) 40%, rgb(0 0 0 / 0.65));
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
</style>
