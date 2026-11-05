type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Submit handler of the booking forms: POSTs the brief as JSON to `contact.bookingEndpoint` when the site has one,
 * otherwise opens the visitor's mail app with the brief prefilled. Without JavaScript the form falls back to its own `action`.
 */
export function useBooking(contact: MaybeRefOrGetter<{ email: string; bookingEndpoint?: string }>, subject: MaybeRefOrGetter<string>) {
  const status = ref<Status>('idle')

  async function submit(event: Event) {
    const form = event.target as HTMLFormElement
    const brief = Object.fromEntries([...new FormData(form)].filter(([, value]) => typeof value === 'string' && value.trim())) as Record<string, string>
    const { email, bookingEndpoint } = toValue(contact)

    if (!bookingEndpoint) {
      const body = Object.entries(brief)
        .map(([field, value]) => `${field}: ${value}`)
        .join('\n')
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(toValue(subject))}&body=${encodeURIComponent(body)}`
      return
    }

    status.value = 'sending'
    try {
      await $fetch(bookingEndpoint, { method: 'POST', body: brief })
      status.value = 'sent'
      form.reset()
    } catch {
      status.value = 'error'
    }
  }

  return { status, submit }
}
