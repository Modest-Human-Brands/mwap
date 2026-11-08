import type { Component } from 'vue'

// Only the app reads this file: the server must never import a .vue file, so it stays apart from the registry in index.ts.
// One entry per template id, loaded on demand.
export const templateComponents: Record<string, () => Promise<Component>> = {
  'portfolio-model-contact-sheet': () => import('./portfolio/model/ContactSheetV1/component.vue'),
  'portfolio-psychiatrist-editorial': () => import('./portfolio/psychiatrist/EditorialV1/component.vue'),
  'portfolio-developer-signal': () => import('./portfolio/developer/SignalV1/component.vue'),
}

/** Page shown in the look of the template when a page of its site does not exist */
export const templateNotFound: Record<string, () => Promise<Component>> = {
  'portfolio-model-contact-sheet': () => import('./portfolio/model/ContactSheetV1/sections/NotFound.vue'),
  'portfolio-psychiatrist-editorial': () => import('./portfolio/psychiatrist/EditorialV1/sections/NotFound.vue'),
  'portfolio-developer-signal': () => import('./portfolio/developer/SignalV1/sections/NotFound.vue'),
}
