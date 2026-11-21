/**
 * The templates link their pages with plain anchors (they are server-rendered and work without scripts). Once the client has mounted,
 * a click on one of them for a page of this app goes through the router instead of a full reload: no white flash, and the view
 * transition of app.vue plays between the pages. Everything else (new tabs, downloads, files, other sites, the API) is left to the browser.
 */
export default defineNuxtPlugin(() => {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download') || anchor.origin !== location.origin) return

    const { pathname, search, hash } = anchor
    if (pathname.startsWith('/api/') || pathname.startsWith('/_') || /\.[a-z0-9]{2,5}$/i.test(pathname)) return
    // A jump inside the page is the scroll library's (or the browser's) business
    if (hash && pathname === location.pathname && search === location.search) return

    event.preventDefault()
    navigateTo(pathname + search + hash)
  })
})
