'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost, BLOG_CATEGORIES } from '@/content/blog';
import { Clock, Calendar, ArrowUpRight, User, BookOpen } from 'lucide-react';
import { isMotionDisabled } from '@/config/motion';

interface CategoryFilterProps {
  posts: BlogPost[];
}

export function CategoryFilter({ posts }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    ready: boolean;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });

  // Calcular posición del pill deslizante
  useEffect(() => {
    const updatePill = () => {
      const container = tabsContainerRef.current;
      const activeBtn = buttonRefs.current.get(selectedCategory);
      if (!container || !activeBtn) return;

      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();

      setPillStyle({
        left: btnRect.left - containerRect.left,
        top: btnRect.top - containerRect.top,
        width: btnRect.width,
        height: btnRect.height,
        ready: true,
      });
    };

    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [selectedCategory]);

  const filteredPosts =
    selectedCategory === 'todas'
      ? posts
      : posts.filter((post) => post.categoryId === selectedCategory);

  const motionDisabled = typeof window !== 'undefined' && isMotionDisabled();

  return (
    <div className="space-y-12">
      {/* Botones de Filtro por Disciplina Clínica con Pill Deslizante */}
      <div
        ref={tabsContainerRef}
        className="relative flex flex-wrap gap-2 pb-6 border-b border-line-subtle"
        role="tablist"
        aria-label="Filtrar por especialidad médica"
      >
        {/* Indicador Deslizante (Pill) */}
        {pillStyle.ready && (
          <div
            className={`absolute bg-btn-primary rounded-btn pointer-events-none shadow-subtle ${
              motionDisabled ? '' : 'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
            }`}
            style={{
              transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
              width: pillStyle.width,
              height: pillStyle.height,
            }}
            aria-hidden="true"
          />
        )}

        {BLOG_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'todas'
              ? posts.length
              : posts.filter((p) => p.categoryId === cat.id).length;

          return (
            <button
              key={cat.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(cat.id, el);
              }}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative z-10 touch-target px-4 py-2 text-xs uppercase tracking-clinical rounded-btn font-medium transition-colors duration-200 flex items-center space-x-2 border cursor-pointer ${
                isSelected
                  ? 'text-btn-primary-text border-transparent'
                  : 'bg-surface text-ink-secondary border-line-subtle hover:border-line-strong hover:text-ink'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded-badge transition-colors duration-200 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-canvas text-ink-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cuadrícula de Artículos Filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, idx) => (
          <article
            key={post.slug}
            className="group bg-surface border border-line-subtle hover:border-line-strong p-8 rounded-xs shadow-subtle flex flex-col justify-between card-interactive"
          >
            <div className="space-y-5">
              {/* Encabezado: Categoría y Tiempo */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold px-2 py-0.5 bg-accent-soft rounded-xs">
                  {post.category}
                </span>
                <span className="flex items-center space-x-1 text-[11px] font-mono text-ink-muted">
                  <Clock className="w-3 h-3 text-accent" />
                  <span>{post.readTime}</span>
                </span>
              </div>

              {/* Título */}
              <h2 className="font-serif text-2xl text-ink group-hover:text-accent transition-colors tracking-tight leading-snug">
                <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                  {post.title}
                </Link>
              </h2>

              {/* Extracto */}
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              {/* Autor y Fecha */}
              <div className="pt-4 border-t border-line-subtle flex items-center justify-between text-xs text-ink-muted">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span className="font-medium text-ink truncate max-w-[140px]">
                    {post.author.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1 font-mono text-[11px]">
                  <Calendar className="w-3 h-3 text-line-strong" />
                  <span>{post.publishedDate.split(' de ')[0]} {post.publishedDate.split(' de ')[1]?.slice(0, 3)}</span>
                </div>
              </div>
            </div>

            {/* Enlace de Lectura */}
            <div className="pt-6 mt-6 border-t border-line-subtle">
              <Link
                href={`/blog/${post.slug}`}
                className="touch-target w-full px-4 py-2.5 bg-canvas group-hover:bg-ink group-hover:text-canvas text-ink border border-line-subtle group-hover:border-ink rounded-xs text-xs uppercase tracking-clinical font-medium transition-all duration-200 flex items-center justify-between"
              >
                <span>Leer artículo clínico</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-accent group-hover:text-canvas group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="p-12 text-center bg-surface border border-line-subtle rounded-xs">
          <BookOpen className="w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-sm text-ink-secondary">
            No hay artículos disponibles en esta categoría por el momento.
          </p>
        </div>
      )}
    </div>
  );
}
