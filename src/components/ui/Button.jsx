import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";

    const variants = {
        primary: "bg-navy text-white hover:bg-navy-dark",
        secondary: "bg-white text-navy border border-slate-200 hover:bg-slate-50",
        outline: "border-2 border-navy text-navy hover:bg-navy/5",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-navy",
        accent: "bg-accent text-white hover:bg-accent-light",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm rounded-sm",
        md: "h-12 px-6 py-2 text-base rounded-sm",
        lg: "h-14 px-8 text-lg rounded-sm",
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
});

Button.displayName = "Button";
