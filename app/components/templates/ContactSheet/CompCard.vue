<script setup lang="ts">
defineProps<{
  slotContent: CompCardSlot
}>()

const href = useSiteHref()
const isFile = (url: string) => /^https?:/.test(url)
</script>

<template>
  <section id="comp-card" class="comp">
    <img class="portrait" :src="slotContent.portraitUrl" alt="" width="520" height="600" loading="lazy" />

    <div class="body">
      <p class="eyebrow">(04) Comp card</p>
      <h2 class="title">{{ slotContent.title }}</h2>

      <div class="numbers">
        <dl class="table">
          <div v-for="row in slotContent.measurements" :key="row.label" class="row">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>

        <ul v-if="slotContent.stats.length" class="stats">
          <li v-for="stat in slotContent.stats" :key="stat.label">
            <span class="value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </li>
        </ul>
      </div>

      <a class="download" :href="href(slotContent.download.href)" :download="isFile(slotContent.download.href) ? '' : undefined">{{ slotContent.download.label }} <span aria-hidden="true">→</span></a>
    </div>
  </section>
</template>

<style scoped>
.comp {
  display: grid;
  gap: 2.5rem;
  padding: 3.5rem var(--cs-pad);
  background: var(--brand-secondary);
  color: var(--cs-on-secondary);
}

.portrait {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 520 / 600;
  object-fit: cover;
}

.eyebrow {
  margin: 0;
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.title {
  margin: 0.75rem 0 2rem;
  font: 400 clamp(3.5rem, 9vw, 8.125rem) / 1 var(--cs-display);
  text-transform: uppercase;
}

.numbers {
  display: grid;
  gap: 2rem;
}

.table {
  max-width: 24rem;
  margin: 0;
  border-top: 1px solid var(--cs-on-secondary-line);
}

.row {
  display: grid;
  grid-template-columns: 11rem 1fr;
  align-items: center;
  min-height: 2.875rem;
  border-bottom: 1px solid var(--cs-on-secondary-line);
}

dt {
  font: 400 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cs-on-secondary-muted);
}

dd {
  margin: 0;
  font-size: 1rem;
}

.stats {
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stats li {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.value {
  font: 400 clamp(3.5rem, 7vw, 6rem) / 1 var(--cs-serif);
}

.stat-label {
  font: 400 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cs-on-secondary-muted);
}

.download {
  display: inline-flex;
  gap: 0.75rem;
  margin-top: 2.5rem;
  padding: 1.125rem 1.5rem;
  background: var(--cs-on-secondary);
  color: var(--brand-secondary);
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@media (max-width: 47.99rem) {
  .download {
    display: flex;
    justify-content: center;
  }
}

@media (min-width: 48rem) {
  .stats {
    flex-direction: column;
    gap: 1.25rem;
  }

  .numbers {
    grid-template-columns: minmax(0, 24rem) auto;
    gap: 4rem;
    align-items: start;
  }
}

@media (min-width: 64rem) {
  .comp {
    grid-template-columns: minmax(0, 32.5rem) 1fr;
    gap: 4.5rem;
    padding-block: 5rem;
  }
}
</style>
