// Reveal on scroll: [data-reveal] elements settle once they enter the viewport.
// The motion lives in global.css and only applies under html.js.
const pending = new Set(document.querySelectorAll<HTMLElement>('[data-reveal]'));

const show = (el: HTMLElement) => {
  el.setAttribute('data-revealed', '');
  pending.delete(el);
};

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      show(entry.target as HTMLElement);
      io.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -12% 0px', threshold: 0 },
);
pending.forEach((el) => io.observe(el));

// The bottom 12% of the last screen never crosses the margin above, so once
// the page is scrolled to the end, show whatever is left.
const atEnd = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
const onScroll = () => {
  if (!atEnd()) return;
  [...pending].forEach((el) => {
    show(el);
    io.unobserve(el);
  });
  removeEventListener('scroll', onScroll);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();
