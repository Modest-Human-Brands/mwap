import { z } from 'zod'

type Issue = { field: string; message: string; code: string }

export function validationError(issues: Issue[]) {
  return createError({ statusCode: 400, statusMessage: 'Bad Request', data: { errors: issues } })
}

const toIssues = (issues: z.core.$ZodIssue[], prefix = ''): Issue[] => issues.map(({ path, message, code }) => ({ field: [...(prefix ? [prefix] : []), ...path].join('.'), message, code }))

export function getTemplate(templateId: unknown): TemplateDefinition {
  const template = typeof templateId === 'string' ? templates[templateId] : undefined
  if (!template) throw createError({ statusCode: 404, statusMessage: 'Template not found' })
  return template
}

const envelopeSchema = z.object({
  templateId: z.string().min(1),
  brand: brandSchema,
  data: z.record(z.string(), z.unknown()).default({}),
  domains: domainsSchema,
})

/**
 * Validates a template + brand + payload body. Missing payload fields are filled from the template
 * sample; every problem is reported at once as 400 with `data.errors`.
 */
export function parseSiteInput<Extra extends z.ZodRawShape>(body: unknown, extra: Extra) {
  const template = getTemplate((body as { templateId?: unknown } | null)?.templateId)
  const parsed = envelopeSchema.extend(extra).safeParse(body)
  const data = mergeWithSample(template.sample, (body as { data?: unknown } | null)?.data)
  const dataResult = template.schema.safeParse(data)

  const issues = [...(parsed.success ? [] : toIssues(parsed.error.issues)), ...(dataResult.success ? [] : toIssues(dataResult.error.issues, 'data'))]
  if (issues.length || !parsed.success || !dataResult.success) throw validationError(issues)

  return { ...parsed.data, template, data: dataResult.data as StudioData }
}
