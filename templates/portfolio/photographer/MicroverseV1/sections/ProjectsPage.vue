<script setup lang="ts">
import type { MicroversePages, MicroversePhoto, MicroverseVideo } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

// Every photo and video as a tile in a masonry; a badge tells which, the tags filter by category
const props = defineProps<{ slotContent: MicroversePages['projects']['header']; photos: MicroversePhoto[]; videos: MicroverseVideo[] }>()

const siteHref = useSiteHref()

const tiles = computed(() => [
  ...props.photos.map((photo) => ({
    kind: 'photo' as const,
    slug: photo.slug,
    title: photo.title,
    category: photo.category,
    src: photo.imageUrl,
    ratio: photo.aspectRatio,
    href: siteHref(`/photo/${photo.slug}`),
  })),
  ...props.videos.map((video) => ({
    kind: 'video' as const,
    slug: video.slug,
    title: video.title,
    category: video.category,
    src: video.posterUrl,
    ratio: video.aspectRatio,
    href: siteHref(`/video/${video.slug}`),
  })),
])

const frames = computed(() => tiles.value.length)
const shoots = computed(() => Math.max(1, new Set(props.photos.map((photo) => photo.project).filter(Boolean)).size))
const categories = computed(() => [...new Set(tiles.value.map((tile) => tile.category))])

const active = ref<string | null>(null)
const visible = computed(() => (active.value ? tiles.value.filter((tile) => tile.category === active.value) : tiles.value))
</script>

<template>
  <section class="mv-sub projects">
    <header class="mv-pagehead top">
      <div>
        <p class="mv-eyebrow">{{ `${slotContent.eyebrow} · ${shoots} ${shoots === 1 ? 'SHOOT' : 'SHOOTS'} · ${frames} FRAMES` }}</p>
        <h1 class="mv-title headline">{{ slotContent.title }}</h1>
      </div>
      <ul class="tags">
        <li>
          <button type="button" :class="{ on: active === null }" :aria-pressed="active === null" @click="active = null">{{ slotContent.allLabel }}</button>
        </li>
        <li v-for="category in categories" :key="category">
          <button type="button" :class="{ on: active === category }" :aria-pressed="active === category" @click="active = category">{{ category.toUpperCase() }}</button>
        </li>
      </ul>
    </header>

    <ul class="wall">
      <li v-for="tile in visible" :key="tile.kind + tile.slug">
        <a :href="tile.href" class="tile">
          <img :src="tile.src" :alt="tile.title" :style="{ aspectRatio: String(tile.ratio) }" loading="lazy" />
          <span class="badge">{{ tile.kind === 'photo' ? 'PHOTO' : 'VIDEO' }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.projects {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-inline: 1rem;
}

.top {
  gap: 1.5rem;
  padding-inline: calc(var(--mv-gutter) - 1rem);
}

.headline {
  font-size: clamp(3.5rem, 11.1vw, 10rem);
  line-height: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags button {
  padding: 0.5rem 1.125rem;
  border: 1px solid color-mix(in srgb, #fff 28%, transparent);
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.tags button:hover {
  border-color: var(--mv-hot);
}

.tags button.on {
  border-color: var(--mv-red);
  background: var(--mv-red);
}

.wall {
  column-count: 2;
  column-gap: 0.5rem;
}

.wall li {
  margin-bottom: 0.5rem;
  break-inside: avoid;
}

.tile {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 4px;
}

.tile img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.tile:hover img {
  transform: scale(1.04);
}

.badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  background: rgb(9 3 3 / 0.7);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  backdrop-filter: blur(6px);
}

@media (min-width: 880px) {
  .projects {
    padding-top: 9rem;
  }

  .top {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .tags {
    padding-bottom: 1.5rem;
  }

  .wall {
    column-count: 4;
  }
}
</style>
