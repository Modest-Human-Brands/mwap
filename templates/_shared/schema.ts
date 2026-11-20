import { z } from 'zod'

const href = z.string().regex(/^(#|\/|https?:\/\/|mailto:|tel:)/, 'Expected an anchor, path, http(s), mailto or tel link')

export const linkSchema = z.strictObject({
  label: z.string(),
  href,
})

const PRIVATE_HOST = /^(localhost|.*\.(localhost|local|internal|lan|home|corp))$/i
const PRIVATE_V4 = /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/

/** An https URL of a public host: the service relays form submissions to it, so it must never reach localhost, a private network or a link-local address */
export const publicHttpsUrl = () =>
  z.url().refine(
    (value) => {
      try {
        const url = new URL(value)
        const host = url.hostname.replace(/^\[|\]$/g, '')
        if (url.protocol !== 'https:' || url.username || url.password) return false
        if (PRIVATE_HOST.test(host) || PRIVATE_V4.test(host)) return false
        // IPv6 literals (loopback, unique local, link-local, mapped addresses) and bare numbers are never public hosts here
        return !host.includes(':') && !/^\d+$/.test(host)
      } catch {
        return false
      }
    },
    { message: 'Use an https URL of a public host (no localhost, private network or credentials)' }
  )

/**
 * Hints for an editor. They travel in the JSON Schema of the template: `title` labels a page or a slot, `widget` says how a
 * string is edited. A string without a widget is a single line; a URL is a link. Media is edited by URL: the service stores no files.
 */
export const image = () => z.url().meta({ widget: 'image' })
export const video = () => z.url().meta({ widget: 'video' })
export const longText = () => z.string().meta({ widget: 'textarea' })

const humanize = (key: string) => {
  const words = key.replace(/([A-Z])/g, ' $1').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/**
 * The layout of a template is fixed: a page has named slots, never a list of sections. A slot can be hidden
 * (`enabled: false`) and its content edited; only the card lists (items, frames, measurements, links) can grow or
 * shrink, within limits. Unknown keys are rejected at every level.
 */
export const slot = <T extends z.ZodRawShape>(shape: T) => z.strictObject({ enabled: z.boolean(), ...shape })

/** A page of `title` (the label of its panel); each slot is titled after its key unless it carries a title of its own */
export const page = <T extends z.ZodRawShape>(title: string, slots: T) => {
  const titled = Object.fromEntries(Object.entries(slots).map(([key, schema]) => [key, schema.meta()?.title ? schema : schema.meta({ title: humanize(key) })])) as unknown as T
  return z.strictObject({ title: z.string(), description: z.string(), ...titled }).meta({ title })
}
