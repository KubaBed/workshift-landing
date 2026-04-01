/**
 * ThreeDMarquee - A 3D rotating marquee of images.
 * Adapted from @emerald-ui / 21st.dev for JSX + plain CSS.
 */
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const defaultCreativeImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1534450257448-692518eabcff?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a8efcb0ce74?q=80&w=400&h=300&fit=crop',
];

export function ThreeDMarquee({ images = defaultCreativeImages, className, columns = 2 }) {
    const chunkSize = Math.ceil(images.length / columns);
    const chunks = Array.from({ length: columns }, (_, colIndex) => {
        const start = colIndex * chunkSize;
        return images.slice(start, start + chunkSize);
    });

    return (
        <div
            className={cn('mx-auto block overflow-hidden rounded-md', className)}
            style={{ height: '100%', width: '100%' }}
        >
            <div className="flex size-full items-center justify-center">
                <div
                    style={{
                        aspectRatio: '1 / 1',
                        width: '160%',
                        flexShrink: 0,
                        transform: 'scale(1.05)',
                    }}
                >
                    <div
                        style={{
                            transform: 'rotateX(45deg) rotateY(0deg) rotateZ(45deg)',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            top: 0,
                            right: '-40%',
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columns}, 1fr)`,
                            gap: '10px',
                            width: '100%',
                            height: '100%',
                            transformOrigin: 'top left',
                        }}
                    >
                        {chunks.map((subarray, colIndex) => (
                            <motion.figure
                                animate={{ y: colIndex % 2 === 0 ? 50 : -50 }}
                                transition={{
                                    duration: colIndex % 2 === 0 ? 10 : 15,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                }}
                                key={colIndex + 'marquee'}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    margin: 0,
                                    padding: 0,
                                }}
                            >
                                {subarray.map((src, imageIndex) => (
                                    <div className="relative" key={imageIndex + src}>
                                        <img
                                            style={{ aspectRatio: '4 / 3', width: '100%', height: '100%', borderRadius: '8px', backgroundColor: '#f5f5f5', objectFit: 'cover', userSelect: 'none', display: 'block' }}
                                            src={src}
                                            draggable={false}
                                            alt={`Kreacja AI ${imageIndex + 1}`}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </motion.figure>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThreeDMarquee;
