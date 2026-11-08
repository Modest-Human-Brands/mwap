import type { TemplateDefinition } from './types'
import { portfolioTemplates } from './portfolio'

export type { TemplateDefinition } from './types'

/** Ids the templates had before they were grouped as portfolios; they still resolve, and answer as the current id */
export const LEGACY_TEMPLATE_IDS: Record<string, string> = {
  'contact-sheet': 'portfolio-model-contact-sheet',
  'psychiatrist-editorial': 'portfolio-psychiatrist-editorial',
  'developer-signal': 'portfolio-developer-signal',
}

export const canonicalTemplateId = (id: string) => LEGACY_TEMPLATE_IDS[id] ?? id

// One folder per profession under portfolio/; the id of a template is its key
export const templates: Record<string, TemplateDefinition> = Object.fromEntries(portfolioTemplates.map((template) => [template.id, template]))
