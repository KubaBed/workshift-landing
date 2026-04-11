import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function GradientText({
  children,
  className = '',
  colors = ['#9CE069', '#E6E8DD', '#7bc44a'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true
}) {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';
  const gradientColors = [...colors, colors[0]].join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',
    backgroundRepeat: 'repeat'
  };

  const bgPositionStart = direction === 'horizontal' ? '0% 50%' : direction === 'vertical' ? '50% 0%' : '0% 50%';
  const bgPositionEnd = direction === 'horizontal' ? '100% 50%' : direction === 'vertical' ? '50% 100%' : '100% 50%';

  return (
    <motion.span
      className={`relative inline-flex items-center cursor-pointer ${showBorder ? 'py-1 px-2 rounded-[1.25rem]' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && (
        <motion.span
          className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]"
          style={{ ...gradientStyle, backgroundPosition: bgPositionStart }}
        >
          <span
            className="absolute bg-black rounded-[1.25rem] z-[-1]"
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </motion.span>
      )}
      <motion.span
        className="inline-block relative text-transparent bg-clip-text pb-2"
        style={{ ...gradientStyle, WebkitBackgroundClip: 'text', backgroundPosition: bgPositionStart }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
