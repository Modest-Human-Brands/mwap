import type { z } from 'zod'
import type { brandSchema, pageSchema, sectionSchema, siteSchema, studioDataSchema } from '../utils/site'

export type SitePayload = z.infer<typeof siteSchema>
export type BrandPayload = z.infer<typeof brandSchema>
export type StudioData = z.infer<typeof studioDataSchema>
export type PagePayload = z.infer<typeof pageSchema>
export type PageKey = keyof StudioData['pages']
export type SiteSection = z.infer<typeof sectionSchema>
export type SiteSectionOf<T extends SiteSection['type']> = Extract<SiteSection, { type: T }>
