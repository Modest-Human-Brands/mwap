import type { z } from 'zod'
import type { brandSchema, siteSchema } from '../utils/site'
import type { ContactSheetData } from '../../templates/portfolio/model/ContactSheetV1/schema'
import type { EditorialData } from '../../templates/portfolio/psychiatrist/EditorialV1/schema'
import type { SignalData } from '../../templates/portfolio/developer/SignalV1/schema'

export type SitePayload = z.infer<typeof siteSchema>
export type BrandPayload = z.infer<typeof brandSchema>
export type PageKey = string
/** What every template page has in common */
export type PagePayload = { title: string; description: string }

/** A site as the component of one template receives it */
export type TemplateSite<Data> = Omit<SitePayload, 'data'> & { data: Data }
export type ContactSheetSite = TemplateSite<ContactSheetData>
export type EditorialSite = TemplateSite<EditorialData>
export type SignalSite = TemplateSite<SignalData>

export type { BookingSlot, CompCardSlot, ContactSheetData, CoverSlot, FooterSlot, IndexSlot, LightboxEntry, SheetSlot } from '../../templates/portfolio/model/ContactSheetV1/schema'
export type { EditorialData } from '../../templates/portfolio/psychiatrist/EditorialV1/schema'
export type { SignalData, SignalProject } from '../../templates/portfolio/developer/SignalV1/schema'
