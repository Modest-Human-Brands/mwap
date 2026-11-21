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

export default defineEventHandler(async (event) => (await read(event)).blogs)
