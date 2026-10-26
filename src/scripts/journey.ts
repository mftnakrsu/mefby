// The home page's colour journey. Measures the zones, then on every scroll
// frame samples the canvas colour at the middle of the screen and sets
// --canvas and the text tone (data-tone="dark") on <html>. The maths lives in
// src/lib/journeyMath.ts; global.css derives --fg, muted text, hairlines and
// the chrome colours from these two.
import {
  buildAnchors,
  canvasCss,
  canvasLightness,
  isDarkCanvas,
  sample,
  type Anchor,
  type JourneyRects,
} from '../lib/journeyMath';

const IDS = ['top', 'products', 'writing', 'work', 'experience', 'publications', 'contact'] as const;
const root = document.documentElement;
let anchors: Anchor[] | null = null;
let frame = 0;
let reported = false;

function measure(): void {
  const rects = {} as JourneyRects;
  for (const id of IDS) {
    const el = document.getElementById(id);
    if (!el) {
      // A missing zone would put NaN into the anchors. Keep the previous ones
      // (none yet: the page stays on paper) and say so once.
      if (!reported) console.error(`journey: no element with id "${id}"; the colour journey is not updated`);
      reported = true;
      return;
    }
    const r = el.getBoundingClientRect();
    rects[id] = { top: r.top + scrollY, height: r.height };
  }
  anchors = buildAnchors(rects);
}

function paint(): void {
  frame = 0;
  if (!anchors) return;
  const s = sample(anchors, scrollY + innerHeight / 2);
  root.style.setProperty('--canvas', canvasCss(s));
  if (isDarkCanvas(canvasLightness(s))) root.dataset.tone = 'dark';
  else delete root.dataset.tone;
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(paint);
};

addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
// Section heights change as fonts and images load and when the width changes.
new ResizeObserver(() => {
  measure();
  schedule();
}).observe(document.body);
measure();
paint();
