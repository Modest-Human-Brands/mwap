const img = (id: string, width: number) => `https://images.unsplash.com/photo-${id}?w=${width}&fit=crop&q=80`

const closing = {
  enabled: true,
  eyebrow: 'Take the next step toward feeling better',
  title: "Let's talk.",
  button: { label: 'Book a consultation', href: '/#visit' },
  details: 'Dr. Purbasha Sengupta · hello@example.com · (000) 000 0000 · Co-founder, Soul Solutions',
  legal: '© 2026 Dr. Purbasha Sengupta. Co-founder, Soul Solutions (soulsolutions.in). For appointments only; not for emergencies.',
}

// Complete, valid payload with neutral wording: fills whatever a caller leaves out and is returned to clients to prefill an editor
export const sample: Record<string, unknown> = {
  seo: {
    ogImage: img('1594824476967-48c8b964273f', 1200),
    canonicalUrl: 'https://example.com',
    keywords: ['psychiatrist', 'anxiety', 'depression', 'sleep', 'online consultation'],
  },
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Care', href: '/#care' },
    { label: 'Visit', href: '/#visit' },
    { label: 'Journal', href: '#' },
    { label: 'Contact', href: '/#contact' },
  ],
  contact: {
    email: 'hello@example.com',
    phone: '(000) 000 0000',
  },
  pages: {
    home: {
      title: 'Dr. Purbasha Sengupta | Consultant Psychiatrist',
      description: 'Calm, unhurried psychiatric care for anxiety, depression and sleep, in person or by secure video. Request an appointment with Dr. Purbasha Sengupta.',
      hero: {
        enabled: true,
        eyebrow: 'Consultant psychiatrist · MBBS, MD',
        titleLines: ['Dr. Purbasha', 'Sengupta'],
        tagline: 'Calm, unhurried psychiatric care for anxiety, depression and sleep. In person or by secure video.',
        imageUrl: img('1594824476967-48c8b964273f', 1400),
        primaryCta: { label: 'Book a consultation', href: '#visit' },
        secondaryLink: { label: 'Co-founder, Soul Solutions', href: 'https://soulsolutions.in' },
        rating: { value: '4.9 / 5', caption: 'from over 120 patient reviews' },
      },
      ticker: {
        enabled: true,
        items: ['Anxiety', 'Depression', 'Sleep', 'Burnout', 'Mood', 'OCD'],
      },
      statement: {
        enabled: true,
        eyebrow: '(01) About',
        title: 'I believe good psychiatric care starts with being listened to.',
        body: 'With patience, clear explanations and evidence-based treatment, I help you understand what you are going through and find a path toward steadier days.',
        link: { label: 'More about me', href: '/about' },
        stats: [
          { value: '12+', label: 'years of practice' },
          { value: '4,000+', label: 'consultations held' },
          { value: '4.9/5', label: 'average patient rating' },
          { value: '2 ways', label: 'to meet: in person or video' },
        ],
      },
      care: {
        enabled: true,
        eyebrow: '(02) Where I can help',
        title: 'Areas of care',
        areas: [
          {
            title: 'Anxiety and stress',
            description: 'Panic, constant worry and phobias, with practical coping plans.',
            imageUrl: img('1499209974431-9dddcece7f88', 520),
            href: '#visit',
          },
          {
            title: 'Depression and mood',
            description: 'Low mood, bipolar disorder and long-term recovery.',
            imageUrl: img('1520206183501-b80df61043c2', 520),
            href: '#visit',
          },
          {
            title: 'Sleep and burnout',
            description: 'Insomnia, exhaustion and work pressure, with a plan to restore rest.',
            imageUrl: img('1507652313519-d4e9174996dd', 520),
            href: '#visit',
          },
        ],
      },
      approach: {
        enabled: true,
        eyebrow: '(03) My approach',
        title: 'Appointments are unhurried, private and judgment-free.',
        imageUrl: img('1470252649378-9c29740c9fa8', 1600),
      },
      appointment: {
        enabled: true,
        eyebrow: '(04) Request an appointment',
        title: "Let's find a time to talk.",
        note: 'If you or someone near you may be in danger, this form is not for emergencies. Please call your local emergency number.',
        hoursTitle: 'Consulting hours',
        hours: [
          { days: 'Mon – Wed', time: '10 AM – 6 PM · in person' },
          { days: 'Thursday', time: '10 AM – 2 PM, 4 – 8 PM · in person and video' },
          { days: 'Friday', time: '10 AM – 6 PM · in person' },
          { days: 'Saturday', time: '10 AM – 1 PM · video only' },
          { days: 'Sunday', time: 'Closed' },
        ],
        submitLabel: 'Request appointment',
      },
      closing,
    },
    about: {
      title: 'About Dr. Purbasha Sengupta | Consultant Psychiatrist',
      description: 'Training, recognition and approach of Dr. Purbasha Sengupta, consultant psychiatrist and co-founder of Soul Solutions.',
      hero: {
        enabled: true,
        eyebrow: '(About) Consultant psychiatrist · MBBS, MD',
        titleLines: ['Hello, I am', 'Purbasha.'],
        intro: 'Dr. Purbasha Sengupta is a consultant psychiatrist and co-founder of Soul Solutions, Kolkata.',
        link: { label: 'Co-founder, Soul Solutions', href: 'https://soulsolutions.in' },
        imageUrl: img('1559839734-2b71ea197ec2', 900),
        badge: { value: '12+', label: 'years of practice' },
      },
      story: {
        enabled: true,
        eyebrow: '(01) About me',
        title: 'Good psychiatric care starts with being listened to. With patience and clear explanations, you find steadier days.',
        columns: [
          'I am a consultant psychiatrist with more than 12 years of experience in adult mental health. My work covers anxiety, depression, bipolar disorder, OCD and sleep problems, always in partnership with the patient and, where welcome, their family.',
          'I combine medication management with psychoeducation and referrals to trusted psychologists and therapists, so that care fits the whole person. Appointments are unhurried, private and judgment-free, in person or by secure video.',
        ],
      },
      credentials: {
        enabled: true,
        eyebrow: '(02) Training and recognition',
        title: 'Education and awards',
        items: [
          { title: 'MD, Psychiatry', detail: 'Leading university medical college. Mood and anxiety focus.' },
          { title: 'MBBS', detail: 'Leading university medical college. Clinical rotations.' },
          { title: 'Fellowship, Psychopharmacology', detail: 'Teaching hospital. Safe, personalised medication care.' },
          { title: 'Board-certified psychiatrist', detail: 'Plus advanced training in CBT-informed care.' },
          { title: 'Patient care award', detail: 'Excellence in care. Mental health first aid instructor.' },
        ],
      },
      clinic: {
        enabled: true,
        eyebrow: '(03) Beyond the consulting room',
        titleLines: ['Co-founder of', 'Soul Solutions.'],
        body: 'A Kolkata mental health clinic where a psychiatrist and a clinical psychologist work together to understand each person before deciding on treatment. By appointment only.',
        link: { label: 'soulsolutions.in', href: 'https://soulsolutions.in' },
        tagline: 'Heal · Understand · Grow',
      },
      testimonial: {
        enabled: true,
        eyebrow: "(04) In patients' words",
        quote: 'Dr. Sengupta explained every option and never rushed me. I finally felt understood.',
        rating: 5,
        author: 'A. R. · shared with permission',
      },
      closing,
    },
  },
}
