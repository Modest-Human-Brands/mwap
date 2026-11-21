import { z } from 'zod'
import { requireTemplateSite } from '~~/server/utils/template-site'
import { relayForm } from '~~/server/utils/form-relay'
import { developerTemplates } from '~~/templates/portfolio/developer'
import { photographerTemplates } from '~~/templates/portfolio/photographer'

// The portfolio templates whose data.contact has a bookingEndpoint; the others (model, psychiatrist) post to it from the browser
const OWNER = [...developerTemplates, ...photographerTemplates].map(({ id }) => id)

const bodySchema = z.strictObject({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  message: z.string().trim().min(1).max(4000),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
})

export default defineEventHandler(async (event) => {
  const site = await requireTemplateSite(event, OWNER)
  return relayForm(event, { schema: bodySchema, endpoint: (site.data as { contact?: { bookingEndpoint?: string } }).contact?.bookingEndpoint, kind: 'contact', slug: site.slug })
})
