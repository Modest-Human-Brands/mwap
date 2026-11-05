<script setup lang="ts">
import { useContactSheetFonts } from '../../_shared/useContactSheetFonts'
defineProps<{
  brandName: string
  imageUrl: string
  homeHref: string
}>()

useContactSheetFonts()
</script>

<template>
  <div class="cs">
    <header class="nav">
      <a class="brand" :href="homeHref">{{ brandName }}</a>
      <a class="cs-button book" :href="homeHref">Book <span aria-hidden="true">→</span></a>
    </header>

    <main class="main">
      <p class="cs-eyebrow">Frame 404 / Not found</p>
      <h1 class="code" :style="{ '--image': `url(${JSON.stringify(imageUrl)})` }">404</h1>
      <div class="bottom">
        <p class="text">This frame is missing from the sheet.</p>
        <a class="cs-button back" :href="homeHref">Back to the sheet <span aria-hidden="true">→</span></a>
      </div>
    </main>
  </div>
</template>

<style src="../contact-sheet.css"></style>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 var(--cs-pad);
  border-bottom: 1px solid var(--cs-line);
}

.brand {
  font: 400 1.375rem/1 var(--cs-display);
  text-transform: uppercase;
}

.book {
  display: none;
}

.main {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 4rem);
  padding: 3rem var(--cs-pad) 2rem;
}

.code {
  margin: 1.5rem 0 0;
  font: 400 min(59vw, 78vh, 700px) / 0.95 var(--cs-display);
  text-align: center;
  color: var(--brand-text);
}

@supports (background-clip: text) or (-webkit-background-clip: text) {
  .code {
    background:
      var(--image) center / cover no-repeat,
      var(--cs-frame);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: auto;
  padding-top: 2rem;
}

.text {
  max-width: 18rem;
  margin: 0;
  font: 400 clamp(2rem, 5vw, 3rem) / 1.1 var(--cs-serif);
}

.back {
  padding: 1.5rem 3rem;
}

@media (min-width: 48rem) {
  .nav {
    height: 5rem;
  }

  .book {
    display: inline-flex;
    height: 2.75rem;
    padding: 0 2rem;
  }

  .main {
    min-height: calc(100vh - 5rem);
  }

  .bottom {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .back {
    padding: 1.5rem 3rem;
  }
}
</style>
