// Build-time helpers for rendering essay metadata (date, reading time, languages,
// tags). Shared by the home page preview and the /essays archive so both stay in sync.

export const fmtDate = (d: Date): string =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// Format a date string, falling back to the raw value if it isn't a valid date.
export const fmtMaybe = (s: string): string => {
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : fmtDate(d);
};

// ~200 wpm reading time from the raw markdown body, counting prose rather than
// MDX/JSX syntax (imports, <Diagram> blocks, fenced code, markdown punctuation).
export const readingTime = (body: string): number => {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^import\s.+$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~\-\[\]()|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// Every essay is bilingual; surface its languages EN-first regardless of canonical.
export const essayLangs = (lang: 'en' | 'tr', hasTranslation: boolean): string[] =>
  hasTranslation ? ['EN', 'TR'] : [lang.toUpperCase()];

// Drop language-marker tags (already shown via the language badge); keep 3 topics.
export const topicTags = (tags: string[]): string[] =>
  tags
    .filter((t) => !['english', 'türkçe', 'turkce', 'turkish'].includes(t.toLowerCase()))
    .slice(0, 3);
