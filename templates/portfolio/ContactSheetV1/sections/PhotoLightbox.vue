<script setup lang="ts">
import type { LightboxEntry } from '~~/templates/portfolio/ContactSheetV1/schema'
const props = defineProps<{
  entries: LightboxEntry[]
  storageKey: string
}>()

// The overlays open through `:target`, so they work without JavaScript; only the shortlist needs it
const shortlist = ref<string[]>([])
const key = (i: number) => `lb-${i}`

onMounted(() => {
  try {
    shortlist.value = JSON.parse(localStorage.getItem(props.storageKey) ?? '[]')
  } catch {
    shortlist.value = []
  }

  // Escape closes whatever overlay is open
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') document.querySelector<HTMLAnchorElement>(':target .close')?.click()
  })
})

function toggle(id: string) {
  shortlist.value = shortlist.value.includes(id) ? shortlist.value.filter((x) => x !== id) : [...shortlist.value, id]
  try {
    localStorage.setItem(props.storageKey, JSON.stringify(shortlist.value))
  } catch {
    // Private mode: the shortlist then lasts for the visit only
  }
}
</script>

<template>
  <aside v-for="(entry, i) in entries" :id="key(i)" :key="key(i)" class="lightbox" :aria-label="entry.title">
    <p class="frame cs-eyebrow">{{ entry.frame }}</p>
    <a class="close" :href="entry.kind === 'index' ? '#index' : '#sheet'">Close <span aria-hidden="true">×</span></a>

    <img class="photo" :src="entry.imageUrl" :alt="entry.title" />

    <div class="caption" :data-frame="entry.frame">
      <h2 class="title">{{ entry.title }}</h2>
      <p v-if="entry.text" class="text">{{ entry.text }}</p>
    </div>

    <nav class="steps" aria-label="Frames">
      <a :href="`#${key((i - 1 + entries.length) % entries.length)}`"><span aria-hidden="true">←</span> Prev</a>
      <a :href="`#${key((i + 1) % entries.length)}`">Next <span aria-hidden="true">→</span></a>
    </nav>

    <div class="actions">
      <button class="shortlist" type="button" :aria-pressed="shortlist.includes(key(i))" @click="toggle(key(i))">
        {{ shortlist.includes(key(i)) ? 'In shortlist' : 'Add to shortlist' }} <span aria-hidden="true">{{ shortlist.includes(key(i)) ? '●' : '○' }}</span>
      </button>
      <a class="cs-button" href="#book">Book this look <span aria-hidden="true">→</span></a>
    </div>
  </aside>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: none;
  overflow-y: auto;
  padding: 1rem var(--cs-pad) 1.5rem;
  background: var(--brand-bg);
  grid-template-columns: 1fr;
  grid-template-areas:
    'frame close'
    'photo photo'
    'caption caption'
    'steps steps'
    'actions actions';
  align-content: start;
  gap: 1rem;
}

.lightbox:target {
  display: grid;
}

.frame {
  grid-area: frame;
  margin: 0;
}

.close {
  grid-area: close;
  justify-self: end;
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.photo {
  grid-area: photo;
  display: block;
  width: 100%;
  max-height: 62vh;
  object-fit: cover;
}

.caption {
  grid-area: caption;
}

.title {
  margin: 0.5rem 0 0.5rem;
  font: 400 clamp(2.75rem, 15vw, 4rem) / 1 var(--cs-display);
  text-transform: uppercase;
}

.text {
  margin: 0;
  font: 400 1.375rem/1.2 var(--cs-serif);
  color: var(--cs-muted);
}

.steps {
  grid-area: steps;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.actions {
  grid-area: actions;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortlist {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--brand-text);
  background: transparent;
  color: var(--brand-text);
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}

.shortlist[aria-pressed='true'] {
  border-color: var(--brand-accent);
  color: var(--brand-accent);
}

@media (min-width: 64rem) {
  .lightbox {
    padding: 3.75rem var(--cs-pad) 3.75rem;
    grid-template-columns: minmax(0, 1fr) minmax(0, 40rem) minmax(0, 1fr);
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'caption photo close'
      'caption photo .'
      'steps photo actions';
    gap: 0 3rem;
  }

  .frame {
    display: none;
  }

  .caption::before {
    display: block;
    margin-bottom: 0.5rem;
    font: 500 0.75rem/1 var(--cs-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand-accent);
    content: attr(data-frame);
  }

  .photo {
    height: 100%;
    max-height: calc(100vh - 7.5rem);
  }

  .title {
    font-size: clamp(4rem, 9vw, 8.125rem);
  }

  .text {
    max-width: 18rem;
    font-size: 1.75rem;
  }

  .steps {
    justify-content: flex-start;
    gap: 2rem;
    align-self: end;
  }

  .actions {
    align-self: end;
  }
}
</style>
