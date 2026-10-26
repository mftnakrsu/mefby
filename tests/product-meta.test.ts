import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fmtMonth, operatingSystem, productFacts, productLinks } from '../src/lib/productMeta.ts';
import type { Product } from '../types.ts';

const base: Product = {
  slug: 'demo',
  name: 'Demo',
  tagline: 'A demo product.',
  description: 'A demo product.',
  status: 'Open source',
  launched: '2026-10',
  stack: [],
  features: [],
  links: {},
  image: { src: '/demo.png', alt: 'A demo screenshot', width: 10, height: 10 },
};

test('launch months read as "Oct 2026"', () => {
  assert.equal(fmtMonth('2026-10'), 'Oct 2026');
  assert.equal(fmtMonth('soon'), 'soon');
});

test('facts list the license, interface languages and platforms that are set', () => {
  assert.deepEqual(productFacts(base), []);
  assert.deepEqual(
    productFacts({ ...base, license: 'MIT', languages: ['EN', 'TR'], platforms: ['Linux', 'macOS'] }),
    [
      { label: 'License', value: 'MIT' },
      { label: 'Interface', value: 'EN · TR' },
      { label: 'Runs on', value: 'Linux · macOS' },
    ],
  );
});

test('links come in priority order: app, download, docs, source', () => {
  const links = productLinks({
    ...base,
    links: { source: 'https://example.com/src', docs: 'https://example.com', download: 'https://example.com/dl' },
  });
  assert.deepEqual(links, [
    { href: 'https://example.com/dl', label: 'Download' },
    { href: 'https://example.com', label: 'Website & docs' },
    { href: 'https://example.com/src', label: 'Source on GitHub' },
  ]);
  assert.equal(productLinks({ ...base, links: { app: 'https://app.example.com' } })[0].label, 'Open the live app');
});

test('web apps run on "Web"; desktop and command-line tools list their systems', () => {
  assert.equal(operatingSystem(base), 'Web');
  assert.equal(operatingSystem({ ...base, platforms: ['Linux', 'Windows', 'macOS'] }), 'Linux, Windows, macOS');
});
