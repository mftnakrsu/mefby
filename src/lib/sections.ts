// The five numbered sections of the home page, in order. The dock, the
// progress rail and the section openings all read from here.
export const HOME_SECTIONS = [
  { id: 'products', title: 'Products' },
  { id: 'writing', title: 'Writing' },
  { id: 'work', title: 'Selected work' },
  { id: 'experience', title: 'Experience' },
  { id: 'publications', title: 'Publications' },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]['id'];

export const twoDigits = (n: number): string => String(n).padStart(2, '0');

/** "01 / 05" for the first section. */
export function sectionKicker(id: HomeSectionId): string {
  const i = HOME_SECTIONS.findIndex((s) => s.id === id);
  return `${twoDigits(i + 1)} / ${twoDigits(HOME_SECTIONS.length)}`;
}
