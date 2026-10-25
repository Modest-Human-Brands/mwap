// Mock registry, validated against the shared schema. Replaced by Notion later.
const projectItems = [
  {
    title: 'Neon Drift',
    category: 'Narrative Short',
    description: 'Shot on anamorphic primes across a neon-lit city at night.',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop&q=80',
  },
  {
    title: 'Vanguard Echoes',
    category: 'Docuseries',
    description: 'Four parts on the underground synth builders of Berlin.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&fit=crop&q=80',
  },
  {
    title: 'Harbor Light',
    category: 'Brand Campaign',
    description: 'A launch film and still series for a coastal lifestyle label.',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&fit=crop&q=80',
  },
  {
    title: 'Reel to Reel',
    category: 'Documentary',
    description: 'A portrait of the last analog film archive in the city.',
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&fit=crop&q=80',
  },
  {
    title: 'Last Screening',
    category: 'Narrative Short',
    description: 'One night, one empty theater, one unfinished story.',
    imageUrl: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&fit=crop&q=80',
  },
  {
    title: 'Cut & Color',
    category: 'Behind the Scenes',
    description: 'Inside our post-production pipeline, from rough cut to final grade.',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&fit=crop&q=80',
  },
]

const pricingSection = {
  type: 'pricing',
  id: 'pricing',
  title: 'Pricing',
  subtitle: 'Simple packages, tailored on request.',
  tiers: [
    {
      name: 'Spark',
      price: 'from $2,500',
      description: 'A single short film or photo set.',
      features: ['1 day shoot', 'Edit and color', '1 revision round'],
      cta: { label: 'Get started', href: '#contact' },
    },
    {
      name: 'Campaign',
      price: 'from $8,000',
      description: 'A full campaign with multiple cutdowns.',
      features: ['3 day shoot', 'Hero film and cutdowns', 'Photo set', '2 revision rounds'],
      cta: { label: 'Get started', href: '#contact' },
      highlighted: true,
    },
    {
      name: 'Series',
      price: 'Custom',
      description: 'Episodic or long-form production.',
      features: ['Dedicated crew', 'Multi-episode planning', 'Post-production pipeline'],
      cta: { label: 'Talk to us', href: '#contact' },
    },
  ],
}

const contactSection = {
  type: 'about-contact',
  id: 'contact',
  title: 'Contact',
  body: 'Tell us about your project and we will reply within two working days.',
  contact: {
    email: 'hello@northlight.example.com',
    phone: '+1 555 010 0199',
    links: [{ label: 'Instagram', href: 'https://instagram.com/' }],
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockSites: Record<string, any> = {
  'northlight-studio': {
    slug: 'northlight-studio',
    brand: {
      name: 'Northlight Studio',
      logoUrl: 'https://api.iconify.design/lucide/aperture.svg?color=%23FB3737&width=64&height=64',
      faviconUrl: 'https://api.iconify.design/lucide/aperture.svg?color=%23FB3737',
      fontFamily: 'Oxanium',
      colors: {
        primary: '#FB3737',
        secondary: '#262626',
        accent: '#F24067',
        background: '#171717',
        text: '#F8FAFC',
      },
    },
    seo: {
      ogImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=630&fit=crop&q=80',
      canonicalUrl: 'https://northlight.example.com',
      keywords: ['film production', 'photography studio', 'brand films'],
    },
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Contact', href: '#contact' },
    ],
    pages: {
      home: {
        title: 'Northlight Studio | Film & Photo Production',
        description: 'Independent film and photography studio producing cinematic brand stories, documentaries and campaigns.',
        sections: [
          {
            type: 'hero',
            id: 'hero',
            title: 'Stories Worth Watching.',
            subtitle: 'An independent studio crafting films, series and campaigns with cinematic precision.',
            cta: { label: 'See our work', href: '/projects' },
            mediaUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&fit=crop&q=80',
          },
          {
            type: 'projects',
            id: 'projects',
            title: 'Featured Work',
            subtitle: 'Recent productions across narrative, documentary and commercial.',
            cta: { label: 'View all projects', href: '/projects' },
            items: projectItems.slice(0, 3),
          },
          pricingSection,
          contactSection,
        ],
      },
      projects: {
        title: 'Projects | Northlight Studio',
        description: 'Films, series and campaigns produced by Northlight Studio.',
        sections: [
          {
            type: 'projects',
            id: 'projects',
            title: 'All Projects',
            subtitle: 'Narrative, documentary and commercial work from the studio.',
            items: projectItems,
          },
          contactSection,
        ],
      },
      about: {
        title: 'About | Northlight Studio',
        description: 'Meet the directors, cinematographers and editors behind Northlight Studio.',
        sections: [
          {
            type: 'hero',
            id: 'hero',
            title: 'A Small Team With Big Frames.',
            subtitle: 'Directors, cinematographers and editors who care about craft more than volume.',
            cta: { label: 'Start a project', href: '#contact' },
            mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&fit=crop&q=80',
          },
          {
            type: 'about-contact',
            id: 'about',
            title: 'Our Story',
            body: 'Northlight began as two friends with one camera. Today we are a small independent studio producing narrative films, documentaries and brand campaigns for clients who want their story told with care.',
            contact: { email: 'hello@northlight.example.com' },
          },
          contactSection,
        ],
      },
    },
  },
}

const SEED_UPDATED_AT = '2026-01-01T00:00:00.000Z'

// Built-in example sites; a stored site with the same slug takes precedence
const seeds: Record<string, SitePayload> = Object.fromEntries(
  Object.entries(mockSites).map(([slug, { slug: _slug, brand, ...data }]) => [
    slug,
    siteSchema.parse({ slug, templateId: 'studio-v1', brand, data: migrateLegacyData(templates['studio-v1']!.sample, data), updatedAt: SEED_UPDATED_AT }),
  ])
)

const storage = () => useStorage('sites')
const key = (slug: string) => `${slug}.json`

// Sites stored before custom domains, organizations and fixed layouts existed have no `domains` or `orgId`, and pages with a `sections` list
function withDomains(site: SitePayload): SitePayload {
  const template = templates[site.templateId]
  const data = template && isLegacyData(site.data) ? (migrateLegacyData(template.sample, site.data as unknown as Record<string, unknown>) as unknown as StudioData) : site.data
  return { ...site, data, domains: site.domains ?? [], orgId: site.orgId ?? DEFAULT_ORG_ID }
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
  return (await listSites({ tolerant: true })).flatMap((site) => Object.keys(site.data.pages).map((page) => (page === 'home' ? `/${site.slug}` : `/${site.slug}/${page}`)))
}
