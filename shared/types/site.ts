import type { z } from 'zod'
import type { aboutContactSlotSchema, brandSchema, heroSlotSchema, pricingSlotSchema, projectsSlotSchema, siteSchema, studioDataSchema } from '../utils/site'

export type SitePayload = z.infer<typeof siteSchema>
export type BrandPayload = z.infer<typeof brandSchema>
export type StudioData = z.infer<typeof studioDataSchema>
export type PageKey = keyof StudioData['pages']
export type PagePayload = StudioData['pages'][PageKey]
export type HeroSlot = z.infer<typeof heroSlotSchema>
export type ProjectsSlot = z.infer<typeof projectsSlotSchema>
export type PricingSlot = z.infer<typeof pricingSlotSchema>
export type AboutContactSlot = z.infer<typeof aboutContactSlotSchema>
