// Responsive sources for hotlinked Unsplash photos: the same crop at three
// widths, so cards do not download the 1600px original. Local images are
// served at one size and get no srcset.
const WIDTHS = [640, 960, 1600];

export function unsplashSrcset(src: string, width: number, height: number): string | undefined {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return undefined;
  }
  if (url.hostname !== 'images.unsplash.com') return undefined;
  return WIDTHS.map((w) => {
    const u = new URL(url);
    u.searchParams.set('w', String(w));
    u.searchParams.set('h', String(Math.round((w * height) / width)));
    return `${u.toString()} ${w}w`;
  }).join(', ');
}
