import type { z } from 'zod'

export interface TemplateDefinition {
  id: string
  label: string
  shortLabel: string
  category: string | null
  description: string
  /** Schema of the template payload (`data`); brand is shared and validated separately */
  schema: z.ZodType
  /** Fills whatever the payload leaves out */
  placeholders: Record<string, unknown>
}

const placeholderPage = (name: string) => ({ title: `{{ ${name} title }}`, description: `{{ ${name} description }}`, sections: [] })

export const templates: Record<string, TemplateDefinition> = {
  'studio-v1': {
    id: 'studio-v1',
    label: 'Studio',
    shortLabel: 'Studio',
    category: 'Studios',
    description: 'Brand site for film and photo studios with Home, Projects and About pages built from hero, projects, pricing and contact sections.',
    schema: studioDataSchema,
    placeholders: {
      seo: { ogImage: 'https://placehold.co/1200x630/png', canonicalUrl: 'https://example.com' },
      navigation: [],
      pages: { home: placeholderPage('home'), projects: placeholderPage('projects'), about: placeholderPage('about') },
    },
  },
}
