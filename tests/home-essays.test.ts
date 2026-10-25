import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickEssays } from '../src/lib/homeEssays.ts';

const essay = (id: string, data: Partial<{ draft: boolean; isTranslation: boolean }> = {}) => ({
  id,
  data: { draft: false, isTranslation: false, ...data },
});
const all = [essay('b'), essay('a'), essay('c', { draft: true }), essay('a-tr', { isTranslation: true })];

test('picks the listed essays in the listed order', () => {
  assert.deepEqual(pickEssays(all, ['a', 'b']).map((e) => e.id), ['a', 'b']);
});

test('a missing slug, a draft or a translation fails loudly', () => {
  assert.throws(() => pickEssays(all, ['nope']), /no essay "nope"/);
  assert.throws(() => pickEssays(all, ['c']), /"c" is a draft/);
  assert.throws(() => pickEssays(all, ['a-tr']), /"a-tr" is a translation/);
});
