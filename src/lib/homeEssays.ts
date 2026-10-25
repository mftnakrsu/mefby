// The home page's hand-picked essays (HOME_ESSAYS in constants.ts), resolved
// in order. A slug that is missing, a draft or a translation throws, which
// fails the build instead of quietly dropping an essay.
export interface EssayLike {
  id: string;
  data: { draft: boolean; isTranslation: boolean };
}

export function pickEssays<T extends EssayLike>(essays: readonly T[], slugs: readonly string[]): T[] {
  return slugs.map((slug) => {
    const essay = essays.find((e) => e.id === slug);
    if (!essay) throw new Error(`HOME_ESSAYS: no essay "${slug}"`);
    if (essay.data.draft) throw new Error(`HOME_ESSAYS: "${slug}" is a draft`);
    if (essay.data.isTranslation) {
      throw new Error(`HOME_ESSAYS: "${slug}" is a translation; list the canonical essay`);
    }
    return essay;
  });
}
