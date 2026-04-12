import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '../../data/blogPosts';

/**
 * Blog card — inspired by Rendani editorial grid.
 * @param {'featured'|'standard'} variant — featured = large (row 1), standard = 3-col grid
 */
export function BlogCard({ post, variant = 'standard' }) {
  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col gap-4 transition-all"
    >
      {/* Image with hover arrow overlay */}
      <div className="relative overflow-hidden rounded-[10px] bg-black/5">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            isFeatured ? 'aspect-[4/3]' : 'aspect-[4/3]'
          }`}
        />
        {/* Arrow overlay — visible on hover */}
        <div className="absolute top-4 right-4 size-9 rounded-full bg-lime flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowUpRight size={18} className="text-black" />
        </div>
      </div>

      {/* Meta + Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3 text-sm text-muted-dark">
          <span>{post.category}</span>
          <span className="w-1 h-1 rounded-full bg-muted-light" />
          <span>{formatDate(post.date)}</span>
        </div>
        <h3
          className={`font-display tracking-tight text-black group-hover:text-black/80 transition-colors ${
            isFeatured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}
        >
          {post.title}
        </h3>
        {isFeatured && (
          <p className="text-muted-dark text-base leading-relaxed mt-1 line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
