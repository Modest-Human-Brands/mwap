import { z } from 'zod'

// The payload of a template lives next to it
import { contactSheetDataSchema } from '../../templates/portfolio/model/ContactSheetV1/schema'
import { signalDataSchema } from '../../templates/portfolio/developer/SignalV1/schema'
import { microverseDataSchema } from '../../templates/portfolio/photographer/MicroverseV1/schema'
import { editorialDataSchema } from '../../templates/portfolio/psychiatrist/EditorialV1/schema'

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
  data: z.union([contactSheetDataSchema, editorialDataSchema, signalDataSchema, microverseDataSchema]),
  domains: domainsSchema,
  googleAnalyticsId: googleAnalyticsIdSchema.optional(),
  /** The user (x-user-id) who created the site and who changed it last; sites saved before owners were recorded have neither */
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  updatedAt: z.string(),
})

type SiteData = z.infer<typeof siteSchema>['data']
type PageMeta = { title: string; description: string }

/** Templates with lists of things give each one a page: projects at `work/<slug>`, photos at `photo/<slug>`, videos at `video/<slug>`, episodes at `episode/<slug>`, posts at `blog/<slug>` */
function detailPages(data: SiteData, brandName?: string): { key: string; meta: PageMeta }[] {
  const named = (title: string, description: string): PageMeta => ({ title: brandName ? `${title} | ${brandName}` : title, description })
  return [
    ...('projects' in data ? data.projects.map((p) => ({ key: `work/${p.slug}`, meta: named(p.name, p.summary) })) : []),
    ...('photos' in data ? data.photos.map((p) => ({ key: `photo/${p.slug}`, meta: named(p.title, p.description ?? p.title) })) : []),
    ...('videos' in data ? data.videos.map((v) => ({ key: `video/${v.slug}`, meta: named(v.title, v.description ?? v.title) })) : []),
    ...('episodes' in data ? data.episodes.map((e) => ({ key: `episode/${e.slug}`, meta: named(e.title, e.excerpt) })) : []),
    ...('blogs' in data ? data.blogs.map((b) => ({ key: `blog/${b.slug}`, meta: named(b.title, b.excerpt) })) : []),
  ]
}

/** Every page key of a site payload: the named pages and one per project, photo or video, e.g. `home`, `about`, `work/rune-infer`, `photo/frame-one` */
export function sitePageKeys(data: SiteData): string[] {
  return [...Object.keys(data.pages), ...detailPages(data).map(({ key }) => key)]
}

/** The page `key` of a site payload, or undefined when the template has no such page */
export function sitePage(data: SiteData, key: string, brandName?: string): PageMeta | undefined {
  const pages = data.pages as Record<string, PageMeta>
  if (Object.hasOwn(pages, key)) return pages[key]
  return detailPages(data, brandName).find((page) => page.key === key)?.meta
}
