// Hands a validated preview payload to the in-process page render: one-time, short-lived, addressed by an unguessable token
const TTL_MS = 30_000
const previews = new Map<string, { site: SitePayload; expires: number }>()

export function putPreview(site: SitePayload): string {
  const now = Date.now()
  for (const [token, { expires }] of previews) if (expires < now) previews.delete(token)

  const token = crypto.randomUUID()
  previews.set(token, { site, expires: now + TTL_MS })
  return token
}

export function takePreview(token: string): SitePayload | undefined {
  const entry = previews.get(token)
  previews.delete(token)
  return entry && entry.expires >= Date.now() ? entry.site : undefined
}
