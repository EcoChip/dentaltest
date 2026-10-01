'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  q: string;
  a: string;
}

export function AccordionFAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="border-t border-line-strong divide-y divide-line-subtle">
      {items.map((item, idx) => (
        <details
          key={idx}
          className="group py-6 focus-within:bg-canvas/40 transition-colors"
        >
          <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none text-ink group-hover:text-accent transition-colors focus-visible:outline-accent">
            <span className="font-serif text-lg sm:text-xl font-normal pr-6">
              {item.q}
            </span>
            <span className="w-8 h-8 rounded-full border border-line-subtle flex items-center justify-center shrink-0 group-open:rotate-180 transition-transform duration-200">
              <ChevronDown className="w-4 h-4 text-accent" />
            </span>
          </summary>
          <div className="pt-4 pr-12 text-xs sm:text-sm text-ink-secondary leading-relaxed animate-in fade-in duration-200">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
