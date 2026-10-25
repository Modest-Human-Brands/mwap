import type { z } from 'zod'

export interface TemplateDefinition {
  id: string
  label: string
  shortLabel: string
  category: string | null
  description: string
  /** Schema of the template payload (`data`); brand is shared and validated separately */
  schema: z.ZodType
  /** Complete, valid payload with neutral wording: fills whatever a caller leaves out and is returned to clients to prefill an editor */
  sample: Record<string, unknown>
}

export const templates: Record<string, TemplateDefinition> = {
  'studio-v1': {
    id: 'studio-v1',
    label: 'Studio',
    shortLabel: 'Studio',
    category: 'Studios',
    description: 'Brand site for film and photo studios with Home, Projects and About pages built from hero, projects, pricing and contact sections.',
    schema: studioDataSchema,
    sample: {
      seo: {
        ogImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=630&fit=crop&q=80',
        canonicalUrl: 'https://example.com',
      },
      navigation: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Projects',
          href: '/projects',
        },
        {
          label: 'About',
          href: '/about',
        },
        {
          label: 'Pricing',
          href: '/#pricing',
        },
        {
          label: 'Contact',
          href: '#contact',
        },
      ],
      pages: {
        home: {
          title: 'Home | Film & Photo Studio',
          description: 'An independent studio producing films, series and campaigns with cinematic precision.',
          hero: {
            enabled: true,
            title: 'Stories Worth Watching.',
            subtitle: 'An independent studio crafting films, series and campaigns with cinematic precision.',
            cta: {
              label: 'See our work',
              href: '/projects',
            },
            mediaUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&fit=crop&q=80',
          },
          projects: {
            enabled: true,
            title: 'Featured Work',
            subtitle: 'Recent productions across narrative, documentary and commercial.',
            cta: {
              label: 'View all projects',
              href: '/projects',
            },
            items: [
              {
                title: 'City After Dark',
                category: 'Narrative Short',
                description: 'Shot on anamorphic primes across a neon-lit city at night.',
                imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop&q=80',
              },
              {
                title: 'Signal and Noise',
                category: 'Docuseries',
                description: 'Four parts on the people who build instruments for a living.',
                imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&fit=crop&q=80',
              },
              {
                title: 'Quiet Harbor',
                category: 'Brand Campaign',
                description: 'A launch film and still series for a coastal lifestyle label.',
                imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&fit=crop&q=80',
              },
            ],
          },
          pricing: {
            enabled: true,
            title: 'Pricing',
            subtitle: 'Simple packages, tailored on request.',
            tiers: [
              {
                name: 'Starter',
                price: 'from $1,500',
                description: 'A single short film or photo set.',
                features: ['1 day shoot', 'Edit and color', '1 revision round'],
                cta: {
                  label: 'Get started',
                  href: '#contact',
                },
              },
              {
                name: 'Campaign',
                price: 'from $6,000',
                description: 'A full campaign with multiple cutdowns.',
                features: ['3 day shoot', 'Hero film and cutdowns', 'Photo set', '2 revision rounds'],
                cta: {
                  label: 'Get started',
                  href: '#contact',
                },
                highlighted: true,
              },
              {
                name: 'Series',
                price: 'Custom',
                description: 'Episodic or long-form production.',
                features: ['Dedicated crew', 'Multi-episode planning', 'Post-production pipeline'],
                cta: {
                  label: 'Talk to us',
                  href: '#contact',
                },
              },
            ],
          },
          contact: {
            enabled: true,
            title: 'Contact',
            body: 'Tell us about your project and we will reply within two working days.',
            contact: {
              email: 'hello@example.com',
              phone: '+1 555 010 0100',
              links: [
                {
                  label: 'Instagram',
                  href: 'https://instagram.com/',
                },
              ],
            },
          },
        },
        projects: {
          title: 'Projects | Film & Photo Studio',
          description: 'Films, series and campaigns produced by the studio.',
          projects: {
            enabled: true,
            title: 'All Projects',
            subtitle: 'Narrative, documentary and commercial work from the studio.',
            items: [
              {
                title: 'City After Dark',
                category: 'Narrative Short',
                description: 'Shot on anamorphic primes across a neon-lit city at night.',
                imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop&q=80',
              },
              {
                title: 'Signal and Noise',
                category: 'Docuseries',
                description: 'Four parts on the people who build instruments for a living.',
                imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&fit=crop&q=80',
              },
              {
                title: 'Quiet Harbor',
                category: 'Brand Campaign',
                description: 'A launch film and still series for a coastal lifestyle label.',
                imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&fit=crop&q=80',
              },
              {
                title: 'The Long Take',
                category: 'Documentary',
                description: 'A portrait of the last analog film archive in the city.',
                imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&fit=crop&q=80',
              },
              {
                title: 'Last Screening',
                category: 'Narrative Short',
                description: 'One night, one empty theater, one unfinished story.',
                imageUrl: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&fit=crop&q=80',
              },
              {
                title: 'Cut and Color',
                category: 'Behind the Scenes',
                description: 'Inside our post-production pipeline, from rough cut to final grade.',
                imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&fit=crop&q=80',
              },
            ],
          },
          contact: {
            enabled: true,
            title: 'Contact',
            body: 'Tell us about your project and we will reply within two working days.',
            contact: {
              email: 'hello@example.com',
              phone: '+1 555 010 0100',
              links: [
                {
                  label: 'Instagram',
                  href: 'https://instagram.com/',
                },
              ],
            },
          },
        },
        about: {
          title: 'About | Film & Photo Studio',
          description: 'Meet the directors, cinematographers and editors behind the studio.',
          hero: {
            enabled: true,
            title: 'A Small Team With Big Frames.',
            subtitle: 'Directors, cinematographers and editors who care about craft more than volume.',
            cta: {
              label: 'Start a project',
              href: '#contact',
            },
            mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&fit=crop&q=80',
          },
          story: {
            enabled: true,
            title: 'Our Story',
            body: 'We began as two friends with one camera. Today we are a small independent studio producing narrative films, documentaries and brand campaigns for clients who want their story told with care.',
            contact: {
              email: 'hello@example.com',
            },
          },
          contact: {
            enabled: true,
            title: 'Contact',
            body: 'Tell us about your project and we will reply within two working days.',
            contact: {
              email: 'hello@example.com',
              phone: '+1 555 010 0100',
              links: [
                {
                  label: 'Instagram',
                  href: 'https://instagram.com/',
                },
              ],
            },
          },
        },
      },
    },
  },
}
