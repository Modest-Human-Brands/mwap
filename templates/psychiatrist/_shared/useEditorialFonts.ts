import { useHead } from '#imports'

/** The typefaces of the Editorial template: Fraunces for display (soft 0, wonk on, optical size follows the font size), Outfit as the body fallback; the brand font replaces the body font */
export function useEditorialFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400,0,1;1,9..144,400,0,1&family=Outfit:wght@300;400;500&display=swap' },
    ],
  })
}
