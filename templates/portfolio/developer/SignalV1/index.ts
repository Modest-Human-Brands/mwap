import type { TemplateDefinition } from '~~/templates/types'
import { sample } from './sample'
import { signalDataSchema, type SignalData } from './schema'

// No Vue imports here: the server reads this file. The component is registered in templates/components.ts
export const signalV1: TemplateDefinition<SignalData> = {
  id: 'portfolio-developer-signal',
  label: 'Developer · Signal',
  shortLabel: 'Signal',
  category: 'Portfolios',
  description: 'Dark developer portfolio with shader backgrounds: a home page with hero terminal, stats, selected projects, systems, career, stack and contact, plus a page for every project.',
  schema: signalDataSchema,
  sample,
  notFoundImage: () => undefined,
}
