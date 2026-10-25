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
 * (`enabled: false`) and its content edited; only the card lists (items, tiers, features, links) can grow or
 * shrink, within limits. Unknown keys are rejected at every level.
 */
const slot = <T extends z.ZodRawShape>(shape: T) => z.strictObject({ enabled: z.boolean(), ...shape })

export const heroSlotSchema = slot({
  title: z.string(),
  subtitle: z.string(),
  cta: linkSchema,
  mediaUrl: z.url(),
})

export const projectsSlotSchema = slot({
  title: z.string(),
  subtitle: z.string().optional(),
  cta: linkSchema.optional(),
  items: z
    .array(
      z.strictObject({
        title: z.string(),
        category: z.string(),
        description: z.string(),
        imageUrl: z.url(),
      })
    )
    .min(1)
    .max(12),
})

export const pricingSlotSchema = slot({
  title: z.string(),
  subtitle: z.string().optional(),
  tiers: z
    .array(
      z.strictObject({
        name: z.string(),
        price: z.string(),
        description: z.string(),
        features: z.array(z.string()).min(1).max(8),
        cta: linkSchema,
        highlighted: z.boolean().optional(),
      })
    )
    .min(1)
    .max(4),
})

/** Used for both the "story" and the "contact" slot */
export const aboutContactSlotSchema = slot({
  title: z.string(),
  body: z.string(),
  contact: z.strictObject({
    email: z.email(),
    phone: z.string().optional(),
    links: z.array(linkSchema).max(6).optional(),
  }),
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

/** Payload of the `studio-v1` template */
export const studioDataSchema = z.strictObject({
  seo: z.object({
    ogImage: z.url(),
    canonicalUrl: z.url(),
    keywords: z.array(z.string()).optional(),
  }),
  navigation: z.array(linkSchema),
  pages: z.strictObject({
    home: page({ hero: heroSlotSchema, projects: projectsSlotSchema, pricing: pricingSlotSchema, contact: aboutContactSlotSchema }),
    projects: page({ projects: projectsSlotSchema, contact: aboutContactSlotSchema }),
    about: page({ hero: heroSlotSchema, story: aboutContactSlotSchema, contact: aboutContactSlotSchema }),
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
  data: studioDataSchema,
  domains: domainsSchema,
  updatedAt: z.string(),
})
