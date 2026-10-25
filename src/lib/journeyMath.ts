// The home page's colour journey as pure maths: section positions → anchors →
// the canvas colour at a scroll position. src/scripts/journey.ts feeds it real
// measurements; tests/journey.test.ts feeds it a fixed layout.
import { ZONES, TEXT_SWITCH_L, css, type Oklch } from './palette.ts';

export interface Rect {
  top: number;
  height: number;
}

/** Page-coordinate boxes of the home page's zones, keyed by element id. */
export interface JourneyRects {
  top: Rect;
  products: Rect;
  writing: Rect;
  work: Rect;
  experience: Rect;
  publications: Rect;
  contact: Rect;
}

export interface Anchor {
  y: number;
  zone: Oklch;
}

/** The colour at a probe: `t` of the way from `from` to `to`. */
export interface Sample {
  from: Oklch;
  to: Oklch;
  t: number;
}

/** The one light → dark seam (Writing → Selected work) spans this many px on each side. */
export const SHORT_SEAM_PX = 80;
const HERO_HOLD = 0.82; // the hero holds paper down to 82% of its height
const HOLD_FROM = 0.18; // every other zone holds its colour from 18% …
const HOLD_TO = 0.85; // … to 85% of its section

export function buildAnchors(r: JourneyRects): Anchor[] {
  const at = (s: Rect, f: number) => s.top + s.height * f;
  const raw: Anchor[] = [
    { y: 0, zone: ZONES.paper },
    { y: at(r.top, HERO_HOLD), zone: ZONES.paper },
    { y: at(r.products, HOLD_FROM), zone: ZONES.mint },
    { y: at(r.products, HOLD_TO), zone: ZONES.mint },
    { y: at(r.writing, HOLD_FROM), zone: ZONES.sky },
    { y: r.writing.top + r.writing.height - SHORT_SEAM_PX, zone: ZONES.sky },
    { y: r.work.top + SHORT_SEAM_PX, zone: ZONES.charcoal },
    { y: at(r.work, HOLD_TO), zone: ZONES.charcoal },
    { y: at(r.experience, HOLD_FROM), zone: ZONES.royal },
    { y: at(r.experience, HOLD_TO), zone: ZONES.royal },
    { y: at(r.publications, HOLD_FROM), zone: ZONES.navy },
    { y: r.contact.top + r.contact.height, zone: ZONES.navy },
  ];
  // A short section can put an anchor above the previous one; clamp so the
  // sequence never runs backwards.
  let floor = -Infinity;
  return raw.map((a) => {
    floor = Math.max(floor, a.y);
    return { y: floor, zone: a.zone };
  });
}

export function sample(anchors: readonly Anchor[], probe: number): Sample {
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (probe <= first.y) return { from: first.zone, to: first.zone, t: 0 };
  if (probe >= last.y) return { from: last.zone, to: last.zone, t: 0 };
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (probe >= a.y && probe <= b.y) {
      const span = b.y - a.y;
      return { from: a.zone, to: b.zone, t: span > 0 ? (probe - a.y) / span : 0 };
    }
  }
  return { from: last.zone, to: last.zone, t: 0 };
}

/** The CSS value for --canvas: a plain colour while a zone holds, an OKLab mix at a seam. */
export function canvasCss({ from, to, t }: Sample): string {
  const pct = Math.round(t * 1000) / 10;
  if (from === to || pct <= 0) return css(from);
  if (pct >= 100) return css(to);
  return `color-mix(in oklab, ${css(from)}, ${css(to)} ${pct}%)`;
}

/** OKLab mixing interpolates lightness linearly, so this is exact. */
export function canvasLightness({ from, to, t }: Sample): number {
  return from[0] + (to[0] - from[0]) * t;
}

export const isDarkCanvas = (l: number): boolean => l < TEXT_SWITCH_L;
