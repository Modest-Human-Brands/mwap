import { z } from 'zod'
import { linkSchema, page, slot, image, longText, video, publicHttpsUrl } from '~~/templates/_shared/schema'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date such as 2026-03-02')
const isoDateTime = z.iso.datetime({ offset: true })
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
})

export const manifestoSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  body: longText(),
  bullets: z.array(z.string()).min(1).max(6),
})

// The cards of these slots are `data.photos` (gallery: true) and `data.videos`
export const photoGallerySlotSchema = slot({ eyebrow: z.string(), title: z.string() })
export const videoGallerySlotSchema = slot({ eyebrow: z.string(), title: z.string() })
// The tiles are the photos with a featured position
export const featuredSlotSchema = slot({ eyebrow: z.string(), title: z.string(), framesLabel: z.string() })
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

// The pages beyond the home page: each has its own slots; the lists they show are `data.team`, `data.episodes`, `data.blogs` and `data.live`
export const aboutSlotSchema = slot({
  title: z.string(),
  photoUrl: image(),
  // The story in order: a section has an optional heading, a paragraph and a list whose items may start with a bold label
  sections: z
    .array(
      z.strictObject({
        heading: z.string().optional(),
        body: longText().optional(),
        items: z
          .array(z.strictObject({ label: z.string().optional(), text: z.string() }))
          .max(8)
          .optional(),
      })
    )
    .min(1)
    .max(10),
})
export const teamSlotSchema = slot({ eyebrow: z.string(), title: z.string() })
export const projectsSlotSchema = slot({ eyebrow: z.string(), title: z.string(), allLabel: z.string() })
export const listHeaderSlotSchema = slot({ eyebrow: z.string(), title: z.string(), backLabel: z.string() })
export const liveHeaderSlotSchema = slot({ eyebrow: z.string(), title: z.string(), liveLabel: z.string() })
export const liveScheduleSlotSchema = slot({ eyebrow: z.string(), title: z.string(), notifyLabel: z.string() })
export const liveReplaysSlotSchema = slot({ eyebrow: z.string(), title: z.string() })
export const liveOffAirSlotSchema = slot({
  eyebrow: z.string(),
  title: z.string(),
  notifyLabel: z.string(),
  daysLabel: z.string(),
  hoursLabel: z.string(),
  minutesLabel: z.string(),
  secondsLabel: z.string(),
})
export const legalSlotSchema = slot({
  title: z.string(),
  updatedLabel: z.string(),
  updated: isoDate,
  sections: z
    .array(z.strictObject({ heading: z.string(), body: longText() }))
    .min(1)
    .max(20),
})

const articleShape = {
  slug: itemSlug,
  title: z.string(),
  excerpt: z.string(),
  thumbnailUrl: image(),
  publishedAt: isoDate,
  // The article text, one entry per paragraph
  body: z.array(longText()).min(1).max(40),
}
export const episodeSchema = z.strictObject({ ...articleShape, videoUrl: video().optional() })
export const blogSchema = z.strictObject({ ...articleShape, author: z.string() })
export const memberSchema = z.strictObject({ name: z.string(), role: z.string(), photoUrl: image() })
export const liveSchema = z.strictObject({
  // The state is decided here, not by the clock: "live" shows the player, "offline" the countdown to `nextAt`
  status: z.enum(['live', 'offline']),
  streamUrl: video().optional(),
  posterUrl: image(),
  title: z.string(),
  nextAt: isoDateTime,
  timeZone: z.string().max(60),
  timeZoneLabel: z.string().max(10),
  schedule: z.array(z.strictObject({ startsAt: isoDateTime, title: z.string() })).max(6),
  replays: z.array(z.strictObject({ title: z.string(), thumbnailUrl: image(), url: z.url() })).max(8),
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
    team: z.array(memberSchema).min(1).max(8),
    // Each episode has a page at `episode/<slug>`, each post one at `blog/<slug>`
    episodes: z.array(episodeSchema).min(1).max(40),
    blogs: z.array(blogSchema).min(1).max(40),
    live: liveSchema,
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
      about: page('About', { story: aboutSlotSchema, team: teamSlotSchema }),
      projects: page('Projects', { header: projectsSlotSchema }),
      live: page('Live', { header: liveHeaderSlotSchema, schedule: liveScheduleSlotSchema, replays: liveReplaysSlotSchema, offAir: liveOffAirSlotSchema }),
      episode: page('Episodes', { header: listHeaderSlotSchema }),
      blog: page('Blogs', { header: listHeaderSlotSchema }),
      terms: page('Terms', { document: legalSlotSchema }),
      privacy: page('Privacy', { document: legalSlotSchema }),
      cancellation: page('Cancellation', { document: legalSlotSchema }),
      license: page('License', { document: legalSlotSchema }),
    }),
  })
  .refine((data) => unique(data.photos) && unique(data.videos) && unique(data.packages) && unique(data.episodes) && unique(data.blogs), {
    message: 'Slugs must be unique within photos, videos, packages, episodes and blogs',
    path: ['photos'],
  })

export type MicroverseData = z.infer<typeof microverseDataSchema>
export type MicroversePhoto = z.infer<typeof photoSchema>
export type MicroverseVideo = z.infer<typeof videoSchema>
export type MicroversePackage = z.infer<typeof packageSchema>
export type MicroverseEpisode = z.infer<typeof episodeSchema>
export type MicroverseBlog = z.infer<typeof blogSchema>
export type MicroverseMember = z.infer<typeof memberSchema>
export type MicroverseLive = z.infer<typeof liveSchema>
export type MicroversePages = MicroverseData['pages']
export type MicroverseHome = MicroverseData['pages']['home']
