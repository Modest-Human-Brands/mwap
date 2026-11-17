export default defineEventHandler(async (event) => {
  const { orgId } = requireAccess(event)

  const slug = getRouterParam(event, 'slug') ?? ''
  const existing = await getSite(slug)
  // Another organization's site answers like a missing one, so its slug is not revealed
  if (!existing || existing.orgId !== orgId) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  const { templateId, brand, data, domains, googleAnalyticsId } = parseSiteInput(await readBody(event), {}, { event, slug })
  await assertDomainsFree(domains, slug, orgId)

  const site: SitePayload = { slug, orgId, templateId, brand, data, domains, ...(googleAnalyticsId && { googleAnalyticsId }), updatedAt: new Date().toISOString() }
  await saveSite(site)

  return site
})
