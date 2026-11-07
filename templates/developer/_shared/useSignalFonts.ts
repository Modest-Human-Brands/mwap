import { useHead } from '#imports'

/** The typefaces of the Signal template: the brand font (loaded by the site head) for all text, JetBrains Mono for code, versions and chips */
export function useSignalFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap' },
    ],
  })
}
