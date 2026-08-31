// types/site.ts

export type TemplateType = 'service-lead-gen' | 'creator-portfolio'

export type SectionType = 'features' | 'gallery' | 'testimonials' | 'contact'

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface BrandConfig {
  name: string
  logoUrl: string
  faviconUrl: string
  fontFamily: string
  colors: ColorPalette
}

export interface SeoConfig {
  metaTitle: string
  metaDescription: string
  ogImage: string
  canonicalUrl: string
  keywords: string[]
}

export interface HeroSection {
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  mediaUrl?: string
}

export interface SectionItem {
  title: string
  body: string
  imageUrl?: string
  link?: string
}

export interface PageSection {
  type: SectionType
  title: string
  description?: string
  items: SectionItem[]
}

export interface ContentConfig {
  hero: HeroSection
  sections: PageSection[]
}

export interface SitePayload {
  slug: string
  templateId: TemplateType
  brand: BrandConfig
  seo: SeoConfig
  content: ContentConfig
}
