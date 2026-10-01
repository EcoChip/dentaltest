'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface AccordionFAQProps {
  items: FAQItem[];
  allowMultiple?: boolean;
  defaultOpenIndex?: number | null;
  className?: string;
}

export function AccordionFAQ({
  items,
  allowMultiple = false,
  defaultOpenIndex = null,
  className = '',
}: AccordionFAQProps) {
  // Acordeón clásico: una sola pregunta abierta a la vez por defecto
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== null ? [defaultOpenIndex] : []
  );

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const triggerScrollTriggerRefresh = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        ScrollTrigger.refresh();
      } catch (e) {
        // Ignorar si ScrollTrigger aún no está activo
      }
    }
  }, []);

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) => {
      const isOpen = prev.includes(idx);
      let next: number[];
      if (allowMultiple) {
        next = isOpen ? prev.filter((i) => i !== idx) : [...prev, idx];
      } else {
        next = isOpen ? [] : [idx];
      }
      return next;
    });

    // Refrescar ScrollTrigger tras completar la animación para evitar desajustes en el resto del scroll
    const delay = isReducedMotion.current ? 10 : 380;
    setTimeout(() => {
      triggerScrollTriggerRefresh();
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIdx = (idx + 1) % items.length;
        buttonRefs.current[nextIdx]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIdx = (idx - 1 + items.length) % items.length;
        buttonRefs.current[prevIdx]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        buttonRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        buttonRefs.current[items.length - 1]?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`border-t border-line-strong divide-y divide-line-subtle ${className}`}
      role="presentation"
    >
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const triggerId = `faq-trigger-${idx}`;
        const panelId = `faq-panel-${idx}`;

        return (
          <div
            key={idx}
            className="group py-5 sm:py-6 transition-colors duration-200 focus-within:bg-surface/30"
          >
            <h3>
              <button
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-full flex items-center justify-between text-left select-none text-ink group-hover:text-accent focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-xs transition-colors duration-200"
              >
                <span className="font-serif text-lg sm:text-xl font-normal pr-6 tracking-tight leading-snug">
                  {item.q}
                </span>
                <span
                  className={`w-8 h-8 rounded-full border border-line-subtle flex items-center justify-center shrink-0 transition-transform duration-300 ease-out bg-surface/50 group-hover:border-accent ${
                    isOpen ? 'rotate-180 bg-accent text-canvas border-accent' : 'text-accent'
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isOpen ? 'text-canvas' : 'text-accent'
                    }`}
                  />
                </span>
              </button>
            </h3>

            {/* Contenedor animado con CSS Grid (0fr -> 1fr) */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`grid transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`pt-4 sm:pt-5 pr-8 sm:pr-12 text-xs sm:text-sm text-ink-secondary leading-relaxed transition-all duration-300 ${
                    isOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                >
                  <p className="max-w-3xl">{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
