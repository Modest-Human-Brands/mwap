import { z } from 'zod'

export default defineEventHandler((event) => {
  const { id, label, shortLabel, category, description, schema, sample } = getTemplate(getRouterParam(event, 'id'))

  return { id, label, shortLabel, category, description, schema: z.toJSONSchema(schema, { unrepresentable: 'any' }), sample }
})
