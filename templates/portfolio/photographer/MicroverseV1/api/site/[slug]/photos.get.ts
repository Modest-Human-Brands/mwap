import type { H3Event } from 'h3'
import { z } from 'zod'
import type { MicroverseData } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import { requireTemplateSite, cacheTemplateRead } from '~~/server/utils/template-site'
import { microverseV1 } from '~~/templates/portfolio/photographer/MicroverseV1'

const OWNER = [microverseV1.id]
const read = async (event: H3Event) => {
  const site = await requireTemplateSite(event, OWNER)
  cacheTemplateRead(event)
  return site.data as unknown as MicroverseData
}

const bool = z.enum(['true', 'false']).transform((value) => value === 'true')
const querySchema = z.object({ category: z.string().trim().min(1).optional(), gallery: bool.optional(), featured: bool.optional() })

export default defineEventHandler(async (event) => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) throw validationError(parsed.error.issues.map(({ path, message, code }) => ({ field: path.join('.'), message, code })))
  const { category, gallery, featured } = parsed.data

  let photos = (await read(event)).photos
  if (category) photos = photos.filter((photo) => photo.category.toLowerCase() === category.toLowerCase())
  if (gallery !== undefined) photos = photos.filter((photo) => photo.gallery === gallery)
  if (featured !== undefined) {
    photos = photos.filter((photo) => (photo.featured !== null) === featured)
    // The featured position is the order of the bento, not the order of the site
    if (featured) photos = photos.toSorted((a, b) => a.featured! - b.featured!)
  }
  return photos
})
