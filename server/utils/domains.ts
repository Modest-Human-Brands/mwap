const TTL_MS = 30_000

let cache: { at: number; map: Map<string, string> } | undefined

/** Drops the domain map so this process sees a write at once; other processes catch up within the TTL */
export function invalidateDomains() {
  cache = undefined
}

async function domainMap(): Promise<Map<string, string>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.map

  const map = new Map<string, string>()
  // Every request goes through the host lookup: it must keep working while Notion is down
  for (const site of await listSites({ tolerant: true })) for (const domain of site.domains) map.set(domain, site.slug)
  cache = { at: Date.now(), map }
  return map
}

/** Slug of the site that owns this apex domain */
export async function getSlugByDomain(domain: string): Promise<string | undefined> {
  return (await domainMap()).get(domain)
}

/** A domain belongs to one site; a site may keep the domains it already has */
export async function assertDomainsFree(domains: string[], slug: string): Promise<void> {
  for (const site of await listSites()) {
    if (site.slug === slug) continue
    const taken = domains.find((domain) => site.domains.includes(domain))
    if (taken) throw createError({ statusCode: 409, statusMessage: `Domain "${taken}" is already used by site "${site.slug}"` })
  }
}
