'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { isMotionDisabled } from '@/config/motion';

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
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
            const progress = Math.min(1, Math.max(0, currentScroll / totalHeight));
            setScrollProgress(progress);
            setVisible(progress >= 0.28);
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

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (disabled) return null;

  // Parámetros para el anillo circular de progreso SVG
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`fixed bottom-24 sm:bottom-8 right-5 sm:right-8 z-40 w-12 h-12 rounded-full bg-surface/90 backdrop-blur-md border border-line-strong text-ink shadow-card flex items-center justify-center transition-all duration-300 focus-visible:outline-accent active:scale-95 group ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Anillo SVG de progreso circular */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-line-subtle"
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-accent transition-all duration-150"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <ArrowUp className="w-4 h-4 text-ink group-hover:text-accent group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
}
