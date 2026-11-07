<script setup lang="ts">
import type { IndexSlot } from '~~/templates/portfolio/ContactSheetV1/schema'
defineProps<{
  slotContent: IndexSlot
}>()

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section id="index" class="index">
    <div v-gsap.whenVisible.once.from="{ opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', start: 'top 90%' }" class="head">
      <p class="cs-eyebrow">(02) Index — {{ slotContent.title }}</p>
      <p v-if="slotContent.hint" class="hint">{{ slotContent.hint }}</p>
    </div>

    <ul v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 28, duration: 0.7, ease: 'power2.out', stagger: 0.06, start: 'top 88%' }" class="list">
      <li v-for="(item, i) in slotContent.items" :key="item.title + i" class="item">
        <a class="row" :href="`#lb-${i}`">
          <span class="num">{{ pad(i + 1) }}</span>
          <span class="title">{{ item.title }}</span>
          <span class="meta category">{{ item.category }}</span>
          <span class="meta year">{{ item.year }}</span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
        <img class="preview" :src="item.imageUrl" alt="" width="300" height="400" loading="lazy" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.index {
  padding: 2rem var(--cs-pad) 5rem;
}

.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.hint {
  display: none;
  margin: 0;
  font: 400 1.75rem/1.2 var(--cs-serif);
  color: var(--cs-muted);
}

.list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--cs-line);
}

.row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  min-height: 5rem;
  border-bottom: 1px solid var(--cs-line);
}

.num,
.category,
.arrow {
  display: none;
}

.title {
  font: 400 clamp(2.5rem, 12vw, 4rem) / 1.2 var(--cs-display);
  text-transform: uppercase;
  transition:
    color 0.2s,
    transform 0.2s;
}

.meta {
  font: 400 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cs-muted);
}

.preview {
  display: none;
}

@media (min-width: 48rem) {
  .row {
    grid-template-columns: 3.875rem 1fr 7.5rem 4rem 2rem;
    min-height: 6.875rem;
  }

  .num {
    display: block;
    align-self: start;
    padding-top: 2.4rem;
    font: 500 0.75rem/1 var(--cs-mono);
    letter-spacing: 0.1em;
    color: var(--brand-accent);
  }

  .category,
  .arrow {
    display: block;
  }

  .year {
    justify-self: end;
  }

  .arrow {
    justify-self: end;
    font-size: 1.25rem;
  }

  .hint {
    display: block;
  }
}

@media (min-width: 64rem) {
  .row {
    grid-template-columns: 3.875rem 1fr 14rem 8rem 2rem;
  }
}

/* Hover preview: the other titles dim, the hovered one turns primary and the shoot appears */
@media (min-width: 64rem) and (hover: hover) {
  .list:hover .title {
    color: var(--cs-line);
  }

  .item:hover .title {
    color: var(--brand-primary);
    transform: translateX(2.5rem);
  }

  .preview {
    position: absolute;
    top: 5rem;
    left: 59%;
    z-index: 2;
    display: block;
    width: 18.75rem;
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border: 6px solid var(--brand-secondary);
    box-shadow: 0 12px 24px rgb(0 0 0 / 0.5);
    transform: rotate(5deg);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .item:hover .preview {
    opacity: 1;
  }
}
</style>
