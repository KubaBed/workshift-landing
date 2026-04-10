import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { annotate } from "rough-notation";

export function Highlighter({
    children,
    action = "highlight",
    color = "#9CE069", // Brand Accent
    strokeWidth = 2,
    animationDuration = 600,
    iterations = 2,
    padding = 4,
    multiline = true,
    isView = false,
    className = "",
    type = "highlight" // Fallback aliases
}) {
    const elementRef = useRef(null);
    const annotationRef = useRef(null);

    // Accept both `action` and `type` prop for flexibility
    const resolvedAction = action || type || "highlight";

    const isInView = useInView(elementRef, {
        once: true,
        margin: "-10%",
    });

    const shouldShow = !isView || isInView;

    useEffect(() => {
        const element = elementRef.current;
        let resizeObserver = null;

        if (shouldShow && element) {
            const annotationConfig = {
                type: resolvedAction,
                color,
                strokeWidth,
                animationDuration,
                iterations,
                padding,
                multiline,
            };

            const annotation = annotate(element, annotationConfig);
            annotationRef.current = annotation;
            annotation.show();

            resizeObserver = new ResizeObserver(() => {
                annotation.hide();
                annotation.show();
            });

            resizeObserver.observe(element);
            resizeObserver.observe(document.body);
        }

        return () => {
            if (annotationRef.current) {
                annotationRef.current.remove();
                annotationRef.current = null;
            }
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [
        shouldShow,
        resolvedAction,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
    ]);

    return (
        <span ref={elementRef} className={`relative inline-block bg-transparent ${className}`}>
            {children}
        </span>
    );
}
