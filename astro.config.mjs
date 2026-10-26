import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Dependency-free rehype plugin: give every h2/h3/h4 a slug `id` so sections are
// deep-linkable (and any future table of contents has anchors to point at).
function rehypeHeadingIds() {
  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  const textOf = (node) =>
    node.type === 'text'
      ? node.value
      : (node.children || []).map(textOf).join('');
  return (tree) => {
    const seen = new Set();
    const walk = (node) => {
      if (node.type === 'element' && /^h[2-4]$/.test(node.tagName || '')) {
        node.properties = node.properties || {};
        if (!node.properties.id) {
          const base = slugify(textOf(node)) || 'section';
          let id = base;
          let n = 1;
          while (seen.has(id)) id = `${base}-${++n}`;
          seen.add(id);
          node.properties.id = id;
        }
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://www.mefby.com',
  // Astro 7 strips whitespace between elements by JSX rules by default; keep the
  // whitespace handling the templates were written for.
  compressHTML: true,
  markdown: {
    // Astro 7's default Markdown processor runs no remark or rehype plugins, and
    // the essays need math, KaTeX and heading ids, so stay on unified. The MDX
    // integration inherits this processor and the Shiki theme.
    processor: unified({
      // Essay tables need GitHub-Flavored Markdown.
      gfm: true,
      // A dollar amount ("a $250 order") is prose, not math: math needs $$…$$.
      remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]],
      rehypePlugins: [rehypeKatex, rehypeHeadingIds],
    }),
    // Light Shiki theme so fenced code blocks match the clean/minimal palette.
    shikiConfig: { theme: 'github-light' },
  },
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Astro builds for "esnext", which leaves the CSS minifier without browser
      // targets: it then wrote `text-decoration: underline 1px`, which Safari
      // reads only from 26.2, and dropped -webkit- prefixes. These are Vite's
      // default targets; Safari 16.4 and Chrome 111 are also Tailwind 4's floor.
      cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
