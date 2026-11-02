import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Linkedin, Twitter, Link2 } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, formatDate, loadPostContent, getPostContentSync } from '../data/blog';
import { SITE_ORIGIN } from '../lib/seo';
import { BlogCard } from '../components/blog/BlogCard';
import { FadeUp } from '../components/animations/FadeUp';
import { track, EVENTS } from '../lib/analytics';
import { applyMeta, postMeta } from '../lib/seo';

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

  // Treść wpisu to osobny chunk (content/blog/<slug>.md), pobierany dopiero tutaj.
  // Nagłówek, data i okładka są w indeksie, więc renderują się od razu.
  // Przy wejściu na prerenderowany wpis treść jest już w HTML (getPostContentSync),
  // więc pierwszy render zgadza się z serwerem i nie ma drugiego pobrania.
  const [loaded, setLoaded] = useState(() => {
    const initial = getPostContentSync(slug);
    return initial == null ? { slug: null, content: null } : { slug, content: initial };
  });
  useEffect(() => {
    if (!post || loaded.slug === slug) return undefined;
    let cancelled = false;
    loadPostContent(slug).then((content) => {
      if (!cancelled) setLoaded({ slug, content });
    });
    return () => {
      cancelled = true;
    };
  }, [slug, post, loaded.slug]);
  const content = loaded.slug === slug ? loaded.content : null;

  // Scroll to top on post change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Meta wpisu przy nawigacji wewnątrz SPA. Pierwsze wejście na URL obsługuje
  // statyczny <head> z scripts/build-seo-html.mjs - obie ścieżki liczą meta tą
  // samą funkcją postMeta(), więc nie mogą się rozjechać.
  useEffect(() => {
    if (!post) return undefined;
    applyMeta(postMeta(post));
    return () => applyMeta();
  }, [post]);

  // Track "blog read complete" gdy user dochodzi do końca artykułu (sentinel
  // div tuż za body). IntersectionObserver dużo wydajniejszy niż scroll listener
  // - zero throttling, zero re-render, zero CPU dopóki user nie dotrze tam.
  // Pamięć per-slug w sessionStorage żeby nie trackować tego samego posta 2x.
  const sentinelRef = useRef(null);
  useEffect(() => {
    // Bez treści sentinel stoi tuż pod okładką i od razu byłby "przeczytany".
    if (!post || !content || !sentinelRef.current) return;
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
  }, [slug, post, content]);

  if (!post) return <Navigate to="/blog" replace />;

  // Simple markdown-ish content → HTML
  const contentHtml = content ? renderContent(content) : '';

  // Z adresu kanonicznego, nie z window.location: ten sam link na serwerze i w przeglądarce.
  const shareUrl = `${SITE_ORIGIN}/blog/${slug}`;

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
        <FadeUp fade={false}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-dark hover:text-black transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Wszystkie wpisy
          </Link>
        </FadeUp>

        {/* Author + Meta - centered */}
        <FadeUp fade={false} delay={0.05}>
          <div className="flex flex-col items-center text-center mb-8">

            {/* Category + Date */}
            <div className="flex items-center gap-3 text-base text-muted-dark">
              <span>{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-muted-light" />
              <span>{formatDate(post.date)}</span>
              {post.updated && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-light" />
                  <span>zaktualizowano {formatDate(post.updated)}</span>
                </>
              )}
            </div>
          </div>
        </FadeUp>

        {/* Title - centered, large */}
        <FadeUp fade={false} delay={0.1}>
          <h1 className="text-3xl md:text-5xl lg:text-[60px] font-display tracking-tight text-black text-center max-w-[900px] mx-auto leading-[1.1] mb-12">
            {post.title}
          </h1>
        </FadeUp>

        {/* Featured image - full container width */}
        <FadeUp fade={false} delay={0.15}>
          <div className="w-full overflow-hidden rounded-[10px]">
            <img
              src={post.image}
              alt={post.title}
              width={960}
              height={411}
              decoding="async"
              className="w-full aspect-[21/9] object-cover"
            />
          </div>
        </FadeUp>
      </section>

      {/* ─── Article Body ─── */}
      <section className="max-w-[800px] mx-auto px-6 max-md:px-4 mb-16">
        <FadeUp fade={false} delay={0.2}>
          <article
            className={`prose-workshift ${content ? '' : 'min-h-[60vh]'}`}
            aria-busy={!content}
            onClick={playYoutube}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </FadeUp>

        {/* Sentinel dla blog_read_complete event - niewidoczny, na końcu artykułu */}
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
              Bezpłatna 30-minutowa rozmowa diagnostyczna, bez zobowiązań.
            </p>
            <Link
              to="/#kontakt"
              className="inline-flex items-center h-12 px-8 rounded-full bg-lime text-black font-medium text-base hover:opacity-90 transition-opacity"
            >
              Zacznij od bezpłatnej rozmowy diagnostycznej
            </Link>
          </FadeUp>
        </div>
      </section>
    </main>
    </>
  );
}

