export default defineEventHandler(() => Object.values(templates).map(({ id, label, shortLabel, category, description }) => ({ id, label, shortLabel, category, description })))
