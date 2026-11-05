import type { TemplateDefinition } from './types'
import { portfolioTemplates } from './portfolio'

export type { TemplateDefinition } from './types'

// One line per category; the id of a template is its key
export const templates: Record<string, TemplateDefinition> = Object.fromEntries([...portfolioTemplates].map((template) => [template.id, template]))
