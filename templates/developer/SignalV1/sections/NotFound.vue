<script setup lang="ts">
import { useSignalFonts } from '~~/templates/developer/_shared/useSignalFonts'
import ShaderBackdrop from './ShaderBackdrop.vue'

// The picture is not used: this 404 is type on the shader
defineProps<{
  brandName: string
  imageUrl?: string
  homeHref: string
}>()

useSignalFonts()
</script>

<template>
  <div class="sg">
    <main class="page">
      <ShaderBackdrop variant="swirl" />
      <a class="logo sg-display" :href="homeHref">{{ brandName }}</a>

      <div class="body">
        <p class="sg-eyebrow">Error 404</p>
        <h1 class="title sg-display">404.<br />This page wandered off the map.</h1>
      </div>

      <a class="sg-button back" :href="homeHref">Back home <span aria-hidden="true">→</span></a>
    </main>
  </div>
</template>

<style src="../signal.css"></style>

<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  min-height: 100svh;
  padding: 1.5rem var(--sg-pad) 3rem;
  isolation: isolate;
}

.logo {
  position: relative;
  font-size: 1rem;
}

.body {
  position: relative;
  display: grid;
  gap: 1rem;
  margin-block: auto;
}

.title {
  max-width: 11em;
  font-size: clamp(2.5rem, 12vw, 3.5rem);
  line-height: 1.2;
}

.back {
  position: relative;
}

@media (min-width: 64rem) {
  .page {
    padding-block: 1.5rem 3.5rem;
  }
}
</style>
