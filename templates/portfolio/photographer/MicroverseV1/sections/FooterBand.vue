<script setup lang="ts">
import type { MicroverseHome } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import SocialIcon from './SocialIcon.vue'

defineProps<{
  slotContent: MicroverseHome['footer']
  contact: { email: string; phone?: string; links?: { label: string; url: string }[] }
}>()

const siteHref = useSiteHref()
</script>

<template>
  <footer class="footer">
    <p class="wordmark" aria-hidden="true">{{ slotContent.wordmark }}</p>

    <div class="reach">
      <a v-if="contact.phone" class="phone" :href="`tel:${contact.phone.replace(/[^+\d]/g, '')}`">{{ contact.phone }}</a>
      <a v-else class="phone" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      <ul v-if="contact.links?.length" class="social">
        <li v-for="link in contact.links" :key="link.url">
          <a :href="link.url" rel="noopener" :aria-label="link.label"><SocialIcon :label="link.label" /></a>
        </li>
      </ul>
    </div>

    <div class="legal">
      <p>{{ slotContent.legal }}</p>
      <ul>
        <li v-for="link in slotContent.links" :key="link.label + link.href">
          <a :href="siteHref(link.href)">{{ link.label }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 3rem 1.5rem 2rem;
  overflow: hidden;
  background: #050202;
  isolation: isolate;
}

/* The molten horizon: a red glow rising from the bottom edge */
.footer::before {
  content: '';
  position: absolute;
  inset: 20% -10% -10%;
  z-index: -1;
  background: radial-gradient(ellipse 90% 90% at 5% 50%, color-mix(in srgb, var(--mv-red) 55%, transparent), transparent);
  pointer-events: none;
}

.wordmark {
  margin-bottom: 3.5rem;
  font-size: 17vw;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  text-transform: uppercase;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.95), rgb(255 255 255 / 0.05));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  user-select: none;
}

.reach {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.phone {
  font-size: 1.375rem;
  font-weight: 600;
}

.social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.social a {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid color-mix(in srgb, #fff 24%, transparent);
  border-radius: 999px;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease;
}

.social a:hover {
  border-color: var(--mv-hot);
  background: var(--mv-red);
}

.legal {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #cbd5e1;
  font-size: 0.8125rem;
}

.legal ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.legal a:hover {
  color: var(--mv-hot);
}

@media (min-width: 880px) {
  .footer {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr auto auto;
    column-gap: 3rem;
    min-height: 37.5rem;
    padding: 2.5rem 2.5rem 3rem 4rem;
  }

  .wordmark {
    grid-column: 1 / -1;
    margin: 0 0 0 -1.5rem;
    font-size: 10.4vw;
    white-space: nowrap;
  }

  .reach {
    display: contents;
  }

  .phone {
    grid-column: 1;
    grid-row: 3;
    align-self: end;
    font-size: 1.75rem;
  }

  .social {
    grid-column: 2;
    grid-row: 3;
    align-self: end;
    gap: 0.75rem;
    margin-right: 1.5rem;
  }

  .social a {
    width: 2.75rem;
    height: 2.75rem;
    border-color: transparent;
  }

  .legal {
    display: contents;
  }

  .legal p {
    grid-column: 1;
    grid-row: 4;
    margin-top: 1.75rem;
  }

  .legal ul {
    grid-column: 2;
    grid-row: 4;
    margin-top: 1.75rem;
    margin-right: 6rem;
    gap: 2.25rem;
  }
}
</style>
