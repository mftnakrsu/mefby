// The design tokens as data. src/styles/global.css declares the same values
// (tests/tokens.test.ts checks that they match); the home page's colour
// journey and the contrast tests read them from here.

export type Oklch = readonly [l: number, c: number, h: number];

export const TOKENS = {
  paper: [0.985, 0.004, 85],
  'paper-sunk': [0.955, 0.006, 80],
  'ink-deep': [0.19, 0.012, 265],
  'ink-deepest': [0.145, 0.014, 265],
  'text-ink': [0.24, 0.012, 270],
  'muted-ink': [0.5, 0.01, 270],
  'text-bone': [0.94, 0.004, 85],
  accent: [0.7, 0.13, 55],
  'accent-ink': [0.5, 0.14, 45],
} as const satisfies Record<string, Oklch>;

// Home page canvases, top to bottom.
export const ZONES = {
  paper: [0.985, 0.004, 85],
  mint: [0.9, 0.07, 168],
  sky: [0.87, 0.085, 246],
  charcoal: [0.4, 0.006, 250],
  royal: [0.4, 0.15, 252],
  navy: [0.25, 0.06, 255],
} as const satisfies Record<string, Oklch>;

/** Canvases darker than this get bone text and the terracotta focus ring. */
export const TEXT_SWITCH_L = 0.58;

/** Muted text is --fg mixed with this much of the canvas. */
export const MUTED_MIX = 0.3;

export const css = ([l, c, h]: Oklch): string => `oklch(${l} ${c} ${h})`;
