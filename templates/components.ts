import type { Component } from 'vue'

// Only the app reads this file: the server must never import a .vue file, so it stays apart from the registry in index.ts.
// One entry per template id, loaded on demand.
export const templateComponents: Record<string, () => Promise<Component>> = {
  'contact-sheet': () => import('./portfolio/ContactSheetV1/component.vue'),
  'psychiatrist-editorial': () => import('./psychiatrist/EditorialV1/component.vue'),
}

/** Page shown in the look of the template when a page of its site does not exist */
export const templateNotFound: Record<string, () => Promise<Component>> = {
  'contact-sheet': () => import('./portfolio/ContactSheetV1/sections/NotFound.vue'),
  'psychiatrist-editorial': () => import('./psychiatrist/EditorialV1/sections/NotFound.vue'),
}
