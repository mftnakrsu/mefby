import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, allRoutes, readPage, visibleText } from './helpers/dist.ts';
import { PROFILE } from '../constants.ts';

const HOST = 'https://www.mefby.com';

test('every page has one main landmark, a skip link and the js flag', () => {
  for (const route of allRoutes()) {
    const html = readPage(route);
    assert.equal(html.match(/<main\b/g)?.length, 1, `${route}: one <main>`);
    assert.ok(html.includes('<main id="main"'), `${route}: main#main`);
    assert.ok(html.includes('href="#main"'), `${route}: skip link`);
    assert.ok(html.includes("document.documentElement.classList.add('js')"), `${route}: js flag`);
  }
});

test('reading pages get the static header with page links and contact icons', () => {
  const html = readPage('/essays');
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  assert.ok(!header.includes('data-dock'));
  for (const href of ['/projects', '/essays', '/products', 'mailto:']) {
    assert.ok(header.includes(`href="${href}`), href);
  }
  assert.ok(header.includes('<a href="/essays" aria-current="page"'));
});

test('reading pages end with the compact footer', () => {
  const html = readPage('/essays');
  const footer = html.slice(html.lastIndexOf('<footer'));
  assert.ok(footer.includes('href="/rss.xml"'));
  assert.ok(footer.includes(`href="${PROFILE.socials.medium}"`));
});

// Astro drops a bare space between two expressions in a template whose root is
// a ternary, which once printed "© 2026Meftun Akarsu".
test('the footer copyright line keeps the space between the year and the name', () => {
  const html = readPage('/essays');
  const footer = visibleText(html.slice(html.lastIndexOf('<footer')));
  assert.match(footer, new RegExp(`© \\d{4} ${PROFILE.owner}`));
});

// The site is served from www.mefby.com, never the old mefby.vercel.app.
test('canonical, og:url and hreflang links point at www.mefby.com on every page', () => {
  for (const route of allRoutes()) {
    const html = readPage(route);
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    assert.equal(canonical, route === '/' ? `${HOST}/` : `${HOST}${route}/`, `${route}: canonical`);
    assert.equal(html.match(/<meta property="og:url" content="([^"]*)"/)?.[1], canonical, `${route}: og:url`);
    for (const [, href] of html.matchAll(/<link rel="alternate" hreflang="[^"]*" href="([^"]*)"/g)) {
      assert.ok(href.startsWith(`${HOST}/`), `${route}: hreflang ${href}`);
    }
    assert.ok(!html.includes('mefby.vercel.app'), `${route}: old host`);
  }
});

test('the sitemap, the RSS feed and robots.txt use www.mefby.com', () => {
  const read = (file: string) => readFileSync(join(DIST, file), 'utf8');
  for (const file of ['sitemap-index.xml', 'sitemap-0.xml']) {
    const locs = [...read(file).matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
    assert.ok(locs.length > 0 && locs.every((loc) => loc.startsWith(`${HOST}/`)), file);
  }
  assert.ok(read('rss.xml').includes(`<link>${HOST}/</link>`), 'rss.xml channel link');
  assert.ok(read('robots.txt').split('\n').includes(`Sitemap: ${HOST}/sitemap-index.xml`), 'robots.txt');
});
