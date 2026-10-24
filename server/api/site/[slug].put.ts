export default defineEventHandler(async (event) => {
  requireApiKey(event)

  const slug = getRouterParam(event, 'slug') ?? ''
  if (!(await getSite(slug))) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  const { templateId, brand, data, domains } = parseSiteInput(await readBody(event), {})
  await assertDomainsFree(domains, slug)

  const site: SitePayload = { slug, templateId, brand, data, domains, updatedAt: new Date().toISOString() }
  await saveSite(site)

  return site
})
