/** `#0ea5e9` / `#0ea` / `#0ea5e9ff` -> [14, 165, 233] (alpha is ignored) */
function hexToRgb(hex: string): [number, number, number] {
  const digits = hex.slice(1)
  const full = digits.length <= 4 ? [...digits].map((d) => d + d).join('') : digits
  const value = parseInt(full.slice(0, 6), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

const channels = (hex: string) => hexToRgb(hex).join(' ')

/** Text color that stays readable on top of `hex`: black on light colors, white on dark ones (WCAG relative luminance) */
function onColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? '0 0 0' : '255 255 255'
}

/** Icon, font and the brand variables (`--brand-*`) every template styles itself with */
export function useBrandHead(brand: MaybeRefOrGetter<BrandPayload>) {
  useHead(() => {
    const { colors, faviconUrl, fontFamily } = toValue(brand)

    // Browser-drawn parts (scrollbars, form controls) follow the brand background, not the visitor's OS
    const scheme = onColor(colors.background) === '255 255 255' ? 'dark' : 'light'

    return {
      titleTemplate: '%s',
      meta: [
        { name: 'color-scheme', content: scheme },
        { name: 'theme-color', content: colors.background },
      ],
      link: [
        { rel: 'icon', href: faviconUrl },
        { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap` },
      ],
      style: [
        {
          // Hex values for plain CSS, RGB channels for Tailwind (opacity modifiers); on-primary and on-secondary are the readable text colors on top of those colors
          textContent: `:root{color-scheme:${scheme};--brand-primary:${colors.primary};--brand-secondary:${colors.secondary};--brand-accent:${colors.accent};--brand-bg:${colors.background};--brand-text:${colors.text};--brand-primary-rgb:${channels(colors.primary)};--brand-secondary-rgb:${channels(colors.secondary)};--brand-accent-rgb:${channels(colors.accent)};--brand-bg-rgb:${channels(colors.background)};--brand-text-rgb:${channels(colors.text)};--brand-on-primary-rgb:${onColor(colors.primary)};--brand-on-secondary-rgb:${onColor(colors.secondary)};--brand-font:'${fontFamily}',sans-serif;}`,
        },
      ],
    }
  })
}

export function useSiteHead(site: MaybeRefOrGetter<SitePayload>, page: PagePayload) {
  // `meta` is private runtime config: it only exists during SSR
  const buildTime = useRuntimeConfig().meta?.buildTime

  useBrandHead(() => toValue(site).brand)

  useSeoMeta({
    title: page.title,
    description: page.description,
    ogTitle: page.title,
    ogDescription: page.description,
    ogImage: () => toValue(site).data.seo.ogImage,
    ogSiteName: () => toValue(site).brand.name,
  })

  useSchemaOrg([
    defineWebSite({
      name: () => toValue(site).brand.name,
      url: () => toValue(site).data.seo.canonicalUrl,
    }),
    defineWebPage({
      name: page.title,
      description: page.description,
      datePublished: buildTime || undefined,
      dateModified: buildTime || undefined,
    }),
  ])
}
