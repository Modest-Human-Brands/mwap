<script setup lang="ts">
import type { MicroverseHome, MicroversePhoto } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import { useCharReveal } from '../useMicroverse'

// `photos` are the featured ones in bento order. The category tags are matter-js bodies: they drop onto the floor of a stage in the
// corner when the section enters view and can be dragged; choosing a tag filters the grid and Flip morphs the cells. The server render
// and reduced motion show the tags as a plain row of buttons, which work the same. On a phone the grid is a swipe strip.
const props = defineProps<{ slotContent: MicroverseHome['featured']; photos: MicroversePhoto[] }>()

const siteHref = useSiteHref()
const title = ref<HTMLElement>()
const grid = ref<HTMLElement>()
const strip = ref<HTMLElement>()
const stage = ref<HTMLElement>()
const tagEls = ref<HTMLElement[]>([])
const selected = ref<string | null>(null)
const physics = ref(false)
const slide = ref(0)
useCharReveal(title)

const categories = computed(() => [...new Set(props.photos.map((photo) => photo.category))])
const shown = computed(() => (selected.value ? props.photos.filter((photo) => photo.category === selected.value) : props.photos))
const pad = (n: number) => String(n).padStart(2, '0')

// The seven cells of the bento, as grid areas (row start / column start / row end / column end); later ones flow on
const AREAS = ['1 / 1 / 3 / 3', '1 / 3 / 2 / 4', '1 / 4 / 2 / 5', '3 / 1 / 4 / 2', '3 / 2 / 4 / 3', '2 / 3 / 4 / 4', '2 / 4 / 4 / 5']
const areaOf = (index: number) => AREAS[index]

// Where the tags rest before (or without) the physics: the pile of the design on the 680 x 200 stage, tilted like dropped tags
const PILE = [
  { x: 40, y: 120, r: -3 },
  { x: 290, y: 128, r: 8 },
  { x: 380, y: 46, r: -11 },
]
const COUNT_PILE = { x: 130, y: 40, r: 17 }
function pile(index: number, count = false) {
  const spot = count ? COUNT_PILE : (PILE[index] ?? { x: 40 + ((index * 110) % 480), y: 30 + ((index * 47) % 110), r: index % 2 ? 6 : -7 })
  return `translate(${spot.x}px, ${spot.y}px) rotate(${spot.r}deg)`
}

let flipState: unknown
let Flip: typeof import('gsap/Flip').Flip | undefined

async function choose(category: string) {
  if (Flip && grid.value) flipState = Flip.getState(grid.value.querySelectorAll('.cell'))
  selected.value = selected.value === category ? null : category
  await nextTick()
  if (Flip && flipState && grid.value) Flip.from(flipState as never, { targets: grid.value.querySelectorAll('.cell'), duration: 0.7, ease: 'expo.out' })
}

function onStrip() {
  const el = strip.value
  if (!el) return
  const first = el.firstElementChild as HTMLElement | null
  const step = first ? first.offsetWidth + 8 : 1
  slide.value = Math.min(Math.round(el.scrollLeft / step), props.photos.length - 1)
}

