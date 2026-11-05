import type { z } from 'zod'

export interface TemplateDefinition {
  id: string
  label: string
  shortLabel: string
  category: string | null
  description: string
  /** Schema of the template payload (`data`); brand is shared and validated separately */
  schema: z.ZodType
  /** Complete, valid payload with neutral wording: fills whatever a caller leaves out and is returned to clients to prefill an editor */
  sample: Record<string, unknown>
}
