export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  logo?: string;
}

export interface Skill {
  subject: string;
  A: number;
  fullMark: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Client {
  id: number;
  name: string;
  industry: string;
  logo?: string;
  link?: string;
}

export interface Publication {
  id: number;
  title: string;
  authors: string;
  venue: string;
  year: number;
  link?: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  location: string;
  period: string;
  gpa?: string;
  description?: string;
  logo?: string;
}

export interface WritingPost {
  title: string;
  date: string;
  url?: string;
}

export interface CompanyProfile {
  name: string;
  owner: string;
  title: string;
  role: string;          // "AI Engineer": hero and footer
  headline: string;      // the hero's role line
  bio: string;
  about: string[];       // the hero's two paragraphs
  closing: string;       // the footer's one-sentence statement
  email: string;
  location: string;
  socials: {
    linkedin: string;
    github: string;
    medium: string;
  };
}

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// One figure on a product page: a single wide screenshot, or several phone
// screenshots shown side by side.
export interface ProductFigure {
  images: ProductImage[];
  caption: string;
}

export interface ProductStep {
  title: string;
  body: string;
}

export interface Product {
  slug: string;              // URL: /products/<slug>
  name: string;
  tagline: string;           // one-liner under the title and on cards
  description: string;       // short paragraph under the tagline
  metaTitle?: string;        // <title> / og:title; falls back to the name
  summary?: string;          // ~155-char meta description; falls back to the tagline
  status: string;            // e.g. "Live", shown as a badge
  launched: string;          // ISO year-month, e.g. "2026-10"
  license?: string;
  languages?: string[];      // UI languages, e.g. ["EN", "TR"]
  stack: string[];
  features: string[];
  steps?: ProductStep[];     // "How it works"
  links: {
    app?: string;
    source?: string;
    docs?: string;
  };
  image: ProductImage;       // card image on /products, OpenGraph image
  video?: {
    src: string;
    poster: string;
    caption: string;
  };
  gallery?: ProductFigure[];
}
