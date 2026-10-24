import { z } from 'zod'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Expected a hex color')
const fontFamily = z.string().regex(/^[A-Za-z0-9 ]{1,60}$/, 'Expected a plain font family name')
const href = z.string().regex(/^(#|\/|https?:\/\/|mailto:|tel:)/, 'Expected an anchor, path, http(s), mailto or tel link')

const linkSchema = z.object({
  label: z.string(),
  href,
})

const heroSectionSchema = z.object({
  type: z.literal('hero'),
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  cta: linkSchema,
  mediaUrl: z.url(),
})

const projectsSectionSchema = z.object({
  type: z.literal('projects'),
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  cta: linkSchema.optional(),
  items: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      description: z.string(),
      imageUrl: z.url(),
    })
  ),
})

const pricingSectionSchema = z.object({
  type: z.literal('pricing'),
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  tiers: z.array(
    z.object({
      name: z.string(),
      price: z.string(),
      description: z.string(),
      features: z.array(z.string()),
      cta: linkSchema,
      highlighted: z.boolean().optional(),
    })
  ),
})

const aboutContactSectionSchema = z.object({
  type: z.literal('about-contact'),
  id: z.string(),
  title: z.string(),
  body: z.string(),
  contact: z.object({
    email: z.email(),
    phone: z.string().optional(),
    links: z.array(linkSchema).optional(),
  }),
})

export const sectionSchema = z.discriminatedUnion('type', [heroSectionSchema, projectsSectionSchema, pricingSectionSchema, aboutContactSectionSchema])

export const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  sections: z.array(sectionSchema),
})

export const siteSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  brand: z.object({
    name: z.string(),
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
  }),
  seo: z.object({
    ogImage: z.url(),
    canonicalUrl: z.url(),
    keywords: z.array(z.string()).optional(),
  }),
  navigation: z.array(linkSchema),
  pages: z.object({
    home: pageSchema,
    projects: pageSchema,
    about: pageSchema,
  }),
})
