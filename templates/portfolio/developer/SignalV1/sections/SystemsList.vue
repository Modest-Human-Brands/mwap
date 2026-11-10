<script setup lang="ts">
import type { SystemsSlot } from '~~/templates/portfolio/developer/SignalV1/schema'

defineProps<{ slotContent: SystemsSlot }>()
</script>

<template>
  <section id="systems" class="systems">
    <p class="sg-eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="title sg-display">{{ slotContent.title }}</h2>
    <ul v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.1, start: 'top 88%' }" class="rows">
      <li v-for="item in slotContent.items" :key="item.name" class="row">
        <component :is="item.href ? 'a' : 'div'" :href="item.href" class="link">
          <h3 class="name sg-display">{{ item.name }}</h3>
          <p class="desc">{{ item.description }}</p>
          <p class="tags sg-mono">{{ item.tags }}</p>
        </component>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.systems {
  padding: 3rem var(--sg-pad) 4rem;
}

.title {
  margin-top: 0.75rem;
  font-size: clamp(1.75rem, 7vw, 2.5rem);
  line-height: 1.2;
}

.rows {
  margin-top: 2rem;
  border-top: 1px solid var(--sg-line);
}

.row {
  border-bottom: 1px solid var(--sg-line);
}

/* The next section draws its own top line */
.row:last-child {
  border-bottom: 0;
}

.link {
  transition: padding-left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: grid;
  gap: 0.5rem;
  padding: 1.5rem 0;
}

.name {
  transition: color 0.3s ease;
  font-size: 1.5rem;
  line-height: 1.25;
}

.desc {
  color: var(--sg-muted);
}

.tags {
  overflow: hidden;
  color: var(--sg-accent);
  font-size: 0.9375rem;
  /* A list such as "TypeScript · CLI · npm" never breaks in the middle, which would leave a dangling dot */
  text-overflow: ellipsis;
  white-space: nowrap;
}

a.link:hover {
  padding-left: 1rem;
}

a.link:hover .name {
  color: var(--sg-accent);
}

@media (min-width: 64rem) {
  .systems {
    padding-block: 4rem 6rem;
  }

  .link {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto;
    align-items: center;
    gap: 2rem;
    padding: 2rem 0;
  }

  .name {
    font-size: 2rem;
    line-height: 1.25;
  }

  .tags {
    overflow: visible;
    text-align: right;
  }
}
</style>
