import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COURSES, courseParts, type SeriesEntry } from '../src/lib/courses.ts';

type Data = SeriesEntry['data'];
const part = (id: string, series: Data['series'], seriesOrder?: number, extra: Partial<Data> = {}): SeriesEntry => ({
  id,
  data: { series, seriesOrder, draft: false, isTranslation: false, ...extra },
});

test('three courses in order, each with its hub and companion repository', () => {
  assert.deepEqual(COURSES.map((c) => c.series), ['rag', 'agents', 'evals']);
  for (const c of COURSES) {
    assert.equal(c.href, `/essays/${c.series}`);
    assert.equal(c.repo, `https://github.com/mftnakrsu/${c.series}-by-hand`);
    assert.equal(c.glossary, `/essays/${c.series}-glossary`);
  }
});

test('a course lists its published parts in part order', () => {
  const essays = [
    part('rag-2', 'rag', 2),
    part('rag-1', 'rag', 1),
    part('agents-1', 'agents', 1),
    part('rag-3', 'rag', 3, { draft: true }),
    part('rag-1-tr', 'rag', 1, { isTranslation: true }),
    part('standalone', 'rag'),
  ];
  assert.deepEqual(courseParts(essays, 'rag').map((e) => e.id), ['rag-1', 'rag-2']);
  assert.deepEqual(courseParts(essays, 'evals'), []);
});
