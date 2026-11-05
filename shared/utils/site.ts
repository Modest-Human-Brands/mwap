import { z } from 'zod'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Expected a hex color')
const fontFamily = z.string().regex(/^[A-Za-z0-9 ]{1,60}$/, 'Expected a plain font family name')
const href = z.string().regex(/^(#|\/|https?:\/\/|mailto:|tel:)/, 'Expected an anchor, path, http(s), mailto or tel link')

const linkSchema = z.strictObject({
  label: z.string(),
  href,
})

/**
 * The layout of a template is fixed: a page has named slots, never a list of sections. A slot can be hidden
 * (`enabled: false`) and its content edited; only the card lists (items, frames, measurements, links) can grow or
 * shrink, within limits. Unknown keys are rejected at every level.
 */
const slot = <T extends z.ZodRawShape>(shape: T) => z.strictObject({ enabled: z.boolean(), ...shape })

export const coverSlotSchema = slot({
  title: z.string(),
  tagline: z.string(),
  label: z.string(),
  availability: z.string().optional(),
  imageUrl: z.url(),
  portraitUrl: z.url(),
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
        imageUrl: z.url(),
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
        imageUrl: z.url(),
        circled: z.boolean().optional(),
      })
    )
    .min(1)
    .max(16),
})

export const compCardSlotSchema = slot({
  title: z.string(),
  portraitUrl: z.url(),
  measurements: z
    .array(z.strictObject({ label: z.string(), value: z.string() }))
    .min(1)
    .max(10),
  stats: z.array(z.strictObject({ value: z.string(), label: z.string() })).max(3),
  download: linkSchema,
})

export const bookingSlotSchema = slot({
  title: z.string(),
  intro: z.string(),
  drawerTitle: z.string(),
  drawerIntro: z.string(),
})

export const footerSlotSchema = slot({
  management: z.strictObject({ name: z.string(), address: z.string() }),
  links: z.array(linkSchema).max(6),
  location: z.string(),
  legal: z.array(linkSchema).max(3),
})

const page = <T extends z.ZodRawShape>(slots: T) => z.strictObject({ title: z.string(), description: z.string(), ...slots })

// "template" and "preview" are fixed routes under /api/site
const RESERVED_SLUGS = new Set(['template', 'preview'])

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Invalid string: must match pattern /^[a-z0-9-]+$/')
  .max(60)
  .refine((slug) => !RESERVED_SLUGS.has(slug), 'Reserved slug')

/** Shared by every template */
export const brandSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.url(),
  faviconUrl: z.url(),
  fontFamily,
  colors: z.object({
    primary: hexColor,
    secondary: hexColor,
    accent: hexColor,
    background: hexColor,
    text: hexColor,
  }),
})

/** Payload of the `contact-sheet` template */
export const contactSheetDataSchema = z.strictObject({
  seo: z.object({
    ogImage: z.url(),
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
    home: page({ cover: coverSlotSchema, index: indexSlotSchema, sheet: sheetSlotSchema, compCard: compCardSlotSchema, booking: bookingSlotSchema, footer: footerSlotSchema }),
  }),
})

/** Lowercase apex hostname; `www.` is not accepted because it always redirects to the apex */
export const domainSchema = z
  .string()
  .regex(/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/, 'Invalid hostname: use a lowercase domain such as "example.com"')
  .refine((domain) => !domain.startsWith('www.'), 'Use the apex domain: www redirects to it')

export const domainsSchema = z.array(domainSchema).max(10).default([])

/** Organization that owns a site; sites without one belong to `default` */
export const DEFAULT_ORG_ID = 'default'
export const orgIdSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Send the organization as a lowercase slug of at most 60 characters')
  .max(60)

export const siteSchema = z.object({
  slug: slugSchema,
  orgId: orgIdSchema.default(DEFAULT_ORG_ID),
  templateId: z.string(),
  brand: brandSchema,
  data: contactSheetDataSchema,
  domains: domainsSchema,
  updatedAt: z.string(),
})
