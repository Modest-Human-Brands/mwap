<script setup lang="ts">
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

const props = defineProps<{
  brandName: string
  links: { label: string; href: string }[]
  pageKey: string
}>()

const siteHref = useSiteHref()
const menu = ref<HTMLDetailsElement>()

// On the home page its own anchors stay anchors, so they scroll instead of reloading
const resolve = (href: string) => (props.pageKey === 'home' && href.startsWith('/#') ? href.slice(1) : siteHref(href))
const closeMenu = () => menu.value?.removeAttribute('open')
</script>

<template>
  <header class="bar">
    <a class="logo sg-display" :href="siteHref('/')">{{ brandName }}</a>

    <nav class="links sg-mono" aria-label="Main">
      <a v-for="link in links" :key="link.label + link.href" :href="resolve(link.href)">{{ link.label }}</a>
    </nav>

    <details ref="menu" class="menu">
      <summary aria-label="Menu"><span class="lines" aria-hidden="true"></span></summary>
      <nav class="panel sg-mono" aria-label="Main">
        <a v-for="link in links" :key="link.label + link.href" :href="resolve(link.href)" @click="closeMenu">{{ link.label }}</a>
      </nav>
    </details>
  </header>
</template>

<style scoped>
.bar {
  position: absolute;
  inset: 0 0 auto;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.25rem var(--sg-pad);
}

.logo {
  font-size: 1rem;
  line-height: 1.5;
}

.links {
  display: none;
  gap: 2.25rem;
  font-size: 0.875rem;
}

.links a {
  color: var(--sg-muted);
  transition: color 0.2s ease;
}

.links a:hover {
  color: var(--sg-text);
}

.menu {
  position: relative;
}

.menu summary {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--sg-line);
  border-radius: 999px;
  background: rgb(0 0 0 / 0.35);
  list-style: none;
  cursor: pointer;
}

.menu summary::-webkit-details-marker {
  display: none;
}

.lines,
.lines::before {
  display: block;
  width: 1rem;
  height: 1.5px;
  background: var(--sg-text);
}

.lines::before {
  content: '';
  transform: translateY(-4px);
}

.panel {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  display: grid;
  gap: 0.25rem;
  min-width: 12rem;
  padding: 0.75rem;
  border: 1px solid var(--sg-line);
  border-radius: 1rem;
  background: var(--sg-raised);
  font-size: 0.875rem;
}

.panel a {
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
}

.panel a:hover {
  background: var(--sg-line);
}

@media (min-width: 64rem) {
  .links {
    display: flex;
  }

  .menu {
    display: none;
  }
}
</style>
