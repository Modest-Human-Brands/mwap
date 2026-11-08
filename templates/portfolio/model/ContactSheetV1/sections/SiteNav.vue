<script setup lang="ts">
import type { SitePayload } from '~~/shared/types/site'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
defineProps<{
  brandName: string
  initials: string
  links: SitePayload['data']['navigation']
}>()

const href = useSiteHref()
</script>

<template>
  <header class="nav">
    <a class="brand" :href="href('/')">{{ brandName }}</a>
    <nav class="links" aria-label="Sections">
      <a v-for="link in links" :key="link.href + link.label" :href="href(link.href)">{{ link.label }}</a>
    </nav>
    <div class="end">
      <span class="tag">({{ initials }})</span>
      <a class="cs-button book" href="#book">Book <span aria-hidden="true">→</span></a>
      <a class="menu" href="#menu">Menu <span aria-hidden="true">+</span></a>
    </div>
  </header>

  <aside id="menu" class="overlay" aria-label="Menu">
    <div class="overlay-top">
      <a class="brand" :href="href('/')">{{ brandName }}</a>
      <a class="menu" href="#cover">Close <span aria-hidden="true">×</span></a>
    </div>
    <nav class="overlay-links">
      <a v-for="link in links" :key="link.href + link.label" :href="href(link.href)">{{ link.label }}</a>
    </nav>
    <a class="cs-button" href="#book">Book <span aria-hidden="true">→</span></a>
  </aside>
</template>

<style scoped>
.nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 5rem;
  padding: 0 var(--cs-pad);
  border-bottom: 1px solid var(--cs-line);
}

.brand {
  font: 400 1.5rem/1 var(--cs-display);
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.links {
  display: flex;
  gap: 2.5rem;
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2.5rem;
}

.tag {
  font: 400 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  color: var(--cs-muted);
}

.book {
  height: 2.75rem;
  padding: 0 2rem;
}

.menu {
  display: none;
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: none;
  flex-direction: column;
  gap: 2rem;
  padding: 1.125rem var(--cs-pad) 2rem;
  background: var(--brand-bg);
}

.overlay:target {
  display: flex;
}

.overlay-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.875rem;
}

.overlay-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: auto 0;
  font: 400 clamp(3rem, 16vw, 5rem) / 1.1 var(--cs-display);
  text-transform: uppercase;
}

@media (max-width: 47.99rem) {
  .nav {
    display: flex;
    justify-content: space-between;
    height: 4rem;
  }

  .links,
  .tag,
  .book {
    display: none;
  }

  .menu {
    display: inline;
  }

  .brand {
    font-size: 1.375rem;
  }
}

@media (min-width: 48rem) {
  .overlay:target {
    display: none;
  }
}
</style>
