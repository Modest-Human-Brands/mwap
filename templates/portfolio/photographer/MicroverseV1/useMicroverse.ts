import { inject, onBeforeUnmount, onMounted, provide, ref, type InjectionKey, type Ref } from 'vue'

/** What the scenes read every frame: the scroll velocity (px per frame, signed) and whether they may run at all */
export interface MicroverseMotion {
  velocity: { value: number }
  /** False with reduced motion or without WebGL: scenes stay as stills */
  gl: Ref<boolean>
  /** Set once the client has mounted: server render and previews never animate */
  ready: Ref<boolean>
}

const motionKey: InjectionKey<MicroverseMotion> = Symbol('microverse-motion')

const hasWebGL = () => {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** Root of the template: smooth scroll (Lenis) whose velocity feeds the shaders, plus the motion and WebGL switches */
export function provideMicroverseMotion() {
  const motion: MicroverseMotion = { velocity: { value: 0 }, gl: ref(false), ready: ref(false) }
  let stop: (() => void) | undefined

  onMounted(async () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    motion.gl.value = !reduced && hasWebGL()
    motion.ready.value = true
    if (reduced) return

    const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')])
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', (event: { velocity: number }) => {
      motion.velocity.value = event.velocity
      ScrollTrigger.update()
    })
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    stop = () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  })

  onBeforeUnmount(() => stop?.())
  provide(motionKey, motion)
  return motion
}

export function useMicroverseMotion(): MicroverseMotion {
  return inject(motionKey, { velocity: { value: 0 }, gl: ref(false), ready: ref(false) })
}

/** Runs `render(time)` every frame while `el` is on screen; the canvas pauses when off-screen (a budget of the design) */
export function useVisibleLoop(el: Ref<HTMLElement | undefined>, render: (time: number) => void) {
  let raf = 0
  let visible = false
  let observer: IntersectionObserver | undefined

  const frame = (time: number) => {
    if (!visible) return
    render(time / 1000)
    raf = requestAnimationFrame(frame)
  }

  onMounted(() => {
    if (!el.value) return
    observer = new IntersectionObserver(([entry]) => {
      const next = !!entry?.isIntersecting
      if (next && !visible) raf = requestAnimationFrame(frame)
      visible = next
      if (!next) cancelAnimationFrame(raf)
    })
    observer.observe(el.value)
  })

  onBeforeUnmount(() => {
    visible = false
    cancelAnimationFrame(raf)
    observer?.disconnect()
  })
}

/** `0.6667` -> `2 : 3 · Portrait`; `1.7778` -> `16 : 9 · Landscape` */
export function aspectLabel(ratio: number, names: { portrait: string; landscape: string; square: string } = { portrait: 'Portrait', landscape: 'Landscape', square: 'Square' }) {
  let pair = `${Math.round(ratio * 100)} : 100`
  for (let d = 1; d <= 20; d++) {
    const n = Math.round(ratio * d)
    if (n > 0 && Math.abs(n / d - ratio) < 0.005) {
      pair = `${n} : ${d}`
      break
    }
  }
  const name = ratio < 0.95 ? names.portrait : ratio > 1.05 ? names.landscape : names.square
  return `${pair} · ${name}`
}

/** 36.4 -> `0:36`; 125 -> `2:05` */
export function clock(seconds: number) {
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** `2026-01-19` -> `19 Jan 2026` (no time zone involved) */
export function shortDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTHS[(month ?? 1) - 1]} ${year}`
}

/** Section titles rise character by character (60 ms apart) once they are on screen; the text stays whole for readers and for the server render */
export function useCharReveal(el: Ref<HTMLElement | undefined>) {
  onMounted(async () => {
    const target = el.value
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    gsap.registerPlugin(ScrollTrigger)
    const text = target.textContent ?? ''
    target.setAttribute('aria-label', text)
    target.textContent = ''
    // Characters are grouped per word so a line only ever breaks between words
    const chars: HTMLElement[] = []
    text.split(/(\s+)/).forEach((part) => {
      if (!part) return
      if (/^\s+$/.test(part)) {
        target.appendChild(document.createTextNode(' '))
        return
      }
      const word = document.createElement('span')
      word.setAttribute('aria-hidden', 'true')
      word.style.display = 'inline-block'
      word.style.whiteSpace = 'nowrap'
      for (const char of part) {
        const span = document.createElement('span')
        span.style.display = 'inline-block'
        span.textContent = char
        word.appendChild(span)
        chars.push(span)
      }
      target.appendChild(word)
    })
    gsap.from(chars, { yPercent: 110, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 * 0.4, scrollTrigger: { trigger: target, start: 'top 88%', once: true } })
  })
}
