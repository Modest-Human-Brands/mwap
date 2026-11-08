import { useHead } from '#imports'

/** The Editorial template has no fixed typefaces: the brand font (loaded by the site head) drives all text */
export function useEditorialFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
  })
}
