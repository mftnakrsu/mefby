// The three numbered courses (essay series), shared by the home page, /essays
// and the course hubs. Part counts always come from the essays collection.
export type Series = 'rag' | 'agents' | 'evals';

export interface Course {
  series: Series;
  title: string;
  href: string;  // the course hub
  blurb: string; // one line for the home page and /essays
  repo: string;  // companion code
}

export const COURSES: readonly Course[] = [
  {
    series: 'rag',
    title: 'RAG from First Principles',
    href: '/essays/rag',
    blurb: 'Build a working RAG system by hand, one concept at a time, with runnable code and interactive figures.',
    repo: 'https://github.com/mftnakrsu/rag-by-hand',
  },
  {
    series: 'agents',
    title: 'Agents from First Principles',
    href: '/essays/agents',
    blurb: 'Grow one agent from a bare loop into a durable, observable, secured production system.',
    repo: 'https://github.com/mftnakrsu/agents-by-hand',
  },
  {
    series: 'evals',
    title: 'Evals from First Principles',
    href: '/essays/evals',
    blurb: 'Build the measurement stack by hand, one concept at a time, so you can tell a real 2% gain from noise.',
    repo: 'https://github.com/mftnakrsu/evals-by-hand',
  },
];

/** The fields of an essay entry that course listings need. */
export interface SeriesEntry {
  id: string;
  data: { series: Series; seriesOrder?: number; draft: boolean; isTranslation: boolean };
}

/** A course's published parts in part order (drafts and translations left out). */
export function courseParts<T extends SeriesEntry>(essays: readonly T[], series: Series): T[] {
  return essays
    .filter(
      (e) => e.data.series === series && e.data.seriesOrder != null && !e.data.draft && !e.data.isTranslation,
    )
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}
