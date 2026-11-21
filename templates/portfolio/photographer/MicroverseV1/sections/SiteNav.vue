<script setup lang="ts">
import SocialIcon from './SocialIcon.vue'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import { useDefaultLogo } from '../useMicroverse'

// The MHB mark is the default: a logo that cannot be loaded is replaced by it
const props = defineProps<{
  brandName: string
  logoUrl: string
  links: { label: string; href: string }[]
  pageKey: string
  phone?: string
  social?: { label: string; url: string }[]
}>()

const siteHref = useSiteHref()
const open = ref(false)

// On the home page its own anchors stay anchors, so they scroll instead of reloading
const isCurrent = (href: string) => href.startsWith('/') && !href.startsWith('/#') && props.pageKey.split('/')[0] === href.slice(1)
const resolve = (href: string) => (props.pageKey === 'home' && href.startsWith('/#') ? href.slice(1) : siteHref(href))

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}
watch(open, (value) => {
  document.documentElement.style.overflow = value ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header class="bar">
    <a class="logo" :href="siteHref('/')" :aria-label="brandName">
      <img :src="logoUrl" :alt="brandName" width="80" height="80" @error="useDefaultLogo" />
    </a>

    <nav class="links" aria-label="Main">
      <a v-for="link in links" :key="link.label + link.href" :href="resolve(link.href)">{{ link.label }}</a>
    </nav>

    <button type="button" class="menu mv-icon-button" :aria-expanded="open" aria-controls="mv-menu" aria-label="Menu" @click="open = true">
      <span class="lines" aria-hidden="true"></span>
    </button>
  </header>

  <!-- The phone menu is a full screen overlay: big links, the phone number and the socials -->
  <div v-if="open" id="mv-menu" class="overlay" role="dialog" aria-modal="true" aria-label="Menu">
    <a class="logo small" :href="siteHref('/')" :aria-label="brandName"><img :src="logoUrl" :alt="brandName" width="56" height="56" @error="useDefaultLogo" /></a>
    <button type="button" class="close mv-icon-button" aria-label="Close menu" @click="open = false"><span class="cross" aria-hidden="true"></span></button>
    <p class="label mv-eyebrow">MENU</p>
    <nav class="big" aria-label="Main">
      <a v-for="link in links" :key="link.label + link.href" :class="{ current: isCurrent(link.href) }" :href="resolve(link.href)" @click="open = false">{{ link.label }}</a>
    </nav>
    <div class="reach">
      <a v-if="phone" class="phone" :href="`tel:${phone.replace(/[^+\d]/g, '')}`">{{ phone }}</a>
      <ul v-if="social?.length" class="socials">
        <li v-for="link in social" :key="link.url">
          <a :href="link.url" rel="noopener" class="social-link" :aria-label="link.label"><SocialIcon :label="link.label" /></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.bar {
  position: absolute;
  inset: 0 0 auto;
  z-index: 20;
  height: 5.25rem;
}

/* Logos are round */
.logo {
  position: absolute;
  top: 0.875rem;
  left: 1rem;
  display: block;
  width: 3.5rem;
  height: 3.5rem;
  overflow: hidden;
  border-radius: 999px;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.links {
  position: absolute;
  top: 2.875rem;
  left: 32.6%;
  display: none;
  gap: 3.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-shadow: 0 1px 12px rgb(0 0 0 / 0.7);
}

.links a {
  transition: color 0.2s ease;
}

.links a:hover {
  color: var(--mv-hot);
}

.menu {
  position: absolute;
  top: 1.375rem;
  right: 1rem;
  border-color: color-mix(in srgb, #fff 20%, transparent);
  background: rgb(0 0 0 / 0.5);
}

.lines,
.lines::before {
  display: block;
  width: 1.125rem;
  height: 1.5px;
  background: currentcolor;
}

.lines::before {
  content: '';
  transform: translateY(-5px);
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  padding: 6.5rem 1.5rem 2rem;
  background: var(--mv-bg);
}

.overlay .logo.small {
  top: 0.875rem;
}

.close {
  position: absolute;
  top: 1.375rem;
  right: 1rem;
  border-color: transparent;
  background: var(--mv-red);
}

.cross {
  position: relative;
  display: block;
  width: 1rem;
  height: 1rem;
}

.cross::before,
.cross::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.75px;
  background: #fff;
  transform: rotate(45deg);
}

.cross::after {
  transform: rotate(-45deg);
}

.label {
  margin-bottom: 0.625rem;
}

.big {
  display: flex;
  flex-direction: column;
}

.big a {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 4rem;
}

.big a.current {
  color: var(--mv-hot);
}

.reach {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
}

.phone {
  font-size: 1.375rem;
  font-weight: 600;
}

.social-link {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid color-mix(in srgb, #fff 24%, transparent);
  border-radius: 999px;
}

.social-link :deep(.social-icon) {
  width: 1.5rem;
  height: 1.5rem;
}

.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

@media (min-width: 880px) {
  .logo {
    top: 1rem;
    left: 3rem;
    width: 5rem;
    height: 5rem;
  }

  .links {
    display: flex;
  }

  .menu,
  .overlay {
    display: none;
  }
}
</style>
