import { useHead } from '#imports'

/** Geist Mono is fixed for the mono labels; the brand font (loaded by the site head) drives all other text */
export function useContactSheetFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap' },
    ],
  })
}
