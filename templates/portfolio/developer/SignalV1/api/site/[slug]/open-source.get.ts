import type { H3Event } from 'h3'
import type { SignalData } from '~~/templates/portfolio/developer/SignalV1/schema'
import { requireTemplateSite, cacheTemplateRead } from '~~/server/utils/template-site'
import { signalV1 } from '~~/templates/portfolio/developer/SignalV1'

const OWNER = [signalV1.id]
const read = async (event: H3Event) => {
  const site = await requireTemplateSite(event, OWNER)
  cacheTemplateRead(event)
  return site.data as unknown as SignalData
}

export default defineEventHandler(async (event) => {
  const { maintainer, contributions, writing } = (await read(event)).pages.home.career.openSource
  return { maintainer, contributions, writing }
})
