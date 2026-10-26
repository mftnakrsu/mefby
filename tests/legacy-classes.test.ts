// No page carries classes from the old zinc/emerald look. Tailwind's default
// palette is gone, so such classes would silently do nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allRoutes, readPage, attrValues } from './helpers/dist.ts';

const isLegacy = (token: string): boolean => {
  const utility = token.slice(token.lastIndexOf(':') + 1); // hover:bg-zinc-50 → bg-zinc-50
  return /-(?:zinc|emerald)-\d/.test(utility) || /^(?:bg|text|border)-(?:white|black)(?:\/\d+)?$/.test(utility);
};

test('no page carries classes from the old look', () => {
  for (const route of allRoutes()) {
    const legacy = attrValues(readPage(route), 'class')
      .flatMap((value) => value.split(/\s+/))
      .filter(isLegacy);
    assert.deepEqual(legacy, [], route);
  }
});
