'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionDisabled } from '@/config/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.3,
  className = '',
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState<string>(() => {
    // Si en SSR o sin animar, estado inicial
    return typeof value === 'number' ? String(value) : value;
  });

  useEffect(() => {
    if (isMotionDisabled()) {
      setDisplayValue(String(value));
      return;
    }

    const rawStr = String(value).trim();
    // Extraer prefijo, número, separador decimal y sufijo
    // Ejemplos: "860+", "18+", "99,2%", "100%", "+250"
    const match = rawStr.match(/^([^\d]*)([\d]+(?:[.,]\d+)?)(.*)$/);
    if (!match) {
      setDisplayValue(rawStr);
      return;
    }

    const prefix = match[1] || '';
    const numStr = match[2] || '0';
    const suffix = match[3] || '';

    const usesComma = numStr.includes(',');
    const normalizedNumStr = numStr.replace(',', '.');
    const targetNum = parseFloat(normalizedNumStr);

    if (isNaN(targetNum)) {
      setDisplayValue(rawStr);
      return;
    }

    const decimalParts = normalizedNumStr.split('.');
    const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
    const decimalSep = usesComma ? ',' : '.';

    // Establecer estado inicial en 0 con formato
    const formatValue = (current: number) => {
      const fixed = current.toFixed(decimals);
      const formatted = usesComma ? fixed.replace('.', decimalSep) : fixed;
      return `${prefix}${formatted}${suffix}`;
    };

    setDisplayValue(formatValue(0));

    const el = containerRef.current;
    if (!el) return;

    const proxy = { val: 0 };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            val: targetNum,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              setDisplayValue(formatValue(proxy.val));
            },
            onComplete: () => {
              // Asegurar valor final exacto original
              setDisplayValue(rawStr);
            },
          });
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [value, duration]);

  return (
    <span ref={containerRef} className={`tabular-numbers inline-block ${className}`}>
      {displayValue}
    </span>
  );
}
