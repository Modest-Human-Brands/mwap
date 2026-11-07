import { useHead } from '#imports'

/** The typefaces of the Signal template: Exo 2 for headings (the brand font is the body font), JetBrains Mono for code, versions and chips */
export function useSignalFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap' },
    ],
  })
}
