// Used by the preview page while it renders; the token is single-use and expires after 30 seconds
export default defineEventHandler((event) => {
  const site = takePreview(getRouterParam(event, 'token') ?? '')
  if (!site) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  return site
})
