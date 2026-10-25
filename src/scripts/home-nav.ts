// Home page navigation: the dock slides in once most of the hero has scrolled
// away, and the section under the upper third of the screen is marked with
// aria-current in the dock and the progress rail.
import { HOME_SECTIONS } from '../lib/sections';

const dock = document.querySelector<HTMLElement>('[data-dock]');
const links = document.querySelectorAll<HTMLAnchorElement>('[data-section-link]');
const sections = HOME_SECTIONS.map((s) => document.getElementById(s.id)).filter(
  (el): el is HTMLElement => el !== null,
);
const last = sections[sections.length - 1];

function activeId(): string | null {
  const line = innerHeight * 0.35;
  const hit = sections.find((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= line && r.bottom > line;
  });
  // The footer belongs to the last zone, so keep that section marked there.
  if (!hit && last && last.getBoundingClientRect().bottom <= line) return last.id;
  return hit?.id ?? null;
}

let frame = 0;
function update(): void {
  frame = 0;
  dock?.toggleAttribute('data-visible', scrollY > innerHeight * 0.6);
  const id = activeId();
  for (const a of links) {
    if (a.dataset.sectionLink === id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  }
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(update);
};
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
update();
