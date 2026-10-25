// Wording rules for public pages. The term lists are not part of the
// repository: they live in tests/wording.local.json (gitignored). Without
// that file the wording checks are skipped.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface WordingRules {
  everywhere: string[];
  privatePages: string[];
  home: string[];
}

const FILE = fileURLToPath(new URL('../wording.local.json', import.meta.url));

export const NO_WORDING_LIST = 'no local wording list (tests/wording.local.json)';

export function loadWordingRules(): WordingRules | null {
  return existsSync(FILE) ? (JSON.parse(readFileSync(FILE, 'utf8')) as WordingRules) : null;
}

/** The patterns in `list` that occur in `text` (case-insensitive). */
export const findTerms = (text: string, list: readonly string[]): string[] =>
  list.filter((source) => new RegExp(source, 'iu').test(text));
