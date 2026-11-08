<script setup lang="ts">
import type { LightboxEntry } from './schema'
import type { ContactSheetSite, PageKey } from '~~/shared/types/site'
import { useContactSheetFonts } from '~~/templates/portfolio/model/_shared/useContactSheetFonts'
import BookingForm from './sections/BookingForm.vue'
import CompCard from './sections/CompCard.vue'
import CoverHero from './sections/CoverHero.vue'
import BookingDrawer from './sections/BookingDrawer.vue'
import SiteFooter from './sections/SiteFooter.vue'
import PhotoLightbox from './sections/PhotoLightbox.vue'
import SiteNav from './sections/SiteNav.vue'
import FilmStrips from './sections/FilmStrips.vue'
import WorkIndex from './sections/WorkIndex.vue'
const props = defineProps<{
  site: ContactSheetSite
  pageKey: PageKey
}>()

// On a custom domain pages live at the root, otherwise under the site slug
const customDomain = useState<{ slug: string } | null>('customDomain', () => null)
provide('siteBase', customDomain.value ? '' : `/${props.site.slug}`)

useContactSheetFonts()

// The template has a single page
const page = computed(() => props.site.data.pages.home)
const brand = computed(() => props.site.brand)
const contact = computed(() => props.site.data.contact)
const subject = computed(() => `Booking enquiry for ${brand.value.name}`)

const initials = computed(() =>
  brand.value.name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
)

const pad = (n: number) => String(n).padStart(2, '0')

// Index items and sheet frames open in one lightbox, numbered in page order
const lightbox = computed<LightboxEntry[]>(() => {
  const { index, sheet } = page.value
  const entries: LightboxEntry[] = []
  if (index.enabled) index.items.forEach((item) => entries.push({ kind: 'index', frame: '', title: item.title, text: item.description, imageUrl: item.imageUrl }))
  if (sheet.enabled) sheet.frames.forEach((frame) => entries.push({ kind: 'sheet', frame: frame.label.toUpperCase(), title: `Frame ${frame.label}`, text: '', imageUrl: frame.imageUrl }))
  return entries.map((entry, i) => ({ ...entry, frame: `Frame ${entry.frame || pad(i + 1)} / ${pad(entries.length)}` }))
})
const sheetStart = computed(() => (page.value.index.enabled ? page.value.index.items.length : 0))
</script>

<template>
  <div class="cs">
    <SiteNav :brand-name="brand.name" :initials="initials" :links="site.data.navigation" />
    <main>
      <CoverHero v-if="page.cover.enabled" :slot-content="page.cover" />
      <WorkIndex v-if="page.index.enabled" :slot-content="page.index" />
      <FilmStrips v-if="page.sheet.enabled" :slot-content="page.sheet" :start="sheetStart" />
      <CompCard v-if="page.compCard.enabled" :slot-content="page.compCard" />
      <BookingForm v-if="page.booking.enabled" :slot-content="page.booking" :contact="contact" :subject="subject" />
    </main>
    <SiteFooter v-if="page.footer.enabled" :slot-content="page.footer" :brand-name="brand.name" :email="contact.email" />
    <PhotoLightbox :entries="lightbox" :storage-key="`cs-shortlist:${site.slug}`" />
    <BookingDrawer v-if="page.booking.enabled" :slot-content="page.booking" :contact="contact" :subject="subject" />
  </div>
</template>

<style src="./contact-sheet.css"></style>
