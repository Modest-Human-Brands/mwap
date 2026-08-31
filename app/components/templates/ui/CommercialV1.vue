<script setup lang="ts">
const props = defineProps<{
  site: SitePayload
}>()

const isVideoModalOpen = ref(false)
const activeVideoUrl = ref('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')

function openShowreel(url?: string) {
  if (url) activeVideoUrl.value = url
  isVideoModalOpen.value = true
}

function closeShowreel() {
  isVideoModalOpen.value = false
}

const featuresSection = computed(() => props.site?.content?.sections?.find((s) => s.type === 'features'))
const testimonialsSection = computed(() => props.site?.content?.sections?.find((s) => s.type === 'testimonials'))

const clientLogos = [
  { name: 'Red Bull', label: 'RED BULL CREATIVE' },
  { name: 'Sony Music', label: 'SONY ENTERTAINMENT' },
  { name: 'Nike Lab', label: 'NIKE LAB ATHLETICS' },
  { name: 'Porsche Design', label: 'PORSCHE MOTION' },
  { name: 'Vogue Commercial', label: 'VOGUE STUDIO' },
]

interface ProjectTypeOption {
  id: string
  name: string
  baseCost: number
}

const projectTypes: ProjectTypeOption[] = [
  { id: 'commercial', name: 'Brand Commercial / TVC', baseCost: 7500 },
  { id: 'product', name: 'Product Launch & 3D Video', baseCost: 4500 },
  { id: 'doc', name: 'Corporate / Brand Documentary', baseCost: 6000 },
  { id: 'social', name: 'High-Volume Social Ad Pack', baseCost: 3500 },
]

interface DeliverableOption {
  id: string
  name: string
  cost: number
}

const deliverableOptions: DeliverableOption[] = [
  { id: '4k_master', name: 'DCI 4K Master + Pro Color Grade', cost: 1200 },
  { id: 'social_cuts', name: '9:16 & 4:5 Vertical Cutdowns (x5)', cost: 800 },
  { id: 'raw_stills', name: 'Full Resolution RAW Photo Pack', cost: 1500 },
  { id: 'drone_aerial', name: 'FAA Licensed Drone/FPV Operator', cost: 950 },
]

const formState = ref({
  projectType: projectTypes[0].id,
  shootDays: 1,
  selectedDeliverables: ['4k_master'] as string[],
  name: '',
  email: '',
  company: '',
  brief: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const estimatedCost = computed(() => {
  const selectedType = projectTypes.find((t) => t.id === formState.value.projectType)
  const base = selectedType ? selectedType.baseCost : 5000
  const dayMultiplier = formState.value.shootDays > 1 ? (formState.value.shootDays - 1) * 2200 : 0

  const addonsCost = formState.value.selectedDeliverables.reduce((acc, currentId) => {
    const option = deliverableOptions.find((o) => o.id === currentId)
    return acc + (option?.cost || 0)
  }, 0)

  const min = base + dayMultiplier + addonsCost
  const max = Math.round(min * 1.35)

  return {
    min: min.toLocaleString(),
    max: max.toLocaleString(),
  }
})

function toggleDeliverable(id: string) {
  const index = formState.value.selectedDeliverables.indexOf(id)
  if (index > -1) {
    formState.value.selectedDeliverables.splice(index, 1)
  } else {
    formState.value.selectedDeliverables.push(id)
  }
}

async function handleLeadSubmit() {
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 1200))
  isSubmitting.value = false
  isSubmitted.value = true
}
</script>

