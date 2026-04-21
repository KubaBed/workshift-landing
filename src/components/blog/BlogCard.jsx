import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '../../data/blogPosts';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Magnetic } from '../animations/Magnetic';

/**
 * Blog card - Workshift editorial grid.
 * @param {'featured'|'standard'} variant - featured = large (row 1), standard = 3-col grid
 */
export function BlogCard({ post, variant = 'standard' }) {
  const isFeatured = variant === 'featured';

  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group flex flex-col gap-4 transition-all"
      >
        {/* Image with hover arrow overlay */}
        <div 
          className="relative overflow-hidden rounded-[10px] bg-black/5"
          style={{ transform: "translateZ(50px)" }}
        >
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.1] ${
              isFeatured ? 'aspect-[4/3]' : 'aspect-[4/3]'
            }`}
          />
          {/* Arrow overlay - visible on hover */}
          <div className="absolute top-4 right-4 z-20">
            <Magnetic strength={0.4}>
              <div className="size-10 rounded-full bg-lime flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg">
                <ArrowUpRight size={20} className="text-black" />
              </div>
            </Magnetic>
          </div>
          
          {/* Subtle shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Meta + Title */}
        <div 
          className="flex flex-col gap-1.5"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex items-center gap-3 text-sm text-muted-dark">
            <span className="font-mono uppercase tracking-wider text-[10px] bg-black/5 px-2 py-0.5 rounded-full">{post.category}</span>
            <span className="w-1 h-1 rounded-full bg-muted-light" />
            <span>{formatDate(post.date)}</span>
          </div>
          <h3
            className={`font-display tracking-tight text-black group-hover:text-black/80 transition-colors ${
              isFeatured ? 'text-2xl md:text-4xl' : 'text-lg md:text-2xl'
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
    </motion.div>
  );
}
