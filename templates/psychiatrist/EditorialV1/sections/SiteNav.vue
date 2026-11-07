<script setup lang="ts">
import { useSiteHref } from '~~/templates/_shared/useSiteHref'

const props = defineProps<{
  brandName: string
  links: { label: string; href: string }[]
  pageKey: string
  /** Hides the dark hero behind the bar: the bar then gets its own surface */
  solid?: boolean
}>()

const siteHref = useSiteHref()
const menu = ref<HTMLDetailsElement>()

// On the home page its own anchors stay anchors, so they scroll instead of reloading
const resolve = (href: string) => (props.pageKey === 'home' && href.startsWith('/#') ? href.slice(1) : siteHref(href))
const closeMenu = () => menu.value?.removeAttribute('open')
</script>

<template>
  <header class="bar" :class="{ solid }">
    <a class="logo ed-display" :href="siteHref('/')">{{ brandName }}</a>

    <nav class="links" aria-label="Main">
      <a v-for="link in links" :key="link.label + link.href" :href="resolve(link.href)">{{ link.label }}</a>
    </nav>
    <a class="pill" :href="resolve('/#visit')">Book a visit</a>

    <details ref="menu" class="menu">
      <summary aria-label="Menu"><span class="lines" aria-hidden="true"></span></summary>
      <nav class="panel" aria-label="Main">
        <a v-for="link in links" :key="link.label + link.href" :href="resolve(link.href)" @click="closeMenu">{{ link.label }}</a>
        <a class="pill" :href="resolve('/#visit')" @click="closeMenu">Book a visit</a>
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
  padding: 1.25rem var(--ed-pad);
  color: var(--ed-on-deep);
}

.bar.solid {
  position: relative;
  background: var(--ed-deep);
}

.logo {
  font-size: clamp(1.375rem, 1.1rem + 0.5vw, 1.625rem);
  line-height: 1;
  letter-spacing: 0;
}

.links,
.pill {
  display: none;
}

.pill {
  align-items: center;
  padding: 0.8125rem 1.625rem;
  border: 1px solid color-mix(in srgb, var(--ed-on-deep) 50%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--ed-on-deep) 14%, transparent);
  font: 500 0.9375rem/1 var(--ed-body);
  backdrop-filter: blur(8px);
  transition: background 0.25s ease;
}

.pill:hover {
  background: color-mix(in srgb, var(--ed-on-deep) 26%, transparent);
}

.menu summary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 2.5rem;
  border: 1px solid color-mix(in srgb, var(--ed-on-deep) 50%, transparent);
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--ed-on-deep) 18%, transparent);
  list-style: none;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.menu summary::-webkit-details-marker {
  display: none;
}

.lines,
.lines::before {
  display: block;
  width: 1.125rem;
  height: 2px;
  background: currentcolor;
}

.lines {
  position: relative;
  top: -3px;
}

.lines::before {
  content: '';
  position: absolute;
  top: 6px;
}

.panel {
  position: absolute;
  inset: 4.5rem var(--ed-pad) auto;
  display: grid;
  gap: 0.25rem;
  padding: 1rem 1.5rem 1.5rem;
  border-radius: 1.5rem;
  background: color-mix(in srgb, var(--ed-deep) 94%, transparent);
  backdrop-filter: blur(16px);
  box-shadow: 0 1.5rem 3rem -1rem rgb(0 0 0 / 0.5);
}

.panel a:not(.pill) {
  padding: 0.75rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--ed-on-deep) 16%, transparent);
  font: 400 1.125rem/1.2 var(--ed-body);
}

.panel .pill {
  display: inline-flex;
  justify-self: start;
  margin-top: 1rem;
  border-color: transparent;
  background: var(--ed-warm);
  color: var(--ed-deep);
}

@media (min-width: 64rem) {
  .bar {
    padding-block: 2.75rem 0;
  }

  .bar.solid {
    padding-block: 2.75rem;
  }

  .links {
    display: flex;
    gap: 2.5rem;
    margin-inline: auto;
    padding-left: clamp(0rem, 16vw, 14rem);
    font: 400 0.9375rem/1 var(--ed-body);
  }

  .links a {
    opacity: 0.92;
    transition: opacity 0.2s ease;
  }

  .links a:hover {
    opacity: 1;
  }

  .pill {
    display: inline-flex;
  }

  .menu {
    display: none;
  }
}
</style>
