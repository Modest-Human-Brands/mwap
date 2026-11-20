export default defineEventHandler(async (event) => {
  const { orgId, userId } = requireAccess(event)

  const slug = getRouterParam(event, 'slug') ?? ''
  const existing = await getSite(slug)
  // Another organization's site answers like a missing one, so its slug is not revealed
  if (!existing || existing.orgId !== orgId) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  // The site is the caller's organization's, so it is not hidden: another user of it is told no
  assertOwner(existing, userId)

  const { templateId, brand, data, domains, googleAnalyticsId } = parseSiteInput(await readBody(event), {}, { event, slug })
  await assertDomainsFree(domains, slug, orgId)

  const site: SitePayload = {
    slug,
    orgId,
    templateId,
    brand,
    data,
    domains,
    ...(googleAnalyticsId && { googleAnalyticsId }),
    ...(existing.createdBy && { createdBy: existing.createdBy }),
    updatedBy: userId,
    updatedAt: new Date().toISOString(),
  }
  await saveSite(site)

  return site
})
