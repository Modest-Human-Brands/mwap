<script setup lang="ts">
import type { HeroSlot } from '~~/templates/portfolio/developer/SignalV1/schema'
import ShaderBackdrop from './ShaderBackdrop.vue'

const props = defineProps<{ slotContent: HeroSlot }>()

// One flat list so every line of the terminal can be staggered in CSS
const lines = computed(() => [
  ...props.slotContent.terminal.flatMap((entry) => [{ kind: 'cmd' as const, text: entry.command }, ...entry.output.map((text) => ({ kind: 'out' as const, text }))]),
  { kind: 'prompt' as const, text: '' },
])
</script>

<template>
  <section class="hero">
    <ShaderBackdrop variant="hero" />

    <div class="inner">
      <div class="copy">
        <p class="sg-eyebrow">{{ slotContent.eyebrow }}</p>
        <h1 class="title sg-display">
          <span v-for="line in slotContent.titleLines" :key="line" class="line">{{ line }}</span>
        </h1>
        <p class="bio">{{ slotContent.bio }}</p>
        <div class="actions">
          <a class="sg-button" :href="slotContent.primaryCta.href">{{ slotContent.primaryCta.label }}</a>
          <a class="sg-button sg-button--ghost" :href="slotContent.secondaryLink.href">{{ slotContent.secondaryLink.label }}</a>
        </div>
      </div>

      <div class="terminal sg-mono" role="img" :aria-label="`Terminal: ${slotContent.terminal.map((t) => t.command).join(', ')}`">
        <div class="chrome" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="screen" aria-hidden="true">
          <template v-for="(line, index) in lines" :key="index">
            <p v-if="line.kind === 'cmd'" class="cmd line-in" :style="{ '--i': index }"><span class="prompt">$</span> {{ line.text }}</p>
            <p v-else-if="line.kind === 'out'" class="out line-in" :style="{ '--i': index }">{{ line.text }}</p>
            <p v-else class="cmd line-in" :style="{ '--i': index }"><span class="prompt">$</span> <span class="cursor"></span></p>
          </template>
        </div>
      </div>
    </div>

    <div class="foot sg-mono">
      <span>{{ slotContent.footer.location }}</span>
      <a class="scroll" href="#work">Scroll ↓</a>
      <span class="summary">{{ slotContent.footer.summary }}</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding: 6rem var(--sg-pad) 1.5rem;
  isolation: isolate;
}

.inner {
  position: relative;
  display: grid;
  gap: 2.5rem;
  margin-block: auto;
}

.copy {
  display: grid;
  justify-items: start;
  gap: 1.25rem;
}

.title {
  display: grid;
  font-size: clamp(2rem, 9.4vw, 2.5rem);
  line-height: 1.25;
}

.bio {
  max-width: 34rem;
  color: var(--sg-muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.terminal {
  overflow: hidden;
  width: 100%;
  max-width: 38.5rem;
  border: 1px solid var(--sg-line);
  border-radius: 1rem;
  background: rgb(0 0 0 / 0.72);
  backdrop-filter: blur(12px);
  font-size: 0.9375rem;
  line-height: 1.7;
}

.chrome {
  display: flex;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--sg-line);
}

.chrome i {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #ff5f57;
}

.chrome i:nth-child(2) {
  background: #febc2e;
}

.chrome i:nth-child(3) {
  background: #28c840;
}

.screen {
  padding: 1rem 1.25rem 1.25rem;
}

.screen p {
  overflow-wrap: anywhere;
}

.prompt {
  color: var(--sg-accent);
}

.out {
  color: var(--sg-muted);
}

.cursor {
  display: inline-block;
  width: 0.5rem;
  height: 1em;
  background: var(--sg-accent);
  vertical-align: text-bottom;
}

.foot {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  margin-top: 2.5rem;
  color: var(--sg-muted);
  font-size: 0.875rem;
}

.summary {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  .cursor {
    animation: blink 1.1s steps(1) infinite;
  }

  .copy > *,
  .terminal {
    animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .copy > :nth-child(2) {
    animation-delay: 0.08s;
  }

  .copy > :nth-child(3) {
    animation-delay: 0.16s;
  }

  .copy > :nth-child(4) {
    animation-delay: 0.24s;
  }

  .terminal {
    animation-delay: 0.3s;
  }

  /* CSS, not GSAP: it keeps its timing while the shader is busy on the main thread, so the text is never stuck half-faded */
  .line-in {
    animation: type-in 0.5s ease-out both;
    animation-delay: calc(0.8s + var(--i) * 0.2s);
  }
}

@keyframes type-in {
  from {
    opacity: 0;
    transform: translateX(-0.875rem);
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
}

@media (min-width: 64rem) {
  .hero {
    min-height: max(56.25rem, 100svh);
    padding-block: 7rem 2rem;
  }

  .inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 38.5rem);
    align-items: center;
    gap: 3rem;
  }

  .copy {
    gap: 1.5rem;
  }

  .title {
    font-size: clamp(2.25rem, 2.8vw, 2.75rem);
    line-height: 1.25;
  }

  .bio {
    font-size: 1.25rem;
  }

  .summary {
    display: inline;
  }
}
</style>
