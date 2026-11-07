export default defineEventHandler(async (event) => {
  requireApiKey(event)
  const orgId = requireOrgId(event)

  const slug = getRouterParam(event, 'slug') ?? ''
  const existing = await getSite(slug)
  // Another organization's site answers like a missing one, so its slug is not revealed
  if (!existing || existing.orgId !== orgId) throw createError({ statusCode: 404, statusMessage: `No site found for slug: "${slug}"` })

  // Only a site saved through the API can be deleted; the built-in example and Notion rows are changed at their source
  if (!(await isStoredSite(slug))) throw createError({ statusCode: 409, statusMessage: `Site "${slug}" is not stored through the API and cannot be deleted here` })

  await deleteSite(slug)
  setResponseStatus(event, 204)
  return null
})
