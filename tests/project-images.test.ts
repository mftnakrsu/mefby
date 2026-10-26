// Project images: every project page (and so every home card) has one; local
// files match their declared size; Unsplash photos are hotlinked, cropped and
// credited with a link, as the Unsplash API guidelines require.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { imageSize } from './helpers/imageSize.ts';
import { readPage, attrValues } from './helpers/dist.ts';

interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: string;
  creditUrl?: string;
}

const DIR = new URL('../src/content/projects/', import.meta.url);
const PUBLIC = fileURLToPath(new URL('../public', import.meta.url));
const UNSPLASH = /^https:\/\/images\.unsplash\.com\/photo-[\w-]+\?/;

const entries = readdirSync(DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const text = readFileSync(new URL(file, DIR), 'utf8');
    const [, fm = '', body = ''] = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) ?? [];
    // The image block: two-space-indented "key: value" lines under "image:".
    const block = fm.match(/^image:[ \t]*(?:#.*)?\n((?: {2}.+\n?)+)/m)?.[1];
    const image = block
      ? (Object.fromEntries(
          [...block.matchAll(/^ {2}(\w+): (.+)$/gm)].map(([, k, v]) => [k, v.startsWith('"') ? JSON.parse(v) : Number(v)]),
        ) as unknown as Image)
      : undefined;
    return {
      slug: file.replace(/\.mdx$/, ''),
      hasPage: body.trim().length > 0,
      isPrivate: /^private:\s*true\b/im.test(fm),
      isFeatured: /^featured:/m.test(fm),
      image,
    };
  });

const withImage = entries.filter((e): e is typeof e & { image: Image } => Boolean(e.image));

test('every project page and home card has an image; index-only rows have none', () => {
  for (const e of entries) assert.equal(Boolean(e.image), e.hasPage || e.isFeatured, e.slug);
});

test('local images live in the project folder and match their declared size', () => {
  for (const e of withImage.filter((x) => !UNSPLASH.test(x.image.src))) {
    const { src, width, height } = e.image;
    assert.ok(src.startsWith(`/projects/${e.slug}/`), `${e.slug}: ${src}`);
    const file = `${PUBLIC}${src}`;
    assert.ok(existsSync(file), `${e.slug}: ${src} is missing`);
    assert.deepEqual(imageSize(readFileSync(file)), { width, height }, e.slug);
  }
});

test('private projects use Unsplash photos only', () => {
  for (const e of withImage.filter((x) => x.isPrivate)) assert.match(e.image.src, UNSPLASH, e.slug);
});

test('Unsplash photos are hotlinked at a 1600×1000 crop with a linked credit', () => {
  for (const e of withImage.filter((x) => UNSPLASH.test(x.image.src))) {
    const { src, width, height, credit, creditUrl } = e.image;
    const params = new URL(src).searchParams;
    assert.ok(params.get('ixid'), `${e.slug}: ixid`);
    assert.deepEqual(
      ['w', 'h', 'fit', 'q', 'auto'].map((k) => params.get(k)),
      ['1600', '1000', 'crop', '80', 'format'],
      e.slug,
    );
    assert.deepEqual([width, height], [1600, 1000], e.slug);
    assert.match(credit ?? '', /^Photo: .+ \/ Unsplash$/, e.slug);
    assert.match(creditUrl ?? '', /^https:\/\/unsplash\.com\/@[\w-]+\?utm_source=mefby&utm_medium=referral$/, e.slug);
  }
});

test('alt texts are short descriptions and no image is used twice', () => {
  const srcs = withImage.map((e) => e.image.src);
  assert.equal(new Set(srcs).size, srcs.length);
  for (const e of withImage) {
    const { alt } = e.image;
    assert.ok(alt.length >= 20 && alt.length <= 160, `${e.slug}: ${alt.length} characters`);
    assert.ok(!/^(an? )?(image|photo|picture) of/i.test(alt), `${e.slug}: alt starts with "image of"`);
  }
});

test('project pages show the image with its size, and the credit as a link', () => {
  for (const e of withImage.filter((x) => x.hasPage)) {
    const html = readPage(`/projects/${e.slug}`);
    const tag = [...html.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]).find((t) => attrValues(t, 'src')[0] === e.image.src);
    assert.ok(tag, `${e.slug}: figure image`);
    assert.deepEqual(attrValues(tag, 'width'), [String(e.image.width)], e.slug);
    assert.deepEqual(attrValues(tag, 'height'), [String(e.image.height)], e.slug);
    assert.deepEqual(attrValues(tag, 'decoding'), ['async'], e.slug);
    if (e.image.creditUrl) assert.ok(attrValues(html, 'href').includes(e.image.creditUrl), `${e.slug}: credit link`);
  }
});
