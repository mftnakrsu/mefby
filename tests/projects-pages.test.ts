import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { allRoutes, readPage, pageExists, targetExists, attrValues, jsonLd } from './helpers/dist.ts';

const DIR = new URL('../src/content/projects/', import.meta.url);
const sources = readdirSync(DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => {
    const body = readFileSync(new URL(f, DIR), 'utf8').replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
    return { slug: f.replace(/\.mdx$/, ''), hasBody: body.length > 0 };
  });

const GROUPS = [
  'Products', 'LLM systems & agents', 'Research', 'Edge & autonomy',
  'Computer vision', 'Data & automation', 'Learning & teaching',
];

test('/projects opens with its h1 and lists the groups in index order', () => {
  const html = readPage('/projects');
  assert.match(html, /<h1 id="projects-title"[^>]*>Projects<\/h1>/);
  const labels = [...html.matchAll(/<h2 id="group-[a-z]+"[^>]*>([^<]+)<\/h2>/g)].map((m) =>
    m[1].replace(/&amp;/g, '&'),
  );
  assert.equal(labels[0], 'Products');
  assert.deepEqual(labels, GROUPS.filter((g) => labels.includes(g)));
});

test('a project gets a page exactly when it has a write-up', () => {
  for (const s of sources) assert.equal(pageExists(`/projects/${s.slug}`), s.hasBody, s.slug);
});

test('index-only public projects link to their repository in a new tab', () => {
  const html = readPage('/projects');
  assert.match(html, /<a href="https:\/\/github\.com\/mftnakrsu\/SQL-Documentation" target="_blank" rel="noopener noreferrer"/);
});

test('every internal link and image on the site resolves', () => {
  const missing: string[] = [];
  for (const route of allRoutes()) {
    const html = readPage(route);
    for (const v of [...attrValues(html, 'href'), ...attrValues(html, 'src')]) {
      if (!v.startsWith('/') || v.startsWith('//')) continue;
      if (!targetExists(v)) missing.push(`${route} → ${v}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('every JSON-LD block parses', () => {
  for (const route of allRoutes()) assert.doesNotThrow(() => jsonLd(readPage(route)), route);
});

test('a private project page has breadcrumbs, the private line and project navigation', () => {
  const html = readPage('/projects/odigos');
  const types = jsonLd(html).map((d) => (d as { '@type'?: string })['@type']);
  assert.ok(types.includes('BreadcrumbList'));
  assert.ok(html.includes('Private codebase'));
  assert.ok(html.includes('aria-label="More projects"'));
});

test('a public project page has its link buttons', () => {
  const html = readPage('/projects/anpr-pipeline');
  assert.ok(html.includes('Source on GitHub'));
  assert.ok(html.includes('href="https://pypi.org/project/anpr-pipeline/"'));
  assert.ok(!html.includes('Private codebase'));
});
