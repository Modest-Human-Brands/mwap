<script setup lang="ts">
import { useEditorialFonts } from '~~/templates/psychiatrist/_shared/useEditorialFonts'

// The picture is not used: this 404 is type on the deep surface
defineProps<{
  brandName: string
  imageUrl?: string
  homeHref: string
}>()

useEditorialFonts()
</script>

<template>
  <div class="ed">
    <main class="page">
      <div class="orb" aria-hidden="true"></div>
      <a class="logo ed-display" :href="homeHref">{{ brandName }}</a>

      <div class="body">
        <p class="ed-eyebrow ed-eyebrow--warm">Error · Page not found</p>
        <h1 class="code ed-display" aria-label="404">404</h1>
      </div>

      <div class="bottom">
        <p class="text">This page took a quiet moment. Let's get you back somewhere calm.</p>
        <a class="ed-button back" :href="homeHref">Back to home <span aria-hidden="true">→</span></a>
      </div>
    </main>
  </div>
</template>

<style src="../editorial.css"></style>

<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.75rem var(--ed-pad) 2.5rem;
  overflow: hidden;
  background: var(--ed-deep);
  color: var(--ed-on-deep);
}

.orb {
  position: absolute;
  right: -30%;
  bottom: -10%;
  width: 90vmax;
  max-width: 50rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ed-teal) 40%, transparent);
  filter: blur(10rem);
  pointer-events: none;
}

.logo {
  position: relative;
  align-self: flex-start;
  font-size: 1.375rem;
  line-height: 1;
  letter-spacing: 0;
}

.body {
  position: relative;
  margin-block: auto;
  padding-top: 4rem;
}

.code {
  margin: 0.5rem 0 0 -0.04em;
  font-size: clamp(10rem, 56vw, 27.5rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
}

.bottom {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
}

.text {
  max-width: 22rem;
  margin: 0;
  color: color-mix(in srgb, var(--ed-on-deep) 85%, var(--ed-deep));
  font-size: 1.25rem;
  line-height: 1.45;
}

@media (min-width: 64rem) {
  .page {
    padding-block: 2.75rem 4.5rem;
  }

  .orb {
    right: -4%;
    bottom: -12%;
  }

  .logo {
    font-size: 1.625rem;
  }

  .body {
    padding-top: 3rem;
  }

  .bottom {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .text {
    max-width: 22rem;
    font-size: 1.375rem;
    line-height: 1.45;
  }

  .back {
    padding: 1.5rem 2.75rem;
    font-size: 1.25rem;
  }
}
</style>
