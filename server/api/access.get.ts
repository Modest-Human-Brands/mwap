// Checks the details of the "Connect to MWap" screen before they are saved; changes nothing
export default defineEventHandler(async (event) => {
  const { orgId, userId } = requireAccess(event)

  // The answer depends on the key in the request, so it must never come from a cache
  setHeader(event, 'Cache-Control', 'no-store')

  const sites = (await listSites()).filter((site) => site.orgId === orgId).length
  return { organizationId: orgId, userId, sites }
})
