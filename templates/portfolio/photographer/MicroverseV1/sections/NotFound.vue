<script setup lang="ts">
import CausticsCanvas from './CausticsCanvas.vue'

// The picture is not used: this 404 is the lost frame, out of focus, on the molten glow
defineProps<{
  brandName: string
  imageUrl?: string
  homeHref: string
}>()
</script>

<template>
  <div class="mv">
    <main class="page">
      <CausticsCanvas position="full" />
      <a class="logo" :href="homeHref">{{ brandName }}</a>
      <div class="body">
        <h1 class="code">404</h1>
        <p class="message">This frame is out of focus. The page you're looking for doesn't exist.</p>
        <a class="back" :href="homeHref"><span aria-hidden="true">←</span> BACK TO HOME</a>
      </div>
    </main>
  </div>
</template>

<style src="../microverse.css"></style>

<style scoped>
.page {
  position: relative;
  display: grid;
  min-height: 100svh;
  place-items: center;
  padding: 1.5rem;
  overflow: hidden;
  isolation: isolate;
  background: var(--mv-bg);
}

.logo {
  position: absolute;
  top: 1.75rem;
  left: 1.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.code {
  font-size: clamp(8rem, 38vw, 18.75rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #fff;
  mix-blend-mode: overlay;
  filter: blur(1px);
}

.message {
  max-width: 24rem;
  margin-top: 1.5rem;
  color: #cbd5e1;
  font-size: 1.25rem;
  text-shadow: 0 1px 14px rgb(0 0 0 / 0.85);
}

.back {
  margin-top: 2.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-decoration: underline;
  text-underline-offset: 0.35em;
  text-shadow: 0 1px 14px rgb(0 0 0 / 0.85);
}

.back:hover {
  color: var(--mv-hot);
}

@media (min-width: 880px) {
  .logo {
    top: 2.5rem;
    left: 4rem;
  }

  .message {
    max-width: none;
    margin-top: 1.5rem;
  }
}
</style>
