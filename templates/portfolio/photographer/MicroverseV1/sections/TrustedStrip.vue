<script setup lang="ts">
// A film strip of client logos at the foot of the hero: sprocket holes above and below, the logos scroll left on a 40 s loop
// (paused on hover and with reduced motion) and a black cap on the right carries the label.
defineProps<{ label: string; clients: { name: string; logoUrl: string }[] }>()
</script>

<template>
  <div class="strip" role="group" :aria-label="label">
    <div class="track" aria-hidden="false">
      <ul v-for="copy in 2" :key="copy" class="logos" :aria-hidden="copy === 2 ? 'true' : undefined">
        <li v-for="client in clients" :key="client.name + copy">
          <img :src="client.logoUrl" :alt="copy === 1 ? client.name : ''" width="44" height="44" loading="lazy" />
        </li>
      </ul>
    </div>
    <div class="cap" aria-hidden="true">
      <i class="slash"></i><i class="slash"></i><i class="slash hot"></i>
      <p class="label">{{ label }}</p>
    </div>
  </div>
</template>

<style scoped>
.strip {
  position: relative;
  height: 5.5rem;
  overflow: hidden;
  background:
    repeating-linear-gradient(90deg, transparent 0 0.6875rem, color-mix(in srgb, #fff 28%, transparent) 0.6875rem 1.5625rem, transparent 1.5625rem 2.25rem) 0.6875rem 0.4375rem / 100% 0.4375rem
      no-repeat,
    repeating-linear-gradient(90deg, transparent 0 0.6875rem, color-mix(in srgb, #fff 28%, transparent) 0.6875rem 1.5625rem, transparent 1.5625rem 2.25rem) 0.6875rem 4.625rem / 100% 0.4375rem
      no-repeat,
    linear-gradient(90deg, var(--mv-red), rgb(8 3 3 / 0.92) 32%, rgb(0 0 0 / 0.92));
}

.track {
  position: absolute;
  top: 1.25rem;
  left: 0;
  display: flex;
  width: max-content;
  animation: scroll 40s linear infinite;
}

.strip:hover .track {
  animation-play-state: paused;
}

.logos {
  display: flex;
  flex: none;
  gap: 4.5rem;
  padding-left: 4rem;
}

.logos:last-child {
  padding-right: 0;
}

.logos li {
  flex: none;
  width: 2.75rem;
  height: 2.75rem;
  overflow: hidden;
  border-radius: 999px;
  background: #fff;
}

.logos img {
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  object-fit: contain;
}

@keyframes scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }
}

/* The cap hides the logos behind a slanted edge. The slashes lean at the same angle (tan 25deg x the strip height = --lean),
   so a thin black gap runs along each of them and the logos slide out from behind the first one. */
.cap {
  --lean: 2.565rem;
  --w: 0.625rem;

  position: absolute;
  inset: 0 0 0 auto;
  width: 14rem;
  background: #000;
  clip-path: polygon(var(--lean) 0, 100% 0, 100% 100%, 0 100%);
}

.slash {
  position: absolute;
  top: 0;
  left: 0.5rem;
  width: calc(var(--lean) + var(--w));
  height: 100%;
  background: var(--mv-red);
  clip-path: polygon(var(--lean) 0, 100% 0, var(--w) 100%, 0 100%);
}

.slash:nth-of-type(2) {
  left: 1.75rem;
}

.slash.hot {
  left: 3rem;
  background: var(--mv-hot);
}

.label {
  position: absolute;
  top: 50%;
  left: 7.25rem;
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1;
  white-space: nowrap;
  text-transform: uppercase;
  transform: translateY(-50%);
}

@media (min-width: 880px) {
  .cap {
    width: 20rem;
  }

  .label {
    left: 8.5rem;
    font-size: 1.375rem;
  }
}
</style>
