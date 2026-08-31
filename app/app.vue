<script setup lang="ts">
const {
  app: { buildTime },
  public: { vapidKey },
} = useRuntimeConfig()

const route = useRoute()
const siteSlug = computed(() => route.params.siteSlug as string)

const { data: site } = await useAsyncData(`site-${siteSlug.value}`, () => $fetch(`/api/sites/${siteSlug.value}`))

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: site.value?.brand?.faviconUrl || '/favicon.ico',
    },
    ...(site.value?.brand?.fontFamily
      ? [
          {
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?family=${site.value.brand.fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`,
          },
        ]
      : []),
  ],
  style: [
    {
      children: `
        :root {
          --brand-primary: ${site.value?.brand?.colors?.primary ?? '#2563eb'};
          --brand-secondary: ${site.value?.brand?.colors?.secondary ?? '#1e293b'};
          --brand-accent: ${site.value?.brand?.colors?.accent ?? '#f59e0b'};
          --brand-bg: ${site.value?.brand?.colors?.background ?? '#ffffff'};
          --brand-text: ${site.value?.brand?.colors?.text ?? '#0f172a'};
          --brand-font: '${site.value?.brand?.fontFamily ?? 'Inter'}', sans-serif;
        }
      `,
    },
  ],
})

useSeoMeta({
  ogType: 'profile',
  ogImageWidth: 1280,
  ogImageHeight: 640,
  fbAppId: 966242223397117,
  twitterCard: 'summary_large_image',
  colorScheme: 'light dark',
})

useSchemaOrg([
  defineWebPage({
    datePublished: buildTime,
    dateModified: buildTime,
    author: 'Shirsendu Bairagi',
  }),
  defineWebSite({
    url: site.value?.brand?.name,
    name: site.value?.seo?.canonicalUrl,
    description: site.value?.seo?.metaDescription,
  }),
])

const { $api } = useNuxtApp()
const { isSupported, permissionGranted } = useWebNotification()

async function getExistingSubscription() {
  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    })
  }

  await $api('/api/notification/push/subscribe', {
    method: 'POST',
    body: subscription.toJSON(),
  })

  return subscription
}

const { version } = useAppUpdater({ checkOnStartup: true, autoInstall: true })

onMounted(async () => {
  console.log('App Version', version.value)
  if (isSupported.value && permissionGranted.value) await getExistingSubscription()
})

watch(permissionGranted, async (value) => {
  if (value) await getExistingSubscription()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaAssets />
  <NuxtLoadingIndicator color="#0593FA" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <LazyAppInstallPrompt hydrate-on-idle />
</template>

<style>
* {
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: 6px;
  @apply antialiased;
}

*::-webkit-scrollbar {
  @apply block size-[6px] bg-light-400 dark:bg-dark-400;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-600 dark:bg-dark-600;
}

html {
  @apply relative overflow-x-hidden scroll-smooth;
}

body {
  @apply relative min-h-screen overflow-x-hidden bg-light-400 fill-black font-main text-black dark:bg-dark-400 dark:fill-white dark:text-white;
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
