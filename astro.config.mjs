import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
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
  site: 'https://mefby.vercel.app',
  // Light Shiki theme so fenced code blocks match the clean/minimal palette
  // (the MDX integration inherits this markdown config by default).
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeHeadingIds],
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
