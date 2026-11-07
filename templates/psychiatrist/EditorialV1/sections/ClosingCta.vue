<script setup lang="ts">
import type { EditorialClosingSlot } from '~~/templates/psychiatrist/EditorialV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

const props = defineProps<{ slotContent: EditorialClosingSlot; pageKey: string }>()

const siteHref = useSiteHref()
const href = computed(() => (props.pageKey === 'home' && props.slotContent.button.href.startsWith('/#') ? props.slotContent.button.href.slice(1) : siteHref(props.slotContent.button.href)))
// Each part of the details line sits on its own line on a phone
const details = computed(() => props.slotContent.details.split(' · '))
</script>

<template>
  <section id="contact" class="closing">
    <p class="ed-eyebrow ed-eyebrow--warm">{{ slotContent.eyebrow }}</p>
    <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 60, duration: 1.1, ease: 'power3.out', start: 'top 85%' }" class="title ed-display">{{ slotContent.title }}</h2>
    <a class="ed-button cta" :href="href">{{ slotContent.button.label }} <span aria-hidden="true">→</span></a>
    <p class="details">
      <span v-for="part in details" :key="part" class="part">{{ part }}</span>
    </p>
    <p class="legal">{{ slotContent.legal }}</p>
  </section>
</template>

<style scoped>
.closing {
  padding: 3.75rem var(--ed-pad) 3rem;
  overflow: hidden;
  background: var(--ed-deep);
  color: var(--ed-on-deep);
}

.title {
  margin-top: 1.5rem;
  font-size: var(--ed-fs-closing);
  line-height: 0.92;
  letter-spacing: -0.04em;
}

.cta {
  margin-top: 2rem;
}

.details {
  margin: 2.5rem 0 0;
  color: var(--ed-on-deep-soft);
  font-size: 0.875rem;
  line-height: 1.55;
}

.part {
  display: block;
}

.legal {
  max-width: 44rem;
  margin: 1rem 0 0;
  color: var(--ed-on-deep-faint);
  font-size: 0.8125rem;
  line-height: 1.5;
}

@media (min-width: 64rem) {
  .closing {
    padding-block: 5rem 3.75rem;
  }

  .title {
    margin-top: 2.25rem;
    margin-left: -0.15em;
    line-height: 1.05;
  }

  .cta {
    margin-top: 1.5rem;
    padding: 1.5rem 2.75rem;
    font-size: 1.25rem;
  }

  .details {
    margin-top: 2.75rem;
    font-size: 1rem;
  }

  .part {
    display: inline;
  }

  .part:not(:last-child)::after {
    content: ' · ';
  }

  .legal {
    margin-top: 1.25rem;
  }
}
</style>
