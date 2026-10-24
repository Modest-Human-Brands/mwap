function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Fills everything the input leaves out from the placeholders; arrays and scalars of the input win as a whole */
export function mergeWithPlaceholders<T>(placeholders: T, input: unknown): T {
  if (!isPlainObject(placeholders) || !isPlainObject(input)) return (input === undefined ? placeholders : input) as T

  const merged: Record<string, unknown> = { ...placeholders }
  for (const [key, value] of Object.entries(input)) {
    merged[key] = key in placeholders ? mergeWithPlaceholders((placeholders as Record<string, unknown>)[key], value) : value
  }
  return merged as T
}
