import { z } from 'zod'
import { requireTemplateSite } from '~~/server/utils/template-site'
import { relayForm } from '~~/server/utils/form-relay'
import { developerTemplates } from '~~/templates/portfolio/developer'

// Shared by every developer template: they all carry data.contact
const OWNER = developerTemplates.map(({ id }) => id)

const bodySchema = z.strictObject({ email: z.email() })

export default defineEventHandler(async (event) => {
  const site = await requireTemplateSite(event, OWNER)
  return relayForm(event, { schema: bodySchema, endpoint: (site.data as { contact?: { newsletterEndpoint?: string } }).contact?.newsletterEndpoint, kind: 'newsletter', slug: site.slug })
})