let stopPhysics: (() => void) | undefined
onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const loaded = await Promise.all([import('gsap'), import('gsap/Flip'), import('gsap/ScrollTrigger'), import('matter-js')]).catch((error) => console.error('featured: scripts did not load', error))
  if (!loaded) return
  const [{ gsap }, flip, { ScrollTrigger }, MatterModule] = loaded
  // matter-js is a CommonJS bundle: its API is the default export
  const Matter = (MatterModule as unknown as { default?: typeof import('matter-js') }).default ?? MatterModule
  gsap.registerPlugin(flip.Flip, ScrollTrigger)
  Flip = flip.Flip
  if (!stage.value || window.innerWidth < 880) return

  const host = stage.value
  // The stage takes its physics size first, so the walls and the floor are measured on the final layout
  physics.value = true
  await nextTick()
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter
  // A fixed small step (120 Hz) with more solver iterations and sleeping bodies: the tags land and settle without jitter or popping apart
  const engine = Engine.create({ gravity: { x: 0, y: 1.2, scale: 0.001 }, positionIterations: 12, velocityIterations: 10, constraintIterations: 4, enableSleeping: true })
  const width = () => host.clientWidth
  const height = () => host.clientHeight
  const wall = { isStatic: true, friction: 0.3, restitution: 0.1 }
  const floor = Bodies.rectangle(width() / 2, height() + 60, width() * 3, 120, wall)
  const left = Bodies.rectangle(-60, height() / 2, 120, height() * 6, wall)
  const right = Bodies.rectangle(width() + 60, height() / 2, 120, height() * 6, wall)
  // The category tags and the frame count are all bodies; only the tags filter. They start above the stage, one over the other with a
  // clear gap, so they never begin inside each other and arrive one after another
  let dropY = -40
  const bodies = tagEls.value.map((el, index) => {
    const w = el.offsetWidth
    const h = el.offsetHeight
    const x = Math.min(Math.max(w / 2 + 16 + ((index * 173) % Math.max(width() - w - 32, 1)), w / 2 + 8), width() - w / 2 - 8)
    dropY -= h + 24
    const body = Bodies.rectangle(x, dropY, w, h, { restitution: 0.2, friction: 0.35, frictionAir: 0.015, slop: 0.02, sleepThreshold: 40, density: 0.002 })
    Body.setAngle(body, (index % 2 ? 1 : -1) * 0.1)
    return body
  })
  Composite.add(engine.world, [floor, left, right, ...bodies])
  // No body ever moves faster than a tag can be followed by the eye (and the solver)
  Events.on(engine, 'beforeUpdate', () => {
    for (const body of bodies) {
      const speed = Math.hypot(body.velocity.x, body.velocity.y)
      if (speed > 22) Body.setVelocity(body, { x: (body.velocity.x / speed) * 22, y: (body.velocity.y / speed) * 22 })
    }
  })

  const mouse = Mouse.create(host)
  // matter-js swallows the wheel: the page must keep scrolling
  mouse.element.removeEventListener('wheel', (mouse as unknown as { mousewheel: EventListener }).mousewheel)
  const constraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.12, damping: 0.2, render: { visible: false } } })
  Composite.add(engine.world, constraint)

  let dragged = 0
  Events.on(constraint, 'startdrag', () => (dragged = 0))
  Events.on(constraint, 'enddrag', (event: { body: Matter.Body }) => {
    const index = bodies.indexOf(event.body)
    const category = categories.value[index]
    if (dragged < 6 && category) choose(category)
  })
  Events.on(constraint, 'mousemove', () => dragged++)

  // Our own loop: fixed sub-steps from the frame time, the transforms written once per frame
  const STEP = 1000 / 120
  let frame = 0
  let last = 0
  let spare = 0
  let started = false
  const draw = () => {
    bodies.forEach((body, index) => {
      const el = tagEls.value[index]
      if (el) el.style.transform = `translate3d(${(body.position.x - el.offsetWidth / 2).toFixed(2)}px, ${(body.position.y - el.offsetHeight / 2).toFixed(2)}px, 0) rotate(${body.angle.toFixed(4)}rad)`
    })
  }
  const tick = (now: number) => {
    spare += Math.min(now - (last || now), 50)
    last = now
    for (let steps = 0; spare >= STEP && steps < 6; steps++) {
      Engine.update(engine, STEP)
      spare -= STEP
    }
    draw()
    frame = requestAnimationFrame(tick)
  }
  // The tags drop when the stage enters view
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting || started) return
      started = true
      frame = requestAnimationFrame(tick)
      observer.disconnect()
    },
    { threshold: 0.3 }
  )
  observer.observe(host)
  // The layout changed under the pinned content above: positions of every trigger are measured again
  ScrollTrigger.refresh()
  stopPhysics = () => {
    observer.disconnect()
    cancelAnimationFrame(frame)
    Engine.clear(engine)
  }
})
onBeforeUnmount(() => stopPhysics?.())
</script>

<template>
  <section id="featured" class="mv-section featured">
    <header class="head">
      <p class="mv-eyebrow">{{ slotContent.eyebrow }}</p>
      <h2 ref="title" class="mv-title">{{ slotContent.title }}</h2>
    </header>

    <!-- Desktop: the bento grid, filtered by the tags -->
    <ul ref="grid" class="grid">
      <li v-for="(photo, index) in shown" :key="photo.slug" class="cell" :style="{ gridArea: areaOf(index) }" :data-flip-id="photo.slug">
        <a :href="siteHref(`/photo/${photo.slug}`)" :aria-label="photo.title">
          <img :src="photo.imageUrl" :alt="photo.title" loading="lazy" />
        </a>
      </li>
    </ul>

    <div ref="stage" class="stage" :class="{ 'is-physics': physics }">
      <ul class="tags" aria-label="Filter by category">
        <li v-for="(category, index) in categories" :key="category">
          <button
            :ref="(el) => el && (tagEls[index] = el as HTMLElement)"
            type="button"
            class="tag"
            :class="{ 'is-selected': selected === category }"
            :aria-pressed="selected === category"
            :style="{ '--pile': pile(index) }"
            @click="!physics && choose(category)">
            {{ category }}
          </button>
        </li>
        <li class="count-item">
          <p :ref="(el) => el && (tagEls[categories.length] = el as HTMLElement)" class="count" :style="{ '--pile': pile(0, true) }">{{ pad(shown.length) }} {{ slotContent.framesLabel }}</p>
        </li>
      </ul>
    </div>

    <!-- Phone: a swipe strip of the same frames -->
    <div class="swipe">
      <div class="meta">
        <p>{{ slotContent.framesLabel }} · {{ slide + 1 }} / {{ photos.length }}</p>
        <p class="hint">SWIPE <span aria-hidden="true">→</span></p>
      </div>
      <ul ref="strip" class="strip" @scroll.passive="onStrip">
        <li v-for="photo in photos" :key="photo.slug">
          <a :href="siteHref(`/photo/${photo.slug}`)" :aria-label="photo.title"><img :src="photo.imageUrl" :alt="photo.title" loading="lazy" /></a>
        </li>
      </ul>
      <p class="dashes" aria-hidden="true"><i v-for="(photo, index) in photos" :key="photo.slug" :class="{ on: index === slide }"></i></p>
    </div>
  </section>
