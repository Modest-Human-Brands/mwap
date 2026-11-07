<script setup lang="ts">
import type { ContactSlot } from '~~/templates/developer/SignalV1/schema'
import ShaderBackdrop from './ShaderBackdrop.vue'

defineProps<{
  slotContent: ContactSlot
  contact: { email: string; links?: { label: string; url: string }[] }
}>()
</script>

<template>
  <section id="contact" class="contact">
    <ShaderBackdrop variant="contact" />
    <div class="inner">
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 1, ease: 'power3.out', start: 'top 85%' }" class="title sg-display">{{ slotContent.title }}</h2>
      <p class="note">{{ slotContent.note }}</p>
      <a class="email sg-display" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      <ul v-if="contact.links?.length" class="links sg-mono">
        <li v-for="link in contact.links" :key="link.url">
          <a :href="link.url" rel="noopener">{{ link.label }}</a>
        </li>
      </ul>
    </div>
    <p class="legal sg-mono">{{ slotContent.legal }}</p>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4rem;
  min-height: 30rem;
  padding: 5rem var(--sg-pad) 2rem;
  isolation: isolate;
}

.inner {
  position: relative;
  display: grid;
  justify-items: start;
  gap: 1.25rem;
}

.title {
  max-width: 12em;
  font-size: clamp(2.25rem, 11vw, 3.5rem);
  line-height: 1.2;
}

.note {
  max-width: 34rem;
  color: var(--sg-muted);
}

.email {
  color: var(--sg-accent);
  font-size: clamp(1.25rem, 6vw, 1.5rem);
  overflow-wrap: anywhere;
}

.email:hover {
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  color: var(--sg-muted);
  font-size: 1rem;
}

.links a:hover {
  color: var(--sg-text);
}

.legal {
  position: relative;
  color: var(--sg-muted);
  font-size: 0.875rem;
}

@media (min-width: 64rem) {
  .contact {
    min-height: 30rem;
    padding-block: 7rem 2.5rem;
  }

  .title {
    font-size: 3.5rem;
  }
}
</style>
