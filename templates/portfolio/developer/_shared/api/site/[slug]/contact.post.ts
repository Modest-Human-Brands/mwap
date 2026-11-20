import { z } from 'zod'
import { requireTemplateSite } from '~~/server/utils/template-site'
import { relayForm } from '~~/server/utils/form-relay'
import { developerTemplates } from '~~/templates/portfolio/developer'

// Shared by every developer template: they all carry data.contact
const OWNER = developerTemplates.map(({ id }) => id)

const bodySchema = z.strictObject({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  message: z.string().trim().min(1).max(4000),
  company: z.string().trim().max(120).optional(),
})

export default defineEventHandler(async (event) => {
  const site = await requireTemplateSite(event, OWNER)
  return relayForm(event, { schema: bodySchema, endpoint: (site.data as { contact?: { bookingEndpoint?: string } }).contact?.bookingEndpoint, kind: 'contact', slug: site.slug })
})
