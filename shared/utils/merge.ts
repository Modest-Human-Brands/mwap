function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Fills everything the input leaves out from the template sample; arrays and scalars of the input win as a whole */
export function mergeWithSample<T>(sample: T, input: unknown): T {
  if (!isPlainObject(sample) || !isPlainObject(input)) return (input === undefined ? sample : input) as T

  const merged: Record<string, unknown> = { ...sample }
  for (const [key, value] of Object.entries(input)) {
    merged[key] = key in sample ? mergeWithSample((sample as Record<string, unknown>)[key], value) : value
  }
  return merged as T
}
