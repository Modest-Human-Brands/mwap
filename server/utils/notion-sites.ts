import { z } from 'zod'
import type { BlockObjectResponse, PageObjectResponse } from '@notionhq/client'

// A site is a published row of the Notion database: `Slug` (title), `Template` (select), `Domains`
// (multi-select or comma separated text) and `Published` (checkbox). The brand and the template payload
// are JSON in the code block(s) of the row's page: { "brand": {...}, "data": {...} }.
const TTL_MS = 60_000
const RETRY_MS = 10_000
const CONCURRENCY = 4

type Property = PageObjectResponse['properties'][string]
type RichText = { plain_text: string }[]

const bodySchema = z.object({ brand: brandSchema, data: z.record(z.string(), z.unknown()).default({}) })

let cache: { sites: SitePayload[]; expires: number } | undefined
let inflight: Promise<SitePayload[]> | undefined
let dataSourceId: string | undefined

export function notionEnabled(): boolean {
  return Boolean(import.meta.env.NOTION_API_KEY && useRuntimeConfig().private.siteNotionDbId)
}

/** The configured id may be a database (resolved to its first data source) or already a data source */
async function resolveDataSourceId(): Promise<string> {
  if (dataSourceId) return dataSourceId

  const configured = useRuntimeConfig().private.siteNotionDbId
  try {
    const database = await notion.databases.retrieve({ database_id: configured })
    dataSourceId = ('data_sources' in database && database.data_sources[0]?.id) || configured
  } catch {
    dataSourceId = configured
  }
  return dataSourceId
}

const text = (richText?: RichText) => (richText ?? []).map((t) => t.plain_text).join('')

function readDomains(property?: Property): string[] {
  const raw = property?.type === 'multi_select' ? property.multi_select.map((o) => o.name) : property?.type === 'rich_text' ? text(property.rich_text).split(',') : []
  return raw.map((d) => d.trim().toLowerCase()).filter(Boolean)
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

/** Organization of a row: its `Organization` relation, as the slugified title of the related page */
async function readOrgId(property: Property | undefined, titles: Map<string, Promise<string>>): Promise<string> {
  const relatedId = property?.type === 'relation' ? property.relation[0]?.id : undefined
  if (!relatedId) return DEFAULT_ORG_ID

  // One lookup per organization and refresh, however many rows point at it
  if (!titles.has(relatedId)) {
    titles.set(
      relatedId,
      notion.pages.retrieve({ page_id: relatedId }).then((related) => {
        const title = 'properties' in related ? Object.values(related.properties).find((p) => p.type === 'title') : undefined
        return slugify(title?.type === 'title' ? text(title.title) : '') || DEFAULT_ORG_ID
      })
    )
  }
  return titles.get(relatedId)!
}

async function pageBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined
  do {
    const response = await notion.blocks.children.list({ block_id: pageId, page_size: 100, start_cursor: cursor })
    blocks.push(...response.results.filter((b): b is BlockObjectResponse => 'type' in b))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)
  return blocks
}

async function toSite(page: PageObjectResponse, orgTitles: Map<string, Promise<string>>): Promise<SitePayload> {
  const slugProperty = page.properties.Slug
  const templateProperty = page.properties.Template
  const slug = slugSchema.parse(slugProperty?.type === 'title' ? text(slugProperty.title).trim() : '')
  const template = getTemplate(templateProperty?.type === 'select' ? templateProperty.select?.name : undefined)
  const domains = domainsSchema.parse(readDomains(page.properties.Domains))
  const orgId = await readOrgId(page.properties.Organization, orgTitles)

  const json = (await pageBlocks(page.id)).map((b) => (b.type === 'code' ? text(b.code.rich_text) : '')).join('')
  const body = bodySchema.parse(JSON.parse(json))
  // Rows written in the old `sections` shape are converted, then filled from the sample like any payload
  const content = isLegacyData(body.data) ? migrateLegacyData(template.sample, body.data) : body.data
  const data = template.schema.parse(mergeWithSample(template.sample, content)) as StudioData

  return { slug, orgId, templateId: template.id, brand: body.brand, data, domains, updatedAt: page.last_edited_time }
}

async function load(): Promise<SitePayload[]> {
  const data_source_id = await resolveDataSourceId()

  // Not `queryAllDataSource`: it swallows errors, and a failed refresh must not look like an empty database
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const response = await notion.dataSources.query({ data_source_id, page_size: 100, start_cursor: cursor, filter: { property: 'Published', checkbox: { equals: true } } })
    pages.push(...response.results.filter((r): r is PageObjectResponse => 'properties' in r))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  const orgTitles = new Map<string, Promise<string>>()
  const sites: SitePayload[] = []
  let next = 0
  // A row that does not validate is skipped, so one bad row cannot take every site down
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, pages.length) }, async () => {
      while (next < pages.length) {
        const page = pages[next++]!
        try {
          sites.push(await toSite(page, orgTitles))
        } catch (error) {
          console.warn(`[notion] skipped row ${page.id}: ${error instanceof Error ? error.message : error}`)
        }
      }
    })
  )

  // On a duplicate slug the earliest edited row wins, so the result does not depend on request order
  const bySlug = new Map<string, SitePayload>()
  for (const site of sites.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))) if (!bySlug.has(site.slug)) bySlug.set(site.slug, site)
  return [...bySlug.values()]
}

/**
 * Published Notion sites, cached for a minute. When a refresh fails the last good copy keeps being served
 * and the refresh is retried shortly; with nothing cached the failure is a 503.
 */
export async function getNotionSites(): Promise<SitePayload[]> {
  if (cache && Date.now() < cache.expires) return cache.sites

  inflight ??= load()
    .then((sites) => {
      cache = { sites, expires: Date.now() + TTL_MS }
      return sites
    })
    .catch((error) => {
      console.error(`[notion] refresh failed: ${error instanceof Error ? error.message : error}`)
      if (!cache) throw createError({ statusCode: 503, statusMessage: 'Site source unavailable' })
      cache.expires = Date.now() + RETRY_MS
      return cache.sites
    })
    .finally(() => {
      inflight = undefined
    })

  return inflight
}
