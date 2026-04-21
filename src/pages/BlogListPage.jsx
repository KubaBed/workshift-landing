import { useState } from 'react';
import { blogPosts, blogCategories } from '../data/blogPosts';
import { BlogCard } from '../components/blog/BlogCard';
import { FadeUp } from '../components/animations/FadeUp';

/**
 * Blog listing page - /blog
 * Layout:
 *   Hero + category filters
 *   Row 1: 2 featured cards (asymmetric 57/43%)
 *   Row 2+: 3-column equal grid
 */
export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = activeCategory
    ? blogPosts.filter((p) => p.category === activeCategory)
    : blogPosts;

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <main className="min-h-screen bg-sage pt-40 pb-24">
      <div className="max-w-[1320px] mx-auto px-6 max-md:px-4">
        {/* Hero */}
        <FadeUp>
          <div className="mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-lime" />
              <span className="font-mono text-sm text-muted-dark uppercase tracking-widest">
                Nasz Blog
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-display tracking-tight text-black leading-[1.05]">
              Wiedza, która napędza pragmatyczne innowacje
            </h1>
          </div>
        </FadeUp>

        {/* Category filters */}
        <FadeUp delay={0.05}>
          <div className="flex flex-wrap gap-3 mb-16">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === null
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-black/10 hover:border-black/30'
              }`}
            >
              Wszystkie
            </button>
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black/10 hover:border-black/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-dark text-lg">
            Brak wpisów w tej kategorii.
          </div>
        )}

        {/* Featured row - 2 cards, asymmetric */}
        {featured.length > 0 && (
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-16 mb-16">
              {featured.map((post) => (
                <BlogCard key={post.slug} post={post} variant="featured" />
              ))}
            </div>
          </FadeUp>
        )}

        {/* Divider + standard grid */}
        {rest.length > 0 && (
          <>
            <div className="h-px bg-black/10 mb-16" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {rest.map((post, i) => (
                <FadeUp key={post.slug} delay={0.05 * i}>
                  <BlogCard post={post} variant="standard" />
                </FadeUp>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
