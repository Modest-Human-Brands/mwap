import type { H3Event } from 'h3'
import type { MicroverseData } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { requireTemplateSite, cacheTemplateRead } from '~~/server/utils/template-site'
import { microverseV1 } from '~~/templates/portfolio/photographer/MicroverseV1'

const OWNER = [microverseV1.id]
const read = async (event: H3Event) => {
  const site = await requireTemplateSite(event, OWNER)
  cacheTemplateRead(event)
  return site.data as unknown as MicroverseData
}

/** A list item with its place in the list: `previous` and `next` wrap around, so the media strip never ends */
const withPlace = <T extends { slug: string }>(items: T[], slug: string) => {
  const index = items.findIndex((item) => item.slug === slug)
  const item = items[index]
  if (!item) return undefined
  return { ...item, index: index + 1, total: items.length, previous: items[(index - 1 + items.length) % items.length]!.slug, next: items[(index + 1) % items.length]!.slug }
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'video') ?? ''
  const video = withPlace((await read(event)).videos, slug)
  if (!video) throw createError({ statusCode: 404, statusMessage: `No video found for slug: "${slug}"` })
  return video
})
