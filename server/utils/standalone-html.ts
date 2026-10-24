/**
 * Turns a server-rendered app page into a static, embeddable document: no scripts (it must not hydrate
 * outside of the app) and absolute asset URLs (it is rendered somewhere else, e.g. an iframe's srcdoc).
 */
export function toStandaloneHtml(html: string, origin: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/g, '')
    .replace(/<link\b[^>]*\brel="(?:modulepreload|prefetch)"[^>]*>/g, '')
    .replace(/<link\b[^>]*\brel="canonical"[^>]*>/g, '')
    .replace(/(\b(?:href|src)=")\/(?!\/)/g, `$1${origin}/`)
}
