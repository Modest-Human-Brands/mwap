<script setup lang="ts">
import type { CareSlot } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

defineProps<{ slotContent: CareSlot }>()

const siteHref = useSiteHref()
const resolve = (href: string) => (href.startsWith('/#') ? href.slice(1) : siteHref(href))
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section id="care" class="care">
    <p class="ed-eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', start: 'top 85%' }" class="title ed-display">{{ slotContent.title }}</h2>

    <ol v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 32, duration: 0.8, ease: 'power2.out', stagger: 0.12, start: 'top 85%' }" class="rows">
      <li v-for="(area, i) in slotContent.areas" :key="area.title" class="row">
        <a class="link" :href="resolve(area.href)">
          <span class="num">{{ pad(i + 1) }}</span>
          <span class="text">
            <span class="name ed-display">{{ area.title }}</span>
            <span class="desc">{{ area.description }}</span>
          </span>
          <img class="photo ed-photo" :src="area.imageUrl" alt="" width="260" height="180" loading="lazy" />
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.care {
  padding: 1.5rem var(--ed-pad) 4rem;
}

.title {
  margin-top: 1.25rem;
  font-size: var(--ed-fs-section);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.rows {
  margin: 2.5rem 0 0;
  padding: 0;
  border-top: 1px solid var(--ed-line);
  list-style: none;
}

.row {
  border-bottom: 1px solid var(--ed-line);
}

.link {
  display: block;
  padding-block: 1.25rem 1.75rem;
}

.text {
  display: block;
}

.num {
  margin-right: 0.35em;
  color: var(--ed-teal);
  font: 500 1rem/1 var(--ed-body);
}

/* On a phone the number sits inline in front of the name */
.num,
.name {
  display: inline;
}

.name {
  font-size: clamp(2.125rem, 8.7vw, 3.5rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.desc {
  display: block;
  max-width: 19rem;
  margin-top: 0.75rem;
  color: var(--ed-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

.photo,
.arrow {
  display: none;
}

@media (min-width: 48rem) {
  .desc {
    max-width: 30rem;
    font-size: 1.0625rem;
  }
}

@media (min-width: 64rem) {
  .care {
    padding-block: 3.75rem 7.5rem;
  }

  .title {
    margin-top: 2.5rem;
  }

  .rows {
    margin-top: 4.5rem;
  }

  .link {
    display: grid;
    grid-template-columns: 4.75rem minmax(0, 1fr) 16.25rem 4rem;
    align-items: center;
    column-gap: 1.5rem;
    padding-block: 1.125rem;
  }

  .num {
    margin: 0;
    padding-top: 0.5rem;
    font-size: 1rem;
  }

  .name {
    display: block;
    font-size: var(--ed-fs-care, clamp(2.75rem, 5.28vw, 4.75rem));
  }

  .desc {
    margin-top: 0.5rem;
    font-size: 1.0625rem;
  }

  .photo {
    display: block;
    width: 16.25rem;
    height: 11.25rem;
    border-radius: 5.625rem;
    transition:
      transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1),
      filter 0.5s ease;
  }

  .arrow {
    display: block;
    justify-self: end;
    font: 300 3rem/1 var(--ed-body);
    transition: transform 0.35s ease;
  }

  .link:hover .photo,
  .link:focus-visible .photo {
    transform: scale(1.06) rotate(-2deg);
  }

  .link:hover .arrow,
  .link:focus-visible .arrow {
    transform: translate(0.35rem, -0.35rem);
  }
}
</style>