<template>
  <div class="bg-brand-bg text-brand-text relative w-full overflow-hidden">
    <header class="bg-brand-bg/85 sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <img :src="site.brand.logoUrl" :alt="site.brand.name" class="size-10 rounded-full border border-white/20 object-cover" />
          <span class="text-xl font-bold tracking-tight text-white">{{ site.brand.name }}</span>
        </div>

        <nav class="font-medium hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#reel" class="transition-colors hover:text-white">Showreel</a>
          <a href="#capabilities" class="transition-colors hover:text-white">Capabilities</a>
          <a href="#clients" class="transition-colors hover:text-white">Clients</a>
          <a href="#estimator" class="transition-colors hover:text-white">Pricing Estimator</a>
        </nav>

        <a href="#estimator" class="bg-brand-primary font-semibold shadow-brand-primary/25 rounded-lg px-5 py-2.5 text-sm text-white shadow-lg transition hover:brightness-110"> Book Discovery </a>
      </div>
    </header>

    <section class="relative flex min-h-[90vh] items-center justify-center px-6 py-24">
      <div class="bg-brand-primary/20 pointer-events-none absolute -top-40 left-1/2 size-[650px] -translate-x-1/2 rounded-full blur-[140px]" />

      <div class="relative z-10 mx-auto max-w-5xl text-center">
        <div class="font-medium text-brand-accent mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest">
          <span class="bg-brand-accent size-2 animate-pulse rounded-full" />
          Full-Cycle Commercial Studio
        </div>

        <h1 class="font-extrabold sm:text-6xl md:text-7xl text-4xl tracking-tight text-white lg:leading-[1.1]">
          {{ site.content.hero.headline }}
        </h1>

        <p class="mx-auto mt-8 max-w-2xl text-lg font-light text-white/70 sm:text-xl">
          {{ site.content.hero.subheadline }}
        </p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            class="font-semibold group inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/20"
            @click="openShowreel(site.content.hero.mediaUrl)">
            <div class="flex size-7 items-center justify-center rounded-full bg-white text-black transition group-hover:scale-110">
              <svg class="fill-current ml-0.5 size-4" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            Watch 2026 Reel (1:45)
          </button>

          <a :href="site.content.hero.ctaLink || '#estimator'" class="bg-brand-primary font-semibold rounded-xl px-8 py-4 text-base text-white transition hover:scale-[1.02] hover:brightness-110">
            {{ site.content.hero.ctaText }}
          </a>
        </div>
      </div>
    </section>

    <section id="clients" class="border-y border-white/10 bg-black/40 py-16">
      <div class="mx-auto max-w-7xl px-6">
        <p class="font-semibold text-center text-xs uppercase tracking-widest text-white/40">Trusted By Advertising Agencies & Global Brands</p>
        <div class="mt-10 grid grid-cols-2 items-center gap-8 md:grid-cols-5">
          <div v-for="client in clientLogos" :key="client.name" class="flex items-center justify-center p-4 text-center">
            <span class="text-sm font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white/80">
              {{ client.label }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section id="reel" class="px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span class="font-semibold text-brand-primary text-xs uppercase tracking-widest">Production Showcase</span>
            <h2 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Featured Commercial Cuts</h2>
          </div>
          <p class="max-w-md text-sm text-white/60">Shot across cinema setups with dedicated color pipelines formatted for broadcast and digital campaigns.</p>
        </div>

        <div class="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/60" @click="openShowreel()">
          <img
            :src="site.content.hero.mediaUrl || 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&fit=crop&q=80'"
            alt="Commercial Reel Cover"
            class="size-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-[2px] transition group-hover:bg-black/20">
            <div class="bg-brand-primary flex size-20 items-center justify-center rounded-full text-white shadow-2xl transition group-hover:scale-110">
              <svg class="fill-current ml-1 size-8" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span class="font-medium rounded-full bg-black/70 px-4 py-1.5 text-xs uppercase tracking-wider text-white"> Click to Play 4K Master Reel </span>
          </div>
        </div>
      </div>
    </section>

    <section id="capabilities" class="border-t border-white/10 bg-black/20 px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 max-w-2xl">
          <span class="font-semibold text-brand-primary text-xs uppercase tracking-widest">Capabilities</span>
          <h2 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {{ featuresSection?.title || 'What We Produce' }}
          </h2>
          <p v-if="featuresSection?.description" class="mt-4 text-white/60">
            {{ featuresSection.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            v-for="(item, idx) in featuresSection?.items"
            :key="idx"
            class="hover:border-brand-primary/50 group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:bg-white/[0.04]">
            <div v-if="item.imageUrl" class="mb-6 aspect-[16/10] overflow-hidden rounded-xl bg-black/40">
              <img :src="item.imageUrl" :alt="item.title" class="size-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <h3 class="text-xl font-bold text-white">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-white/65">{{ item.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="estimator" class="bg-gradient-to-b from-transparent to-black/80 px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <span class="font-semibold text-brand-primary text-xs uppercase tracking-widest">Instant Scoping</span>
          <h2 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">Production Cost Estimator</h2>
          <p class="mt-4 text-sm text-white/60">Select your scope parameters to calculate a ballpark budget range and submit for shoot calendar availability.</p>
        </div>

        <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md lg:col-span-7">
            <h3 class="mb-6 text-lg font-bold text-white">1. Project Specifications</h3>

            <label class="font-semibold mb-3 block text-xs uppercase tracking-wider text-white/60">Project Format</label>
            <div class="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                v-for="t in projectTypes"
                :key="t.id"
                type="button"
                :class="[
                  'flex flex-col justify-between gap-2 rounded-xl border p-4 text-left transition',
                  formState.projectType === t.id ? 'border-brand-primary bg-brand-primary/10 text-white' : 'border-white/10 bg-black/40 text-white/70 hover:border-white/20',
                ]"
                @click="formState.projectType = t.id">
                <span class="font-semibold text-sm">{{ t.name }}</span>
                <span class="text-xs text-white/40">From ${{ t.baseCost.toLocaleString() }}</span>
              </button>
            </div>

            <div class="mb-8">
              <div class="mb-3 flex items-center justify-between">
                <label class="font-semibold text-xs uppercase tracking-wider text-white/60">Estimated Shoot Days</label>
                <span class="text-brand-primary text-sm font-bold">{{ formState.shootDays }} Day{{ formState.shootDays > 1 ? 's' : '' }}</span>
              </div>
              <input v-model.number="formState.shootDays" type="range" min="1" max="5" class="accent-brand-primary h-2 w-full cursor-pointer rounded-lg bg-white/10" />
              <div class="font-mono mt-2 flex justify-between text-[11px] text-white/40">
                <span>1 Day (Standard)</span>
                <span>3 Days (Multi-location)</span>
                <span>5+ Days (Campaign)</span>
              </div>
            </div>

            <label class="font-semibold mb-3 block text-xs uppercase tracking-wider text-white/60">Production Add-ons</label>
            <div class="space-y-3">
              <div
                v-for="d in deliverableOptions"
                :key="d.id"
                :class="[
                  'flex cursor-pointer items-center justify-between rounded-xl border p-3.5 text-sm transition',
                  formState.selectedDeliverables.includes(d.id) ? 'border-brand-primary/60 bg-brand-primary/5 text-white' : 'border-white/10 bg-black/40 text-white/70 hover:border-white/20',
                ]"
                @click="toggleDeliverable(d.id)">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'flex size-4 items-center justify-center rounded border text-xs',
                      formState.selectedDeliverables.includes(d.id) ? 'border-brand-primary bg-brand-primary text-white' : 'border-white/30 bg-transparent',
                    ]">
                    <span v-if="formState.selectedDeliverables.includes(d.id)">✓</span>
                  </div>
                  <span>{{ d.name }}</span>
                </div>
                <span class="text-xs text-white/50">+${{ d.cost.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6 lg:col-span-5">
            <div class="border-brand-primary/30 bg-brand-primary/10 rounded-2xl border p-8 backdrop-blur-md">
              <span class="font-semibold text-brand-primary text-xs uppercase tracking-widest">Estimated Budget Bracket</span>
              <div class="mt-3 flex items-baseline gap-2">
                <span class="font-extrabold text-4xl text-white sm:text-5xl">${{ estimatedCost.min }}</span>
                <span class="font-medium text-white/60">— ${{ estimatedCost.max }}</span>
              </div>
              <p class="mt-2 text-xs text-white/50">Final scope includes crew, equipment insurance, location permits, editing & master delivery.</p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
              <h3 class="mb-4 text-lg font-bold text-white">2. Submit Scope for Dates</h3>

              <div v-if="isSubmitted" class="bg-brand-primary/20 border-brand-primary/40 rounded-xl border p-6 text-center">
                <div class="bg-brand-primary mx-auto mb-3 flex size-10 items-center justify-center rounded-full font-bold text-white">✓</div>
                <h4 class="text-base font-bold text-white">Project Scope Received</h4>
                <p class="mt-1 text-xs text-white/70">Our executive producer will respond with team availability within 24 hours.</p>
              </div>

              <form v-else class="space-y-4" @submit.prevent="handleLeadSubmit">
                <div>
                  <label class="font-medium mb-1 block text-xs text-white/70">Your Name</label>
                  <input
                    v-model="formState.name"
                    required
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    class="focus:border-brand-primary w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none" />
                </div>

                <div>
                  <label class="font-medium mb-1 block text-xs text-white/70">Work Email</label>
                  <input
                    v-model="formState.email"
                    required
                    type="email"
                    placeholder="s.jenkins@brand.com"
                    class="focus:border-brand-primary w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none" />
                </div>

                <div>
                  <label class="font-medium mb-1 block text-xs text-white/70">Company / Agency Name</label>
                  <input
                    v-model="formState.company"
                    required
                    type="text"
                    placeholder="e.g. Horizon Labs"
                    class="focus:border-brand-primary w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none" />
                </div>

                <div>
                  <label class="font-medium mb-1 block text-xs text-white/70">Target Shoot Window / Notes</label>
                  <textarea
                    v-model="formState.brief"
                    rows="3"
                    placeholder="Tentative shoot in late October, require studio tabletop..."
                    class="focus:border-brand-primary w-full resize-none rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none" />
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="bg-brand-primary shadow-brand-primary/25 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50">
                  <span v-if="isSubmitting">Transmitting Scope...</span>
                  <span v-else>Request Production Availability</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="testimonialsSection?.items?.length" class="border-t border-white/10 bg-black/30 px-6 py-24">
      <div class="mx-auto max-w-5xl text-center">
        <span class="font-semibold text-brand-primary text-xs uppercase tracking-widest">Endorsements</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-white">{{ testimonialsSection.title }}</h2>

        <div class="mt-12">
          <div v-for="(t, idx) in testimonialsSection.items" :key="idx" class="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-left md:p-12">
            <p class="text-lg font-light italic leading-relaxed text-white/90 md:text-xl">"{{ t.body }}"</p>
            <div class="mt-6 flex items-center gap-4">
              <img v-if="t.imageUrl" :src="t.imageUrl" :alt="t.title" class="size-12 rounded-full border border-white/20 object-cover" />
              <div>
                <h4 class="text-sm font-bold text-white">{{ t.title }}</h4>
                <p class="text-xs text-white/50">Verified Production Partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-white/10 bg-black px-6 py-12 text-center text-xs text-white/40">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div class="flex items-center gap-3">
          <img :src="site.brand.logoUrl" class="size-6 rounded-full object-cover opacity-60" />
          <span class="font-bold text-white/80">{{ site.brand.name }}</span>
        </div>
        <p>© {{ new Date().getFullYear() }} {{ site.brand.name }}. All rights reserved.</p>
        <p class="font-mono text-[11px] text-white/30">Powered by Nuxt Website Engine</p>
      </div>
    </footer>

    <div v-if="isVideoModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" @click.self="closeShowreel">
      <div class="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">
        <button
          type="button"
          class="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white hover:text-black"
          @click="closeShowreel">
          ✕
        </button>
        <iframe :src="activeVideoUrl" class="size-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
      </div>
    </div>
  </div>
</template>
