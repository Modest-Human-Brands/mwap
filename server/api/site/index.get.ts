import { z } from 'zod'

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  org: orgIdSchema.optional(),
})

export default defineEventHandler(async (event) => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) throw validationError(parsed.error.issues.map(({ path, message, code }) => ({ field: path.join('.'), message, code })))
  const { limit, offset, org } = parsed.data

  const sites = (await listSites()).filter((site) => !org || site.orgId === org)

  return {
    results: sites.slice(offset, offset + limit).map(({ slug, orgId, templateId, brand, updatedAt }) => ({ slug, orgId, templateId, name: brand.name, updatedAt })),
    pagination: { total: sites.length, limit, offset },
  }
})
