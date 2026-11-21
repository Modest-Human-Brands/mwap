<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  ogType: 'website',
  ogImageWidth: 1280,
  ogImageHeight: 640,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="rgb(var(--brand-primary-rgb, 5 147 250))" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <LazyAppInstallPrompt hydrate-on-idle />
</template>

<style>
/* Page to page: the old page fades and lifts away, the new one settles in (View Transitions API, see experimental.viewTransition) */
::view-transition-old(root) {
  animation: 0.35s cubic-bezier(0.4, 0, 1, 1) both vt-out;
}

::view-transition-new(root) {
  animation: 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both vt-in;
}

@keyframes vt-out {
  to {
    opacity: 0;
    transform: translateY(-0.75rem) scale(0.992);
  }
}

@keyframes vt-in {
  from {
    opacity: 0;
    transform: translateY(1rem) scale(1.004);
  }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}

* {
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: 6px;
  @apply antialiased;
}

*::-webkit-scrollbar {
  @apply block size-[6px] bg-brand-bg;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-brand-text/30;
}

html {
  @apply relative overflow-x-hidden scroll-smooth;
}

body {
  @apply relative min-h-screen overflow-x-hidden bg-brand-bg fill-brand-text font-main text-brand-text;
}

svg.iconify--local {
  @apply !m-0 !box-content;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
