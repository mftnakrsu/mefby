// Reading pages: an essay in a course and its Turkish twin, a course hub, a
// glossary and /essays.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { readPage, attrValues, jsonLd, visibleText } from './helpers/dist.ts';

const ESSAYS = new URL('../src/content/essays/', import.meta.url);
const canonical = readdirSync(ESSAYS)
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => ({
    slug: file.replace(/\.mdx$/, ''),
    frontmatter: readFileSync(new URL(file, ESSAYS), 'utf8').split('\n---')[0],
  }))
  .filter((e) => !/^isTranslation: true$/m.test(e.frontmatter) && !/^draft: true$/m.test(e.frontmatter));

test('an essay in a course: series label, meta row, prose and part navigation', () => {
  const html = readPage('/essays/build-your-first-rag');
  const text = visibleText(html);
  assert.match(text, /RAG from First Principles · Part 6 of \d+/);
  assert.match(text, /\d+ min read/);
  assert.ok(html.includes('<div class="prose">'), 'prose wrapper');
  const hrefs = attrValues(html, 'href');
  assert.ok(hrefs.includes('/essays/rag'), 'series label links to the hub');
  assert.ok(hrefs.includes('/essays/build-your-first-rag-tr'), 'language toggle');
  assert.ok(hrefs.includes('https://github.com/mftnakrsu/rag-by-hand/tree/main/part-06-build-your-first-rag'), 'code');
  const nav = html.slice(html.indexOf('aria-label="Series navigation"'));
  assert.match(visibleText(nav), /Part 5.*Part 7/);
  const types = jsonLd(html).map((d) => (d as { '@type'?: string })['@type']);
  assert.ok(types.includes('Article') && types.includes('BreadcrumbList'), 'structured data');
  assert.match(html, /<link rel="alternate" hreflang="tr" href="[^"]*\/essays\/build-your-first-rag-tr\/"/);
  assert.match(html, /<link rel="canonical" href="[^"]*\/essays\/build-your-first-rag\/?"/);
});

test('essay figures sit in the new frame with a mono "Fig" label', () => {
  const html = readPage('/essays/build-your-first-rag');
  assert.match(html, /<figure class="[^"]*\bborder-fg-line\b[^"]*\bbg-paper\b/);
  assert.match(html, /<span class="t-mono[^"]*">Fig 1<\/span>/);
});

test('the Turkish twin keeps its language and links back', () => {
  const html = readPage('/essays/build-your-first-rag-tr');
  assert.match(html, /<html lang="tr"/);
  assert.match(visibleText(html), /\d+ dk okuma/);
  assert.ok(attrValues(html, 'href').includes('/essays/build-your-first-rag'));
});

test('a course hub: opening, Part 1 button, glossary and code links, numbered parts', () => {
  const html = readPage('/essays/rag');
  assert.match(html, /<h1 id="course-title"[^>]*>RAG from First Principles<\/h1>/);
  assert.match(html, /<a href="\/essays\/[a-z0-9-]+"[^>]*\bbg-accent-ink\b[^>]*>Start with Part 1/);
  const hrefs = attrValues(html, 'href');
  assert.ok(hrefs.includes('/essays/rag-glossary'), 'glossary');
  assert.ok(hrefs.includes('https://github.com/mftnakrsu/rag-by-hand'), 'code');
  const indices = [...visibleText(html).matchAll(/\b(\d{2}) \/ (\d{2})\b/g)];
  assert.equal(indices[0]?.[1], '01');
  assert.equal(indices.length, Number(indices[0]?.[2]), 'one row per part');
});

test('a glossary links every part to its #glossary section', () => {
  const html = readPage('/essays/rag-glossary');
  assert.match(html, /<h1 id="glossary-title"[^>]*>RAG Glossary<\/h1>/);
  const links = attrValues(html, 'href').filter((h) => /^\/essays\/[a-z0-9-]+#glossary$/.test(h));
  const parts = attrValues(readPage('/essays/rag'), 'href').filter((h) => /^\/essays\/[a-z0-9-]+$/.test(h));
  assert.ok(links.length >= 12, `${links.length} glossary links`);
  for (const link of links) {
    const page = link.replace('#glossary', '');
    assert.ok(parts.includes(page), `${page} is a part of the course`);
    assert.ok(readPage(page).includes('id="glossary"'), `${page} has a Glossary heading`);
  }
});

test('/essays: the count line, three courses, and every essay listed', () => {
  const html = readPage('/essays');
  const text = visibleText(html);
  const bilingual = canonical.filter((e) => /^translationSlug: /m.test(e.frontmatter)).length;
  assert.ok(text.includes(`${canonical.length} essays · ${bilingual} also in Türkçe`), 'count line');
  assert.equal(text.match(/\d+ parts/g)?.length, 3, 'three course entries');
  const listed = new Set(attrValues(html, 'href').filter((h) => /^\/essays\/[a-z0-9-]+$/.test(h)));
  for (const e of canonical) assert.ok(listed.has(`/essays/${e.slug}`), e.slug);
  assert.equal(text.match(/most recent essay/g)?.length, 1, 'one "New" marker');
});
