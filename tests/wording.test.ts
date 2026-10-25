// Built pages follow the wording rules in tests/wording.local.json (skipped
// without it). Task 11 adds the home page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allRoutes, readPage, visibleText, attrValues } from './helpers/dist.ts';
import { loadWordingRules, findTerms, NO_WORDING_LIST } from './helpers/wording.ts';

const rules = loadWordingRules();
const skip = rules ? false : NO_WORDING_LIST;

/** What a visitor or a search engine reads: visible text, alt text, labels and meta tags. */
const readable = (html: string): string =>
  [visibleText(html), ...['alt', 'aria-label', 'content'].flatMap((attr) => attrValues(html, attr))].join('\n');

test('project and product pages follow the wording rules', { skip }, () => {
  for (const route of allRoutes().filter((r) => /^\/(projects|products)(\/|$)/.test(r))) {
    const html = readPage(route);
    const text = readable(html);
    assert.deepEqual(findTerms(text, rules!.everywhere), [], route);
    if (html.includes('Private codebase')) {
      assert.deepEqual(findTerms(text, rules!.privatePages), [], `${route} (private)`);
    }
  }
});
