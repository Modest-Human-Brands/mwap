// The registry lives in /templates; this re-export makes it auto-imported in app and server
import { templates as registry } from '../../templates'

export const templates = registry
export type { TemplateDefinition } from '../../templates'
