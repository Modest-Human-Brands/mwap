import type { TemplateDefinition } from '~~/templates/types'
import { sample } from './sample'
import { microverseDataSchema, type MicroverseData } from './schema'

// No Vue imports here: the server reads this file. The component is registered in templates/components.ts
export const microverseV1: TemplateDefinition<MicroverseData> = {
  id: 'portfolio-photographer-microverse',
  label: 'Photographer · Microverse',
  shortLabel: 'Microverse',
  category: 'Portfolios',
  description:
    'Red and black photography studio on molten, light-driven WebGL: a looping hero reel, a pinned photo gallery, a 3D video ring, a physics-tag bento and packages, plus a page for every photo and video.',
  schema: microverseDataSchema,
  sample,
  notFoundImage: () => undefined,
}
