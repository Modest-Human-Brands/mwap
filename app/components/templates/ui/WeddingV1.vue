<script setup lang="ts">
const props = defineProps<{
  site: SitePayload
}>()

const gallerySection = computed(() => props.site?.content?.sections?.find((s) => s.type === 'gallery'))

const testimonialsSection = computed(() => props.site?.content?.sections?.find((s) => s.type === 'testimonials'))

const isModalOpen = ref(false)
const selectedMedia = ref<string | null>(null)

function openMedia(url?: string) {
  if (!url) return
  selectedMedia.value = url
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedMedia.value = null
}

const packages = [
  {
    name: 'The Intimate Vow',
    hours: 'Up to 6 Hours Coverage',
    price: '3,800',
    featured: false,
    includes: ['Single Master Cinematographer & Photographer', '350+ Curated High-Res Edited Stills', '4-6 Minute Highlight Cinematic Film', 'Online Heirloom Gallery with Print Rights'],
  },
  {
    name: 'The Complete Celebration',
    hours: 'Full Day Coverage (10 Hours)',
    price: '6,200',
    featured: true,
    includes: [
      'Two Lead Cinematographers + Two Photographers',
      '700+ Master Edited Editorial Stills',
      '8-10 Minute Signature Film + Drone Footage',
      'Full Ceremony & Speeches Multi-Cam Document',
      'Super 8mm Vintage Film Reel Blend',
    ],
  },
  {
    name: 'The Destination Weekend',
    hours: 'Multi-Day Coverage (3 Days)',
    price: '9,500',
    featured: false,
    includes: [
      'Welcome Dinner + Full Wedding Day + Farewell Brunch',
      'Full High-Res Archive + 72-Hour Teaser Reel',
      '12-15 Minute Feature Film with Color Grading',
      'Custom Handcrafted Italian Leather Album',
      'All Regional Travel & Logistics Included',
    ],
  },
]

const inquiryForm = ref({
  coupleNames: '',
  email: '',
  phone: '',
  weddingDate: '',
  venueLocation: '',
  serviceType: 'both',
  estimatedGuests: '100-200',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

async function handleInquirySubmit() {
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 1200))
  isSubmitting.value = false
  isSubmitted.value = true
}
</script>

