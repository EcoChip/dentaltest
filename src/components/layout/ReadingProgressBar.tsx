'use client';

import React, { useEffect, useState } from 'react';
import { isMotionDisabled } from '@/config/motion';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (isMotionDisabled()) {
      setDisabled(true);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentScroll = window.scrollY || document.documentElement.scrollTop;
            const currentProgress = Math.min(1, Math.max(0, currentScroll / totalHeight));
            setProgress(currentProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (disabled) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-[2px] z-[60] pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
          transition: 'transform 0.1s linear',
        }}
      />
    </div>
  );
}
