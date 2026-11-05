import { useHead } from '#imports'

/** The typefaces of the Contact Sheet template; the brand font is only the body font */
export function useContactSheetFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anton&family=Geist+Mono:wght@400;500&family=Instrument+Serif&display=swap' },
    ],
  })
}