<template>
  <div class="bg-brand-bg font-brand text-brand-text relative w-full">
    <header class="border-brand-secondary/10 bg-brand-bg/90 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#" class="flex items-center gap-3">
          <img v-if="site.brand.logoUrl" :src="site.brand.logoUrl" :alt="site.brand.name" class="border-brand-secondary/20 size-10 rounded-full border object-cover" />
          <span class="font-serif font-semibold text-brand-text text-xl tracking-wide">
            {{ site.brand.name }}
          </span>
        </a>

        <nav class="text-brand-text/70 hidden items-center gap-8 text-xs uppercase tracking-widest md:flex">
          <a href="#stories" class="hover:text-brand-primary transition">Stories</a>
          <a href="#investment" class="hover:text-brand-primary transition">Collections</a>
          <a href="#kind-words" class="hover:text-brand-primary transition">Kind Words</a>
          <a href="#inquire" class="hover:text-brand-primary transition">Check Availability</a>
        </nav>

        <a
          href="#inquire"
          class="border-brand-primary bg-brand-primary font-semibold hover:text-brand-primary rounded-full border px-6 py-2.5 text-xs uppercase tracking-widest text-white transition duration-300 hover:bg-transparent">
          Inquire Date
        </a>
      </div>
    </header>

    <section class="relative flex min-h-[92vh] items-center justify-center px-6 py-24">
      <div class="absolute inset-0 overflow-hidden">
        <img
          :src="site.content.hero.mediaUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&fit=crop&q=80'"
          alt="Wedding Hero Background"
          class="size-full object-cover opacity-20 saturate-50 filter" />
        <div class="from-brand-bg/40 via-brand-bg/80 to-brand-bg absolute inset-0 bg-gradient-to-b" />
      </div>

      <div class="relative z-10 mx-auto max-w-4xl text-center">
        <span class="text-brand-primary inline-block text-xs uppercase tracking-[0.3em]"> Destination & Editorial Wedding Cinema </span>

        <h1 class="font-serif font-normal sm:text-6xl md:text-7xl text-brand-text mt-6 text-4xl leading-tight">
          {{ site.content.hero.headline }}
        </h1>

        <p class="text-brand-text/70 mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed sm:text-lg">
          {{ site.content.hero.subheadline }}
        </p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            :href="site.content.hero.ctaLink || '#inquire'"
            class="bg-brand-primary font-semibold rounded-full px-8 py-4 text-xs uppercase tracking-widest text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:brightness-95">
            {{ site.content.hero.ctaText }}
          </a>

          <a
            href="#stories"
            class="border-brand-secondary/20 bg-brand-bg/50 font-semibold text-brand-text hover:border-brand-primary hover:text-brand-primary rounded-full border px-8 py-4 text-xs uppercase tracking-widest backdrop-blur-sm transition duration-300">
            Explore Gallery
          </a>
        </div>
      </div>
    </section>

    <section id="stories" class="px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <span class="text-brand-primary text-xs uppercase tracking-[0.25em]">Portfolio</span>
          <h2 class="font-serif font-normal text-brand-text mt-3 text-3xl sm:text-5xl">
            {{ gallerySection?.title || 'Selected Love Stories' }}
          </h2>
          <p v-if="gallerySection?.description" class="text-brand-text/60 mt-4 text-sm leading-relaxed">
            {{ gallerySection.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div v-for="(item, idx) in gallerySection?.items" :key="idx" class="group flex cursor-pointer flex-col" @click="openMedia(item.imageUrl)">
            <div class="bg-brand-secondary/5 relative aspect-[3/4] overflow-hidden rounded-lg">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="size-full object-cover transition duration-700 group-hover:scale-105" />
              <div class="bg-brand-secondary/0 group-hover:bg-brand-secondary/20 absolute inset-0 flex items-center justify-center transition duration-300">
                <span
                  class="font-semibold text-brand-secondary rounded-full bg-white/90 px-4 py-1.5 text-[11px] uppercase tracking-widest opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                  View Story
                </span>
              </div>
            </div>
            <div class="mt-4 text-center">
              <h3 class="font-serif font-semibold text-brand-text text-lg">{{ item.title }}</h3>
              <p class="text-brand-text/60 mt-1 text-xs leading-relaxed">{{ item.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="investment" class="border-brand-secondary/10 bg-brand-secondary/[0.02] border-t px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <span class="text-brand-primary text-xs uppercase tracking-[0.25em]">Investment</span>
          <h2 class="font-serif font-normal text-brand-text mt-3 text-3xl sm:text-5xl">Curated Collections</h2>
          <p class="text-brand-text/60 mt-4 text-sm leading-relaxed">Every celebration is documented with intention, archival clarity, and editorial sensitivity.</p>
        </div>

        <div class="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          <div
            v-for="pkg in packages"
            :key="pkg.name"
            :class="[
              'flex flex-col justify-between rounded-2xl p-8 transition duration-300',
              pkg.featured ? 'border-brand-primary bg-brand-bg relative border-2 shadow-xl' : 'border-brand-secondary/10 bg-brand-bg border',
            ]">
            <div v-if="pkg.featured" class="bg-brand-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Most Selected
            </div>

            <div>
              <h3 class="font-serif text-brand-text text-xl font-bold">{{ pkg.name }}</h3>
              <p class="text-brand-text/50 mt-1 text-xs uppercase tracking-wider">{{ pkg.hours }}</p>

              <div class="mt-6 flex items-baseline gap-1">
                <span class="text-brand-text/60 text-xs">$</span>
                <span class="font-serif font-semibold text-brand-text text-4xl">{{ pkg.price }}</span>
              </div>

              <div class="border-brand-secondary/10 my-6 border-t" />

              <ul class="text-brand-text/70 space-y-3 text-xs leading-relaxed">
                <li v-for="(inc, idx) in pkg.includes" :key="idx" class="flex items-start gap-2">
                  <span class="text-brand-primary mt-0.5">✦</span>
                  <span>{{ inc }}</span>
                </li>
              </ul>
            </div>

            <a
              href="#inquire"
              :class="[
                'font-semibold mt-8 block rounded-full py-3 text-center text-xs uppercase tracking-widest transition',
                pkg.featured ? 'bg-brand-primary text-white hover:brightness-95' : 'border-brand-secondary/20 text-brand-text hover:border-brand-primary hover:text-brand-primary border',
              ]">
              Reserve Collection
            </a>
          </div>
        </div>
      </div>
    </section>

    <section v-if="testimonialsSection?.items?.length" id="kind-words" class="border-brand-secondary/10 border-t px-6 py-24">
      <div class="mx-auto max-w-4xl text-center">
        <span class="text-brand-primary text-xs uppercase tracking-[0.25em]">Praise</span>
        <h2 class="font-serif font-normal text-brand-text mt-3 text-3xl sm:text-4xl">
          {{ testimonialsSection.title }}
        </h2>

        <div class="mt-12">
          <div v-for="(t, idx) in testimonialsSection.items" :key="idx" class="border-brand-secondary/10 bg-brand-secondary/[0.01] rounded-2xl border p-8 md:p-12">
            <p class="font-serif font-normal text-brand-text/90 text-lg italic leading-relaxed md:text-2xl">"{{ t.body }}"</p>
            <div class="mt-8 flex flex-col items-center justify-center gap-3">
              <img v-if="t.imageUrl" :src="t.imageUrl" :alt="t.title" class="border-brand-secondary/20 size-14 rounded-full border object-cover" />
              <span class="font-semibold text-brand-text text-xs uppercase tracking-widest">{{ t.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="inquire" class="border-brand-secondary/10 bg-brand-secondary/[0.03] border-t px-6 py-24">
      <div class="mx-auto max-w-3xl">
        <div class="mb-12 text-center">
          <span class="text-brand-primary text-xs uppercase tracking-[0.25em]">Connect</span>
          <h2 class="font-serif font-normal text-brand-text mt-3 text-3xl sm:text-5xl">Check Date Availability</h2>
          <p class="text-brand-text/60 mt-3 text-sm">We accept a limited number of destination weddings annually to ensure dedicated focus for every couple.</p>
        </div>

        <div class="border-brand-secondary/10 bg-brand-bg rounded-2xl border p-8 shadow-sm md:p-12">
          <div v-if="isSubmitted" class="py-12 text-center">
            <div class="bg-brand-primary/10 text-brand-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full text-xl">✦</div>
            <h3 class="font-serif font-semibold text-brand-text text-2xl">Inquiry Received</h3>
            <p class="text-brand-text/60 mt-2 text-sm">Thank you for sharing your story. We will review our calendar and respond within 48 hours.</p>
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleInquirySubmit">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="text-brand-text/70 mb-2 block text-xs uppercase tracking-wider">Couple Names</label>
                <input
                  v-model="inquiryForm.coupleNames"
                  required
                  type="text"
                  placeholder="e.g. Clara & Nathan"
                  class="border-brand-secondary/20 text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary w-full rounded-lg border bg-transparent px-4 py-3 text-sm focus:outline-none" />
              </div>

              <div>
                <label class="text-brand-text/70 mb-2 block text-xs uppercase tracking-wider">Email Address</label>
                <input
                  v-model="inquiryForm.email"
                  required
                  type="email"
                  placeholder="clara@example.com"
                  class="border-brand-secondary/20 text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary w-full rounded-lg border bg-transparent px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="text-brand-text/70 mb-2 block text-xs uppercase tracking-wider">Wedding Date</label>
                <input
                  v-model="inquiryForm.weddingDate"
                  required
                  type="date"
                  class="border-brand-secondary/20 text-brand-text focus:border-brand-primary w-full rounded-lg border bg-transparent px-4 py-3 text-sm focus:outline-none" />
              </div>

              <div>
                <label class="text-brand-text/70 mb-2 block text-xs uppercase tracking-wider">Venue & Location</label>
                <input
                  v-model="inquiryForm.venueLocation"
                  required
                  type="text"
                  placeholder="e.g. Villa Cimbrone, Ravello, Italy"
                  class="border-brand-secondary/20 text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary w-full rounded-lg border bg-transparent px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="text-brand-text/70 mb-2 block text-xs uppercase tracking-wider">Coverage Needed</label>
                <select
                  v-model="inquiryForm.serviceType"
                  class="border-brand-secondary/20 bg-brand-bg text-brand-text focus:border-brand-primary w-full rounded-lg border px-4 py-3 text-sm focus:outline-none">
                  <option value="both">Both Photography & Cinema</option>
                  <option value="cinema">Cinema Only</option>
                  <option value="photo">Photography Only</option>
                </select>
              </div>

              <div>
                <label class="text-brand-text/70 mb-2 block text-xs uppercase tracking-wider">Guest Count Range</label>
                <select
                  v-model="inquiryForm.estimatedGuests"
                  class="border-brand-secondary/20 bg-brand-bg text-brand-text focus:border-brand-primary w-full rounded-lg border px-4 py-3 text-sm focus:outline-none">
                  <option value="under-50">Under 50 (Intimate / Elopement)</option>
                  <option value="50-150">50 - 150 Guests</option>
                  <option value="150-300">150 - 300 Guests</option>
                  <option value="300+">300+ Guests</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-brand-text/70 mb-2 block text-xs uppercase tracking-wider">Tell Us About Your Vision</label>
              <textarea
                v-model="inquiryForm.message"
                rows="4"
                placeholder="Share your plans, aesthetic, wedding planner details..."
                class="border-brand-secondary/20 text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary w-full resize-none rounded-lg border bg-transparent px-4 py-3 text-sm focus:outline-none" />
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-brand-primary font-semibold w-full rounded-full py-4 text-xs uppercase tracking-widest text-white shadow-md transition duration-300 hover:brightness-95 disabled:opacity-50">
              <span v-if="isSubmitting">Sending Request...</span>
              <span v-else>Submit Date Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </section>

    <footer class="border-brand-secondary/10 bg-brand-bg text-brand-text/40 border-t px-6 py-12 text-center text-xs">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div class="flex items-center gap-3">
          <img v-if="site.brand.logoUrl" :src="site.brand.logoUrl" class="size-6 rounded-full object-cover opacity-60" />
          <span class="font-serif font-semibold text-brand-text/80">{{ site.brand.name }}</span>
        </div>
        <p>© {{ new Date().getFullYear() }} {{ site.brand.name }}. All rights reserved.</p>
        <p class="text-brand-text/30 text-[10px] uppercase tracking-widest">Editorial Wedding Collection</p>
      </div>
    </footer>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" @click.self="closeModal">
      <div class="relative max-w-4xl overflow-hidden rounded-lg">
        <button
          type="button"
          class="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-white hover:text-black"
          @click="closeModal">
          ✕
        </button>
        <img v-if="selectedMedia" :src="selectedMedia" alt="Expanded Media View" class="max-h-[85vh] w-auto rounded-lg object-contain" />
      </div>
    </div>
  </div>
</template>
