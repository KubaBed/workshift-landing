import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Linkedin, Twitter, Link2 } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, formatDate } from '../data/blogPosts';
import { BlogCard } from '../components/blog/BlogCard';
import { FadeUp } from '../components/animations/FadeUp';
import { track, EVENTS } from '../lib/analytics';

/**
 * Blog article page - /blog/:slug
 * Layout:
 *   Banner: author avatar + meta + H1 title + featured image (centered, full-width)
 *   Body:   800px centered column, markdown-like HTML rendering
 *   Footer: share icons + related posts (2-col asymmetric) + CTA
 */
export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const related = post ? getRelatedPosts(slug, 2) : [];

  // Scroll to top on post change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Track "blog read complete" gdy user dochodzi do końca artykułu (sentinel
  // div tuż za body). IntersectionObserver dużo wydajniejszy niż scroll listener
  // — zero throttling, zero re-render, zero CPU dopóki user nie dotrze tam.
  // Pamięć per-slug w sessionStorage żeby nie trackować tego samego posta 2x.
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!post || !sentinelRef.current) return;
    const key = `blog_read_${slug}`;
    if (sessionStorage.getItem(key)) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          track(EVENTS.BLOG_READ_COMPLETE, { slug, category: post.category });
          sessionStorage.setItem(key, '1');
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [slug, post]);

  if (!post) return <Navigate to="/blog" replace />;

  // Simple markdown-ish content → HTML
  const contentHtml = renderContent(post.content);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-lime z-[100] origin-left"
        style={{ scaleX }}
      />
      <main className="min-h-screen bg-sage pt-32 pb-0">
      {/* ─── Banner Section ─── */}
      <section id="banner" className="max-w-[1320px] mx-auto px-6 max-md:px-4 mb-16">
        {/* Back link */}
        <FadeUp>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-dark hover:text-black transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Wszystkie wpisy
          </Link>
        </FadeUp>

        {/* Author + Meta - centered */}
        <FadeUp delay={0.05}>
          <div className="flex flex-col items-center text-center mb-8">

            {/* Category + Date */}
            <div className="flex items-center gap-3 text-base text-muted-dark">
              <span>{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-muted-light" />
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </FadeUp>

        {/* Title - centered, large */}
        <FadeUp delay={0.1}>
          <h1 className="text-3xl md:text-5xl lg:text-[60px] font-display tracking-tight text-black text-center max-w-[900px] mx-auto leading-[1.1] mb-12">
            {post.title}
          </h1>
        </FadeUp>

        {/* Featured image - full container width */}
        <FadeUp delay={0.15}>
          <div className="w-full overflow-hidden rounded-[10px]">
            <img
              src={post.image}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover"
            />
          </div>
        </FadeUp>
      </section>

      {/* ─── Article Body ─── */}
      <section className="max-w-[800px] mx-auto px-6 max-md:px-4 mb-16">
        <FadeUp delay={0.2}>
          <article
            className="prose-workshift"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </FadeUp>

        {/* Sentinel dla blog_read_complete event — niewidoczny, na końcu artykułu */}
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

        {/* Share links */}
        <div className="mt-16 pt-8 border-t border-black/10 flex items-center gap-6">
          <span className="text-sm text-muted-dark font-medium">Udostępnij:</span>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-dark hover:text-black transition-colors"
            aria-label="Udostępnij na LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-dark hover:text-black transition-colors"
            aria-label="Udostępnij na X"
          >
            <Twitter size={20} />
          </a>
          <button
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="text-muted-dark hover:text-black transition-colors"
            aria-label="Kopiuj link"
          >
            <Link2 size={20} />
          </button>
        </div>
      </section>

      {/* ─── Related Posts ─── */}
      {related.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-6 max-md:px-4 py-24 border-t border-black/10">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 max-w-[700px]">
              Może Cię również zainteresować
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 md:gap-16">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} variant="featured" />
              ))}
            </div>
          </FadeUp>
        </section>
      )}

      {/* ─── CTA Section ─── */}
      <section className="bg-black text-white py-24">
        <div className="max-w-[1320px] mx-auto px-6 max-md:px-4 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight text-white mb-6">
              Masz pomysł? Porozmawiajmy.
            </h2>
            <p className="text-muted-light text-lg mb-10 max-w-lg mx-auto">
              Bezpłatna konsultacja - bez zobowiązań, bez haczyka.
            </p>
            <Link
              to="/#kontakt"
              className="inline-flex items-center h-12 px-8 rounded-full bg-lime text-black font-medium text-base hover:opacity-90 transition-opacity"
            >
              Zacznij od bezpłatnego audytu
            </Link>
          </FadeUp>
        </div>
      </section>
    </main>
    </>
  );
}

/**
 * Minimal markdown-ish → HTML converter.
 * Handles: ## headings, ### headings, **bold**, > blockquotes, - lists, paragraphs.
 * No external deps needed for simple blog content.
 */
function renderContent(raw) {
  const lines = raw.trim().split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line - close list if open, add spacing
    if (!trimmed) {
      if (inList) { html += '</ul>'; inList = false; }
      continue;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h4>${inline(trimmed.slice(4))}</h4>`;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${inline(trimmed.slice(3))}</h3>`;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<blockquote><p>${inline(trimmed.slice(2))}</p></blockquote>`;
      continue;
    }

    // YouTube embed: [youtube:VIDEOID] on its own line → 16:9 iframe
    const ytMatch = trimmed.match(/^\[youtube:([\w-]+)\]$/);
    if (ytMatch) {
      if (inList) { html += '</ul>'; inList = false; }
      const id = ytMatch[1];
      html += `<div class="my-8 aspect-video w-full overflow-hidden rounded-[10px] bg-black"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${id}?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
      continue;
    }

    // List item
    if (trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(trimmed.slice(2))}</li>`;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html += '<ol>'; inList = true; }
      html += `<li>${inline(trimmed.replace(/^\d+\.\s/, ''))}</li>`;
      continue;
    }

    // Paragraph
    if (inList) { html += '</ul>'; inList = false; }
    html += `<p>${inline(trimmed)}</p>`;
  }

  if (inList) html += '</ul>';
  return html;
}

/** Inline formatting: [text](url), **bold**, *italic*, `code` */
function inline(text) {
  return text
    // Links first - so **bold** inside link text still works after this pass
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}
