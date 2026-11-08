<script setup lang="ts">
// Counts up to the number inside a value such as "40", "1,200+" or "99.9%" when it scrolls into view.
// The server render and reduced-motion visitors get the final value
const props = defineProps<{ value: string }>()

const text = ref(props.value)
const el = ref<HTMLElement>()

const parts = computed(() => {
  const match = /^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(props.value)
  if (!match) return null
  const raw = match[2]!
  return { prefix: match[1]!, target: parseFloat(raw.replace(/,/g, '')), decimals: raw.split('.')[1]?.length ?? 0, grouped: raw.includes(','), suffix: match[3]! }
})

function format(n: number) {
  const p = parts.value!
  const body = n.toLocaleString('en-US', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals, useGrouping: p.grouped })
  return `${p.prefix}${body}${p.suffix}`
}

let observer: IntersectionObserver | undefined
let frame = 0

onMounted(() => {
  if (!parts.value || !el.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  text.value = format(0)
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      observer?.disconnect()
      const start = performance.now()
      const duration = 1600
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        // Ease out: fast at first, settling on the number
        text.value = format(parts.value!.target * (1 - Math.pow(1 - t, 4)))
        if (t < 1) frame = requestAnimationFrame(tick)
        else text.value = props.value
      }
      frame = requestAnimationFrame(tick)
    },
    { threshold: 0.6 }
  )
  observer.observe(el.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <span ref="el" class="count">{{ text }}</span>
</template>

<style scoped>
.count {
  font-variant-numeric: tabular-nums;
}
</style>
