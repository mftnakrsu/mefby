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
// Whatever is on the first screen settles at once: the margin above would hold
// back its bottom 12%, such as the hero's links and scroll cue.
[...pending].forEach((el) => {
  const r = el.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) show(el);
  else io.observe(el);
});

// Tabbing onto a block that is still hidden would leave its focus ring
// invisible, so focus shows the block.
addEventListener('focusin', (e) => {
  for (let n = e.target as Element | null; n; n = n.parentElement) {
    if (pending.has(n as HTMLElement)) {
      show(n as HTMLElement);
      io.unobserve(n);
    }
  }
});

// The bottom 12% of the last screen never crosses the margin above, so once
// the page is scrolled (or resized) to its end, show whatever is left.
const atEnd = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
const onScroll = () => {
  if (!atEnd()) return;
  [...pending].forEach((el) => {
    show(el);
    io.unobserve(el);
  });
  removeEventListener('scroll', onScroll);
  removeEventListener('resize', onScroll);
};
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll, { passive: true });
onScroll();
