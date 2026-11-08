<script setup lang="ts">
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import type { ContactSlot, SignalProject } from '~~/templates/portfolio/developer/SignalV1/schema'
import { formatDate } from '~~/templates/portfolio/developer/SignalV1/format'

const props = defineProps<{
  project: SignalProject
  next: SignalProject
  email: string
  legal: ContactSlot['legal']
}>()

const siteHref = useSiteHref()
const showNext = computed(() => props.next.slug !== props.project.slug)
</script>

<template>
  <main>
    <section class="hero">
      <img v-gsap.from="{ scale: 1.18, duration: 1.8, ease: 'power3.out' }" :src="project.posterUrl" :alt="`${project.name} preview`" fetchpriority="high" />
      <video v-if="project.videoUrl" :src="project.videoUrl" :poster="project.posterUrl" autoplay muted loop playsinline aria-hidden="true"></video>
      <div class="veil"></div>
    </section>

    <header v-gsap.stagger.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.2 }" class="head">
      <a class="back sg-mono" :href="siteHref('/#work')">← All work</a>
      <h1 class="title sg-display">{{ project.name }}</h1>
      <p class="summary">{{ project.summary }}</p>
      <ul class="chips">
        <li v-for="tech in project.stack" :key="tech" class="sg-chip">{{ tech }}</li>
      </ul>
    </header>

    <div class="bar">
      <dl v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 18, duration: 0.7, ease: 'power2.out', stagger: 0.1, start: 'top 92%' }" class="meta sg-mono">
        <div>
          <dt>Current version</dt>
          <dd>{{ project.version }}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>
            <time :datetime="project.updated">{{ formatDate(project.updated) }}</time>
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{{ project.status }}</dd>
        </div>
      </dl>
      <a class="sg-button" :href="project.url" rel="noopener">Open {{ project.name }} <span aria-hidden="true">→</span></a>
    </div>

    <section id="overview" class="overview">
      <p class="sg-eyebrow">Overview</p>
      <p v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="text">{{ project.overview }}</p>
    </section>

    <section id="capabilities" class="capabilities">
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="h2 sg-display">Capabilities</h2>
      <ol v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 30, duration: 0.7, ease: 'power2.out', stagger: 0.1, start: 'top 88%' }" class="caps">
        <li v-for="(cap, index) in project.capabilities" :key="cap.title" class="cap sg-card">
          <span class="num sg-mono">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="cap-title sg-display">{{ cap.title }}</h3>
          <p>{{ cap.text }}</p>
        </li>
      </ol>
    </section>

    <section id="releases" class="releases">
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="h2 sg-display">Releases</h2>
      <ul v-gsap.whenVisible.once.stagger.from="{ opacity: 0, x: -24, duration: 0.7, ease: 'power2.out', stagger: 0.08, start: 'top 90%' }" class="rel">
        <li v-for="release in project.releases" :key="release.version" class="row">
          <span class="ver sg-mono">{{ release.version }}</span>
          <time class="date" :datetime="release.date">{{ formatDate(release.date) }}</time>
          <span v-if="release.current" class="tag sg-mono">Current release</span>
        </li>
      </ul>
    </section>

    <a v-if="showNext" v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 1, ease: 'power3.out', start: 'top 92%' }" class="next" :href="siteHref(`/work/${next.slug}`)">
      <span class="sg-eyebrow">Next project</span>
      <span class="next-title sg-display">{{ next.name }} <span aria-hidden="true">→</span></span>
      <span class="next-text">{{ next.summary }}</span>
    </a>

    <footer class="foot sg-mono">
      <span>{{ legal }}</span>
      <a :href="`mailto:${email}`">{{ email }}</a>
    </footer>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  height: clamp(16rem, 60vw, 47.5rem);
  overflow: hidden;
  background: var(--sg-sunken);
}

.hero img,
.hero video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.6), transparent 30%, transparent 55%, var(--sg-bg));
}

.head {
  display: grid;
  justify-items: start;
  gap: 1rem;
  padding: 0 var(--sg-pad) 2.5rem;
  margin-top: -3rem;
  position: relative;
}

.back {
  color: var(--sg-muted);
  font-size: 1rem;
}

.back:hover {
  color: var(--sg-text);
}

.title {
  font-size: clamp(2.5rem, 12vw, 3.5rem);
  line-height: 1.2;
}

.summary {
  max-width: 44rem;
  color: var(--sg-muted);
  font-size: 1.25rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.bar {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem var(--sg-pad);
  border-block: 1px solid var(--sg-line);
  background: var(--sg-bg);
}

.meta {
  display: grid;
  gap: 1rem;
  font-size: 1rem;
}

.meta dt {
  color: var(--sg-muted);
  font-size: 0.875rem;
}

.overview,
.capabilities,
.releases {
  padding: 3.5rem var(--sg-pad) 0;
}

.text {
  max-width: 52rem;
  margin-top: 1rem;
  color: var(--sg-muted);
  font-size: 1.25rem;
  line-height: 1.65;
}

.h2 {
  font-size: clamp(1.75rem, 7vw, 2.5rem);
  line-height: 1.2;
}

.caps {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.75rem;
}

.cap {
  display: grid;
  align-content: start;
  gap: 0.5rem;
  padding: 1.5rem;
  color: var(--sg-muted);
}

.num {
  color: var(--sg-accent);
  font-size: 0.9375rem;
}

.cap-title {
  color: var(--sg-text);
  font-size: 1.375rem;
  line-height: 1.3;
}

.rel {
  margin-top: 1.5rem;
  border-top: 1px solid var(--sg-line);
}

.row {
  transition: padding-left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--sg-line);
}

.ver {
  min-width: 6rem;
}

.date {
  color: var(--sg-muted);
}

.row:hover {
  padding-left: 0.75rem;
}

.tag {
  margin-left: auto;
  padding: 0.125rem 0.625rem;
  border: 1px solid var(--sg-accent);
  border-radius: 999px;
  color: var(--sg-accent);
  font-size: 0.875rem;
}

.next {
  display: grid;
  gap: 0.75rem;
  margin-top: 4rem;
  padding: 3.5rem var(--sg-pad);
  background: var(--sg-sunken);
}

.next-title {
  display: inline-block;
  transition:
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    color 0.3s ease;
  font-size: clamp(2rem, 8vw, 3rem);
  line-height: 1.2;
}

.next:hover .next-title {
  transform: translateX(0.75rem);
  color: var(--sg-accent);
}

.next-text {
  max-width: 40rem;
  color: var(--sg-muted);
}

.foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding: 1.5rem var(--sg-pad) 2rem;
  color: var(--sg-muted);
  font-size: 0.875rem;
}

.foot a:hover {
  color: var(--sg-text);
}

@media (min-width: 64rem) {
  .head {
    padding-bottom: 3.5rem;
    margin-top: -5rem;
  }

  .bar {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .meta {
    grid-template-columns: repeat(3, auto);
    justify-content: start;
    gap: 4rem;
  }

  .overview,
  .capabilities,
  .releases {
    padding-top: 5rem;
  }

  .overview {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
    gap: 2rem;
  }

  .text {
    margin-top: 0;
  }

  .caps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }

  .next {
    margin-top: 6rem;
    padding-block: 5rem;
  }
}
</style>
