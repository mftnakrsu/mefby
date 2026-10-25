// Grouping, ordering and link rules for the projects collection. Pure
// functions over a minimal shape, so they run in unit tests without Astro;
// CollectionEntry<'projects'> satisfies ProjectLike.

export type Category = 'llm' | 'research' | 'edge' | 'vision' | 'data' | 'learning';
export type FeaturedGroup = 'llm' | 'vision' | 'research' | 'edge';

export interface ProjectLike {
  id: string;
  body?: string;
  data: {
    title: string;
    year: number;
    category: Category;
    private: boolean;
    links: { repo?: string; site?: string; demo?: string; paper?: string; package?: string };
    featured?: { group: FeaturedGroup; order: number };
  };
}

export const CATEGORY_ORDER: Category[] = ['llm', 'research', 'edge', 'vision', 'data', 'learning'];

export const CATEGORY_LABELS: Record<Category, string> = {
  llm: 'LLM systems & agents',
  research: 'Research',
  edge: 'Edge & autonomy',
  vision: 'Computer vision',
  data: 'Data & automation',
  learning: 'Learning & teaching',
};

/** Groups of the home page's Selected work, in order. */
export const FEATURED_ORDER: FeaturedGroup[] = ['llm', 'vision', 'research', 'edge'];

export const FEATURED_LABELS: Record<FeaturedGroup, string> = {
  llm: 'Production LLM systems',
  vision: 'Computer vision',
  research: 'Research',
  edge: 'Edge AI',
};

/** An entry with a write-up (a non-empty MDX body) gets its own page. */
export const hasPage = (p: ProjectLike): boolean => Boolean(p.body?.trim());

/** Where a row or card links: the project's page, else its repo or site, else nowhere. */
export function projectHref(p: ProjectLike): string | null {
  if (hasPage(p)) return `/projects/${p.id}`;
  return p.data.links.repo ?? p.data.links.site ?? null;
}

const newestFirst = (a: ProjectLike, b: ProjectLike) =>
  b.data.year - a.data.year || a.data.title.localeCompare(b.data.title);

/** Category groups in index order, each newest first then by title; empty groups dropped. */
export function groupByCategory<T extends ProjectLike>(items: readonly T[]): { category: Category; items: T[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((p) => p.data.category === category).sort(newestFirst),
  })).filter((g) => g.items.length > 0);
}

/** Featured entries in home-section order, each group sorted by `featured.order`. */
export function featuredGroups<T extends ProjectLike>(items: readonly T[]): { group: FeaturedGroup; items: T[] }[] {
  return FEATURED_ORDER.map((group) => ({
    group,
    items: items
      .filter((p) => p.data.featured?.group === group)
      .sort((a, b) => (a.data.featured?.order ?? 0) - (b.data.featured?.order ?? 0)),
  })).filter((g) => g.items.length > 0);
}

/** Entries with a page, in index order: drives /projects/<slug> and its previous/next links. */
export function pageSequence<T extends ProjectLike>(items: readonly T[]): T[] {
  return groupByCategory(items).flatMap((g) => g.items).filter(hasPage);
}

/** "2020–2026" (en dash), or a single year. */
export function yearSpan(items: readonly ProjectLike[]): string {
  const years = items.map((p) => p.data.year);
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}
