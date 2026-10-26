// Build-time helpers for product metadata, shared by the product cards and the
// product pages so they format dates, facts and links the same way.
import type { Product } from '../../types';

// "2026-10" → "Oct 2026"; falls back to the raw value if it doesn't parse.
export const fmtMonth = (ym: string): string => {
  const d = new Date(`${ym}-01T00:00:00Z`);
  return isNaN(d.getTime())
    ? ym
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
};

export interface Fact {
  label: string;
  value: string;
}

/** The facts under a product's description: license, interface languages, platforms. */
export function productFacts(p: Product): Fact[] {
  const facts: Fact[] = [];
  if (p.license) facts.push({ label: 'License', value: p.license });
  if (p.languages?.length) facts.push({ label: 'Interface', value: p.languages.join(' · ') });
  if (p.platforms?.length) facts.push({ label: 'Runs on', value: p.platforms.join(' · ') });
  return facts;
}

export interface ProductLink {
  href: string;
  label: string;
}

/** The page's buttons in priority order; the first one is the primary button. */
export function productLinks(p: Product): ProductLink[] {
  const { app, download, docs, source } = p.links;
  const links: ProductLink[] = [];
  if (app) links.push({ href: app, label: 'Open the live app' });
  if (download) links.push({ href: download, label: 'Download' });
  if (docs) links.push({ href: docs, label: 'Website & docs' });
  if (source) links.push({ href: source, label: 'Source on GitHub' });
  return links;
}

/** schema.org operatingSystem: the systems a desktop or command-line tool runs on, else "Web". */
export const operatingSystem = (p: Product): string =>
  p.platforms?.length ? p.platforms.join(', ') : 'Web';