/** Klik w miniaturę [youtube:ID]: podmienia ją na odtwarzacz z autostartem. */
function playYoutube(event) {
  const button = event.target.closest('[data-yt-id]');
  if (!button) return;
  const iframe = document.createElement('iframe');
  iframe.className = 'w-full h-full';
  iframe.src = `https://www.youtube.com/embed/${button.dataset.ytId}?rel=0&autoplay=1`;
  iframe.title = 'YouTube video player';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  button.replaceWith(iframe);
}

/**
 * Minimal markdown-ish → HTML converter.
 * Handles: ## headings, ### headings, **bold**, > blockquotes, - lists, paragraphs.
 * No external deps needed for simple blog content.
 */
function renderContent(raw) {
  const lines = raw.trim().split('\n');
  let html = '';
  // Typ otwartej listy ('ul' albo 'ol'), zeby zamknac ja wlasciwym tagiem.
  let inList = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line - close list if open, add spacing
    if (!trimmed) {
      if (inList) { html += `</${inList}>`; inList = null; }
      continue;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      if (inList) { html += `</${inList}>`; inList = null; }
      html += `<h4>${inline(trimmed.slice(4))}</h4>`;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      if (inList) { html += `</${inList}>`; inList = null; }
      html += `<h3>${inline(trimmed.slice(3))}</h3>`;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      if (inList) { html += `</${inList}>`; inList = null; }
      html += `<blockquote><p>${inline(trimmed.slice(2))}</p></blockquote>`;
      continue;
    }

    // YouTube embed: [youtube:VIDEOID] → 16:9, [youtube:VIDEOID|pion] → 9:16 (Shorts).
    // Bez wariantu "pion" pionowe nagranie dostaje czarne pasy po bokach i robi sie male.
    const ytMatch = trimmed.match(/^\[youtube:([\w-]+)(?:\|([^\]]+))?\]$/);
    if (ytMatch) {
      if (inList) { html += `</${inList}>`; inList = null; }
      const id = ytMatch[1];
      const vertical = (ytMatch[2] || '').trim() === 'pion';
      const wrapper = vertical
        ? 'my-8 mx-auto w-full max-w-sm aspect-[9/16] overflow-hidden rounded-[10px] bg-black'
        : 'my-8 aspect-video w-full overflow-hidden rounded-[10px] bg-black';
      // Miniatura z przyciskiem zamiast iframe: odtwarzacz YouTube to ok. 900 KB skryptów, które
      // blokowały render wpisu (PSI 02.11: LCP 9,9 s). Iframe wstawia playYoutube() po kliknięciu.
      html += `<div class="${wrapper}"><button type="button" data-yt-id="${id}" aria-label="Odtwórz film na YouTube" class="group relative block w-full h-full cursor-pointer"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async" class="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"/><span aria-hidden="true" class="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-lime shadow-lg transition-transform group-hover:scale-110"><svg width="24" height="24" viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z"/></svg></span></button></div>`;
      continue;
    }

    // Image embed: [image:/path.png] or [image:/path.png|alt text] on its own line
    const imgMatch = trimmed.match(/^\[image:([^\]|]+)(?:\|([^\]]+))?\]$/);
    if (imgMatch) {
      if (inList) { html += `</${inList}>`; inList = null; }
      const src = imgMatch[1].trim();
      const alt = (imgMatch[2] || '').trim();
      html += `<div class="my-8 w-full overflow-hidden rounded-[10px]"><img src="${src}" alt="${alt}" loading="lazy" class="w-full h-auto"/></div>`;
      continue;
    }

    // List item
    if (trimmed.startsWith('- ')) {
      if (inList !== 'ul') { if (inList) html += `</${inList}>`; html += '<ul>'; inList = 'ul'; }
      html += `<li>${inline(trimmed.slice(2))}</li>`;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (inList !== 'ol') { if (inList) html += `</${inList}>`; html += '<ol>'; inList = 'ol'; }
      html += `<li>${inline(trimmed.replace(/^\d+\.\s/, ''))}</li>`;
      continue;
    }

    // Paragraph
    if (inList) { html += `</${inList}>`; inList = null; }
    html += `<p>${inline(trimmed)}</p>`;
  }

  if (inList) html += `</${inList}>`;
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
