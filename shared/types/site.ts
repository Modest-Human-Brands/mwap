import type { z } from 'zod'
import type { bookingSlotSchema, brandSchema, compCardSlotSchema, contactSheetDataSchema, coverSlotSchema, footerSlotSchema, indexSlotSchema, sheetSlotSchema, siteSchema } from '../utils/site'

export type SitePayload = z.infer<typeof siteSchema>
export type BrandPayload = z.infer<typeof brandSchema>
export type ContactSheetData = z.infer<typeof contactSheetDataSchema>
export type PageKey = keyof ContactSheetData['pages']
export type PagePayload = ContactSheetData['pages'][PageKey]
export type CoverSlot = z.infer<typeof coverSlotSchema>
export type IndexSlot = z.infer<typeof indexSlotSchema>
export type SheetSlot = z.infer<typeof sheetSlotSchema>
export type CompCardSlot = z.infer<typeof compCardSlotSchema>
export type BookingSlot = z.infer<typeof bookingSlotSchema>
export type FooterSlot = z.infer<typeof footerSlotSchema>
