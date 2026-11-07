import type { TemplateDefinition } from '~~/templates/types'
import { sample } from './sample'
import { editorialDataSchema, type EditorialData } from './schema'

// No Vue imports here: the server reads this file. The component is registered in templates/components.ts
export const editorialV1: TemplateDefinition<EditorialData> = {
  id: 'psychiatrist-editorial',
  label: 'Editorial',
  shortLabel: 'Editorial',
  category: 'Psychiatrists',
  description:
    'Two-page website for a psychiatrist: a home page with hero, ticker, statement, areas of care, approach, appointment request and closing, and an about page with story, credentials, clinic and testimonial.',
  schema: editorialDataSchema,
  sample,
  notFoundImage: (data) => data.pages.home.hero.imageUrl,
}
