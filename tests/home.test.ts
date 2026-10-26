// The built home page: zones in order, navigation, what each section shows,
// and the JavaScript budget.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, readPage, attrValues, visibleText } from './helpers/dist.ts';
import { HOME_SECTIONS } from '../src/lib/sections.ts';
import { EXPERIENCE, HOME_ESSAYS, PUBLICATIONS } from '../constants.ts';

const ORDER = ['top', ...HOME_SECTIONS.map((s) => s.id), 'contact'];

/** The HTML of one zone: from its id to the next zone's id. */
function zone(page: string, id: string): string {
  const start = page.indexOf(`id="${id}"`);
  const next = ORDER[ORDER.indexOf(id) + 1];
  return page.slice(start, next ? page.indexOf(`id="${next}"`) : undefined);
}

const ESSAYS = new URL('../src/content/essays/', import.meta.url);
const canonicalEssays = readdirSync(ESSAYS).filter((file) => {
  if (!file.endsWith('.mdx')) return false;
  const frontmatter = readFileSync(new URL(file, ESSAYS), 'utf8').split('\n---')[0];
  return !/^isTranslation: true$/m.test(frontmatter) && !/^draft: true$/m.test(frontmatter);
}).length;

test('hero, five numbered sections and the footer, in page order', () => {
  const page = readPage('/');
  const ids = [...page.matchAll(/<(?:header|section|footer)\b[^>]*?\sid="([a-z]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ORDER);
  assert.match(page, /<h1 [^>]*>Meftun Akarsu<\/h1>/);
  HOME_SECTIONS.forEach((s, i) => {
    assert.ok(page.includes(`>0${i + 1} / 05<`), `${s.id}: kicker`);
    assert.match(page, new RegExp(`<h2 id="${s.id}-title"[^>]*>${s.title}</h2>`), `${s.id}: title`);
  });
});

test('the dock and the rail both link every section', () => {
  const ids = HOME_SECTIONS.map((s) => s.id);
  assert.deepEqual(attrValues(readPage('/'), 'data-section-link'), [...ids, ...ids]);
});

test('products: Oyla leads with its video, steps and screenshots; the rest follow', () => {
  const products = zone(readPage('/'), 'products');
  assert.match(products, /<video\b[^>]*\spreload="metadata"/);
  const srcs = attrValues(products, 'src');
  for (const shot of ['phone-vote', 'phone-thanks', 'present-results', 'word-cloud']) {
    assert.ok(srcs.includes(`/products/oyla/${shot}.png`), shot);
  }
  assert.deepEqual(srcs.filter((src) => src.endsWith('.gif')), [], 'no GIFs on the home page');
  const hrefs = attrValues(products, 'href');
  for (const slug of ['oyla', 'flashjot', 'ulgen', 'agent-buzzer']) {
    assert.ok(hrefs.includes(`/products/${slug}`), slug);
  }
  assert.ok(hrefs.includes('/products'), 'All products');
  const text = visibleText(products);
  for (const step of ['Create', 'Share the code', 'Watch answers arrive']) assert.ok(text.includes(step), step);
});

test('writing: three courses, the hand-picked essays in order, Medium and the essay count', () => {
  const writing = zone(readPage('/'), 'writing');
  const hrefs = attrValues(writing, 'href');
  for (const series of ['rag', 'agents', 'evals']) {
    assert.ok(hrefs.includes(`/essays/${series}`), `${series}: hub`);
    assert.ok(hrefs.includes(`https://github.com/mftnakrsu/${series}-by-hand`), `${series}: code`);
  }
  const picked = hrefs.filter((h) => HOME_ESSAYS.some((slug) => h === `/essays/${slug}`));
  assert.deepEqual(picked, HOME_ESSAYS.map((slug) => `/essays/${slug}`));
  const medium = hrefs.filter((h) => h.startsWith('https://medium.com/@meftunakarsu/'));
  assert.ok(medium.length >= 1 && medium.length <= 4, `${medium.length} Medium posts`);
  const text = visibleText(writing);
  assert.equal(text.match(/\d+ parts/g)?.length, 3, 'a part count per course');
  assert.ok(text.includes(`All ${canonicalEssays} essays`), `All ${canonicalEssays} essays`);
  assert.ok(text.includes('All posts on Medium'));
});

test('selected work: eight cards in four groups, in the approved order', () => {
  const work = zone(readPage('/'), 'work');
  const cards = attrValues(work, 'href').filter((h) => /^\/projects\/[a-z0-9-]+$/.test(h));
  assert.deepEqual(cards, [
    '/projects/odigos', '/projects/eaa-gds-chatbots', '/projects/factsheet-tool',
    '/projects/anpr-pipeline', '/projects/yolo-pool',
    '/projects/rag-vs-agentic', '/projects/video-generation',
    '/projects/offline-voice-command',
  ]);
  const labels = [...work.matchAll(/<h3 id="work-[a-z]+"[^>]*>([^<]+)<\/h3>/g)].map((m) => m[1]);
  assert.deepEqual(labels, ['Production LLM systems', 'Computer vision', 'Research', 'Edge AI']);
  assert.ok(attrValues(work, 'href').includes('/projects'), 'All projects');
});

test('experience and publications come from the résumé data', () => {
  const page = readPage('/');
  const experience = visibleText(zone(page, 'experience'));
  for (const e of EXPERIENCE) assert.ok(experience.includes(e.company), e.company);
  assert.ok(experience.includes('Education') && experience.includes('Certifications'));
  const publications = zone(page, 'publications');
  for (const p of PUBLICATIONS) {
    assert.ok(visibleText(publications).includes(p.title), p.title);
    if (p.link) assert.ok(attrValues(publications, 'href').includes(p.link), p.link);
  }
});

test('the home page ships under 5 KB of its own JavaScript', () => {
  const page = readPage('/');
  let bytes = 0;
  for (const m of page.matchAll(/<script type="module"(?: src="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/g)) {
    bytes += m[1] ? statSync(join(DIST, m[1])).size : Buffer.byteLength(m[2]);
  }
  assert.ok(bytes > 0 && bytes < 5 * 1024, `${bytes} bytes`);
});
