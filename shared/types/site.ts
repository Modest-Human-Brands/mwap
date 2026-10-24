import type { z } from 'zod'
import type { pageSchema, sectionSchema, siteSchema } from '../utils/site'

export type SitePayload = z.infer<typeof siteSchema>
export type PagePayload = z.infer<typeof pageSchema>
export type PageKey = keyof SitePayload['pages']
export type SiteSection = z.infer<typeof sectionSchema>
export type SiteSectionOf<T extends SiteSection['type']> = Extract<SiteSection, { type: T }>
