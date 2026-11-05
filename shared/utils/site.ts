import { z } from 'zod'

// The payload of a template lives next to it; only one template exists so far
import { contactSheetDataSchema } from '../../templates/portfolio/ContactSheetV1/schema'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Expected a hex color')
const fontFamily = z.string().regex(/^[A-Za-z0-9 ]{1,60}$/, 'Expected a plain font family name')
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

/** Lowercase apex hostname; `www.` is not accepted because it always redirects to the apex */
export const domainSchema = z
  .string()
  .regex(/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/, 'Invalid hostname: use a lowercase domain such as "example.com"')
  .refine((domain) => !domain.startsWith('www.'), 'Use the apex domain: www redirects to it')

/** GA4 measurement id of the property a site reports to */
export const googleAnalyticsIdSchema = z.string().regex(/^G-[A-Z0-9]{6,12}$/, 'Expected a GA4 measurement id such as G-ABC123DEF4')

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
  googleAnalyticsId: googleAnalyticsIdSchema.optional(),
  updatedAt: z.string(),
})
