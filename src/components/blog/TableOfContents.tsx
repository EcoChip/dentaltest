'use client';

import React, { useEffect, useState } from 'react';
import { ListFilter, ChevronRight } from 'lucide-react';
import type { TocItem } from '@/content/blog';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 110;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="Tabla de contenidos del artículo"
      className="p-6 bg-surface border border-line-subtle rounded-xs shadow-subtle space-y-4"
    >
      <div className="flex items-center space-x-2 pb-3 border-b border-line-subtle text-ink">
        <ListFilter className="w-4 h-4 text-accent" />
        <span className="text-xs uppercase tracking-clinical font-semibold">
          Índice del Artículo
        </span>
      </div>

      <ul className="space-y-2 text-xs">
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`group flex items-start space-x-2 py-1 transition-colors ${
                  isActive
                    ? 'text-accent font-medium'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                <span className="font-mono text-[10px] text-ink-muted group-hover:text-accent mt-0.5 tabular-numbers">
                  0{idx + 1}
                </span>
                <span className="leading-snug flex-1">{item.title}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
