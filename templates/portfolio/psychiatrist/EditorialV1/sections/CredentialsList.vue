<script setup lang="ts">
import type { CredentialsSlot } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'

defineProps<{ slotContent: CredentialsSlot }>()
</script>

<template>
  <section id="credentials" class="credentials">
    <p class="ed-eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', start: 'top 85%' }" class="title ed-display">{{ slotContent.title }}</h2>
    <ul v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.1, start: 'top 85%' }" class="list">
      <li v-for="item in slotContent.items" :key="item.title" class="item">
        <h3 class="name ed-display">{{ item.title }}</h3>
        <p class="detail">{{ item.detail }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.credentials {
  padding: 3rem var(--ed-pad) 4rem;
}

.title {
  margin-top: 1.25rem;
  font-size: clamp(3rem, 12.8vw, 7.5rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.list {
  margin: 2.5rem 0 0;
  padding: 0;
  border-top: 1px solid var(--ed-line);
  list-style: none;
}

.item {
  display: grid;
  gap: 0.5rem;
  padding-block: 1.5rem;
  border-bottom: 1px solid var(--ed-line);
}

.name {
  font-size: clamp(1.625rem, 6vw, 2.5rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.detail {
  max-width: 28rem;
  margin: 0;
  color: var(--ed-muted);
  font-size: 0.9375rem;
  line-height: 1.5;
}

@media (min-width: 64rem) {
  .credentials {
    padding-block: 5rem 7.5rem;
  }

  .title {
    margin-top: 2.5rem;
    font-size: clamp(5rem, 8.33vw, 7.5rem);
    line-height: 1.23;
  }

  .list {
    margin-top: 4.25rem;
  }

  .item {
    grid-template-columns: 53% minmax(0, 1fr);
    align-items: center;
    min-height: 6.875rem;
    padding-block: 0;
  }

  .detail {
    font-size: 1.0625rem;
  }
}
</style>
