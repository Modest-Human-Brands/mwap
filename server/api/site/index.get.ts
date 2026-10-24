import { z } from 'zod'

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

export default defineEventHandler(async (event) => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) throw validationError(parsed.error.issues.map(({ path, message, code }) => ({ field: path.join('.'), message, code })))
  const { limit, offset } = parsed.data

  const sites = await listSites()

  return {
    results: sites.slice(offset, offset + limit).map(({ slug, templateId, brand, updatedAt }) => ({ slug, templateId, name: brand.name, updatedAt })),
    pagination: { total: sites.length, limit, offset },
  }
})
