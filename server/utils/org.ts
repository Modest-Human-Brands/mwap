import type { H3Event } from 'h3'

/** Reads the organization of a write from the x-org-id header; 400 when it is missing or malformed */
export function requireOrgId(event: H3Event): string {
  const result = orgIdSchema.safeParse(getHeader(event, 'x-org-id')?.trim() ?? '')
  if (!result.success) throw validationError([{ field: 'x-org-id', message: result.error.issues[0]!.message, code: 'invalid_format' }])
  return result.data
}
