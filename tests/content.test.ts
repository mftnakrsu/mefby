// Source-level checks on src/content/projects/*.mdx (no build needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { loadWordingRules, findTerms, NO_WORDING_LIST } from './helpers/wording.ts';

const DIR = new URL('../src/content/projects/', import.meta.url);

// These guards fail closed. A frontmatter key is found however YAML spells it
// (quoted key, space before the colon, any quoting or case of the value, a
// trailing comment, block or flow style), so an unexpected spelling is checked
// instead of skipped; what cannot be read at all fails a test of its own.
const frontmatterValue = (frontmatter: string, key: string): string | undefined => {
  // The rest of the key's line, minus surrounding quotes; undefined when the key is absent.
  const raw = frontmatter.match(new RegExp(`^["']?${key}["']?[ \\t]*:[ \\t]*(.*)$`, 'im'))?.[1];
  return raw?.replace(/^(["'])(.*)\1\s*$/, '$2');
};

const entries = readdirSync(DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const text = readFileSync(new URL(file, DIR), 'utf8');
    const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) throw new Error(`${file}: no frontmatter`);
    const privateFlag = frontmatterValue(m[1], 'private');
    return {
      slug: file.replace(/\.mdx$/, ''),
      text,
      frontmatter: m[1],
      body: m[2].trim(),
      // Private unless the key is absent or says false: `True`, `true # note` and "true" all count.
      isPrivate: privateFlag !== undefined && !/^false\b/i.test(privateFlag),
      isFeatured: frontmatterValue(m[1], 'featured') !== undefined,
      // Title and summary: what /projects and the home cards show.
      listing: [frontmatterValue(m[1], 'title'), frontmatterValue(m[1], 'summary')].join('\n'),
    };
  });

const proseWords = (body: string) =>
  body
    .replace(/^#{1,6} .*$/gm, ' ')
    .replace(/[*_`>[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

test('summaries are one sentence of at most 200 characters', () => {
  for (const e of entries) {
    const summary = e.frontmatter.match(/^summary: "(.*)"$/m)?.[1];
    assert.ok(summary, `${e.slug}: summary`);
    assert.ok(summary.length <= 200, `${e.slug}: ${summary.length} characters`);
    assert.ok(/[.]$/.test(summary), `${e.slug}: ends with a full stop`);
  }
});

// `listing` reads these two lines. Any other form (unquoted, single-quoted, folded,
// missing) could leave text out of the wording checks, so it fails here instead.
test('every title and summary is one double-quoted line, the form the wording checks read', () => {
  for (const e of entries) {
    assert.match(e.frontmatter, /^title: ".+"$/m, `${e.slug}: title`);
    assert.match(e.frontmatter, /^summary: ".+"$/m, `${e.slug}: summary`);
  }
});

test('write-ups are 120–350 words in 2–4 sections, starting with Overview', () => {
  for (const e of entries.filter((x) => x.body)) {
    const n = proseWords(e.body);
    assert.ok(n >= 120 && n <= 350, `${e.slug}: ${n} words`);
    const headings = [...e.body.matchAll(/^(#{1,6}) (.+)$/gm)];
    assert.ok(headings.every((h) => h[1] === '##'), `${e.slug}: only ## headings`);
    assert.equal(headings[0]?.[2], 'Overview', `${e.slug}: first heading`);
    assert.ok(headings.length >= 2 && headings.length <= 4, `${e.slug}: ${headings.length} sections`);
    assert.ok(!/^import\s|<[A-Za-z]|```|!\[/m.test(e.body), `${e.slug}: plain prose only`);
  }
});

test('private projects carry no repository link', () => {
  for (const e of entries.filter((x) => x.isPrivate)) {
    // A `repo` key in any spelling: block or flow style, quoted or not.
    assert.ok(!/\brepo["']?\s*:/.test(e.frontmatter), e.slug);
  }
});

const rules = loadWordingRules();
test('project files follow the wording rules', { skip: rules ? false : NO_WORDING_LIST }, () => {
  for (const e of entries) {
    assert.deepEqual(findTerms(e.text, rules!.everywhere), [], e.slug);
    if (e.isPrivate) assert.deepEqual(findTerms(e.text, rules!.privatePages), [], `${e.slug} (private)`);
    // Every title and summary is listed on /projects next to the private work.
    assert.deepEqual(findTerms(e.listing, rules!.privatePages), [], `${e.slug} (listing)`);
    if (e.isFeatured) assert.deepEqual(findTerms(e.listing, rules!.home), [], `${e.slug} (home card)`);
  }
});
