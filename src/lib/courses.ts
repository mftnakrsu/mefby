// The three numbered courses (essay series), shared by the home page, /essays
// and the course hubs. Part counts always come from the essays collection.
export type Series = 'rag' | 'agents' | 'evals';

export interface Course {
  series: Series;
  title: string;
  short: string;           // "RAG", "Agents", "Evals": the glossary's title
  href: string;            // the course hub
  glossary: string;        // the glossary page
  blurb: string;           // one line for the home page and /essays
  repo: string;            // companion code
  coreParts: number;       // parts 1..coreParts are the core track; later ones the frontier track
  intro: string;           // the hub's opening paragraph
  frontierNote: string;    // above the frontier track
  description: string;     // the hub's meta description
  listDescription: string; // the hub's ItemList JSON-LD description
}

export const COURSES: readonly Course[] = [
  {
    series: 'rag',
    title: 'RAG from First Principles',
    short: 'RAG',
    href: '/essays/rag',
    glossary: '/essays/rag-glossary',
    blurb: 'Build a working RAG system by hand, one concept at a time, with runnable code and interactive figures.',
    repo: 'https://github.com/mftnakrsu/rag-by-hand',
    coreParts: 12,
    intro:
      'Most RAG tutorials hand you a framework and a black box. This one builds the whole thing by hand, one concept at a time, so you understand every moving part: why RAG exists, how meaning becomes geometry, how retrieval actually ranks, and how to make it fast, cheap, and safe in production. Every part runs on a single example you can follow end to end, with runnable code and an interactive figure.',
    frontierNote:
      'Optional 2026-frontier material you reach for once the core pipeline is solid. Each builds on the core, not on the part before it.',
    description:
      'A from-scratch course on Retrieval-Augmented Generation: build a working RAG system by hand, one concept at a time, with runnable code and interactive figures.',
    listDescription: 'A from-scratch course on Retrieval-Augmented Generation, built by hand.',
  },
  {
    series: 'agents',
    title: 'Agents from First Principles',
    short: 'Agents',
    href: '/essays/agents',
    glossary: '/essays/agents-glossary',
    blurb: 'Grow one agent from a bare loop into a durable, observable, secured production system.',
    repo: 'https://github.com/mftnakrsu/agents-by-hand',
    coreParts: 11,
    intro:
      'Most agent tutorials hand you a framework and a black box. This one builds the whole thing by hand, one concept at a time, so you understand every moving part: the reason/act/observe loop, typed tools, memory, planning, reflection, durability, and how to make a multi-agent system observable, secure, and graded in production. Retrieval is demoted to one tool the agent may call. Every part runs on a single example you can follow end to end, with runnable code and an interactive figure.',
    frontierNote:
      'The protocol wire and multi-agent territory you reach for once the single agent is solid: MCP, sandboxed code, supervisors and handoffs, A2A, security, and evaluation.',
    description:
      'A from-scratch course on building LLM agents: grow one agent from a bare loop into a durable, observable, secured production system, one concept at a time, with runnable code and interactive figures.',
    listDescription: 'A from-scratch course on building LLM agents, built by hand.',
  },
  {
    series: 'evals',
    title: 'Evals from First Principles',
    short: 'Evals',
    href: '/essays/evals',
    glossary: '/essays/evals-glossary',
    blurb: 'Build the measurement stack by hand, one concept at a time, so you can tell a real 2% gain from noise.',
    repo: 'https://github.com/mftnakrsu/evals-by-hand',
    coreParts: 11,
    intro:
      'Most eval advice is prose and dashboards. This one builds the measurement stack by hand, one concept at a time, so you can tell a real 2% gain from noise: metrics and the confusion matrix, golden sets, annotator agreement, LLM-as-judge and its biases, confidence intervals, significance and power, pass@k, arenas, calibration, and a CI regression gate. Every part runs on a small labeled set you can trace end to end, with runnable code and an interactive figure.',
    frontierNote:
      'The production and agent territory you reach for once the offline gate is solid: the eval flywheel, online A/B and guardrail metrics, agent-trajectory evals, and a tiny end-to-end harness.',
    description:
      'A from-scratch course on evaluating LLM systems: build the measurement stack by hand, one concept at a time, so you can tell a real 2% gain from noise.',
    listDescription: 'A from-scratch course on evaluating LLM systems, built by hand.',
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
