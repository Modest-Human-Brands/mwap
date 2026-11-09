<script setup lang="ts">
import ShaderBackdrop from './ShaderBackdrop.vue'
import type { CareerSlot } from '~~/templates/portfolio/developer/SignalV1/schema'

defineProps<{ slotContent: CareerSlot }>()

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section id="career" class="career">
    <ShaderBackdrop variant="ambient" />
    <!-- Experience -->
    <div class="block">
      <p class="sg-eyebrow">{{ slotContent.experience.eyebrow }}</p>
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="title sg-display">{{ slotContent.experience.title }}</h2>
      <p class="intro">{{ slotContent.experience.intro }}</p>
      <ol v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.12, start: 'top 88%' }" class="timeline">
        <li v-for="job in slotContent.experience.items" :key="job.company + job.period" class="job">
          <div class="when sg-mono">
            <p>{{ job.period }}</p>
            <p class="where">{{ job.location }}</p>
          </div>
          <div class="what">
            <h3 class="company sg-display">{{ job.company }}</h3>
            <p class="role">{{ job.role }}</p>
            <ul class="points">
              <li v-for="point in job.highlights" :key="point">{{ point }}</li>
            </ul>
            <p class="stack sg-mono">{{ job.stack }}</p>
          </div>
        </li>
      </ol>
    </div>

    <!-- Education -->
    <div class="block">
      <p class="sg-eyebrow">{{ slotContent.education.eyebrow }}</p>
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="title sg-display">{{ slotContent.education.title }}</h2>
      <div v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 32, duration: 0.8, ease: 'power3.out', stagger: 0.12, start: 'top 88%' }" class="pair">
        <article class="passport sg-card">
          <p class="pill sg-mono">{{ slotContent.education.pursuing.label }}</p>
          <h3 class="passport-title sg-display">{{ slotContent.education.pursuing.degree }}</h3>
          <p class="muted">{{ slotContent.education.pursuing.institute }}</p>
          <ol class="stages">
            <li v-for="stage in slotContent.education.pursuing.stages" :key="stage.label" class="stage" :data-state="stage.state">
              <span class="dot" aria-hidden="true" />
              <span class="stage-label sg-mono">{{ stage.label }}</span>
            </li>
          </ol>
          <p class="level sg-mono">{{ slotContent.education.pursuing.currentLevel }}</p>
          <hr class="rule" />
          <template v-if="slotContent.education.pursuing.coursework.length">
            <p class="mini sg-mono">COURSEWORK</p>
            <ul class="chips">
              <li v-for="course in slotContent.education.pursuing.coursework" :key="course" class="chip">{{ course }}</li>
            </ul>
          </template>
          <p class="muted">{{ slotContent.education.pursuing.relevance }}</p>
        </article>
        <div v-if="slotContent.education.certificates.length" class="ledger">
          <p class="mini sg-mono">{{ pad(slotContent.education.certificates.length) }} CREDENTIALS</p>
          <ul>
            <li v-for="(cert, index) in slotContent.education.certificates" :key="cert.name" class="cert">
              <span class="numeral sg-display" aria-hidden="true">{{ pad(index + 1) }}</span>
              <div class="cert-body">
                <h3 class="cert-name sg-display">{{ cert.name }}</h3>
                <p class="muted">
                  {{ cert.issuer }} · {{ cert.year
                  }}<template v-if="cert.credentialId">
                    · <span class="sg-mono">{{ cert.credentialId }}</span></template
                  >
                </p>
              </div>
              <a v-if="cert.url" class="btn" :href="cert.url" rel="noopener" :aria-label="`Verify ${cert.name}`">Verify →</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Hackathons -->
    <div v-if="slotContent.hackathons.items.length" class="block">
      <p class="sg-eyebrow">{{ slotContent.hackathons.eyebrow }}</p>
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="title sg-display">{{ slotContent.hackathons.title }}</h2>
      <ul v-gsap.whenVisible.once.stagger.from="{ opacity: 0, y: 32, duration: 0.8, ease: 'power3.out', stagger: 0.12, start: 'top 88%' }" class="rows">
        <li v-for="item in slotContent.hackathons.items" :key="item.name + item.year" class="row">
          <span class="year sg-display">{{ item.year }}</span>
          <div class="row-body">
            <span class="pill sg-mono" :data-result="item.result">{{ item.result.toUpperCase() }}</span>
            <h3 class="row-title sg-display">{{ item.name }}</h3>
            <p class="muted">{{ item.description }}</p>
            <ul class="chips">
              <li v-for="tech in item.stack" :key="tech" class="chip">{{ tech }}</li>
            </ul>
          </div>
          <a v-if="item.url" class="btn" :href="item.url" rel="noopener">Project →</a>
        </li>
      </ul>
    </div>

    <!-- Open source & writing -->
    <div class="block">
      <p class="sg-eyebrow">{{ slotContent.openSource.eyebrow }}</p>
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', start: 'top 88%' }" class="title sg-display">{{ slotContent.openSource.title }}</h2>
      <div class="banner sg-card">
        <div class="banner-head">
          <p class="banner-title sg-display">{{ slotContent.openSource.maintainer.title }}</p>
          <a v-if="slotContent.openSource.maintainer.url" class="btn primary" :href="slotContent.openSource.maintainer.url" rel="noopener">GitHub →</a>
        </div>
        <dl class="figures">
          <div v-for="(stat, index) in slotContent.openSource.maintainer.stats" :key="stat.label" class="figure" :class="{ hot: index === slotContent.openSource.maintainer.stats.length - 1 }">
            <dt class="mini sg-mono">{{ stat.label }}</dt>
            <dd class="figure-value sg-display">{{ stat.value }}</dd>
          </div>
        </dl>
      </div>
      <div class="pair">
        <ul class="list">
          <li v-for="item in slotContent.openSource.contributions" :key="item.name" class="entry">
            <div>
              <span class="sg-mono entry-name">{{ item.name }}</span>
              <p class="muted">{{ item.description }}</p>
            </div>
            <a v-if="item.url" class="btn small" :href="item.url" rel="noopener">{{ item.action }}</a>
          </li>
        </ul>
        <ul class="list">
          <li v-for="item in slotContent.openSource.writing" :key="item.title" class="entry">
            <div>
              <span class="entry-name">{{ item.title }}</span>
              <p class="muted sg-mono">{{ item.meta }}</p>
            </div>
            <a v-if="item.url" class="btn small" :href="item.url" rel="noopener">{{ item.action }}</a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.career {
  display: grid;
  gap: 4rem;
  position: relative;
  isolation: isolate;
  padding: 4rem var(--sg-pad);
  border-top: 1px solid var(--sg-line);
}

