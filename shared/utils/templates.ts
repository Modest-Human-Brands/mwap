// The registry lives in /templates; this re-export makes it auto-imported in app and server
import { canonicalTemplateId as canonical, templates as registry } from '../../templates'

export const templates = registry
export const canonicalTemplateId = canonical
export type { TemplateDefinition } from '../../templates'
