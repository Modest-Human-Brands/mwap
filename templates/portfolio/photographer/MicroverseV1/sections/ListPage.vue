<script setup lang="ts">
import type { MicroversePages } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

// The episodes (three columns) and the blog (four columns): a card is a thumbnail, a title, the start of the text and a date
const props = defineProps<{
  kind: 'episode' | 'blog'
  slotContent: MicroversePages['episode']['header']
  items: { slug: string; title: string; excerpt: string; thumbnailUrl: string; publishedAt: string }[]
}>()

const siteHref = useSiteHref()
const href = (slug: string) => siteHref(`/${props.kind}/${slug}`)
</script>

<template>
  <section class="mv-sub list" :data-kind="kind">
    <header class="mv-pagehead">
      <p class="mv-eyebrow">{{ slotContent.eyebrow }}</p>
      <h1 class="mv-title">{{ slotContent.title }}</h1>
    </header>
    <ul class="grid">
      <li v-for="item in items" :key="item.slug">
        <a :href="href(item.slug)" class="card">
          <img :src="item.thumbnailUrl" :alt="item.title" width="636" height="556" loading="lazy" />
          <time :datetime="item.publishedAt">{{ item.publishedAt }}</time>
          <h2>{{ item.title }}</h2>
          <p>{{ item.excerpt }}</p>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.grid {
  display: grid;
  gap: 2rem 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card img {
  width: 100%;
  height: auto;
  aspect-ratio: 318 / 278;
  object-fit: cover;
  border-radius: 4px;
  transition: opacity 0.3s ease;
}

.card:hover img {
  opacity: 0.85;
}

time {
  margin-top: 0.5rem;
  color: var(--mv-hot);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
}

h2 {
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.25;
}

.card:hover h2 {
  color: var(--mv-hot);
}

.card p {
  color: #cbd5e1;
  font-size: 0.9375rem;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 880px) {
  .list {
    padding-top: 10rem;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .list[data-kind='blog'] .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