.career > :not(.backdrop) {
  position: relative;
  z-index: 1;
}

.title {
  margin-top: 0.75rem;
  font-size: clamp(1.75rem, 7vw, 3rem);
  line-height: 1.2;
}

.intro {
  max-width: 40rem;
  margin-top: 1rem;
  color: var(--sg-muted);
}

.muted {
  color: var(--sg-muted);
}

.timeline {
  margin-top: 2rem;
  border-top: 1px solid var(--sg-line);
}

.job {
  display: grid;
  gap: 1rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--sg-line);
}

.when {
  color: var(--sg-muted);
  font-size: 0.9375rem;
}

.company {
  font-size: 1.5rem;
  line-height: 1.25;
}

.role {
  color: var(--sg-accent);
}

.points {
  display: grid;
  gap: 0.375rem;
  margin-top: 0.75rem;
  color: var(--sg-muted);
}

.stack {
  margin-top: 0.75rem;
  color: var(--sg-muted);
  font-size: 0.9375rem;
}

.pair {
  display: grid;
  gap: 1.25rem;
  margin-top: 2rem;
}

.pill {
  justify-self: start;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--sg-accent);
  border-radius: 999px;
  color: var(--sg-accent);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
}

.pill[data-result='winner'] {
  background: var(--sg-accent);
  color: var(--sg-bg);
}

