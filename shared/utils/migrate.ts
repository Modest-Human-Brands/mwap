type Json = Record<string, unknown>

const isRecord = (value: unknown): value is Json => typeof value === 'object' && value !== null && !Array.isArray(value)

/** True for the old payload shape: pages carrying a free `sections` list instead of named slots */
export function isLegacyData(data: unknown): boolean {
  return isRecord(data) && isRecord(data.pages) && Object.values(data.pages).some((page) => isRecord(page) && Array.isArray(page.sections))
}

const slotOf = ({ type, id }: Json) => (type === 'about-contact' ? (id === 'contact' ? 'contact' : 'story') : String(type))

/**
 * Maps a payload in the old `sections` shape onto the template's fixed slots (taken from its sample).
 * The first section of each kind wins; order and repeats are dropped. A slot the old page did not have is
 * kept hidden (`enabled: false`) with the sample content, so the page looks as it did before.
 */
export function migrateLegacyData(sample: Json, data: Json): Json {
  const pages = isRecord(data.pages) ? data.pages : {}
  const migrated: Json = {}

  for (const [key, samplePage] of Object.entries(sample.pages as Record<string, Json>)) {
    const legacy = isRecord(pages[key]) ? pages[key] : {}
    const sections = (Array.isArray(legacy.sections) ? legacy.sections : []).filter(isRecord)
    const page: Json = { title: legacy.title ?? samplePage.title, description: legacy.description ?? samplePage.description }

    for (const [name, sampleSlot] of Object.entries(samplePage)) {
      if (name === 'title' || name === 'description') continue
      const section = sections.find((s) => slotOf(s) === name)
      if (section) {
        const { type: _type, id: _id, ...content } = section
        page[name] = { enabled: true, ...content }
      } else {
        page[name] = { ...(sampleSlot as Json), enabled: false }
      }
    }
    migrated[key] = page
  }

  return { ...data, pages: migrated }
}
