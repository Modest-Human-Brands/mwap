<script setup lang="ts">
import type { MicroverseBlog, MicroverseEpisode, MicroversePages } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

// One episode or one blog post: the text, the video of an episode when it has one, and the way to the neighbours
const props = defineProps<{
  kind: 'episode' | 'blog'
  slotContent: MicroversePages['episode']['header']
  item: MicroverseEpisode | MicroverseBlog
  items: (MicroverseEpisode | MicroverseBlog)[]
}>()

const siteHref = useSiteHref()
const href = (slug: string) => siteHref(`/${props.kind}/${slug}`)

const index = computed(() => props.items.findIndex((entry) => entry.slug === props.item.slug))
const previous = computed(() => (props.items.length > 1 ? props.items[(index.value - 1 + props.items.length) % props.items.length] : undefined))
const next = computed(() => (props.items.length > 1 ? props.items[(index.value + 1) % props.items.length] : undefined))
const video = computed(() => ('videoUrl' in props.item ? props.item.videoUrl : undefined))
const author = computed(() => ('author' in props.item ? props.item.author : undefined))
</script>

<template>
  <article class="mv-sub article">
    <a class="mv-link" :href="siteHref(`/${kind}`)">← {{ slotContent.backLabel }}</a>
    <header class="mv-pagehead">
      <p class="mv-eyebrow">
        <time :datetime="item.publishedAt">{{ item.publishedAt }}</time>
        <template v-if="author"> · {{ author }}</template>
      </p>
      <h1 class="title">{{ item.title }}</h1>
    </header>

    <video v-if="video" class="cover" :src="video" :poster="item.thumbnailUrl" controls playsinline preload="none" />
    <img v-else class="cover" :src="item.thumbnailUrl" :alt="item.title" width="636" height="556" />

    <div class="text">
      <p v-for="(paragraph, i) in item.body" :key="i">{{ paragraph }}</p>
    </div>

    <nav v-if="previous && next" class="more" aria-label="More">
      <a :href="href(previous.slug)">← {{ previous.title }}</a>
      <a :href="href(next.slug)">{{ next.title }} →</a>
    </nav>
  </article>
</template>

<style scoped>
.article {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 62rem;
  margin-inline: auto;
}

.title {
  font-size: clamp(2rem, 4.4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
}

.cover {
  width: 100%;
  height: auto;
  max-height: 34rem;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 4px;
  background: #000;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  line-height: 1.75;
}

.more {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid color-mix(in srgb, #fff 18%, transparent);
  font-weight: 600;
}

.more a:hover {
  color: var(--mv-hot);
}

@media (min-width: 880px) {
  .article {
    padding-top: 10rem;
  }
}
</style>
