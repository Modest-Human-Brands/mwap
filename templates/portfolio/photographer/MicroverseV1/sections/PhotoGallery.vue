<script setup lang="ts">
import type { MicroverseHome, MicroversePhoto } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import { useCharReveal } from '../useMicroverse'

// A waterfall: four columns of photos that drift against each other as the page scrolls (0.85x and 1.15x of the scroll speed).
// Hovering lifts a frame and shows its category and id; a click opens the photo page. The columns are plain stacks without JS,
// with reduced motion and on a phone, where only the first two are shown.
const props = defineProps<{ slotContent: MicroverseHome['photoGallery']; photos: MicroversePhoto[] }>()

const siteHref = useSiteHref()
const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
useCharReveal(title)

const COLUMNS = 4
const columns = computed(() => {
  const lists: MicroversePhoto[][] = Array.from({ length: COLUMNS }, () => [])
  props.photos.forEach((photo, index) => lists[index % COLUMNS]!.push(photo))
  return lists
})
const label = (photo: MicroversePhoto) => `${photo.category}  ·  ${photo.mediaId ?? photo.slug}`

let media: { revert: () => void } | undefined
onMounted(async () => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  media = gsap.matchMedia()
  media.add('(min-width: 880px)', () => {
    // Columns 1 and 3 are slower than the page, 2 and 4 faster: their offset swings against each other while the section passes
    const swing = 90
    root.value!.querySelectorAll<HTMLElement>('.col').forEach((col, index) => {
      const slow = index % 2 === 0
      gsap.fromTo(col, { y: slow ? -swing : swing }, { y: slow ? swing : -swing, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
    })
  })
})
onBeforeUnmount(() => media?.revert())
</script>

<template>
  <section id="photos" ref="root" class="mv-section gallery">
    <header class="head">
      <p class="mv-eyebrow">{{ slotContent.eyebrow }}</p>
      <h2 ref="title" class="mv-title">{{ slotContent.title }}</h2>
    </header>

    <div class="frame">
      <ul v-for="(list, index) in columns" :key="index" class="col">
        <li v-for="photo in list" :key="photo.slug" class="tile">
          <a :href="siteHref(`/photo/${photo.slug}`)" :aria-label="photo.title" :style="{ aspectRatio: photo.aspectRatio }">
            <img :src="photo.imageUrl" :alt="photo.title" loading="lazy" />
            <span class="chip" aria-hidden="true">{{ label(photo) }}<i>↗</i></span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 6rem;
  padding-bottom: 5rem;
  background: var(--mv-bg);
}

.head {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.frame {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  max-height: 29.375rem;
  overflow: hidden;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.col:nth-child(2) {
  margin-top: 3rem;
}

.col:nth-child(n + 3) {
  display: none;
}

.tile a {
  position: relative;
  display: block;
  overflow: hidden;
  border: 2px solid transparent;
  background: var(--mv-raised);
  transition:
    border-color 0.3s ease,
    box-shadow 0.4s ease,
    transform 0.5s var(--mv-ease);
}

.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tile a:hover,
.tile a:focus-visible {
  z-index: 2;
  border-color: var(--mv-hot);
  box-shadow: 0 1.5rem 3rem rgb(0 0 0 / 0.6);
  transform: translateY(-0.375rem);
}

/* The category and id of the frame under the cursor */
.chip {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  background: #000;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(0.5rem);
  transition:
    opacity 0.3s ease,
    transform 0.4s var(--mv-ease);
}

.chip i {
  font-style: normal;
}

.tile a:hover .chip,
.tile a:focus-visible .chip {
  opacity: 1;
  transform: none;
}

@media (min-width: 880px) {
  .gallery {
    padding-top: 6rem;
    padding-bottom: 5rem;
  }

  .head {
    gap: 0.5rem;
  }

  .frame {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 0.75rem calc(var(--mv-gutter) * -0.866) 0;
    max-height: none;
    overflow: hidden;
    padding-bottom: 7.5rem;
  }

  .col:nth-child(n + 3) {
    display: flex;
  }

  .col:nth-child(1) {
    margin-top: 0;
  }

  .col:nth-child(2) {
    margin-top: 6rem;
  }

  .col:nth-child(3) {
    margin-top: 2rem;
  }

  .col:nth-child(4) {
    margin-top: 8.75rem;
  }
}
</style>