.pill[data-result='participant'] {
  border-color: var(--sg-line);
  color: var(--sg-muted);
}

.passport {
  display: grid;
  align-content: start;
  gap: 0.75rem;
  padding: 2rem;
  border-radius: 2rem;
}

.passport-title {
  font-size: clamp(1.75rem, 6vw, 3rem);
  line-height: 1.2;
}

.stages {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.stage {
  display: grid;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 2px solid var(--sg-line);
  color: var(--sg-muted);
}

.stage[data-state='done'],
.stage[data-state='current'] {
  border-color: var(--sg-accent);
}

.stage[data-state='current'] {
  color: var(--sg-text);
}

.dot {
  width: 0.625rem;
  height: 0.625rem;
  border: 1px solid var(--sg-accent);
  border-radius: 999px;
}

.stage[data-state='done'] .dot,
.stage[data-state='current'] .dot {
  background: var(--sg-accent);
}

.stage-label {
  font-size: 0.8125rem;
}

.level {
  color: var(--sg-accent);
  font-size: 0.875rem;
}

.rule {
  width: 100%;
  border: 0;
  border-top: 1px solid var(--sg-line);
}

.mini {
  color: var(--sg-muted);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--sg-line);
  border-radius: 999px;
  color: var(--sg-muted);
  font-size: 0.8125rem;
}

.ledger {
  display: grid;
  align-content: start;
  gap: 1rem;
}

.cert {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--sg-line);
}

.cert-body {
  flex: 1;
  min-width: 0;
}

.numeral {
  color: var(--sg-muted);
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1;
}

.cert-name {
  font-size: 1.5rem;
  line-height: 1.2;
}

.btn {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--sg-line);
  border-radius: 999px;
  color: var(--sg-text);
  font-size: 0.9375rem;
  white-space: nowrap;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.btn:hover {
  border-color: var(--sg-accent);
  color: var(--sg-accent);
}

.btn.primary {
  border-color: transparent;
  background: var(--sg-accent);
  color: var(--sg-bg);
}

.btn.primary:hover {
  color: var(--sg-bg);
  opacity: 0.85;
}

.btn.small {
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
}

.rows {
  margin-top: 2rem;
  border-bottom: 1px solid var(--sg-line);
}

.row {
  display: grid;
  gap: 1rem;
  padding: 2rem 0;
  border-top: 1px solid var(--sg-line);
}

.year {
  color: var(--sg-muted);
  font-size: clamp(2.5rem, 10vw, 3.5rem);
  font-weight: 300;
  line-height: 1;
}

.row-body {
  display: grid;
  align-content: start;
  gap: 0.75rem;
}

.row-title {
  font-size: 2rem;
  line-height: 1.25;
}

.banner {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 2rem;
}

.banner-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.banner-title {
  font-size: 1.5rem;
}

.figures {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.figure-value {
  font-size: clamp(1.75rem, 6vw, 3rem);
  line-height: 1.2;
}

.figure.hot .figure-value {
  color: var(--sg-accent);
}

.list {
  display: grid;
  align-content: start;
  border-top: 1px solid var(--sg-line);
}

.entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--sg-line);
}

.entry-name {
  font-size: 1.0625rem;
}

@media (min-width: 64rem) {
  .career {
    gap: 6rem;
    padding-block: 6rem;
  }

  .job {
    grid-template-columns: 14rem minmax(0, 1fr);
    gap: 3rem;
    padding: 2.5rem 0;
  }

  .pair {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }

  .row {
    grid-template-columns: 12rem minmax(0, 1fr) auto;
    align-items: start;
    gap: 3rem;
  }
}
</style>
