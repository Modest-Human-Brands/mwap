import type { z } from 'zod'
import type { brandSchema, siteSchema } from '../utils/site'

export type SitePayload = z.infer<typeof siteSchema>
export type BrandPayload = z.infer<typeof brandSchema>
export type { BookingSlot, CompCardSlot, ContactSheetData, CoverSlot, FooterSlot, IndexSlot, LightboxEntry, PageKey, PagePayload, SheetSlot } from '../../templates/portfolio/ContactSheetV1/schema'
