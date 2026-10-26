import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOKENS, ZONES, TEXT_SWITCH_L, MUTED_MIX } from '../src/lib/palette.ts';
import { toOklab, mixOklab, contrast, type Lab } from './helpers/color.ts';

type Zone = keyof typeof ZONES;
const INK = toOklab(TOKENS['text-ink']);
const BONE = toOklab(TOKENS['text-bone']);
const textOn = (canvas: Lab): Lab => (canvas[0] < TEXT_SWITCH_L ? BONE : INK);
const mutedOn = (canvas: Lab): Lab => mixOklab(textOn(canvas), canvas, MUTED_MIX);
const focusOn = (canvas: Lab): Lab =>
  toOklab(canvas[0] < TEXT_SWITCH_L ? TOKENS.accent : TOKENS['accent-ink']);
const zone = (name: Zone): Lab => toOklab(ZONES[name]);

test('every zone keeps text and muted text at AA and the focus ring at 3:1', () => {
  for (const name of Object.keys(ZONES) as Zone[]) {
    const c = zone(name);
    assert.ok(contrast(textOn(c), c) >= 4.5, `${name}: text`);
    assert.ok(contrast(mutedOn(c), c) >= 4.5, `${name}: muted`);
    assert.ok(contrast(focusOn(c), c) >= 3, `${name}: focus ring`);
  }
});

test('same-tone seams stay AA across the whole blend', () => {
  const seams: [Zone, Zone][] = [['paper', 'mint'], ['mint', 'sky'], ['charcoal', 'royal'], ['royal', 'navy']];
  for (const [a, b] of seams) {
    for (let i = 0; i <= 20; i++) {
      const c = mixOklab(zone(a), zone(b), i / 20);
      assert.ok(contrast(textOn(c), c) >= 4.5, `${a}→${b} at ${i * 5}%: text`);
      assert.ok(contrast(mutedOn(c), c) >= 4.5, `${a}→${b} at ${i * 5}%: muted`);
    }
  }
});

test('only the Writing → Selected work seam switches the text tone', () => {
  const order: Zone[] = ['paper', 'mint', 'sky', 'charcoal', 'royal', 'navy'];
  const dark = (name: Zone) => ZONES[name][0] < TEXT_SWITCH_L;
  const switches = order.slice(1).filter((name, i) => dark(name) !== dark(order[i]));
  assert.deepEqual(switches, ['charcoal']);
});

test('reading surfaces stay AA', () => {
  const paper = toOklab(TOKENS.paper);
  const sunk = toOklab(TOKENS['paper-sunk']);
  const accentInk = toOklab(TOKENS['accent-ink']);
  const cases: [string, Lab, Lab][] = [
    ['ink on paper-sunk', INK, sunk],
    ['muted on paper-sunk', mixOklab(INK, paper, MUTED_MIX), sunk],
    ['accent-ink on paper', accentInk, paper],
    ['accent-ink on paper-sunk', accentInk, sunk],
    ['paper on accent-ink', paper, accentInk],
  ];
  for (const [label, fg, bg] of cases) assert.ok(contrast(fg, bg) >= 4.5, label);
});
