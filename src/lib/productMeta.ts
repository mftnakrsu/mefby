// Build-time helpers for product metadata, shared by the home page, /products
// and the product pages so they format dates the same way.

// "2026-10" → "Oct 2026"; falls back to the raw value if it doesn't parse.
export const fmtMonth = (ym: string): string => {
  const d = new Date(`${ym}-01T00:00:00Z`);
  return isNaN(d.getTime())
    ? ym
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
};
