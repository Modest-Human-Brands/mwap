import { z } from 'zod'

const href = z.string().regex(/^(#|\/|https?:\/\/|mailto:|tel:)/, 'Expected an anchor, path, http(s), mailto or tel link')

export const linkSchema = z.strictObject({
  label: z.string(),
  href,
})

/**
 * The layout of a template is fixed: a page has named slots, never a list of sections. A slot can be hidden
 * (`enabled: false`) and its content edited; only the card lists (items, frames, measurements, links) can grow or
 * shrink, within limits. Unknown keys are rejected at every level.
 */
export const slot = <T extends z.ZodRawShape>(shape: T) => z.strictObject({ enabled: z.boolean(), ...shape })

export const page = <T extends z.ZodRawShape>(slots: T) => z.strictObject({ title: z.string(), description: z.string(), ...slots })
