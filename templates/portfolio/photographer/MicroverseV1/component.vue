<script setup lang="ts">
import type { MicroverseSite, PageKey } from '~~/shared/types/site'
import BookSession from './sections/BookSession.vue'
import FeaturedBento from './sections/FeaturedBento.vue'
import FooterBand from './sections/FooterBand.vue'
import HeroHome from './sections/HeroHome.vue'
import ManifestoSection from './sections/ManifestoSection.vue'
import MediaPage from './sections/MediaPage.vue'
import PackagesSection from './sections/PackagesSection.vue'
import PhotoGallery from './sections/PhotoGallery.vue'
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

const galleryPhotos = computed(() => data.value.photos.filter((photo) => photo.gallery))
const featuredPhotos = computed(() => data.value.photos.filter((photo) => photo.featured !== null).toSorted((a, b) => a.featured! - b.featured!))
</script>

<template>
  <div class="mv">
    <SiteNav v-if="!media?.item" :brand-name="site.brand.name" :logo-url="site.brand.logoUrl" :links="data.navigation" :page-key="'home'" :phone="data.contact.phone" :social="data.contact.links" />

    <MediaPage v-if="media?.item" :kind="media.kind" :item="media.item" :items="media.items" :brand-name="site.brand.name" :logo-url="site.brand.logoUrl" />

    <template v-else>
      <main>
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
