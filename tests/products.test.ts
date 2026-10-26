// Products: the PRODUCTS data and its media (no build needed), then the built
// /products index and product pages.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PRODUCTS } from '../constants.ts';
import { operatingSystem, productLinks } from '../src/lib/productMeta.ts';
import { imageSize } from './helpers/imageSize.ts';
import { readPage, attrValues, jsonLd, visibleText } from './helpers/dist.ts';

const publicFile = (src: string) => fileURLToPath(new URL(`../public${src}`, import.meta.url));

test('four products, Oyla first', () => {
  assert.deepEqual(PRODUCTS.map((p) => p.slug), ['oyla', 'flashjot', 'ulgen', 'agent-buzzer']);
});

test('every product has a spec line, short copy and a link', () => {
  for (const p of PRODUCTS) {
    assert.ok(p.spec && p.spec.length >= 2 && p.spec.length <= 4, `${p.slug}: spec line`);
    assert.ok(p.tagline.length <= 160, `${p.slug}: tagline is ${p.tagline.length} characters`);
    assert.ok(p.summary && p.summary.length <= 200 && p.summary.endsWith('.'), `${p.slug}: summary`);
    assert.ok(productLinks(p).length > 0, `${p.slug}: at least one link`);
  }
});

test('product media exist and images match their declared size', () => {
  for (const p of PRODUCTS) {
    for (const img of [p.image, ...(p.gallery ?? []).flatMap((f) => f.images)]) {
      const file = publicFile(img.src);
      assert.ok(existsSync(file), `${p.slug}: ${img.src} is missing`);
      const { width, height } = imageSize(readFileSync(file));
      assert.deepEqual([width, height], [img.width, img.height], img.src);
      assert.ok(img.alt.length >= 20, `${img.src}: alt text`);
    }
    for (const src of p.video ? [p.video.src, p.video.poster] : []) {
      assert.ok(existsSync(publicFile(src)), `${p.slug}: ${src} is missing`);
    }
  }
});

test('every file under public/products is used by a product', () => {
  const used = new Set(
    PRODUCTS.flatMap((p) => [
      p.image.src,
      ...(p.gallery ?? []).flatMap((f) => f.images.map((img) => img.src)),
      ...(p.video ? [p.video.src, p.video.poster] : []),
    ]),
  );
  const files = readdirSync(publicFile('/products'), { recursive: true })
    .filter((f) => /\.[a-z0-9]+$/i.test(f) && !/(^|\/)\./.test(f))
    .map((f) => `/products/${f}`);
  assert.ok(files.length > 0, 'media found');
  assert.deepEqual(files.filter((f) => !used.has(f)), []);
});

test('/products shows every product as a card with a static image', () => {
  const html = readPage('/products');
  assert.match(html, /<h1 id="products-title"[^>]*>Products<\/h1>/);
  for (const p of PRODUCTS) assert.ok(html.includes(`href="/products/${p.slug}"`), p.slug);
  // GIF demos are for the product pages only.
  assert.deepEqual(attrValues(html, 'src').filter((src) => src.endsWith('.gif')), []);
});

test('each product page has its title, structured data and primary button', () => {
  for (const p of PRODUCTS) {
    const html = readPage(`/products/${p.slug}`);
    const h1 = html.match(/<h1 id="product-title"[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    assert.equal(visibleText(h1), p.name, `${p.slug}: h1`);

    const blocks = jsonLd(html) as { '@type'?: string; operatingSystem?: string }[];
    const app = blocks.find((b) => b['@type'] === 'SoftwareApplication');
    assert.equal(app?.operatingSystem, operatingSystem(p), `${p.slug}: operatingSystem`);
    assert.ok(blocks.some((b) => b['@type'] === 'BreadcrumbList'), `${p.slug}: breadcrumbs`);

    const primary = html.match(/<a href="([^"]*)"[^>]*\bbg-accent-ink\b/)?.[1];
    assert.equal(primary, productLinks(p)[0].href, `${p.slug}: primary button`);
  }
});

test('each product page shows every figure of its gallery, numbered in order', () => {
  for (const p of PRODUCTS) {
    const html = readPage(`/products/${p.slug}`);
    const labels = [...html.matchAll(/<span class="t-mono mr-2">Fig (\d+)<\/span>/g)].map((m) => Number(m[1]));
    assert.deepEqual(labels, (p.gallery ?? []).map((_, i) => i + 1), p.slug);
  }
});

test('product images are described, sized and decoded asynchronously; videos load lazily', () => {
  for (const p of PRODUCTS) {
    const html = readPage(`/products/${p.slug}`);
    for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
      for (const attr of [' alt="', ' width="', ' height="', ' decoding="async"']) {
        assert.ok(tag.includes(attr), `${p.slug}: ${attr.trim()} missing in ${tag}`);
      }
    }
    for (const tag of html.match(/<video\b[^>]*>/g) ?? []) {
      assert.ok(tag.includes(' preload="metadata"'), `${p.slug}: ${tag}`);
    }
  }
});

test('the copy says what works today and who runs what', () => {
  const buzzer = visibleText(readPage('/products/agent-buzzer'));
  assert.ok(buzzer.includes('Claude Code is the only agent wired up today'), 'agent-buzzer');
  const ulgen = visibleText(readPage('/products/ulgen'));
  assert.ok(ulgen.includes("EVREN, Türkiye's national model API"), 'Ülgen: how EVREN is described');
  assert.ok(ulgen.includes('not affiliated with EVREN'), 'Ülgen: independence');
});
