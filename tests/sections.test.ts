import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_SECTIONS, sectionKicker, twoDigits } from '../src/lib/sections.ts';

test('home sections are numbered 01–05 in page order', () => {
  assert.deepEqual(
    HOME_SECTIONS.map((s) => s.id),
    ['products', 'writing', 'work', 'experience', 'publications'],
  );
  assert.equal(sectionKicker('products'), '01 / 05');
  assert.equal(sectionKicker('publications'), '05 / 05');
  assert.equal(twoDigits(3), '03');
});
