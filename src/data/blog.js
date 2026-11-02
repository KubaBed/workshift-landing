/**
 * Blog na stronie. Wpisy żyją w content/blog/<slug>.md (frontmatter + treść).
 *
 * - `blogPosts`: indeks bez treści (tytuł, zajawka, data, okładka), wkompilowany przy buildzie
 *   przez wtyczkę z scripts/lib/blog-source.mjs. Lista bloga i karty nie ciągną treści wpisów.
 * - `loadPostContent(slug)`: treść jednego wpisu, osobny mały chunk pobierany dopiero na stronie wpisu.
 */
import blogIndex from 'virtual:blog-index';
import { parseBlogFile } from '../lib/blogFrontmatter';

export const blogPosts = blogIndex;

export const blogCategories = [...new Set(blogPosts.map((post) => post.category))];

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}

export function getRelatedPosts(currentSlug, count = 2) {
  return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, count);
}

const postFiles = import.meta.glob('/content/blog/*.md', { query: '?raw', import: 'default' });

/** Treść wpisu (markdown bez frontmattera) albo null, gdy nie ma takiego pliku. */
export async function loadPostContent(slug) {
  const load = postFiles[`/content/blog/${slug}.md`];
  if (!load) return null;
  return parseBlogFile(await load(), `${slug}.md`).content;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
