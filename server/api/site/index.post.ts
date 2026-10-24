export default defineEventHandler(async (event) => {
  requireApiKey(event)

  const { slug, templateId, brand, data, domains } = parseSiteInput(await readBody(event), { slug: slugSchema })

  if (await getSite(slug)) throw createError({ statusCode: 409, statusMessage: `Site "${slug}" already exists` })
  await assertDomainsFree(domains, slug)

  const site: SitePayload = { slug, templateId, brand, data, domains, updatedAt: new Date().toISOString() }
  await saveSite(site)

  setResponseStatus(event, 201)
  setHeader(event, 'Location', `/api/site/${slug}`)
  return site
})
