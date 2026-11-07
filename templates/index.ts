import type { TemplateDefinition } from './types'
import { portfolioTemplates } from './portfolio'
import { psychiatristTemplates } from './psychiatrist'

export type { TemplateDefinition } from './types'

// One line per category; the id of a template is its key
export const templates: Record<string, TemplateDefinition> = Object.fromEntries([...portfolioTemplates, ...psychiatristTemplates].map((template) => [template.id, template]))
