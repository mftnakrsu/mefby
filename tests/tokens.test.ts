import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TOKENS, css } from '../src/lib/palette.ts';
import { builtCss } from './helpers/dist.ts';

const source = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

test('global.css declares every token with the value in palette.ts', () => {
  for (const [name, value] of Object.entries(TOKENS)) {
    const line = `--${name}: ${css(value)};`;
    assert.ok(source.includes(line), line);
  }
});

test('the live tokens follow the switch and muted rules', () => {
  assert.match(source, /@property --fg \{/);
  assert.match(source, /:root\[data-tone="dark"\] \{\s*--fg: var\(--text-bone\);\s*--focus: var\(--accent\);/);
  assert.ok(source.includes('--fg-muted: color-mix(in oklab, var(--fg), var(--canvas) 30%);'));
  assert.ok(source.includes('--color-*: initial;'), "Tailwind's default palette is switched off");
});

test('the build ships the three font families and no Inter', () => {
  const built = builtCss();
  for (const family of ['Bricolage Grotesque Variable', 'Hanken Grotesk Variable', 'Geist Mono Variable']) {
    assert.ok(built.includes(family), family);
  }
  assert.ok(!built.includes('Inter Variable'));
});
