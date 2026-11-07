<script setup lang="ts">
import { useSiteHref } from '~~/templates/_shared/useSiteHref'
import type { SignalProject, WorkSlot } from '~~/templates/developer/SignalV1/schema'
import { formatDate } from '~~/templates/developer/SignalV1/format'

defineProps<{ slotContent: WorkSlot; projects: SignalProject[] }>()

const siteHref = useSiteHref()
</script>

<template>
  <section id="work" class="work">
    <p class="sg-eyebrow">{{ slotContent.eyebrow }}</p>
    <h2 class="title sg-display">{{ slotContent.title }}</h2>

    <ul v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.12, start: 'top 85%' }" class="cards">
      <li v-for="project in projects" :key="project.slug" class="card">
        <a class="media" :href="siteHref(`/work/${project.slug}`)" :aria-label="`${slotContent.openLabel}: ${project.name}`" tabindex="-1">
          <img :src="project.posterUrl" alt="" loading="lazy" width="800" height="472" />
          <video v-if="project.videoUrl" :src="project.videoUrl" :poster="project.posterUrl" autoplay muted loop playsinline preload="none" aria-hidden="true"></video>
        </a>
        <div class="body">
          <h3 class="name sg-display">{{ project.name }}</h3>
          <p class="summary">{{ project.summary }}</p>
          <p class="label sg-mono">{{ slotContent.stackLabel }}</p>
          <ul class="chips">
            <li v-for="tech in project.stack" :key="tech" class="sg-chip">{{ tech }}</li>
          </ul>
          <dl class="meta sg-mono">
            <div>
              <dt>Version</dt>
              <dd>{{ project.version }}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>
                <time :datetime="project.updated">{{ formatDate(project.updated) }}</time>
              </dd>
            </div>
          </dl>
          <a class="sg-button open" :href="siteHref(`/work/${project.slug}`)">{{ slotContent.openLabel }} {{ project.name }} <span aria-hidden="true">→</span></a>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.work {
  padding: 4rem var(--sg-pad);
}

.title {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 8vw, 3rem);
  line-height: 1.2;
}

.cards {
  display: grid;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--sg-line);
  border-radius: 1rem;
  background: var(--sg-raised);
}

.media {
  position: relative;
  display: block;
  aspect-ratio: 421 / 236;
  overflow: hidden;
  background: var(--sg-sunken);
}

.media img,
.media video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(0 0 0 / 0.55), transparent 60%);
}

.card:hover .media img,
.card:hover .media video {
  transform: scale(1.04);
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}

.name {
  font-size: 1.75rem;
  line-height: 1.25;
}

.summary {
  color: var(--sg-muted);
}

.label {
  margin-top: 0.5rem;
  color: var(--sg-accent);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sg-line);
  font-size: 0.8125rem;
}

.meta div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.meta dt {
  color: var(--sg-muted);
}

.open {
  margin-top: auto;
  width: 100%;
}

.body > .meta + .open {
  margin-top: 1rem;
}

@media (min-width: 48rem) {
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .work {
    padding-block: 6rem;
  }

  .title {
    font-size: 3rem;
  }

  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }
}
</style>
