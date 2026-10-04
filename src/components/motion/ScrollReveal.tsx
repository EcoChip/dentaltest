'use client';

import React, { useEffect, useRef, useState, ElementType, ComponentPropsWithoutRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_TOKENS, isMotionDisabled } from '@/config/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealVariant = 'fade-up' | 'mask-line' | 'stagger' | 'zoom-in';

interface ScrollRevealProps<T extends ElementType = 'div'> {
  as?: T;
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  className?: string;
  threshold?: string;
  once?: boolean;
}

export function ScrollReveal<T extends ElementType = 'div'>({
  as,
  children,
  variant = 'fade-up',
  delay = 0,
  duration = MOTION_TOKENS.durations.slow,
  distance = MOTION_TOKENS.distances.lg,
  stagger = MOTION_TOKENS.staggers.normal,
  className = '',
  threshold = 'top 88%',
  once = true,
  ...rest
}: ScrollRevealProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ScrollRevealProps<T>>) {
  const Component = as || 'div';
  const containerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (isMotionDisabled()) {
      setDisabled(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Reducción sutil de distancia en dispositivos móviles
    const isMobile = window.innerWidth < 768;
    const finalDistance = isMobile ? distance * MOTION_TOKENS.mobile.distanceMultiplier : distance;
    const finalDuration = isMobile ? duration * MOTION_TOKENS.mobile.durationMultiplier : duration;

    const ctx = gsap.context(() => {
      if (variant === 'mask-line') {
        const target = innerRef.current || container;
        gsap.set(target, { y: finalDistance, opacity: 0 });

        ScrollTrigger.create({
          trigger: container,
          start: threshold,
          once,
          onEnter: () => {
            gsap.to(target, {
              y: 0,
              opacity: 1,
              duration: finalDuration,
              delay,
              ease: MOTION_TOKENS.easings.entranceGsap,
            });
          },
        });
      } else if (variant === 'stagger') {
        const targets = container.querySelectorAll(':scope > *');
        if (targets.length > 0) {
          gsap.set(targets, { y: finalDistance, opacity: 0 });

          ScrollTrigger.create({
            trigger: container,
            start: threshold,
            once,
            onEnter: () => {
              gsap.to(targets, {
                y: 0,
                opacity: 1,
                duration: finalDuration,
                stagger,
                delay,
                ease: MOTION_TOKENS.easings.entranceGsap,
              });
            },
          });
        }
      } else if (variant === 'zoom-in') {
        gsap.set(container, { scale: 0.96, opacity: 0 });

        ScrollTrigger.create({
          trigger: container,
          start: threshold,
          once,
          onEnter: () => {
            gsap.to(container, {
              scale: 1,
              opacity: 1,
              duration: finalDuration,
              delay,
              ease: MOTION_TOKENS.easings.entranceGsap,
            });
          },
        });
      } else {
        // fade-up por defecto
        gsap.set(container, { y: finalDistance, opacity: 0 });

        ScrollTrigger.create({
          trigger: container,
          start: threshold,
          once,
          onEnter: () => {
            gsap.to(container, {
              y: 0,
              opacity: 1,
              duration: finalDuration,
              delay,
              ease: MOTION_TOKENS.easings.entranceGsap,
            });
          },
        });
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, [variant, delay, duration, distance, stagger, threshold, once]);

  // Si está deshabilitado el movimiento por preferencia o debug, renderizar directo
  if (disabled) {
    return (
      <Component className={className} {...(rest as any)}>
        {children}
      </Component>
    );
  }

  if (variant === 'mask-line') {
    return (
      <Component
        ref={containerRef as any}
        className={`overflow-hidden ${className}`}
        {...(rest as any)}
      >
        <div ref={innerRef} className="will-change-transform">
          {children}
        </div>
      </Component>
    );
  }

  return (
    <Component
      ref={containerRef as any}
      className={`${variant === 'stagger' ? '' : 'will-change-transform'} ${className}`}
      {...(rest as any)}
    >
      {children}
    </Component>
  );
}
