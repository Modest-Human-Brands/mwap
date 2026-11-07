<script setup lang="ts">
import type { ClinicSlot } from '~~/templates/psychiatrist/EditorialV1/schema'

const props = defineProps<{ slotContent: ClinicSlot }>()
const external = computed(() => /^https?:\/\//.test(props.slotContent.link.href))
</script>

<template>
  <section id="clinic" v-gsap.whenVisible.from="{ scale: 0.94, ease: 'none', scrub: true, start: 'top bottom', end: 'top 35%' }" class="clinic">
    <p class="ed-eyebrow eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 class="title ed-display">
      <span v-for="line in slotContent.titleLines" :key="line" class="line">{{ line }}</span>
    </h2>
    <div class="aside">
      <p class="body">{{ slotContent.body }}</p>
      <a class="ed-link link" :href="slotContent.link.href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener' : undefined"
        >{{ slotContent.link.label }} <span aria-hidden="true">↗</span></a
      >
    </div>
    <p class="tagline">{{ slotContent.tagline }}</p>
  </section>
</template>

<style scoped>
.clinic {
  display: grid;
  gap: 1.5rem;
  padding: 3.5rem var(--ed-pad) 3rem;
  background: var(--ed-teal);
  color: #fff;
  transform-origin: center top;
}

.eyebrow {
  color: color-mix(in srgb, #fff 80%, var(--ed-teal));
}

.title {
  font-size: clamp(3rem, 13vw, 7.5rem);
  line-height: 0.97;
  letter-spacing: -0.03em;
}

.line {
  display: block;
}

.body {
  max-width: 30rem;
  margin: 0;
  line-height: 1.55;
}

.link {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 1.125rem;
}

.tagline {
  margin: 2rem 0 0;
  color: color-mix(in srgb, #fff 80%, var(--ed-teal));
  font: 500 0.8125rem/1.2 var(--ed-body);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

@media (min-width: 64rem) {
  .clinic {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    grid-template-rows: auto auto 1fr;
    column-gap: 4rem;
    min-height: clamp(34rem, 41.7vw, 37.5rem);
    padding-block: 5rem 4.5rem;
  }

  .eyebrow {
    grid-column: 1 / -1;
  }

  .title {
    grid-column: 1;
    font-size: clamp(5rem, 8.33vw, 7.5rem);
    line-height: 0.97;
  }

  .aside {
    grid-column: 2;
    padding-top: 3.75rem;
  }

  .body {
    font-size: 1.1875rem;
    line-height: 1.58;
  }

  .link {
    margin-top: 2.5rem;
    font-size: 1.25rem;
  }

  .tagline {
    grid-column: 1 / -1;
    align-self: end;
    margin: 0;
    font-size: 0.875rem;
  }
}
</style>
