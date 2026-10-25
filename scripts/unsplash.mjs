#!/usr/bin/env node
// Dev tool for project photos from Unsplash. Not part of the site.
//
//   node scripts/unsplash.mjs search "<query>"   up to ten landscape photos
//   node scripts/unsplash.mjs use <photo-id>      register the use, print the image block
//
// Follows the API guidelines: photos are hotlinked from images.unsplash.com,
// every use is registered through the photo's download_location, and the
// photographer is credited with a link. Reads UNSPLASH_ACCESS_KEY from .env
// (gitignored) and never prints it. Demo apps get 50 requests an hour; search
// caches its results so that `use` costs one request.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const API = 'https://api.unsplash.com';
const CACHE = 'node_modules/.cache/unsplash';
const UTM = 'utm_source=mefby&utm_medium=referral';

try {
  process.loadEnvFile('.env');
} catch {
  // no .env: the check below explains what to do
}
const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Add it to .env (see .env.example).');
  process.exit(1);
}

async function api(pathAndQuery) {
  const res = await fetch(new URL(pathAndQuery, API), {
    headers: { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' },
  });
  const left = res.headers.get('x-ratelimit-remaining');
  if (left !== null) console.error(`(requests left this hour: ${left})`);
  if (!res.ok) throw new Error(`Unsplash API: ${res.status} ${res.statusText} for ${pathAndQuery.split('?')[0]}`);
  return res.json();
}

// Unsplash+ photos need a paid license; they are served from plus.unsplash.com.
const isFree = (p) => !p.premium && !p.plus && new URL(p.urls.raw).hostname === 'images.unsplash.com';
const yamlString = (s) => JSON.stringify(String(s ?? '').replace(/\s+/g, ' ').trim());

const [command, arg] = process.argv.slice(2);

if (command === 'search' && arg) {
  const query = new URLSearchParams({ query: arg, orientation: 'landscape', per_page: '10', content_filter: 'high' });
  const { results } = await api(`/search/photos?${query}`);
  mkdirSync(CACHE, { recursive: true });
  for (const p of results.filter(isFree)) {
    writeFileSync(`${CACHE}/${p.id}.json`, JSON.stringify(p));
    console.log(`${p.id}  ${p.width}x${p.height}  ${p.user.name} (@${p.user.username})`);
    console.log(`  ${p.alt_description ?? p.description ?? '(no description)'}`);
    console.log(`  preview: ${p.urls.small}`);
  }
} else if (command === 'use' && arg) {
  let p;
  try {
    p = JSON.parse(readFileSync(`${CACHE}/${arg}.json`, 'utf8'));
  } catch {
    p = await api(`/photos/${encodeURIComponent(arg)}`);
  }
  if (!isFree(p)) throw new Error(`${arg} is an Unsplash+ photo: pick another one`);
  if (p.width < 1600) throw new Error(`${arg} is only ${p.width}px wide: pick another one`);
  const download = new URL(p.links.download_location);
  await api(download.pathname + download.search); // registers the use
  console.log(
    [
      'image:',
      `  src: ${yamlString(`${p.urls.raw}&w=1600&h=1000&fit=crop&q=80&auto=format`)}`,
      `  alt: ${yamlString(p.alt_description ?? p.description)}`,
      '  width: 1600',
      '  height: 1000',
      `  credit: ${yamlString(`Photo: ${p.user.name} / Unsplash`)}`,
      `  creditUrl: ${yamlString(`https://unsplash.com/@${p.user.username}?${UTM}`)}`,
    ].join('\n'),
  );
} else {
  console.error('usage: node scripts/unsplash.mjs search "<query>" | use <photo-id>');
  process.exit(2);
}
