const pic = (seed: string, width: number, height: number) => `https://picsum.photos/seed/${seed}/${width}/${height}`
// A public sample clip that allows cross-origin use (the hero shader needs it); replace with your own reels
const reel = () => 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
// Neutral client marks drawn inline (no request): a shape on a dark ground, shown on the white discs of the film strip
const SHAPES: Record<string, string> = {
  hexagon: '<path d="M32 6l22 13v26L32 58 10 45V19z"/>',
  triangle: '<path d="M32 8l24 44H8z"/>',
  'circle-dot': '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="6" fill="#fff"/>',
  diamond: '<path d="M32 6l26 26-26 26L6 32z"/>',
  shield: '<path d="M32 6l22 8v16c0 14-9 24-22 28C19 54 10 44 10 30V14z"/>',
}
const logo = (shape: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#111">${SHAPES[shape]}</svg>`)}`

const photo = (slug: string, title: string, category: string, ratio: number, width: number, height: number, gallery: boolean, featured: number | null, description?: string) => ({
  slug,
  title,
  ...(description ? { description } : {}),
  imageUrl: pic(`mv-${slug}`, width, height),
  aspectRatio: ratio,
  category,
  gallery,
  featured,
  mediaId: `photo-${slug}`,
  width,
  height,
  project: 'Sample shoot',
})

const paragraphs = (title: string) => [
  `${title} starts with a conversation: what the brand wants people to feel, who they are talking to and where the pictures will live.`,
  'From there we plan the set, the light and the styling, and shoot in a single focused day so the result stays consistent.',
  'Each frame is then retouched by hand and delivered in the sizes and formats the team needs, ready for the shop, the feed and print.',
]
const episode = (slug: string, title: string, excerpt: string, publishedAt: string, withVideo: boolean) => ({
  slug,
  title,
  excerpt,
  thumbnailUrl: pic(`mv-ep-${slug}`, 636, 556),
  publishedAt,
  ...(withVideo ? { videoUrl: reel() } : {}),
  body: paragraphs(title),
})
const blog = (slug: string, title: string, excerpt: string, publishedAt: string) => ({
  slug,
  title,
  excerpt,
  author: 'Alex Morgan',
  thumbnailUrl: pic(`mv-blog-${slug}`, 636, 556),
  publishedAt,
  body: paragraphs(title),
})
const legal = (title: string, ...headings: string[]) => ({
  enabled: true,
  title,
  updatedLabel: 'Last updated',
  updated: '2026-01-01',
  sections: headings.map((heading) => ({ heading, body: `This section covers ${heading.toLowerCase()}. Replace it with the wording that applies to your studio and your clients.` })),
})

// Complete, valid payload with neutral wording: fills whatever a caller leaves out and is returned to clients to prefill an editor
export const sample: Record<string, unknown> = {
  seo: {
    ogImage: pic('mv-share', 1200, 630),
    canonicalUrl: 'https://example.com',
    keywords: ['product photography', 'food photography', 'videography', 'studio'],
  },
  navigation: [
    { label: 'PRICING', href: '/#packages' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'EPISODES', href: '/episode' },
    { label: 'BLOGS', href: '/blog' },
    { label: 'LIVE', href: '/live' },
    { label: 'ABOUT US', href: '/about' },
  ],
  contact: {
    email: 'hello@example.com',
    phone: '+1 555 0100',
    links: [
      { label: 'Instagram', url: 'https://www.instagram.com/example' },
      { label: 'YouTube', url: 'https://www.youtube.com/@example' },
    ],
  },
  trusted: [
    { name: 'Brand one', logoUrl: logo('hexagon') },
    { name: 'Brand two', logoUrl: logo('triangle') },
    { name: 'Brand three', logoUrl: logo('circle-dot') },
    { name: 'Brand four', logoUrl: logo('diamond') },
    { name: 'Brand five', logoUrl: logo('shield') },
  ],
  photos: [
    photo('frame-one', 'Lifestyle photograph of a black leather wallet', 'product', 0.6667, 720, 1080, true, 1, 'A smart wallet on a dark table next to a glass of whiskey, lit from one side.'),
    photo('frame-two', 'A chilled glass of cola on a dark table', 'food', 1.5, 1080, 720, true, null),
    photo('frame-three', 'Studio shot of a pair of white sneakers', 'ecommerce', 1, 900, 900, false, 2),
    photo('frame-four', 'A wristwatch on black stone', 'product', 0.6667, 720, 1080, true, 3),
    photo('frame-five', 'Spices on a wooden board', 'food', 1.5, 1080, 720, true, 4),
    photo('frame-six', 'A phone case on a marble shelf', 'ecommerce', 0.8, 800, 1000, true, null),
    photo('frame-seven', 'A perfume bottle in warm light', 'product', 0.6667, 720, 1080, false, 5),
    photo('frame-eight', 'Fresh pasta on a ceramic plate', 'food', 1, 900, 900, false, 6),
    photo('frame-nine', 'A leather bag on a concrete step', 'product', 0.8, 800, 1000, true, 7),
    photo('frame-ten', 'Citrus slices on a dark plate', 'food', 1.5, 1080, 720, true, null),
  ],
  videos: [
    {
      slug: 'reel-one',
      title: 'Product reel, a watch in motion',
      posterUrl: pic('mv-reel-one', 506, 900),
      videoUrl: reel(),
      aspectRatio: 0.5625,
      category: 'product',
      durationSeconds: 36.4,
      uploadedAt: '2026-01-19',
      mediaId: 'video-reel-one',
    },
    {
      slug: 'reel-two',
      title: 'Food reel, pouring and steam',
      posterUrl: pic('mv-reel-two', 506, 900),
      videoUrl: reel(),
      aspectRatio: 0.5625,
      category: 'food',
      durationSeconds: 21,
      uploadedAt: '2026-02-02',
      mediaId: 'video-reel-two',
    },
    {
      slug: 'reel-three',
      title: 'Sneaker spin, 360 degrees',
      posterUrl: pic('mv-reel-three', 506, 900),
      videoUrl: reel(),
      aspectRatio: 0.5625,
      category: 'ecommerce',
      durationSeconds: 15,
      uploadedAt: '2026-02-20',
      mediaId: 'video-reel-three',
    },
    {
      slug: 'reel-five',
      title: 'Packaging reveal, slow unboxing',
      posterUrl: pic('mv-reel-five', 506, 900),
      videoUrl: reel(),
      aspectRatio: 0.5625,
      category: 'ecommerce',
      durationSeconds: 28,
      uploadedAt: '2026-03-12',
      mediaId: 'video-reel-five',
    },
    {
      slug: 'reel-six',
      title: 'Coffee pour, macro',
      posterUrl: pic('mv-reel-six', 506, 900),
      videoUrl: reel(),
      aspectRatio: 0.5625,
      category: 'food',
      durationSeconds: 19,
      uploadedAt: '2026-03-20',
      mediaId: 'video-reel-six',
    },
    {
      slug: 'reel-four',
      title: 'Behind the scenes at the studio',
      posterUrl: pic('mv-reel-four', 506, 900),
      videoUrl: reel(),
      aspectRatio: 0.5625,
      category: 'product',
      durationSeconds: 48,
      uploadedAt: '2026-03-05',
      mediaId: 'video-reel-four',
    },
  ],
  packages: [
    {
      slug: 'standard',
      title: 'Standard Photography Package',
      subtitle: 'Everything you need for great product visuals',
      price: '₹15000',
      unit: 'day',
      features: [
        'Photo and video shoots included',
        'Marketplace-ready edits',
        'White background and infographic shots',
        'Professional post-processing',
        '360° product video available',
        'Quick turnaround delivery',
      ],
    },
    {
      slug: 'custom',
      title: 'Custom Photography Package',
      subtitle: 'Tailored end-to-end for premium brands',
      price: 'Custom',
      unit: 'day',
      features: [
        'Custom mood board creation',
        'Live shoot streaming',
        'Ultra-premium props and set design',
        'Bespoke creative concept and direction',
        'Campaign-ready hero video assets',
        'Dedicated production manager',
      ],
    },
  ],
  team: [
    { name: 'Alex Morgan', role: 'FOUNDER & LEAD PHOTOGRAPHER', photoUrl: pic('mv-team-1', 360, 450) },
    { name: 'Sam Rivera', role: 'SCRIPT WRITER', photoUrl: pic('mv-team-2', 360, 450) },
    { name: 'Jordan Lee', role: 'CREATIVE TECHNOLOGIST', photoUrl: pic('mv-team-3', 360, 450) },
  ],
  episodes: [
    episode(
      'chocolate-product-shoot',
      'Chocolate packaging shoot: a sweet brief',
      'Every product shoot is a journey into creativity, and this one started with a box of chocolates and a short brief.',
      '2026-02-10',
      true
    ),
    episode(
      'jewellery-showcase',
      'Jewellery photography: capturing fine detail',
      'Jewellery deserves every intricate detail captured with care, from the first sketch of the lighting to the final retouch.',
      '2026-02-24',
      false
    ),
    episode(
      'leather-goods-story',
      'Leather goods: crafting a visual story',
      'A good product has a story, and this shoot set out to tell it with texture, warm light and patient styling.',
      '2026-03-09',
      true
    ),
    episode('tea-videography', 'Tea videography: brewing a cinematic reel', 'Pouring, steam and slow motion: how a short reel for a tea brand came together in one studio day.', '2026-03-23', true),
  ],
  blogs: [
    blog('storytelling-beyond-the-product-shot', 'Storytelling beyond the product shot', 'Why the best product images show a moment, not just an object, and how to brief for one.', '2026-01-12'),
    blog(
      'how-product-photography-grows-sales',
      'How professional product photography grows your business',
      'Clear, consistent visuals build trust. Here is what changes when a catalogue is shot well.',
      '2026-01-26'
    ),
    blog('finding-the-right-food-photographer', 'Finding the right food photographer: a guide', 'What to look for in a portfolio, which questions to ask and how to compare quotes.', '2026-02-16'),
    blog('what-a-shoot-day-looks-like', 'What a shoot day looks like', 'From the first brief to the last frame: a walk through a typical day in the studio.', '2026-03-02'),
  ],
  live: {
    status: 'live',
    streamUrl: reel(),
    posterUrl: pic('mv-live', 1280, 720),
    title: 'Studio session: product shoot, live',
    nextAt: '2026-12-05T13:30:00Z',
    timeZone: 'Asia/Kolkata',
    timeZoneLabel: 'IST',
    schedule: [
      { startsAt: '2026-11-28T13:30:00Z', title: 'Food styling live' },
      { startsAt: '2026-12-05T13:30:00Z', title: 'Packshot masterclass' },
      { startsAt: '2026-12-12T13:30:00Z', title: 'Behind the scenes' },
    ],
    replays: [
      { title: 'Episode 01 replay', thumbnailUrl: pic('mv-replay-1', 564, 318), url: reel() },
      { title: 'Episode 02 replay', thumbnailUrl: pic('mv-replay-2', 564, 318), url: reel() },
      { title: 'Episode 03 replay', thumbnailUrl: pic('mv-replay-3', 564, 318), url: reel() },
      { title: 'Episode 04 replay', thumbnailUrl: pic('mv-replay-4', 564, 318), url: reel() },
    ],
  },
  pages: {
    home: {
      title: 'Sample Studio | Product photography and videography',
      description: 'Sample Studio is a product and food photography studio: campaign photos, reels and packages for brands that want to stand out.',
      hero: {
        enabled: true,
        eyebrow: 'SAMPLE STUDIO  —  PRODUCT PHOTOGRAPHY & VIDEOGRAPHY  ·  SAMPLE CITY',
        titleLines: ['BOLD LIGHT.', 'HONEST PRODUCT.'],
        tagline: 'Create your brand identity that speaks to your clients, with our product photography and videography service.',
        videoUrl: reel(),
        posterUrl: pic('mv-hero', 1600, 900),
        ctaLabel: 'Book a Session',
        trustedLabel: 'TRUSTED US',
      },
      manifesto: {
        enabled: true,
        eyebrow: '02 / SIGNATURE BRANDING',
        title: 'Signature Visuals for Brands That Dare to Lead',
        body: 'Sample Studio crafts creative media for brands that want their product to feel like an experience, not a price tag. We partner with forward-thinking brands to create images that tell stories, drive desire and lift impactful launches.',
        bullets: [
          'Strategy-first photography concepts tailored for your launch objectives',
          'Full-service production: casting, art direction, motion and brand-centric videography',
          'Brand-safe rights and tailored assets for digital campaigns',
        ],
      },
      photoGallery: {
        enabled: true,
        eyebrow: '03 / PHOTO GALLERY',
        title: 'Photo Gallery',
      },
      videoGallery: { enabled: true, eyebrow: '04 / VIDEO GALLERY', title: 'Video Gallery' },
      featured: {
        enabled: true,
        eyebrow: '05 / FEATURED PHOTOS',
        title: 'Featured Photos',
        framesLabel: 'FRAMES',
      },
      packages: { enabled: true, eyebrow: '06 / PACKAGES', title: 'Packages', ctaLabel: 'Contact Us' },
      footer: {
        enabled: true,
        wordmark: 'SAMPLE STUDIO',
        legal: '© 2026  ·  Powered by MWap',
        links: [
          { label: 'terms', href: '/terms' },
          { label: 'privacy', href: '/privacy' },
          { label: 'cancellation', href: '/cancellation' },
          { label: 'license', href: '/license' },
        ],
      },
    },
    about: {
      title: 'About | Sample Studio',
      description: 'The story, the mission and the team behind Sample Studio.',
      story: {
        enabled: true,
        title: 'Our Story',
        photoUrl: pic('mv-about', 560, 760),
        sections: [
          {
            body: 'Sample Studio was founded to bring honest, striking imagery to brands. Through product and food photography and videography, we help brands build a deeper connection with their audience.',
          },
          {
            heading: 'Mission & Vision',
            body: 'Our mission is to elevate your brand with striking visuals that drive engagement and sales. We aim to lead the industry in creative storytelling backed by technical mastery.',
          },
          {
            heading: 'What We Do',
            items: [
              { label: 'Product & Food Photography:', text: 'E-commerce flat-lays to gourmet spreads.' },
              { label: 'Videography:', text: 'Short ads, commercials and social reels that captivate.' },
              { label: 'CGI-Style Imagery:', text: 'High-end shots with dynamic lighting and expert retouching.' },
              { label: 'Creative Direction:', text: 'Art direction, styling and custom concepts aligned with your identity.' },
            ],
          },
          {
            heading: 'Our Studio',
            body: 'Our studio has advanced cameras, versatile backdrops and controlled lighting, perfect for everything from clean white-background shots to lifestyle scenes.',
          },
          {
            heading: 'Our Approach',
            body: 'We start each project with a collaborative briefing, follow with precise lighting and styling, and finish with careful post-production. Expect fast turnarounds and clear pricing.',
          },
          { heading: 'Our Clients', body: 'We have worked with food, beverage, jewellery and lifestyle brands, delivering versatile, professional imagery that drives results.' },
        ],
      },
      team: { enabled: true, eyebrow: 'ABOUT / THE CREW BEHIND THE FRAME', title: 'Team' },
    },
    projects: {
      title: 'Projects | Sample Studio',
      description: 'Every shoot of Sample Studio: photos and videos, filterable by category.',
      header: { enabled: true, eyebrow: 'PROJECTS', title: 'Projects', allLabel: 'ALL' },
    },
    live: {
      title: 'Live | Sample Studio',
      description: 'Watch the shoot happen: live sessions, the schedule and replays of past streams.',
      header: { enabled: true, eyebrow: 'LIVE / WATCH THE SHOOT HAPPEN', title: 'Live Stream', liveLabel: 'LIVE' },
      schedule: { enabled: true, eyebrow: 'NEXT ON AIR', title: 'Schedule', notifyLabel: 'NOTIFY ME' },
      replays: { enabled: true, eyebrow: 'REPLAYS', title: 'Past Streams' },
      offAir: {
        enabled: true,
        eyebrow: 'LIVE / OFF AIR',
        title: "We're off air.\nBack in",
        notifyLabel: 'NOTIFY ME',
        daysLabel: 'DAYS',
        hoursLabel: 'HOURS',
        minutesLabel: 'MINUTES',
        secondsLabel: 'SECONDS',
      },
    },
    episode: {
      title: 'Episodes | Sample Studio',
      description: 'Behind every shoot: the brief, the set and the result, episode by episode.',
      header: { enabled: true, eyebrow: 'EPISODES / BEHIND EVERY SHOOT', title: 'Episodes', backLabel: 'Back to episodes' },
    },
    blog: {
      title: 'Blogs | Sample Studio',
      description: 'Notes from the studio on product photography, videography and growing a brand.',
      header: { enabled: true, eyebrow: 'BLOGS / NOTES FROM THE STUDIO', title: 'Blogs', backLabel: 'Back to blogs' },
    },
    terms: {
      title: 'Terms of Service | Sample Studio',
      description: 'The terms of using this website and booking Sample Studio.',
      document: legal('Terms of Service', 'Using this website', 'Bookings and payments', 'Content and rights'),
    },
    privacy: {
      title: 'Privacy Policy | Sample Studio',
      description: 'How Sample Studio handles your personal data.',
      document: legal('Privacy Policy', 'What we collect', 'How we use it', 'Your choices'),
    },
    cancellation: {
      title: 'Cancellation Policy | Sample Studio',
      description: 'Rescheduling and cancelling a booking with Sample Studio.',
      document: legal('Cancellation Policy', 'Rescheduling', 'Cancelling a booking', 'Refunds'),
    },
    license: {
      title: 'License | Sample Studio',
      description: 'How the photographs and videos delivered by Sample Studio may be used.',
      document: legal('License', 'Delivered work', 'Permitted use', 'Attribution'),
    },
  },
}
