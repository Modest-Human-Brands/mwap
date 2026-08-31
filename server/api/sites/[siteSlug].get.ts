const mockSites: Record<string, SitePayload> = {
  'apex-studios': {
    slug: 'apex-studios',
    templateId: 'service-lead-gen',
    brand: {
      name: 'Apex Cinema & Commercials',
      logoUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=120&h=120&fit=crop&q=80',
      faviconUrl: 'https://api.iconify.design/lucide:clapperboard.svg',
      fontFamily: 'Plus Jakarta Sans',
      colors: {
        primary: '#f97316',
        secondary: '#09090b',
        accent: '#fb923c',
        background: '#0c0a09',
        text: '#f2f2f2',
      },
    },
    seo: {
      metaTitle: 'Apex Studios | Commercial Film & Advertising Production',
      metaDescription: 'Full-service commercial videography and photography studio crafting high-converting brand campaigns, product launches, and digital ads.',
      ogImage: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&h=630&fit=crop&q=80',
      canonicalUrl: 'https://apexstudios.com',
      keywords: ['commercial video production', 'brand advertising photography', 'product launch cinematography', 'corporate video'],
    },
    content: {
      hero: {
        headline: 'We Engineer Commercial Visuals That Demand Attention',
        subheadline: 'Full-service production house executing high-impact advertising campaigns, product films, and visual brand assets for global brands.',
        ctaText: 'Request Production Deck',
        ctaLink: '#contact',
        mediaUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&fit=crop&q=80',
      },
      sections: [
        {
          type: 'features',
          title: 'Full-Cycle Production Capabilities',
          description: 'From pre-production scripting and storyboarding to color grading in ACES and deliverable formatting.',
          items: [
            {
              title: 'Brand Commercials & Broadcast Ads',
              body: 'High-concept television and digital brand films shot on ARRI/RED camera systems with cinema optics.',
              imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&fit=crop&q=80',
            },
            {
              title: 'High-End Product & E-Commerce Photography',
              body: 'Studio tabletop setups, liquid motion, 3D tracking integration, and macro editorial stills.',
              imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&fit=crop&q=80',
            },
            {
              title: 'Corporate Storytelling & Brand Documentaries',
              body: 'Executive thought leadership, founder profiles, and global recruitment campaign media.',
              imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&fit=crop&q=80',
            },
          ],
        },
        {
          type: 'testimonials',
          title: 'What Production Partners Say',
          items: [
            {
              title: 'Marcus Vance, Creative Director at Hyperion Agency',
              body: 'Apex delivered 14 cutdowns and 40 master hero images for our global launch on an impossible 10-day turnaround without compromising polish.',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
            },
          ],
        },
      ],
    },
  },
  'lumiere-films': {
    slug: 'lumiere-films',
    templateId: 'creator-portfolio',
    brand: {
      name: 'Lumière Wedding Cinema',
      logoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=120&h=120&fit=crop&q=80',
      faviconUrl: 'https://api.iconify.design/lucide:heart-handshake.svg',
      fontFamily: 'Cormorant Garamond',
      colors: {
        primary: '#9a7b56',
        secondary: '#2e261f',
        accent: '#d4af37',
        background: '#faf7f2',
        text: '#2b2622',
      },
    },
    seo: {
      metaTitle: 'Lumière Cinema | Editorial Destination Wedding Photography & Film',
      metaDescription: 'Capturing unscripted, timeless wedding stories and editorial portraits worldwide. Available for destination ceremonies across Europe, Asia, and the Americas.',
      ogImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=630&fit=crop&q=80',
      canonicalUrl: 'https://lumiereweddingfilms.com',
      keywords: ['destination wedding photography', 'editorial wedding cinema', 'luxury wedding videographer', 'fine art wedding photo'],
    },
    content: {
      hero: {
        headline: 'Timeless Romance, Captured with Cinematic Grace',
        subheadline: 'We craft heirloom wedding films and editorial imagery that preserve the unscripted intimacy and grandeur of your day.',
        ctaText: 'Check Date Availability',
        ctaLink: '#inquire',
        mediaUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&fit=crop&q=80',
      },
      sections: [
        {
          type: 'gallery',
          title: 'Recent Love Stories',
          description: 'A curated selection of destination ceremonies, quiet moments, and celebrations.',
          items: [
            {
              title: 'Sophia & Julian — Villa Cimbrone, Ravello',
              body: 'Super 8mm and 4K digital blend capturing a golden-hour ceremony over the Amalfi coastline.',
              imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&fit=crop&q=80',
            },
            {
              title: 'Elena & Lucas — Château de Varennes, Burgundy',
              body: 'Three-day editorial celebration featuring bespoke lighting design and intimate garden vows.',
              imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop&q=80',
            },
            {
              title: 'Aria & Dev — Lake Como, Italy',
              body: 'Intimate sunset boat departure and candlelit lakeside reception documented on medium-format film.',
              imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&fit=crop&q=80',
            },
          ],
        },
        {
          type: 'testimonials',
          title: 'Words from Our Couples',
          items: [
            {
              title: 'Clara & Nathan (Married September 2025)',
              body: 'Watching our film felt like stepping right back into the emotion of the ceremony. Lumière gave us a masterpiece our family will cherish for generations.',
              imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
            },
          ],
        },
      ],
    },
  },
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'siteSlug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Site slug parameter is required',
    })
  }

  const site = mockSites[slug]

  if (!site) {
    throw createError({
      statusCode: 404,
      statusMessage: `No photography/videography site found for slug: "${slug}"`,
    })
  }

  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  return site
})
