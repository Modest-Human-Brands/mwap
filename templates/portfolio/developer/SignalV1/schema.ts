import { z } from 'zod'
import { linkSchema, page, slot, image, longText, video } from '~~/templates/_shared/schema'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date such as 2026-03-02')
const labelled = <T extends z.ZodRawShape>(shape: T) => z.strictObject({ eyebrow: z.string(), title: z.string(), ...shape })

export const heroSlotSchema = slot({
  eyebrow: z.string(),
  titleLines: z.array(z.string()).min(1).max(4),
  bio: longText(),
  primaryCta: linkSchema,
  secondaryLink: linkSchema,
  // Lines of the terminal window: a command and what it prints
  terminal: z
    .array(z.strictObject({ command: z.string(), output: z.array(z.string()).max(6) }))
    .min(1)
    .max(8),
  footer: z.strictObject({ location: z.string(), summary: longText() }),
})

export const introSlotSchema = slot({
  body: longText(),
  stats: z
    .array(z.strictObject({ value: z.string(), label: z.string() }))
    .min(2)
    .max(4),
})

// The cards of this slot are `data.projects`
export const workSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  stackLabel: z.string(),
  openLabel: z.string(),
})

export const systemsSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  items: z
    .array(z.strictObject({ name: z.string(), description: z.string(), tags: z.string(), href: z.string().optional() }))
    .min(1)
    .max(8),
})

export const careerSlotSchema = slot({
  experience: labelled({
    intro: longText(),
    items: z
      .array(
        z.strictObject({
          period: z.string(),
          location: z.string(),
          company: z.string(),
          role: z.string(),
          highlights: z.array(z.string()).min(1).max(5),
          stack: z.string(),
        })
      )
      .min(1)
      .max(6),
  }),
  education: labelled({
    pursuing: z.strictObject({ label: z.string(), degree: z.string(), institute: z.string(), details: z.string() }),
    certificates: z.array(z.strictObject({ name: z.string(), issuer: z.string(), year: z.string(), credentialId: z.string().optional(), url: z.url().optional() })).max(6),
  }),
  hackathons: labelled({
    items: z.array(z.strictObject({ label: z.string(), name: z.string(), description: z.string(), stack: z.string(), url: z.url().optional() })).max(6),
  }),
  openSource: labelled({
    contributions: z.array(z.strictObject({ name: z.string(), description: z.string(), url: z.url().optional() })).max(6),
    writing: z.array(z.strictObject({ title: z.string(), meta: z.string(), url: z.url().optional() })).max(6),
  }),
})

export const stackSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  columns: z
    .array(z.strictObject({ title: z.string(), items: z.string() }))
    .min(1)
    .max(4),
})

export const contactSlotSchema = slot({
  title: z.string(),
  note: longText(),
  legal: z.string(),
})

export const projectSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, digits and single hyphens'),
  name: z.string(),
  summary: longText(),
  posterUrl: image(),
  // Played muted and looped on the card and the project page; the poster shows until it loads, with reduced motion, and in previews
  videoUrl: video().optional(),
  stack: z.array(z.string()).min(1).max(8),
  version: z.string(),
  updated: isoDate,
  status: z.string(),
  url: z.url(),
  overview: longText(),
  capabilities: z
    .array(z.strictObject({ title: z.string(), text: longText() }))
    .min(1)
    .max(6),
  releases: z
    .array(z.strictObject({ version: z.string(), date: isoDate, current: z.boolean().optional() }))
    .min(1)
    .max(10),
})

/** Payload of the `developer-signal` template */
export const signalDataSchema = z.strictObject({
  seo: z.object({
    ogImage: image(),
    canonicalUrl: z.url(),
    keywords: z.array(z.string()).optional(),
  }),
  navigation: z.array(linkSchema).min(1).max(6),
  contact: z.strictObject({
    email: z.email(),
    links: z
      .array(z.strictObject({ label: z.string(), url: z.url() }))
      .max(6)
      .optional(),
    bookingEndpoint: z.url().optional(),
  }),
  // Each project also has its own page at `work/<slug>`
  projects: z.array(projectSchema).min(1).max(6),
  pages: z.strictObject({
    home: page('Home', {
      hero: heroSlotSchema,
      intro: introSlotSchema,
      work: workSlotSchema,
      systems: systemsSlotSchema,
      career: careerSlotSchema,
      stack: stackSlotSchema,
      contact: contactSlotSchema,
    }),
  }),
})

export type SignalData = z.infer<typeof signalDataSchema>
export type SignalHomePage = SignalData['pages']['home']
export type SignalProject = z.infer<typeof projectSchema>
export type HeroSlot = SignalHomePage['hero']
export type IntroSlot = SignalHomePage['intro']
export type WorkSlot = SignalHomePage['work']
export type SystemsSlot = SignalHomePage['systems']
export type CareerSlot = SignalHomePage['career']
export type StackSlot = SignalHomePage['stack']
export type ContactSlot = SignalHomePage['contact']
