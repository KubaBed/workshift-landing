import React from 'react';
import { motion } from 'framer-motion';

/**
 * Floating component that adds a smooth, organic ambient motion to its children.
 * Uses hardware-accelerated transforms for maximum performance.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Element to animate
 * @param {number} props.amplitude - Max pixels to move (default: 12)
 * @param {number} props.duration - Duration of one full cycle in seconds (default: 4)
 * @param {number} props.delay - Initial delay (useful for staggered floating)
 * @param {number} props.rotation - Subtle rotation range in degrees (default: 0)
 * @param {string} props.className - Additional classes for the wrapper
 */
export function Floating({ 
    children, 
    amplitude = 12, 
    duration = 4, 
    delay = 0, 
    rotation = 0,
    className = "",
    style = {},
    ...rest
}) {
    return (
        <motion.div
            className={className}
            {...rest}
            animate={{
                y: [ -amplitude, amplitude ],
                rotate: [ -rotation, rotation ],
            }}
            transition={{
                y: {
                    duration: duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: delay
                },
                rotate: {
                    duration: duration * 1.2, // Slightly different timing for more organic feel
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: delay
                }
            }}
            style={{ willChange: "transform", ...style }}
        >
            {children}
        </motion.div>
    );
}
