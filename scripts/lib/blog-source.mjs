/**
 * Jedno źródło wpisów bloga: pliki content/blog/<slug>.md.
 *
 * Czytają je dwa miejsca: wtyczka Vite (indeks wpisów bez treści dla strony) i
 * scripts/seo-routes.mjs (statyczny HTML, sitemapa, JSON-LD). Treść wpisu strona ładuje
 * leniwie, osobno dla każdego wpisu (src/data/blog.js).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseBlogFile, REQUIRED_POST_FIELDS } from '../../src/lib/blogFrontmatter.js';

export const BLOG_DIR = new URL('../../content/blog/', import.meta.url).pathname;

/** Wszystkie wpisy z treścią, od najnowszego. Rzuca błędem przy brakach we frontmatterze. */
export function readBlogPosts(dir = BLOG_DIR) {
  const posts = readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const { meta, content } = parseBlogFile(readFileSync(join(dir, name), 'utf8'), name);
      const missing = REQUIRED_POST_FIELDS.filter((field) => !meta[field]);
      if (missing.length) throw new Error(`content/blog/${name}: brak pól ${missing.join(', ')}`);
      if (`${meta.slug}.md` !== name) throw new Error(`content/blog/${name}: slug "${meta.slug}" różny od nazwy pliku`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`content/blog/${name}: data "${meta.date}" nie jest RRRR-MM-DD`);
      if (meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)) throw new Error(`content/blog/${name}: updated "${meta.updated}" nie jest RRRR-MM-DD`);
      return { ...meta, content };
    });
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** Wpisy bez treści: to, czego potrzebuje lista bloga i karty. */
export function readBlogIndex(dir = BLOG_DIR) {
  return readBlogPosts(dir).map(({ content: _content, ...meta }) => meta);
}

/**
 * Wtyczka Vite: moduł `virtual:blog-index` z indeksem wpisów. Zmiana pliku .md w dev
 * przeładowuje indeks.
 */
export function blogIndexPlugin() {
  const id = 'virtual:blog-index';
  const resolved = `\0${id}`;
  return {
    name: 'workshift-blog-index',
    resolveId(source) {
      return source === id ? resolved : undefined;
    },
    load(source) {
      if (source !== resolved) return undefined;
      for (const name of readdirSync(BLOG_DIR)) this.addWatchFile(join(BLOG_DIR, name));
      return `export default ${JSON.stringify(readBlogIndex())};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(BLOG_DIR)) return undefined;
      const mod = server.moduleGraph.getModuleById(resolved);
      if (mod) server.moduleGraph.invalidateModule(mod);
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
