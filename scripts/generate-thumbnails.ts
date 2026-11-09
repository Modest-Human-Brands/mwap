// Renders the home page of every template with its sample content to public/templates/<id>.png: the static thumbnails the
// template picker shows. Needs a production server (the dev server injects styles with scripts, which previews do not run):
// `bun run build`, then `node .output/server/index.mjs` with PORT and NUXT_APP_SECRET set, and Chrome or Edge installed.
//
//   THUMBNAIL_BASE_URL=http://localhost:3000 bun run thumbnails
//
//   bun run thumbnails                   every template
//   bun run thumbnails <template id>     one template
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const BASE_URL = process.env.THUMBNAIL_BASE_URL ?? 'http://localhost:3000'
const OUTPUT_DIR = new URL('../public/templates/', import.meta.url)
const SIZE = { width: 1440, height: 900 }

const icon = (name: string, color: string) => `https://api.iconify.design/lucide/${name}.svg?color=${encodeURIComponent(color)}`

// A neutral brand per template, in the colors the template is designed for
const brands: Record<string, unknown> = {
  'portfolio-model-contact-sheet': {
    name: 'Sample Model',
    logoUrl: icon('aperture', '#FF3B1F'),
    faviconUrl: icon('aperture', '#FF3B1F'),
    fontFamily: 'Geist',
    colors: { primary: '#FF3B1F', secondary: '#EEEAE0', accent: '#E8A33D', background: '#0E0E0C', text: '#F2EFE6' },
  },
  'portfolio-psychiatrist-editorial': {
    name: 'Sample Clinic',
    logoUrl: icon('heart-pulse', '#2E7C7B'),
    faviconUrl: icon('heart-pulse', '#2E7C7B'),
    fontFamily: 'Outfit',
    colors: { primary: '#E7B66B', secondary: '#10303A', accent: '#2E7C7B', background: '#F4F7F6', text: '#14262B' },
  },
  'portfolio-developer-signal': {
    name: 'Sample Dev',
    logoUrl: icon('terminal', '#5BBBFF'),
    faviconUrl: icon('terminal', '#5BBBFF'),
    fontFamily: 'Exo 2',
    colors: { primary: '#0593FA', secondary: '#262626', accent: '#5BBBFF', background: '#171717', text: '#F8FAFC' },
  },
}

const only = process.argv[2]
const ids = Object.keys(brands).filter((id) => !only || id === only)
if (!ids.length) throw new Error(`Unknown template "${only}". Known: ${Object.keys(brands).join(', ')}`)

await mkdir(OUTPUT_DIR, { recursive: true })
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : 'chrome' })

try {
  for (const templateId of ids) {
    const response = await fetch(`${BASE_URL}/api/site/template/preview`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ templateId, brand: brands[templateId] }),
    })
    if (!response.ok) throw new Error(`${templateId}: preview answered ${response.status}`)
    const { html } = (await response.json()) as { html: string }

    const page = await browser.newPage({ viewport: SIZE })
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await writeFile(new URL(`${templateId}.png`, OUTPUT_DIR), await page.screenshot({ type: 'png' }))
    await page.close()
    console.info(`[thumbnail] ${templateId}`)
  }
} finally {
  await browser.close()
}
