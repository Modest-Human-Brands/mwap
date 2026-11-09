import { createUnifont, providers } from 'unifont'

/** Font families the brand picker offers first, when nothing has been typed. */
export const FEATURED_FONTS = ['Geist', 'Inter', 'Exo 2', 'Roboto', 'Poppins', 'Lato', 'Montserrat', 'Open Sans', 'Playfair Display', 'Merriweather', 'Cormorant Garamond', 'Caveat']

let catalogue: Promise<string[]> | undefined

/** Every Google Fonts family, fetched once per server process. A failed fetch is retried on the next call. */
export function listFontFamilies(): Promise<string[]> {
  catalogue ??= createUnifont([providers.google()])
    .then((unifont) => unifont.listFonts(['google']))
    .then((families) => families ?? [])
    .catch((error) => {
      catalogue = undefined
      throw error
    })
  return catalogue
}

/** `{ family, name }` as the doc service returns it, `name` being the family without spaces. */
export const fontItem = (family: string) => ({ family, name: family.replaceAll(/\s+/g, '') })
