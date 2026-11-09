const img = (id: string, width: number) => `https://images.unsplash.com/photo-${id}?w=${width}&fit=crop&q=80`

// Complete, valid payload with neutral wording: fills whatever a caller leaves out and is returned to clients to prefill an editor
export const sample: Record<string, unknown> = {
  seo: {
    ogImage: img('1518770660439-4636190af475', 1200),
    canonicalUrl: 'https://example.com',
    keywords: ['software engineer', 'rust', 'typescript', 'open source', 'portfolio'],
  },
  navigation: [
    { label: '~/work', href: '/#work' },
    { label: '~/stack', href: '/#stack' },
    { label: '~/systems', href: '/#systems' },
    { label: '~/contact', href: '/#contact' },
  ],
  contact: {
    email: 'hello@example.com',
    links: [
      { label: 'github.com/example', url: 'https://github.com/example' },
      { label: 'linkedin.com/in/example', url: 'https://www.linkedin.com/in/example' },
    ],
  },
  projects: [
    {
      slug: 'rune-infer',
      name: 'Rune Infer',
      summary: 'A small inference runtime that runs quantised language models on the CPU with a tiny memory footprint.',
      posterUrl: img('1518770660439-4636190af475', 1600),
      stack: ['Rust', 'WASM', 'Docker'],
      version: 'v1.4.0',
      updated: '2026-03-02',
      status: 'Open source',
      url: 'https://example.com/rune-infer',
      overview:
        'Rune Infer loads quantised models and serves them over a local socket or straight from the browser through WebAssembly. It was built for machines without a GPU, where start-up time and memory matter more than raw throughput.',
      capabilities: [
        { title: 'Fast start', text: 'Models are memory-mapped, so a first token arrives in under a second on a laptop.' },
        { title: 'Runs anywhere', text: 'One core compiles to a native binary, a container image and a WebAssembly module.' },
        { title: 'Small API', text: 'A handful of calls cover loading, streaming and cancelling, with typed bindings.' },
      ],
      releases: [
        { version: 'v1.4.0', date: '2026-03-02', current: true },
        { version: 'v1.3.0', date: '2025-12-11' },
        { version: 'v1.2.0', date: '2025-09-24' },
      ],
    },
    {
      slug: 'lattice-sync',
      name: 'Lattice Sync',
      summary: 'Offline-first data sync for apps that must keep working without a connection.',
      posterUrl: img('1555066931-4365d14bab8c', 1600),
      stack: ['TypeScript', 'SQLite', 'CRDT'],
      version: 'v0.9.2',
      updated: '2026-01-18',
      status: 'Open source',
      url: 'https://example.com/lattice-sync',
      overview:
        'Lattice Sync keeps a local SQLite copy of the data and merges changes with conflict-free replicated types. Clients sync in the background whenever a network is available, and never block the interface.',
      capabilities: [
        { title: 'Conflict free', text: 'Concurrent edits merge deterministically on every device.' },
        { title: 'Local first', text: 'Reads and writes hit the local database; the network is only for catching up.' },
        { title: 'Small footprint', text: 'The client adds under 40 kB gzipped to a web app.' },
      ],
      releases: [
        { version: 'v0.9.2', date: '2026-01-18', current: true },
        { version: 'v0.9.0', date: '2025-11-05' },
      ],
    },
    {
      slug: 'signal-board',
      name: 'Signal Board',
      summary: 'A live dashboard that turns service metrics into a calm, readable status wall.',
      posterUrl: img('1461749280684-dccba630e2f6', 1600),
      stack: ['Python', 'FastAPI', 'Vue'],
      version: 'v2.1.0',
      updated: '2025-10-30',
      status: 'Hosted',
      url: 'https://example.com/signal-board',
      overview:
        'Signal Board collects metrics from the services a team runs and shows only what needs attention. Rules decide what counts as a problem, so the wall stays quiet when everything is fine.',
      capabilities: [
        { title: 'Quiet by default', text: 'Only services outside their targets draw attention.' },
        { title: 'Any source', text: 'Reads from Prometheus, plain HTTP checks and webhooks.' },
        { title: 'Shareable', text: 'Every view has a stable link and a read-only kiosk mode.' },
      ],
      releases: [
        { version: 'v2.1.0', date: '2025-10-30', current: true },
        { version: 'v2.0.0', date: '2025-07-14' },
      ],
    },
  ],
  pages: {
    home: {
      title: 'Alex Sample | Software engineer (Rust, TypeScript, AI)',
      description: 'Portfolio of Alex Sample, a software engineer building fast tools in Rust and TypeScript: selected projects, systems, career and open source work.',
      hero: {
        enabled: true,
        eyebrow: 'SOFTWARE ENGINEER · REMOTE',
        titleLines: ["Hi, I'm Alex.", 'I build fast tools', 'and the systems behind them.'],
        bio: 'Full-stack and systems developer working in Rust, TypeScript and Python. I ship small, dependable software and publish most of it as open source.',
        primaryCta: { label: 'View projects ↓', href: '#work' },
        secondaryLink: { label: 'github.com/example →', href: 'https://github.com/example' },
        terminal: [
          { command: 'whoami', output: ['alex-sample — software engineer'] },
          { command: 'cat stack.txt', output: ['rust  typescript  python', 'vue  nuxt  postgres'] },
          { command: 'ls ~/work', output: ['rune-infer  lattice-sync  signal-board'] },
        ],
        footer: { location: 'Remote · UTC+00:00', summary: 'github.com/example · 40 public repositories' },
      },
      intro: {
        enabled: true,
        body: 'I like software that starts fast, fails loudly and is easy to read a year later. These are the things I have shipped and the tools I reach for.',
        stats: [
          { value: '40', label: 'Public repositories' },
          { value: '12', label: 'Published packages' },
          { value: '300', label: 'Stars earned' },
          { value: '8', label: 'Years building' },
        ],
      },
      work: {
        enabled: true,
        eyebrow: 'SELECTED WORK',
        title: 'Projects',
        stackLabel: 'STACK',
        openLabel: 'Open project',
      },
      systems: {
        enabled: true,
        eyebrow: 'MORE SYSTEMS',
        title: 'Smaller tools and experiments',
        items: [
          { name: 'tiny-queue', description: 'A durable job queue in a single file.', tags: 'Rust · Library' },
          { name: 'pixel-diff', description: 'Visual regression checks for component libraries.', tags: 'TypeScript · CLI' },
          { name: 'log-lens', description: 'Search and tail structured logs from the terminal.', tags: 'Rust · CLI' },
          { name: 'notebook-kit', description: 'Helpers for reproducible data notebooks.', tags: 'Python · Library' },
        ],
      },
      career: {
        enabled: true,
        experience: {
          eyebrow: 'EXPERIENCE · CAREER TIMELINE',
          title: 'Where I have worked',
          intro: 'Product teams and small studios, mostly building developer tools and data-heavy web apps.',
          items: [
            {
              period: '2023 – Present',
              location: 'Remote',
              company: 'Example Labs',
              role: 'Senior software engineer',
              highlights: ['→ Led the rewrite of the sync engine in Rust.', '→ Cut cold-start time of the web app by 60%.'],
              stack: 'Rust · TypeScript · PostgreSQL',
            },
            {
              period: '2019 – 2023',
              location: 'Remote',
              company: 'Sample Studio',
              role: 'Full-stack developer',
              highlights: ['→ Built the dashboard used by 2,000 teams.', '→ Introduced end-to-end tests and a release train.'],
              stack: 'Vue · Node.js · Python',
            },
          ],
        },
        education: {
          eyebrow: 'EDUCATION & CERTIFICATES',
          title: 'Learning',
          pursuing: {
            label: 'CURRENTLY PURSUING',
            degree: 'B.Sc. in Computer Science',
            institute: 'Example University',
            stages: [
              { label: 'Foundations', state: 'done' },
              { label: 'Core CS', state: 'current' },
              { label: 'Specialisation', state: 'next' },
            ],
            currentLevel: 'Second year of three',
            coursework: ['Distributed systems', 'Compilers', 'Machine learning', 'Databases'],
            relevance: 'The coursework feeds directly into the sync engine and inference tooling I build at work.',
          },
          certificates: [
            { name: 'Cloud Fundamentals', issuer: 'Example Academy', year: '2025', credentialId: 'EX-0001', url: 'https://example.com/credentials/ex-0001' },
            { name: 'Applied Machine Learning', issuer: 'Sample Institute', year: '2024', credentialId: 'EX-0002' },
          ],
        },
        hackathons: {
          eyebrow: 'HACKATHONS & RECOGNITION',
          title: 'Built under a deadline',
          items: [
            {
              year: '2025',
              result: 'finalist',
              name: 'Sample Hack',
              description: 'An offline-first field notes app built in 36 hours.',
              stack: ['TypeScript', 'SQLite'],
              url: 'https://example.com/projects/sample-hack',
            },
            { year: '2024', result: 'winner', name: 'Example Jam', description: 'A browser-based model playground running on WebAssembly.', stack: ['Rust', 'WASM'] },
          ],
        },
        openSource: {
          eyebrow: 'OPEN SOURCE & WRITING',
          title: 'Giving back',
          maintainer: {
            title: 'Maintainer · example/runtime and 3 more',
            url: 'https://github.com/example',
            stats: [
              { value: '40', label: 'Repositories' },
              { value: '120', label: 'Merged PRs' },
              { value: '300', label: 'Stars' },
            ],
          },
          contributions: [
            { name: 'example/runtime', description: 'Fixed a memory-mapping bug on Windows.', action: 'PR →', url: 'https://example.com/pr/1' },
            { name: 'example/ui-kit', description: 'Added keyboard support to the combobox.', action: 'PR →' },
          ],
          writing: [
            { title: 'Starting a model in under a second', meta: 'Article · 2026', action: 'Read →' },
            { title: 'Local-first without the buzzwords', meta: 'Talk · 2025', action: 'Slides →' },
          ],
        },
      },
      stack: {
        enabled: true,
        eyebrow: 'STACK',
        title: 'Rust, TypeScript & Python.',
        columns: [
          { title: 'SYSTEMS', items: 'Rust · C · WebAssembly · Docker' },
          { title: 'WEB & AI', items: 'TypeScript · Vue · Nuxt · ONNX' },
          { title: 'PYTHON & DATA', items: 'Python · FastAPI · Postgres · DuckDB' },
        ],
      },
      contact: {
        enabled: true,
        title: "Let's build something modest.",
        note: 'Open to interesting projects, collaborations and conversations about small, dependable software.',
        legal: '© 2026 Alex Sample',
      },
    },
  },
}
