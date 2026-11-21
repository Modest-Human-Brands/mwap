<script setup lang="ts">
import type { MicroverseSite, PageKey } from '~~/shared/types/site'
import AboutPage from './sections/AboutPage.vue'
import ArticlePage from './sections/ArticlePage.vue'
import BookSession from './sections/BookSession.vue'
import FeaturedBento from './sections/FeaturedBento.vue'
import FooterBand from './sections/FooterBand.vue'
import HeroHome from './sections/HeroHome.vue'
import LegalPage from './sections/LegalPage.vue'
import ListPage from './sections/ListPage.vue'
import LivePage from './sections/LivePage.vue'
import ManifestoSection from './sections/ManifestoSection.vue'
import MediaPage from './sections/MediaPage.vue'
import PackagesSection from './sections/PackagesSection.vue'
import PhotoGallery from './sections/PhotoGallery.vue'
import ProjectsPage from './sections/ProjectsPage.vue'
import SiteNav from './sections/SiteNav.vue'
import VideoGallery from './sections/VideoGallery.vue'
import { provideMicroverseMotion } from './useMicroverse'

const props = defineProps<{
  site: MicroverseSite
  pageKey: PageKey
}>()

// On a custom domain pages live at the root, otherwise under the site slug
const customDomain = useState<{ slug: string } | null>('customDomain', () => null)
provide('siteBase', customDomain.value ? '' : `/${props.site.slug}`)
provideMicroverseMotion()

const book = ref<InstanceType<typeof BookSession>>()
provide('openBooking', (message?: string) => book.value?.open(message))

const data = computed(() => props.site.data)
const home = computed(() => data.value.pages.home)
const bookLabel = computed(() => home.value.hero.ctaLabel)

// `photo/<slug>` and `video/<slug>` are media pages; the router has already made sure they exist
const [kindKey, itemSlug] = [props.pageKey.split('/')[0], props.pageKey.split('/').slice(1).join('/')]
const media = computed(() => {
  if (kindKey === 'photo') return { kind: 'photo' as const, items: data.value.photos, item: data.value.photos.find((photo) => photo.slug === itemSlug) }
  if (kindKey === 'video') return { kind: 'video' as const, items: data.value.videos, item: data.value.videos.find((video) => video.slug === itemSlug) }
  return undefined
})

// The other pages: `about`, `projects`, `live`, `episode`, `blog`, the legal ones, and `episode/<slug>`, `blog/<slug>`
const pages = computed(() => data.value.pages)
const legalKey = computed(() => (['terms', 'privacy', 'cancellation', 'license'] as const).find((key) => key === kindKey))
const article = computed(() => {
  if (kindKey === 'episode' && itemSlug) return { kind: 'episode' as const, items: data.value.episodes, item: data.value.episodes.find((episode) => episode.slug === itemSlug) }
  if (kindKey === 'blog' && itemSlug) return { kind: 'blog' as const, items: data.value.blogs, item: data.value.blogs.find((post) => post.slug === itemSlug) }
  return undefined
})

const galleryPhotos = computed(() => data.value.photos.filter((photo) => photo.gallery))
const featuredPhotos = computed(() => data.value.photos.filter((photo) => photo.featured !== null).toSorted((a, b) => a.featured! - b.featured!))
</script>

<template>
  <div class="mv">
    <SiteNav v-if="!media?.item" :brand-name="site.brand.name" :logo-url="site.brand.logoUrl" :links="data.navigation" :page-key="pageKey" :phone="data.contact.phone" :social="data.contact.links" />

    <MediaPage v-if="media?.item" :kind="media.kind" :item="media.item" :items="media.items" :brand-name="site.brand.name" :logo-url="site.brand.logoUrl" />

    <template v-else>
      <main v-if="pageKey !== 'home'">
        <AboutPage v-if="pageKey === 'about'" :story="pages.about.story" :team="pages.about.team" :members="data.team" />
        <ProjectsPage v-else-if="pageKey === 'projects'" :slot-content="pages.projects.header" :photos="data.photos" :videos="data.videos" />
        <LivePage v-else-if="pageKey === 'live'" :header="pages.live.header" :schedule="pages.live.schedule" :replays="pages.live.replays" :off-air="pages.live.offAir" :live="data.live" />
        <ListPage v-else-if="pageKey === 'episode'" kind="episode" :slot-content="pages.episode.header" :items="data.episodes" />
        <ListPage v-else-if="pageKey === 'blog'" kind="blog" :slot-content="pages.blog.header" :items="data.blogs" />
        <ArticlePage v-else-if="article?.item" :kind="article.kind" :slot-content="pages[article.kind].header" :item="article.item" :items="article.items" />
        <LegalPage v-else-if="legalKey" :slot-content="pages[legalKey].document" />
      </main>
      <main v-else>
        <HeroHome v-if="home.hero.enabled" :slot-content="home.hero" :trusted="data.trusted" />
        <ManifestoSection v-if="home.manifesto.enabled" :slot-content="home.manifesto" />
        <PhotoGallery v-if="home.photoGallery.enabled && galleryPhotos.length" :slot-content="home.photoGallery" :photos="galleryPhotos" />
        <VideoGallery v-if="home.videoGallery.enabled" :slot-content="home.videoGallery" :videos="data.videos" />
        <FeaturedBento v-if="home.featured.enabled && featuredPhotos.length" :slot-content="home.featured" :photos="featuredPhotos" />
        <PackagesSection v-if="home.packages.enabled" :slot-content="home.packages" :packages="data.packages" />
      </main>
      <FooterBand v-if="home.footer.enabled" :slot-content="home.footer" :contact="data.contact" />
    </template>

    <BookSession ref="book" :label="bookLabel" :slug="site.slug" :email="data.contact.email" />
  </div>
</template>

<style src="./microverse.css"></style>
