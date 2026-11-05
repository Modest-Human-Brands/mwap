/** Site paths (`/projects`) live under `/<slug>` unless the site is served on its own domain; anchors and absolute links stay as they are */
export function useSiteHref() {
  const base = inject<string>('siteBase', '')
  return (href: string) => (href.startsWith('/') && !href.startsWith('//') ? (href === '/' && base ? base : `${base}${href}`) : href)
}
