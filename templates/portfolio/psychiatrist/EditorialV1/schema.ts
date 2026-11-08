import { z } from 'zod'
import { linkSchema, page, slot, image, longText } from '~~/templates/_shared/schema'

const closingSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  button: linkSchema,
  details: z.string(),
  legal: z.string(),
})

export const heroSlotSchema = slot({
  eyebrow: z.string(),
  titleLines: z.array(z.string()).min(1).max(3),
  tagline: longText(),
  imageUrl: image(),
  primaryCta: linkSchema,
  secondaryLink: linkSchema,
  rating: z.strictObject({ value: z.string(), caption: z.string() }).optional(),
})

export const tickerSlotSchema = slot({
  items: z.array(z.string()).min(3).max(10),
})

export const statementSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  body: longText(),
  link: linkSchema,
  stats: z
    .array(z.strictObject({ value: z.string(), label: z.string() }))
    .min(2)
    .max(4),
})

export const careSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  areas: z
    .array(z.strictObject({ title: z.string(), description: z.string(), imageUrl: image(), href: z.string() }))
    .min(1)
    .max(6),
})

export const approachSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  imageUrl: image(),
})

export const appointmentSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  note: longText(),
  hoursTitle: z.string(),
  hours: z
    .array(z.strictObject({ days: z.string(), time: z.string() }))
    .min(1)
    .max(7),
  submitLabel: z.string(),
})

export const aboutHeroSlotSchema = slot({
  eyebrow: z.string(),
  titleLines: z.array(z.string()).min(1).max(3),
  intro: longText(),
  link: linkSchema,
  imageUrl: image(),
  badge: z.strictObject({ value: z.string(), label: z.string() }),
})

export const storySlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  columns: z.array(z.string()).min(1).max(2),
})

export const credentialsSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  items: z
    .array(z.strictObject({ title: z.string(), detail: z.string() }))
    .min(1)
    .max(8),
})

export const clinicSlotSchema = slot({
  eyebrow: z.string(),
  titleLines: z.array(z.string()).min(1).max(3),
  body: longText(),
  link: linkSchema,
  tagline: longText(),
})

export const testimonialSlotSchema = slot({
  eyebrow: z.string(),
  quote: z.string(),
  rating: z.number().int().min(1).max(5),
  author: z.string(),
})

/** Payload of the `psychiatrist-editorial` template */
export const editorialDataSchema = z.strictObject({
  seo: z.object({
    ogImage: image(),
    canonicalUrl: z.url(),
    keywords: z.array(z.string()).optional(),
  }),
  navigation: z.array(linkSchema).min(1).max(6),
  // Where the appointment form POSTs to (without it the form opens a mailto link)
  contact: z.strictObject({
    email: z.email(),
    phone: z.string().optional(),
    bookingEndpoint: z.url().optional(),
  }),
  pages: z.strictObject({
    home: page('Home', {
      hero: heroSlotSchema,
      ticker: tickerSlotSchema,
      statement: statementSlotSchema,
      care: careSlotSchema,
      approach: approachSlotSchema,
      appointment: appointmentSlotSchema,
      closing: closingSlotSchema,
    }),
    about: page('About', {
      hero: aboutHeroSlotSchema,
      story: storySlotSchema,
      credentials: credentialsSlotSchema,
      clinic: clinicSlotSchema,
      testimonial: testimonialSlotSchema,
      closing: closingSlotSchema,
    }),
  }),
})

export type EditorialData = z.infer<typeof editorialDataSchema>
export type EditorialPageKey = keyof EditorialData['pages']
export type EditorialHomePage = EditorialData['pages']['home']
export type EditorialAboutPage = EditorialData['pages']['about']
export type EditorialClosingSlot = z.infer<typeof closingSlotSchema>
export type HeroSlot = EditorialHomePage['hero']
export type TickerSlot = EditorialHomePage['ticker']
export type StatementSlot = EditorialHomePage['statement']
export type CareSlot = EditorialHomePage['care']
export type ApproachSlot = EditorialHomePage['approach']
export type AppointmentSlot = EditorialHomePage['appointment']
export type AboutHeroSlot = EditorialAboutPage['hero']
export type StorySlot = EditorialAboutPage['story']
export type CredentialsSlot = EditorialAboutPage['credentials']
export type ClinicSlot = EditorialAboutPage['clinic']
export type TestimonialSlot = EditorialAboutPage['testimonial']
