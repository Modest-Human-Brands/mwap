<script setup lang="ts">
import type { FooterSlot } from '~~/templates/portfolio/ContactSheetV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
const props = defineProps<{
  slotContent: FooterSlot
  brandName: string
  email: string
}>()

const href = useSiteHref()
const chars = computed(() => Math.max(6, props.brandName.length))
const year = new Date().getFullYear()
</script>

<template>
  <footer id="footer" class="footer" :style="{ '--chars': chars }">
    <p class="name">{{ brandName }}</p>

    <div class="columns">
      <div>
        <p class="label">Management</p>
        <p class="value">{{ slotContent.management.name }}<br />{{ slotContent.management.address }}</p>
      </div>
      <div>
        <p class="label">Email</p>
        <p class="value">
          <a :href="`mailto:${email}`">{{ email }}</a>
        </p>
      </div>
      <div v-if="slotContent.links.length">
        <p class="label">Follow</p>
        <p class="value">
          <a v-for="link in slotContent.links" :key="link.href + link.label" class="link" :href="href(link.href)">{{ link.label }} <span aria-hidden="true">→</span></a>
        </p>
      </div>
      <div>
        <p class="label">Based in</p>
        <p class="value">{{ slotContent.location }}</p>
      </div>
    </div>

    <div class="legal">
      <p>© {{ year }} {{ brandName }}</p>
      <nav v-if="slotContent.legal.length" aria-label="Legal">
        <a v-for="link in slotContent.legal" :key="link.href + link.label" :href="href(link.href)">{{ link.label }}</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 1.75rem var(--cs-pad) 1.5rem;
}

.name {
  margin: 0 0 2.5rem;
  font: 400 min(310px, calc((100vw - 2 * var(--cs-pad)) / (0.47 * var(--chars)))) / 0.95 var(--cs-display);
  text-transform: uppercase;
  white-space: nowrap;
}

.columns {
  display: grid;
  gap: 1.5rem;
  padding-bottom: 3rem;
}

.label {
  margin: 0 0 0.75rem;
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-accent);
}

.value {
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
}

.link {
  display: block;
}

.legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--cs-line);
  font: 400 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cs-muted);
}

.legal p {
  margin: 0;
}

.legal nav {
  display: flex;
  gap: 2rem;
}

@media (min-width: 48rem) {
  .columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 64rem) {
  .columns {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding-top: 1rem;
  }
}
</style>
