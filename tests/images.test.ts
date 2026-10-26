import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unsplashSrcset } from '../src/lib/images.ts';

const SRC = 'https://images.unsplash.com/photo-1?ixid=abc&ixlib=rb-4.1.0&w=1600&h=1000&fit=crop&q=80&auto=format';

test('Unsplash photos get three widths with the same crop', () => {
  const parts = (unsplashSrcset(SRC, 1600, 1000) ?? '').split(', ');
  assert.equal(parts.length, 3);
  assert.ok(parts[0].endsWith('w=640&h=400&fit=crop&q=80&auto=format 640w'), parts[0]);
  assert.ok(parts[1].endsWith('w=960&h=600&fit=crop&q=80&auto=format 960w'), parts[1]);
  assert.ok(parts[2].endsWith('w=1600&h=1000&fit=crop&q=80&auto=format 1600w'), parts[2]);
});

test('local images get no srcset', () => {
  assert.equal(unsplashSrcset('/projects/anpr-pipeline/flowchart.png', 1200, 800), undefined);
});
