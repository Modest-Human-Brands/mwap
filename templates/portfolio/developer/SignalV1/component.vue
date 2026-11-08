<script setup lang="ts">
import type { PageKey, SignalSite } from '~~/shared/types/site'
import { useSignalFonts } from '~~/templates/portfolio/developer/_shared/useSignalFonts'
import CareerSection from './sections/CareerSection.vue'
import ContactBand from './sections/ContactBand.vue'
import HeroHome from './sections/HeroHome.vue'
import IntroStats from './sections/IntroStats.vue'
import ProjectPage from './sections/ProjectPage.vue'
import SiteNav from './sections/SiteNav.vue'
import StackBand from './sections/StackBand.vue'
import SystemsList from './sections/SystemsList.vue'
import WorkCards from './sections/WorkCards.vue'

const props = defineProps<{
  site: SignalSite
  pageKey: PageKey
}>()

// On a custom domain pages live at the root, otherwise under the site slug
const customDomain = useState<{ slug: string } | null>('customDomain', () => null)
provide('siteBase', customDomain.value ? '' : `/${props.site.slug}`)

useSignalFonts()

// One listener for every card: the spotlight follows the pointer through --mx / --my
function trackPointer(event: PointerEvent) {
  const card = (event.target as HTMLElement).closest<HTMLElement>('.sg-card')
  if (!card) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  card.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

const home = computed(() => props.site.data.pages.home)
const projects = computed(() => props.site.data.projects)
// `work/<slug>` is a project page; the router has already made sure it exists
const projectIndex = computed(() => projects.value.findIndex((project) => `work/${project.slug}` === props.pageKey))
const project = computed(() => (projectIndex.value >= 0 ? projects.value[projectIndex.value] : undefined))
const nextProject = computed(() => projects.value[(projectIndex.value + 1) % projects.value.length]!)
</script>

<template>
  <div class="sg" @pointermove="trackPointer">
    <SiteNav :brand-name="site.brand.name" :links="site.data.navigation" :page-key="project ? pageKey : 'home'" />

    <main v-if="!project">
      <HeroHome v-if="home.hero.enabled" :slot-content="home.hero" />
      <IntroStats v-if="home.intro.enabled" :slot-content="home.intro" />
      <WorkCards v-if="home.work.enabled" :slot-content="home.work" :projects="projects" />
      <SystemsList v-if="home.systems.enabled" :slot-content="home.systems" />
      <CareerSection v-if="home.career.enabled" :slot-content="home.career" />
      <StackBand v-if="home.stack.enabled" :slot-content="home.stack" />
      <ContactBand v-if="home.contact.enabled" :slot-content="home.contact" :contact="site.data.contact" />
    </main>

    <ProjectPage v-else :project="project" :next="nextProject" :email="site.data.contact.email" :legal="home.contact.legal" />
  </div>
</template>

<style src="./signal.css"></style>