</template>

<style scoped>
.featured {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 3.75rem;
  padding-bottom: 3.5rem;
  background: var(--mv-bg);
}

.head {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.grid,
.stage {
  display: none;
}

.swipe {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  order: 3;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.meta p {
  margin: 0;
}

.hint {
  color: var(--mv-hot);
  font-size: 0.6875rem;
}

.strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.strip::-webkit-scrollbar {
  display: none;
}

.strip li {
  flex: none;
  width: min(16.25rem, 76vw);
  aspect-ratio: 4 / 5;
  scroll-snap-align: start;
  background: var(--mv-raised);
}

.strip a,
.strip img {
  display: block;
  width: 100%;
  height: 100%;
}

.strip img {
  object-fit: cover;
}

.dashes {
  display: flex;
  gap: 0.375rem;
  margin: 0.25rem 0 0;
}

.dashes i {
  width: 0.875rem;
  height: 3px;
  background: color-mix(in srgb, #fff 24%, transparent);
  transition: width 0.3s var(--mv-ease);
}

.dashes i.on {
  width: 1.75rem;
  background: var(--mv-red);
}

@media (min-width: 880px) {
  .featured {
    gap: 0;
    min-height: 68.75rem;
    padding-top: 6rem;
    padding-bottom: 3.125rem;
  }

  .head {
    gap: 0.5rem;
  }

  .swipe {
    display: none;
  }

  .grid {
    --gap: 0.5rem;

    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: calc((min(100vw, 90rem) - var(--mv-gutter) * 0.268 - 3 * var(--gap)) / 4 * 0.7341);
    gap: var(--gap);
    margin: 3.75rem calc(var(--mv-gutter) * -0.866) 0;
  }

  .cell {
    position: relative;
    overflow: hidden;
    background: var(--mv-raised);
  }

  .cell a,
  .cell img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .cell img {
    object-fit: cover;
    transition: transform 0.8s var(--mv-ease);
  }

  .cell:hover img {
    transform: scale(1.04);
  }

  /* The tags live on a stage in the corner, over the lower cells; it only takes the pointer when the tags are bodies */
  .stage {
    position: absolute;
    right: 1.25rem;
    bottom: 3.125rem;
    z-index: 5;
    display: block;
    width: min(42.5rem, 47%);
    height: 12.5rem;
    pointer-events: none;
  }

  .stage.is-physics {
    pointer-events: auto;
  }

  .tags {
    position: absolute;
    inset: 0;
  }

  .tag {
    padding: 1rem 1.75rem;
    border: 1.5px solid var(--mv-red);
    background: #000;
    color: var(--mv-hot);
    font-size: 1.625rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    line-height: 1.25;
    text-transform: uppercase;
    pointer-events: auto;
    cursor: pointer;
    transition:
      background-color 0.25s ease,
      color 0.25s ease;
  }

  .tag:hover,
  .tag.is-selected {
    background: var(--mv-red);
    color: #fff;
  }

  .count {
    margin: 0;
    padding: 0.625rem 1.125rem;
    background: #fff;
    color: #000;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: 1.25;
    text-transform: uppercase;
    pointer-events: auto;
  }

  .tag,
  .count {
    position: absolute;
    top: 0;
    left: 0;
    transform: var(--pile);
    transform-origin: center;
  }

  .is-physics .tag,
  .is-physics .count {
    cursor: grab;
    touch-action: none;
    user-select: none;
    will-change: transform;
  }

  .count-item {
    position: static;
  }
}
</style>
