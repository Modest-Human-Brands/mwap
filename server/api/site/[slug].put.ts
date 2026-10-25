export default defineEventHandler(async (event) => {
  requireApiKey(event)
  const orgId = requireOrgId(event)

  const slug = getRouterParam(event, 'slug') ?? ''
  const existing = await getSite(slug)
  // Another organization's site answers like a missing one, so its slug is not revealed
  if (!existing || existing.orgId !== orgId) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  const { templateId, brand, data, domains } = parseSiteInput(await readBody(event), {})
  await assertDomainsFree(domains, slug)

  const site: SitePayload = { slug, orgId, templateId, brand, data, domains, updatedAt: new Date().toISOString() }
  await saveSite(site)

  return site
})
