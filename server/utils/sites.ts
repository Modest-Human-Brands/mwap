// Built-in example site, validated against the template schema; a stored site with the same slug takes precedence
const SEED_UPDATED_AT = '2026-01-01T00:00:00.000Z'

const seeds: Record<string, SitePayload> = {
  'sample-model': siteSchema.parse({
    slug: 'sample-model',
    templateId: 'portfolio-model-contact-sheet',
    brand: {
      name: 'Sample Model',
      logoUrl: 'https://api.iconify.design/lucide/aperture.svg?color=%23FF3B1F&width=64&height=64',
      faviconUrl: 'https://api.iconify.design/lucide/aperture.svg?color=%23FF3B1F',
      fontFamily: 'Geist',
      colors: {
        primary: '#FF3B1F',
        secondary: '#EEEAE0',
        accent: '#E8A33D',
        background: '#0E0E0C',
        text: '#F2EFE6',
      },
    },
    data: mergeWithSample(templates['portfolio-model-contact-sheet']!.sample, { seo: { canonicalUrl: 'https://samplemodel.example.com' }, contact: { email: 'booking@samplemodel.example.com' } }),
    updatedAt: SEED_UPDATED_AT,
  }),
}

const storage = () => useStorage('sites')
const key = (slug: string) => `${slug}.json`

// Sites stored before custom domains and organizations existed have no `domains` or `orgId`; sites stored under an earlier template id get the current one
function withDomains(site: SitePayload): SitePayload {
  return { ...site, templateId: canonicalTemplateId(site.templateId), domains: site.domains ?? [], orgId: site.orgId ?? DEFAULT_ORG_ID }
}

// Precedence: saved through the API, then a published Notion row, then the built-in example
export async function getSite(slug: string): Promise<SitePayload | undefined> {
  const stored = await storage().getItem<SitePayload>(key(slug))
  if (stored) return withDomains(stored)

  if (notionEnabled()) {
    try {
      const site = (await getNotionSites()).find((s) => s.slug === slug)
      if (site) return site
    } catch (error) {
      // The built-in example stays reachable while Notion is down; anything else cannot be told apart from a missing site
      if (!seeds[slug]) throw error
    }
  }

  return seeds[slug]
}

export async function saveSite(site: SitePayload): Promise<void> {
  await storage().setItem(key(site.slug), site)
  invalidateDomains()
}

/** True for a site saved through the API; the built-in example and Notion rows are not stored here */
export async function isStoredSite(slug: string): Promise<boolean> {
  return (await storage().getItem(key(slug))) != null
}

/** Removes a stored site and frees its domains; a built-in or Notion site of the same slug becomes visible again */
export async function deleteSite(slug: string): Promise<void> {
  await storage().removeItem(key(slug))
  invalidateDomains()
}

/**
 * Every site of every source. `tolerant` leaves the Notion sites out instead of failing when that source
 * is unavailable, for callers (routing, sitemap) that must not break because of it.
 */
export async function listSites({ tolerant = false } = {}): Promise<SitePayload[]> {
  const bySlug = new Map<string, SitePayload>(Object.entries(seeds))

  if (notionEnabled()) {
    try {
      for (const site of await getNotionSites()) bySlug.set(site.slug, site)
    } catch (error) {
      if (!tolerant) throw error
    }
  }

  const storedKeys = await storage().getKeys()
  const stored = await Promise.all(storedKeys.map((k) => storage().getItem<SitePayload>(k)))
  for (const site of stored) if (site) bySlug.set(site.slug, withDomains(site))

  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug))
}

/** Public paths of every page of every site, e.g. `/slug`, `/slug/projects` */
export async function listSitePaths(): Promise<string[]> {
  return (await listSites({ tolerant: true })).flatMap((site) => sitePageKeys(site.data).map((page) => (page === 'home' ? `/${site.slug}` : `/${site.slug}/${page}`)))
}
