import { z } from 'zod'
import { linkSchema, page, slot, image, longText } from '~~/templates/_shared/schema'

export const coverSlotSchema = slot({
  title: z.string(),
  tagline: longText(),
  label: z.string(),
  availability: z.string().optional(),
  imageUrl: image(),
  portraitUrl: image(),
})

export const indexSlotSchema = slot({
  title: z.string(),
  hint: z.string().optional(),
  items: z
    .array(
      z.strictObject({
        title: z.string(),
        category: z.string(),
        year: z.string(),
        description: z.string(),
        imageUrl: image(),
      })
    )
    .min(1)
    .max(12),
})

export const sheetSlotSchema = slot({
  title: z.string(),
  label: z.string().optional(),
  frames: z
    .array(
      z.strictObject({
        label: z.string(),
        imageUrl: image(),
        circled: z.boolean().optional(),
      })
    )
    .min(1)
    .max(16),
})

export const compCardSlotSchema = slot({
  title: z.string(),
  portraitUrl: image(),
  measurements: z
    .array(z.strictObject({ label: z.string(), value: z.string() }))
    .min(1)
    .max(10),
  stats: z.array(z.strictObject({ value: z.string(), label: z.string() })).max(3),
  download: linkSchema,
})

export const bookingSlotSchema = slot({
  title: z.string(),
  intro: longText(),
  drawerTitle: z.string(),
  drawerIntro: z.string(),
})

export const footerSlotSchema = slot({
  management: z.strictObject({ name: z.string(), address: z.string() }),
  links: z.array(linkSchema).max(6),
  location: z.string(),
  legal: z.array(linkSchema).max(3),
})

/** Payload of the `contact-sheet` template */
export const contactSheetDataSchema = z.strictObject({
  seo: z.object({
    ogImage: image(),
    canonicalUrl: z.url(),
    keywords: z.array(z.string()).optional(),
  }),
  navigation: z.array(linkSchema).max(6),
  // Booking email, and where the booking forms POST to (without it they open a mailto link)
  contact: z.strictObject({
    email: z.email(),
    bookingEndpoint: z.url().optional(),
  }),
  pages: z.strictObject({
    home: page('Home', { cover: coverSlotSchema, index: indexSlotSchema, sheet: sheetSlotSchema, compCard: compCardSlotSchema, booking: bookingSlotSchema, footer: footerSlotSchema }),
  }),
})

export type ContactSheetData = z.infer<typeof contactSheetDataSchema>
export type CoverSlot = z.infer<typeof coverSlotSchema>
export type IndexSlot = z.infer<typeof indexSlotSchema>
export type SheetSlot = z.infer<typeof sheetSlotSchema>
export type CompCardSlot = z.infer<typeof compCardSlotSchema>
export type BookingSlot = z.infer<typeof bookingSlotSchema>
export type FooterSlot = z.infer<typeof footerSlotSchema>

/** One picture of the lightbox: an index item or a contact sheet frame */
export interface LightboxEntry {
  kind: 'index' | 'sheet'
  /** Counter shown above the title, e.g. `Frame 03 / 18` */
  frame: string
  title: string
  text: string
  imageUrl: string
}
