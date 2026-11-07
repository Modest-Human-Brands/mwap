<script setup lang="ts">
import type { CareerSlot } from '~~/templates/developer/SignalV1/schema'

defineProps<{ slotContent: CareerSlot }>()
</script>

<template>
  <section id="career" class="career">
    <!-- Experience -->
    <div class="block">
      <p class="sg-eyebrow">{{ slotContent.experience.eyebrow }}</p>
      <h2 class="title sg-display">{{ slotContent.experience.title }}</h2>
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
      <h2 class="title sg-display">{{ slotContent.education.title }}</h2>
      <div class="pair">
        <article class="card">
          <p class="label sg-mono">{{ slotContent.education.pursuing.label }}</p>
          <h3 class="card-title sg-display">{{ slotContent.education.pursuing.degree }}</h3>
          <p>{{ slotContent.education.pursuing.institute }}</p>
          <p class="muted">{{ slotContent.education.pursuing.details }}</p>
        </article>
        <ul v-if="slotContent.education.certificates.length" class="card certs">
          <li v-for="cert in slotContent.education.certificates" :key="cert.name" class="cert">
            <div>
              <h3 class="cert-name sg-display">{{ cert.name }}</h3>
              <p class="muted">
                {{ cert.issuer }} · {{ cert.year
                }}<template v-if="cert.credentialId">
                  · <span class="sg-mono">{{ cert.credentialId }}</span></template
                >
              </p>
            </div>
            <a v-if="cert.url" class="verify" :href="cert.url" rel="noopener" :aria-label="`Verify ${cert.name}`">Verify →</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Hackathons -->
    <div v-if="slotContent.hackathons.items.length" class="block">
      <p class="sg-eyebrow">{{ slotContent.hackathons.eyebrow }}</p>
      <h2 class="title sg-display">{{ slotContent.hackathons.title }}</h2>
      <ul class="grid">
        <li v-for="item in slotContent.hackathons.items" :key="item.name" class="card">
          <p class="label sg-mono">{{ item.label }}</p>
          <h3 class="card-title sg-display">{{ item.name }}</h3>
          <p class="muted">{{ item.description }}</p>
          <p class="stack sg-mono">{{ item.stack }}</p>
          <a v-if="item.url" class="verify" :href="item.url" rel="noopener">Project →</a>
        </li>
      </ul>
    </div>

    <!-- Open source & writing -->
    <div class="block">
      <p class="sg-eyebrow">{{ slotContent.openSource.eyebrow }}</p>
      <h2 class="title sg-display">{{ slotContent.openSource.title }}</h2>
      <div class="pair">
        <ul class="list">
          <li v-for="item in slotContent.openSource.contributions" :key="item.name">
            <component :is="item.url ? 'a' : 'div'" :href="item.url" class="entry">
              <span class="sg-mono entry-name">{{ item.name }}</span>
              <span class="muted">{{ item.description }}</span>
            </component>
          </li>
        </ul>
        <ul class="list">
          <li v-for="item in slotContent.openSource.writing" :key="item.title">
            <component :is="item.url ? 'a' : 'div'" :href="item.url" class="entry">
              <span class="entry-name">{{ item.title }}</span>
              <span class="muted sg-mono">{{ item.meta }}</span>
            </component>
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
  padding: 4rem var(--sg-pad);
  border-top: 1px solid var(--sg-line);
}

.title {
  margin-top: 0.75rem;
  font-size: clamp(1.75rem, 7vw, 2.5rem);
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
  font-size: 0.8125rem;
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
  font-size: 0.8125rem;
}

.pair,
.grid {
  display: grid;
  gap: 1.25rem;
  margin-top: 2rem;
}

.card {
  display: grid;
  align-content: start;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 1px solid var(--sg-line);
  border-radius: 1rem;
  background: var(--sg-raised);
}

.card-title {
  font-size: 1.375rem;
  line-height: 1.3;
}

.label {
  color: var(--sg-accent);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
}

.certs {
  gap: 0;
  padding-block: 0.5rem;
}

.cert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
}

.cert + .cert {
  border-top: 1px solid var(--sg-line);
}

.cert-name {
  font-size: 1.0625rem;
}

.verify {
  color: var(--sg-accent);
  font-size: 0.875rem;
  white-space: nowrap;
}

.list {
  display: grid;
  align-content: start;
  border-top: 1px solid var(--sg-line);
}

.entry {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--sg-line);
}

.entry-name {
  font-size: 0.9375rem;
}

a.entry:hover .entry-name {
  color: var(--sg-accent);
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

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }
}
</style>
