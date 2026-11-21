import { z } from 'zod'
import { linkSchema, page, slot, image, longText, video, publicHttpsUrl } from '~~/templates/_shared/schema'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date such as 2026-03-02')
const itemSlug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, digits and single hyphens')

export const heroSlotSchema = slot({
  eyebrow: z.string(),
  // The headline, one line per entry
  titleLines: z.array(z.string()).min(1).max(3),
  tagline: longText(),
  // The reel: always a looping video, graded red and black; the poster shows until it plays, with reduced motion and in previews
  videoUrl: video(),
  posterUrl: image(),
  ctaLabel: z.string(),
  trustedLabel: z.string(),
  caption: z.string(),
})

export const manifestoSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  body: longText(),
  bullets: z.array(z.string()).min(1).max(6),
  caption: z.string(),
})

// The cards of these slots are `data.photos` (gallery: true) and `data.videos`
export const photoGallerySlotSchema = slot({ eyebrow: z.string(), title: z.string(), caption: z.string() })
export const videoGallerySlotSchema = slot({ eyebrow: z.string(), title: z.string(), caption: z.string() })
// The tiles are the photos with a featured position
export const featuredSlotSchema = slot({ eyebrow: z.string(), title: z.string(), framesLabel: z.string(), caption: z.string() })
// The cards are `data.packages`
export const packagesSlotSchema = slot({ eyebrow: z.string(), title: z.string(), ctaLabel: z.string() })

export const footerSlotSchema = slot({
  wordmark: z.string(),
  legal: z.string(),
  links: z.array(linkSchema).max(6),
})

export const photoSchema = z.strictObject({
  slug: itemSlug,
  title: z.string(),
  description: longText().optional(),
  imageUrl: image(),
  // Width divided by height: 0.6667 is a 2:3 portrait
  aspectRatio: z.number().positive(),
  // The tags of the featured bento filter on this
  category: z.string().min(1),
  // True: the photo is in the pinned gallery
  gallery: z.boolean(),
  // Position in the featured bento (1 first); null when the photo is not featured
  featured: z.number().int().min(1).nullable(),
  mediaId: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  project: z.string().optional(),
})

export const videoSchema = z.strictObject({
  slug: itemSlug,
  title: z.string(),
  description: longText().optional(),
  posterUrl: image(),
  videoUrl: video(),
  aspectRatio: z.number().positive(),
  category: z.string().min(1),
  durationSeconds: z.number().positive(),
  uploadedAt: isoDate.optional(),
  mediaId: z.string().optional(),
})

export const packageSchema = z.strictObject({
  slug: itemSlug,
  title: z.string(),
  subtitle: z.string(),
  // Text, so "custom" is a price too
  price: z.string(),
  unit: z.string(),
  features: z.array(z.string()).min(1).max(10),
})

const unique = (items: { slug: string }[]) => new Set(items.map(({ slug }) => slug)).size === items.length

/** Payload of the `portfolio-photographer-microverse` template */
export const microverseDataSchema = z
  .strictObject({
    seo: z.object({
      ogImage: image(),
      canonicalUrl: z.url(),
      keywords: z.array(z.string()).optional(),
    }),
    navigation: z.array(linkSchema).min(1).max(6),
    contact: z.strictObject({
      email: z.email(),
      phone: z.string().max(40).optional(),
      links: z
        .array(z.strictObject({ label: z.string(), url: z.url() }))
        .max(6)
        .optional(),
      // Where the Book a Session form is relayed to by the service; without it the form opens a mailto link
      bookingEndpoint: publicHttpsUrl().optional(),
    }),
    // Logos of the clients shown under the hero
    trusted: z.array(z.strictObject({ name: z.string(), logoUrl: image() })).max(8),
    // Each photo has a page at `photo/<slug>`, each video one at `video/<slug>`
    photos: z.array(photoSchema).min(1).max(60),
    videos: z.array(videoSchema).min(1).max(30),
    packages: z.array(packageSchema).min(1).max(4),
    pages: z.strictObject({
      home: page('Home', {
        hero: heroSlotSchema,
        manifesto: manifestoSlotSchema,
        photoGallery: photoGallerySlotSchema,
        videoGallery: videoGallerySlotSchema,
        featured: featuredSlotSchema,
        packages: packagesSlotSchema,
        footer: footerSlotSchema,
      }),
    }),
  })
  .refine((data) => unique(data.photos) && unique(data.videos) && unique(data.packages), { message: 'Slugs must be unique within photos, videos and packages', path: ['photos'] })

export type MicroverseData = z.infer<typeof microverseDataSchema>
export type MicroversePhoto = z.infer<typeof photoSchema>
export type MicroverseVideo = z.infer<typeof videoSchema>
export type MicroversePackage = z.infer<typeof packageSchema>
export type MicroverseHome = MicroverseData['pages']['home']
