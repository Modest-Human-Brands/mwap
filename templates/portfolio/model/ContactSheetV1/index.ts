import type { TemplateDefinition } from '~~/templates/types'
import { sample } from './sample'
import { contactSheetDataSchema, type ContactSheetData } from './schema'

// No Vue imports here: the server reads this file. The component is registered in templates/components.ts
export const contactSheetV1: TemplateDefinition<ContactSheetData> = {
  id: 'portfolio-model-contact-sheet',
  label: 'Model · Contact Sheet',
  shortLabel: 'Contact Sheet',
  category: 'Portfolios',
  description:
    'Single-page portfolio for fashion and editorial models: cover, work index with preview, contact sheet, comp card and booking, built from cover, index, sheet, comp card, booking and footer sections.',
  schema: contactSheetDataSchema,
  sample,
  notFoundImage: (data) => data.pages.home.cover.imageUrl,
}
