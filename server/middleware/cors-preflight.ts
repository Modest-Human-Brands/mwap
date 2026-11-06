/**
 * Answers CORS preflights of the API with 204. The API routes are method-specific files (index.get.ts, index.post.ts),
 * so no handler matches OPTIONS and the request would fall through to the public-site route, which 404s on "/api/...".
 * A browser accepts a preflight only with a 2xx, so it is answered here, before any routing. The CORS headers
 * themselves come from the `cors: true` route rule of /api/** (see nuxt.config.ts), so they are not set twice.
 */
export default defineEventHandler((event) => {
  if (event.method !== 'OPTIONS' || !getRequestURL(event).pathname.startsWith('/api/')) return

  setResponseStatus(event, 204)
  return null
})
