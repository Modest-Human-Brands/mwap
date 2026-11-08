<script setup lang="ts">
import type { StatementSlot } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

defineProps<{ slotContent: StatementSlot }>()
const siteHref = useSiteHref()
</script>

<template>
  <section id="about" class="statement">
    <p class="ed-eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', start: 'top 85%' }" class="title ed-display">{{ slotContent.title }}</h2>

    <div v-gsap.whenVisible.once.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', start: 'top 88%' }" class="body">
      <p>{{ slotContent.body }}</p>
      <a class="more ed-link" :href="siteHref(slotContent.link.href)">{{ slotContent.link.label }} <span aria-hidden="true">→</span></a>
    </div>

    <dl v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 28, duration: 0.7, ease: 'power2.out', stagger: 0.1, start: 'top 90%' }" class="stats">
      <div v-for="stat in slotContent.stats" :key="stat.label" class="stat">
        <dt class="value ed-display">{{ stat.value }}</dt>
        <dd class="label">{{ stat.label }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.statement {
  padding: 3.75rem var(--ed-pad) 4rem;
}

.title {
  max-width: 21ch;
  margin-top: 1.25rem;
  font-size: var(--ed-fs-statement);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.body {
  max-width: 30rem;
  margin-top: 2.5rem;
  color: var(--ed-muted);
}

.body p {
  margin: 0;
  line-height: 1.6;
}

.more {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--ed-teal);
  font-size: 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 1rem;
  margin: 3rem 0 0;
}

.stat {
  margin: 0;
}

.value {
  font-size: var(--ed-fs-stat);
  line-height: 1.2;
}

.label {
  margin: 0;
  color: var(--ed-muted);
  font-size: 0.8125rem;
}

@media (min-width: 64rem) {
  .statement {
    padding-block: 6.875rem 7.5rem;
  }

  .title {
    max-width: 14em;
    margin-top: 2.5rem;
    line-height: 1.095;
  }

  .body {
    max-width: 30rem;
    margin-top: 2.75rem;
  }

  .body p {
    line-height: 1.6;
  }

  .more {
    margin-top: 2.25rem;
    font-size: 1.125rem;
  }

  .stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0 1.5rem;
    margin-top: 5.5rem;
    padding-top: 1.625rem;
    border-top: 1px solid var(--ed-line);
  }

  .label {
    font-size: 0.9375rem;
  }
}
</style>
