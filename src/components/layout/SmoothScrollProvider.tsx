'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, desactivar Lenis y usar scroll nativo
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Inicializar Lenis con configuración no agresiva en táctil
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.2,
      infinite: false,
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      (window as any).__lenis = lenis;
    }

    // Sincronización bidireccional estricta con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete (window as any).__lenis;
      }
    };
  }, []);

  // Al cambiar de ruta: resetear scroll a la cabecera inmediatamente y refrescar ScrollTrigger
  useEffect(() => {
    window.scrollTo(0, 0);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    // Pequeño retardo para asegurar que el nuevo DOM esté montado antes de refrescar ScrollTrigger
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
