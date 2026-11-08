<script setup lang="ts">
import type { EditorialSite, PageKey } from '~~/shared/types/site'
import { useEditorialFonts } from '~~/templates/portfolio/psychiatrist/_shared/useEditorialFonts'
import AppointmentForm from './sections/AppointmentForm.vue'
import ApproachBand from './sections/ApproachBand.vue'
import CareAreas from './sections/CareAreas.vue'
import ClinicBand from './sections/ClinicBand.vue'
import ClosingCta from './sections/ClosingCta.vue'
import CredentialsList from './sections/CredentialsList.vue'
import HeroAbout from './sections/HeroAbout.vue'
import HeroHome from './sections/HeroHome.vue'
import SiteNav from './sections/SiteNav.vue'
import StatementSection from './sections/StatementSection.vue'
import StorySection from './sections/StorySection.vue'
import TestimonialQuote from './sections/TestimonialQuote.vue'
import TickerBand from './sections/TickerBand.vue'

const props = defineProps<{
  site: EditorialSite
  pageKey: PageKey
}>()

// On a custom domain pages live at the root, otherwise under the site slug
const customDomain = useState<{ slug: string } | null>('customDomain', () => null)
provide('siteBase', customDomain.value ? '' : `/${props.site.slug}`)

useEditorialFonts()

const home = computed(() => props.site.data.pages.home)
const about = computed(() => props.site.data.pages.about)
const isAbout = computed(() => props.pageKey === 'about')
const heroEnabled = computed(() => (isAbout.value ? about.value.hero.enabled : home.value.hero.enabled))
const contact = computed(() => props.site.data.contact)
const subject = computed(() => `Appointment request for ${props.site.brand.name}`)
</script>

<template>
  <div class="ed">
    <SiteNav :brand-name="site.brand.name" :links="site.data.navigation" :page-key="isAbout ? 'about' : 'home'" :solid="!heroEnabled" />

    <main v-if="!isAbout">
      <HeroHome v-if="home.hero.enabled" :slot-content="home.hero" page-key="home" />
      <TickerBand v-if="home.ticker.enabled" :slot-content="home.ticker" />
      <StatementSection v-if="home.statement.enabled" :slot-content="home.statement" />
      <CareAreas v-if="home.care.enabled" :slot-content="home.care" />
      <ApproachBand v-if="home.approach.enabled" :slot-content="home.approach" />
      <AppointmentForm v-if="home.appointment.enabled" :slot-content="home.appointment" :contact="contact" :subject="subject" />
      <ClosingCta v-if="home.closing.enabled" :slot-content="home.closing" page-key="home" />
    </main>

    <main v-else>
      <HeroAbout v-if="about.hero.enabled" :slot-content="about.hero" />
      <StorySection v-if="about.story.enabled" :slot-content="about.story" />
      <CredentialsList v-if="about.credentials.enabled" :slot-content="about.credentials" />
      <ClinicBand v-if="about.clinic.enabled" :slot-content="about.clinic" />
      <TestimonialQuote v-if="about.testimonial.enabled" :slot-content="about.testimonial" />
      <ClosingCta v-if="about.closing.enabled" :slot-content="about.closing" page-key="about" />
    </main>
  </div>
</template>

<style src="./editorial.css"></style>
