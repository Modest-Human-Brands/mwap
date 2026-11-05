<script setup lang="ts">
const props = defineProps<{
  site: SitePayload
  pageKey: PageKey
}>()

// On a custom domain pages live at the root, otherwise under the site slug
const customDomain = useState<{ slug: string } | null>('customDomain', () => null)
provide('siteBase', customDomain.value ? '' : `/${props.site.slug}`)

useContactSheetFonts()

const page = computed(() => props.site.data.pages[props.pageKey])
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
    <TemplatesContactSheetNav :brand-name="brand.name" :initials="initials" :links="site.data.navigation" />
    <main>
      <TemplatesContactSheetCover v-if="page.cover.enabled" :slot-content="page.cover" />
      <TemplatesContactSheetWork v-if="page.index.enabled" :slot-content="page.index" />
      <TemplatesContactSheetStrips v-if="page.sheet.enabled" :slot-content="page.sheet" :start="sheetStart" />
      <TemplatesContactSheetCompCard v-if="page.compCard.enabled" :slot-content="page.compCard" />
      <TemplatesContactSheetBooking v-if="page.booking.enabled" :slot-content="page.booking" :contact="contact" :subject="subject" />
    </main>
    <TemplatesContactSheetFooter v-if="page.footer.enabled" :slot-content="page.footer" :brand-name="brand.name" :email="contact.email" />
    <TemplatesContactSheetLightbox :entries="lightbox" :storage-key="`cs-shortlist:${site.slug}`" />
    <TemplatesContactSheetDrawer v-if="page.booking.enabled" :slot-content="page.booking" :contact="contact" :subject="subject" />
  </div>
</template>

<style src="./contact-sheet.css"></style>
