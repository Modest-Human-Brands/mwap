import { z } from 'zod'

const querySchema = z.object({
  q: z.string().trim().max(60).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

/** Font families a brand can use, from Google Fonts. Without `q` the featured families, otherwise a name search. */
export default defineEventHandler(async (event) => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) throw validationError(parsed.error.issues.map(({ path, message, code }) => ({ field: path.join('.'), message, code })))
  const { q, limit } = parsed.data

  const families = await listFontFamilies().catch(() => {
    throw createError({ statusCode: 502, statusMessage: 'The font library is unavailable' })
  })
  const needle = q?.toLowerCase()
  if (!needle) return FEATURED_FONTS.filter((family) => families.includes(family)).map(fontItem)
  return families
    .filter((family) => family.toLowerCase().includes(needle))
    .slice(0, limit)
    .map(fontItem)
})
