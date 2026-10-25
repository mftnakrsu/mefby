import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  groupByCategory,
  featuredGroups,
  pageSequence,
  projectHref,
  hasPage,
  yearSpan,
  type ProjectLike,
} from '../src/lib/projects.ts';

type Data = ProjectLike['data'];
const entry = (
  id: string,
  data: Partial<Data> & Pick<Data, 'title' | 'year' | 'category'>,
  body = '',
): ProjectLike => ({ id, body, data: { private: false, links: {}, ...data } });

const odigos = entry('odigos', { title: 'Odigos', year: 2025, category: 'llm', private: true, featured: { group: 'llm', order: 1 } }, 'Write-up.');
const anpr = entry('anpr-pipeline', { title: 'anpr-pipeline', year: 2022, category: 'vision', links: { repo: 'https://github.com/x/anpr' }, featured: { group: 'vision', order: 1 } }, 'Write-up.');
const sql = entry('sql-notes', { title: 'SQL notes', year: 2022, category: 'learning', links: { repo: 'https://github.com/x/sql' } });
const secret = entry('secret', { title: 'Secret tool', year: 2023, category: 'learning', private: true });
const jira = entry('jira-mcp-server', { title: 'JIRA MCP server', year: 2026, category: 'llm', links: { repo: 'https://github.com/x/jira' } }, 'Write-up.');
const all = [sql, anpr, secret, odigos, jira];

test('groups follow the index order, newest first inside a group', () => {
  const groups = groupByCategory(all);
  assert.deepEqual(groups.map((g) => g.category), ['llm', 'vision', 'learning']);
  assert.deepEqual(groups[0].items.map((p) => p.id), ['jira-mcp-server', 'odigos']);
  assert.deepEqual(groups[2].items.map((p) => p.id), ['secret', 'sql-notes']);
});

test('a write-up makes a page; other rows link to the repo or nowhere', () => {
  assert.equal(hasPage(odigos), true);
  assert.equal(hasPage(sql), false);
  assert.equal(projectHref(odigos), '/projects/odigos');
  assert.equal(projectHref(sql), 'https://github.com/x/sql');
  assert.equal(projectHref(secret), null);
});

test('pages run in index order; featured entries group by home section', () => {
  assert.deepEqual(pageSequence(all).map((p) => p.id), ['jira-mcp-server', 'odigos', 'anpr-pipeline']);
  assert.deepEqual(
    featuredGroups(all).map((g) => [g.group, g.items.map((p) => p.id)]),
    [['llm', ['odigos']], ['vision', ['anpr-pipeline']]],
  );
});

test('the year span uses an en dash', () => {
  assert.equal(yearSpan(all), '2022–2026');
  assert.equal(yearSpan([sql]), '2022');
});
