import type { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the registry holds templates of different payload types
export interface TemplateDefinition<Data = any> {
  id: string
  label: string
  shortLabel: string
  category: string | null
  description: string
  /** Schema of the template payload (`data`); brand is shared and validated separately */
  schema: z.ZodType
  /** Complete, valid payload with neutral wording: fills whatever a caller leaves out and is returned to clients to prefill an editor */
  sample: Record<string, unknown>
  /** Picture the 404 page of a site may show; templates whose 404 has no picture leave it out */
  notFoundImage?: (data: Data) => string | undefined
}
