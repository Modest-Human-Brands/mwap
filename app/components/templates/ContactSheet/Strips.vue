<script setup lang="ts">
defineProps<{
  slotContent: SheetSlot
  /** Lightbox index of the first frame */
  start: number
}>()
</script>

<template>
  <section id="sheet" class="sheet">
    <div class="head">
      <div>
        <p class="cs-eyebrow">(03) Contact sheet</p>
        <h2 class="title">{{ slotContent.title }}</h2>
      </div>
      <p v-if="slotContent.label" class="label">{{ slotContent.label }}</p>
    </div>

    <ul class="strip">
      <li v-for="(frame, i) in slotContent.frames" :key="frame.label + i" class="cell" :class="{ circled: frame.circled }">
        <a class="frame" :href="`#lb-${start + i}`" :aria-label="`Frame ${frame.label}`">
          <img :src="frame.imageUrl" alt="" width="318" height="340" loading="lazy" />
          <span v-if="frame.circled" class="mark" aria-hidden="true" />
        </a>
        <span class="number">{{ frame.label }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sheet {
  padding: 2rem 0 3rem;
  background: var(--cs-strip);
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 0 var(--cs-pad);
  margin-bottom: 1.75rem;
}

.title {
  margin: 0.5rem 0 0;
  font: 400 clamp(2rem, 4vw, 3.5rem) / 1.1 var(--cs-serif);
}

.label {
  display: none;
  margin: 0;
  font: 400 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cs-muted);
}

.strip {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 0.625rem;
  margin: 0;
  /* Frames sit at the page margin, the film itself runs to the edges of the page (see the end cells) */
  padding: 0 calc(var(--cs-pad) - 0.75rem);
  list-style: none;
}

.cell:nth-child(2n + 1) {
  box-shadow: calc(-1 * var(--cs-pad)) 0 0 var(--cs-frame);
}

.cell:nth-child(2n) {
  box-shadow: var(--cs-pad) 0 0 var(--cs-frame);
}

/* A cell is one frame of film with its sprocket holes; side by side the cells make a strip */
.cell {
  position: relative;
  padding: 2.5rem 0.75rem 3.25rem;
  background: var(--cs-frame);
}

.cell::before,
.cell::after {
  position: absolute;
  right: 0;
  left: 0;
  height: 10px;
  background: repeating-linear-gradient(90deg, var(--brand-bg) 0 14px, transparent 14px 36px) center / 100% 100%;
  content: '';
}

.cell::before {
  top: 12px;
}

.cell::after {
  bottom: 12px;
}

.circled {
  z-index: 1;
}

.frame {
  position: relative;
  display: block;
}

.frame img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 171 / 230;
  object-fit: cover;
}

/* Circled in red, like the shortlist marked on a printed contact sheet */
.mark {
  position: absolute;
  inset: -8% -12%;
  border: 3px solid var(--brand-primary);
  border-radius: 50%;
  transform: rotate(-3deg);
  pointer-events: none;
}

.number {
  position: absolute;
  bottom: 1.5rem;
  left: 0.75rem;
  font: 500 0.6875rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-accent);
}

@media (min-width: 48rem) {
  .strip {
    grid-template-columns: repeat(3, 1fr);
  }

  .cell:nth-child(n) {
    box-shadow: none;
  }

  .cell:nth-child(3n + 1) {
    box-shadow: calc(-1 * var(--cs-pad)) 0 0 var(--cs-frame);
  }

  .cell:nth-child(3n) {
    box-shadow: var(--cs-pad) 0 0 var(--cs-frame);
  }

  .label {
    display: block;
  }
}

@media (min-width: 64rem) {
  .strip {
    grid-template-columns: repeat(4, 1fr);
  }

  .cell:nth-child(n) {
    box-shadow: none;
  }

  .cell:nth-child(4n + 1) {
    box-shadow: calc(-1 * var(--cs-pad)) 0 0 var(--cs-frame);
  }

  .cell:nth-child(4n) {
    box-shadow: var(--cs-pad) 0 0 var(--cs-frame);
  }

  .cell {
    padding-right: 0.75rem;
  }

  .frame img {
    aspect-ratio: 318 / 340;
  }
}
</style>
