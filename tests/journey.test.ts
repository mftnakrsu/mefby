import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ZONES, css } from '../src/lib/palette.ts';
import {
  buildAnchors,
  sample,
  canvasCss,
  canvasLightness,
  isDarkCanvas,
  type JourneyRects,
} from '../src/lib/journeyMath.ts';

// A home page 8700px tall, sections in page order.
const RECTS: JourneyRects = {
  top: { top: 0, height: 900 },
  products: { top: 900, height: 1600 },
  writing: { top: 2500, height: 1400 },
  work: { top: 3900, height: 2000 },
  experience: { top: 5900, height: 1500 },
  publications: { top: 7400, height: 700 },
  contact: { top: 8100, height: 600 },
};
const anchors = buildAnchors(RECTS);
const colourAt = (y: number) => canvasCss(sample(anchors, y));

test('anchors follow the hold and seam rules', () => {
  assert.deepEqual(
    anchors.map((a) => Math.round(a.y)),
    [0, 738, 1188, 2260, 2752, 3820, 3980, 5600, 6170, 7175, 7526, 8700],
  );
});

test('each zone holds its colour through the middle of its section', () => {
  const holds: [number, keyof typeof ZONES][] = [
    [0, 'paper'], [700, 'paper'], [1700, 'mint'], [3200, 'sky'],
    [4500, 'charcoal'], [6500, 'royal'], [8400, 'navy'], [99999, 'navy'],
  ];
  for (const [y, zone] of holds) assert.equal(colourAt(y), css(ZONES[zone]), `${y}px`);
});

test('seams mix in OKLab, and the sky → charcoal seam is only 160px long', () => {
  assert.equal(colourAt(963), `color-mix(in oklab, ${css(ZONES.paper)}, ${css(ZONES.mint)} 50%)`);
  assert.equal(colourAt(3820), css(ZONES.sky));
  assert.equal(colourAt(3900), `color-mix(in oklab, ${css(ZONES.sky)}, ${css(ZONES.charcoal)} 50%)`);
  assert.equal(colourAt(3980), css(ZONES.charcoal));
});

test('the text tone flips exactly once, inside the short seam', () => {
  const flips: number[] = [];
  let dark = false;
  for (let y = 0; y <= 9000; y += 10) {
    const now = isDarkCanvas(canvasLightness(sample(anchors, y)));
    if (now !== dark) flips.push(y);
    dark = now;
  }
  assert.deepEqual(flips, [3920]);
});

test('the switch point is lightness 0.58', () => {
  assert.equal(isDarkCanvas(0.58), false);
  assert.equal(isDarkCanvas(0.5799), true);
});

test('anchors never run backwards when a section is shorter than the seam', () => {
  const squashed = buildAnchors({
    ...RECTS,
    writing: { top: 2500, height: 90 },
    work: { top: 2590, height: 2000 },
  });
  for (let i = 1; i < squashed.length; i++) {
    assert.ok(squashed[i].y >= squashed[i - 1].y, `anchor ${i}`);
  }
  assert.doesNotThrow(() => canvasCss(sample(squashed, 2550)));
});
