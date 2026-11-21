<script setup lang="ts">
import type { MicroversePages } from '~~/templates/portfolio/photographer/MicroverseV1/schema'

// terms, privacy, cancellation and license share this layout
defineProps<{ slotContent: MicroversePages['terms']['document'] }>()
</script>

<template>
  <article class="mv-sub legal">
    <header class="mv-pagehead">
      <h1 class="mv-title">{{ slotContent.title }}</h1>
      <p class="updated">
        {{ slotContent.updatedLabel }}: <time :datetime="slotContent.updated">{{ slotContent.updated }}</time>
      </p>
    </header>
    <ol class="sections">
      <li v-for="(section, index) in slotContent.sections" :key="section.heading">
        <h2>
          <span class="num">{{ String(index + 1).padStart(2, '0') }}</span> {{ section.heading }}
        </h2>
        <p>{{ section.body }}</p>
      </li>
    </ol>
  </article>
</template>

<style scoped>
.legal {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 62rem;
  margin-inline: auto;
}

.updated {
  color: #cbd5e1;
  font-size: 0.875rem;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  list-style: none;
}

h2 {
  margin-bottom: 0.5rem;
  color: var(--mv-red);
  font-size: clamp(1.25rem, 2.2vw, 1.75rem);
  font-weight: 700;
}

.num {
  margin-right: 0.5rem;
  color: var(--mv-hot);
  font-size: 0.8em;
  letter-spacing: 0.1em;
}

p {
  line-height: 1.7;
}

@media (min-width: 880px) {
  .legal {
    padding-top: 10rem;
  }
}
</style>
