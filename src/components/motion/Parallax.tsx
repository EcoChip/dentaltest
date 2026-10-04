'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_TOKENS, isMotionDisabled } from '@/config/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // 0.05 a 0.08 recomendado
  className?: string;
}

export function Parallax({
  children,
  speed = MOTION_TOKENS.parallax.desktopOffset,
  className = '',
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (isMotionDisabled()) {
      setDisabled(true);
      return;
    }

    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    const isMobile = window.innerWidth < 768;
    const finalSpeed = isMobile ? speed * 0.5 : speed;
    const percentMovement = finalSpeed * 100;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { yPercent: -percentMovement },
        {
          yPercent: percentMovement,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [speed]);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={targetRef} className="will-change-transform h-full w-full">
        {children}
      </div>
    </div>
  );
}
