export default defineEventHandler((event) => {
  // Static thumbnails are plain files (see `bun run thumbnails`), served from the same origin as the API unless a public URL is set
  const origin = (useRuntimeConfig().public.siteUrl || getRequestURL(event).origin).replace(/\/+$/, '')

  return Object.values(templates).map(({ id, label, shortLabel, category, description }) => ({ id, label, shortLabel, category, description, thumbnail: `${origin}/templates/${id}.png` }))
})
