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

// One figure on a product page: a single wide screenshot, or several
// screenshots side by side (phone screenshots stay phone-sized).
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
  tagline: string;           // one sentence: the page's lead, cards, the /projects row
  description: string;       // short paragraph under the lead
  metaTitle?: string;        // <title> / og:title; falls back to the name
  summary?: string;          // meta description, at most 200 characters; falls back to the tagline
  status: string;            // e.g. "Open source": the page's kicker
  launched: string;          // ISO year-month, e.g. "2026-10"
  license?: string;          // SPDX id, e.g. "MIT"
  languages?: string[];      // UI languages, e.g. ["EN", "TR"]
  platforms?: string[];      // systems a desktop or command-line tool runs on; web apps leave it out
  applicationCategory?: string; // schema.org category; "BusinessApplication" when left out
  spec?: string[];           // spec line: 2–4 short tokens
  stack: string[];
  features: string[];
  steps?: ProductStep[];     // "How it works"
  links: {
    app?: string;            // a hosted app people can open
    download?: string;       // installers
    docs?: string;           // website and documentation
    source?: string;
  };
  image: ProductImage;       // cards, OpenGraph, and the page's figure when there is no video
  video?: {
    src: string;
    poster: string;
    caption: string;
  };
  gallery?: ProductFigure[];
}
