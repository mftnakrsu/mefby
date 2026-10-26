// Read the built site in dist/. Tests that use these need `npm run build` first.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIST = fileURLToPath(new URL('../../dist/', import.meta.url));

export function requireDist(): void {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('dist/ is missing: run `npm run build` first');
  }
}

/** '/essays/rag' → dist/essays/rag/index.html; '/' → dist/index.html */
export function pageFile(route: string): string {
  return join(DIST, route.replace(/^\/+|\/+$/g, ''), 'index.html');
}

export const pageExists = (route: string): boolean => existsSync(pageFile(route));

export function readPage(route: string): string {
  requireDist();
  return readFileSync(pageFile(route), 'utf8');
}

/** Every built page as a route: '/', '/essays', '/essays/rag', … */
export function allRoutes(): string[] {
  requireDist();
  const routes: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full, rel ? `${rel}/${name}` : name);
      else if (name === 'index.html') routes.push(rel ? `/${rel}` : '/');
    }
  };
  walk(DIST, '');
  return routes.sort();
}

/** Does a site-relative href point at a built page or a file in dist/? */
export function targetExists(href: string): boolean {
  const path = decodeURI(href.split('#')[0].split('?')[0]);
  const rel = path.replace(/^\/+/, '');
  if (existsSync(join(DIST, rel, 'index.html'))) return true;
  if (path.endsWith('/')) return false;
  const file = join(DIST, rel);
  return existsSync(file) && statSync(file).isFile();
}

export function builtCss(): string {
  requireDist();
  const dir = join(DIST, '_astro');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n');
}

const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', rarr: '→', larr: '←', ndash: '–', mdash: '—',
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const hex = e[1] === 'x' || e[1] === 'X';
      return String.fromCodePoint(parseInt(e.slice(hex ? 2 : 1), hex ? 16 : 10));
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

/** What a reader sees: no scripts, styles or tags; entities decoded; whitespace collapsed. */
export function visibleText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every value of a double-quoted attribute, entities decoded. */
export function attrValues(html: string, attr: string): string[] {
  return [...html.matchAll(new RegExp(`\\s${attr}="([^"]*)"`, 'g'))].map((m) => decodeEntities(m[1]));
}

/** Every JSON-LD block, parsed (throws on invalid JSON). */
export function jsonLd(html: string): unknown[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
}
