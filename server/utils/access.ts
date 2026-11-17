import type { H3Event } from 'h3'
import { z } from 'zod'

const userIdSchema = z
  .string()
  .min(1, 'Send who makes the change in x-user-id')
  .max(120, 'x-user-id is at most 120 characters')
  // eslint-disable-next-line no-control-regex -- control characters are exactly what must not pass
  .regex(/^[^\u0000-\u001f\u007f]+$/, 'x-user-id has no control characters')

/** Reads who makes the request from the x-user-id header; 400 when it is missing or malformed */
export function requireUserId(event: H3Event): string {
  const result = userIdSchema.safeParse(getHeader(event, 'x-user-id')?.trim() ?? '')
  if (!result.success) throw validationError([{ field: 'x-user-id', message: result.error.issues[0]!.message, code: 'invalid_format' }])
  return result.data
}

/**
 * What every protected route needs, checked in this order: the API key (401), then the organization and the user (400).
 * The key goes first so a wrong key never learns whether the organization exists.
 */
export function requireAccess(event: H3Event): { orgId: string; userId: string } {
  requireApiKey(event)
  return { orgId: requireOrgId(event), userId: requireUserId(event) }
}

/**
 * Reads are public. A read that sends an API key asks to be scoped to its organization, so the whole check applies
 * (a wrong key is 401, never a quiet fall back to the public answer) and the caller's organization is returned.
 */
export function optionalAccess(event: H3Event): { orgId: string; userId: string } | undefined {
  return getHeader(event, 'x-api-key') === undefined ? undefined : requireAccess(event)
}
