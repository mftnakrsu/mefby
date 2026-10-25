import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allRoutes, readPage } from './helpers/dist.ts';
import { PROFILE } from '../constants.ts';

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
