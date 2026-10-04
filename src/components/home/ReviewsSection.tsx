'use client';

import React, { useRef, useState, useEffect } from 'react';
import reviewsData from '@/data/reviews.placeholder.json';
import { siteContent } from '@/content/site';
import { Star, ShieldAlert, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export function ReviewsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Referencias para arrastre fluido (drag & drop) con inercia
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const momentumRafRef = useRef<number | null>(null);

  const reviews = reviewsData.reviews;
  const headerInfo = siteContent.reviewsHeader;

  const cancelMomentum = () => {
    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
  };

  // Actualizar estado de scroll, flechas y barra de progreso
  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
    }
  };

  useEffect(() => {
    checkScrollState();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);

    return () => {
      cancelMomentum();
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, []);

  // Controladores de arrastre con ratón (Mouse Drag con Momentum)
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    cancelMomentum();
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollStartRef.current = el.scrollLeft;
    lastXRef.current = e.pageX;
    velocityRef.current = 0;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;
    el.scrollLeft = scrollStartRef.current - walk;

    velocityRef.current = e.pageX - lastXRef.current;
    lastXRef.current = e.pageX;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Aplicar inercia (Momentum Fling)
    const el = scrollContainerRef.current;
    if (!el) return;

    let currentVelocity = velocityRef.current;
    const applyMomentum = () => {
      if (Math.abs(currentVelocity) > 0.5) {
        el.scrollLeft -= currentVelocity * 1.5;
        currentVelocity *= 0.92; // Factor de fricción suave
        momentumRafRef.current = requestAnimationFrame(applyMomentum);
      } else {
        cancelMomentum();
      }
    };

    momentumRafRef.current = requestAnimationFrame(applyMomentum);
  };

  // Autoplay accesible con pausa en hover/foco y respeto de reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const nextIdx = (currentIndex + 1) % reviews.length;
      const cardWidth = el.querySelector('article')?.clientWidth || 320;
      el.scrollTo({
        left: nextIdx * (cardWidth + 24),
        behavior: 'smooth',
      });
      setCurrentIndex(nextIdx);
    }, 5500);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, reviews.length]);

  const scrollPrev = () => {
    cancelMomentum();
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('article')?.clientWidth || 320;
    el.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
  };

  const scrollNext = () => {
    cancelMomentum();
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('article')?.clientWidth || 320;
    el.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
  };

  return (
    <section
      className="py-24 lg:py-32 bg-canvas border-t border-line-subtle"
      aria-labelledby="reviews-title"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera y Valoración Media */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="max-w-xl">
            <ScrollReveal variant="fade-up" distance={12} delay={0.05}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
                  Testimonios y Experiencia de Paciente
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="mask-line" delay={0.1}>
              <h2
                id="reviews-title"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1]"
              >
                Evaluaciones clínicas de pacientes en tratamiento activo
              </h2>
            </ScrollReveal>
          </div>

          {/* Bloque de Calificación Global de Google */}
          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="bg-surface border border-line-strong p-6 rounded-xs shrink-0 flex items-center space-x-6 shadow-subtle card-interactive">
              <div className="text-center border-r border-line-subtle pr-6">
                <span className="font-serif text-4xl sm:text-5xl text-ink font-light block leading-none tabular-numbers">
                  {headerInfo.globalRating}
                </span>
                <span className="text-[10px] uppercase tracking-clinical text-ink-muted">
                  sobre {headerInfo.maxRating}
                </span>
              </div>
              <div>
                <div
                  className="flex items-center space-x-1 mb-1.5 text-accent"
                  aria-label={`Calificación de ${headerInfo.globalRating} sobre 5 estrellas`}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xs text-ink font-medium">
                  {headerInfo.totalReviews} opiniones verificadas
                </p>
                <a
                  href={headerInfo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-accent hover:underline flex items-center space-x-1 mt-1"
                >
                  <span>{headerInfo.sourceName}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Banner de Aviso de Confidencialidad y Marcador Obligatorio */}
        <div className="mb-8 p-4 bg-surface border border-line-strong rounded-xs flex items-start space-x-3 text-xs text-ink-secondary">
          <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-ink uppercase tracking-wider block text-[10px]">
              {headerInfo.disclaimer}
            </span>
            <p className="text-[11px] leading-relaxed text-ink-muted">
              {reviewsData.__AVISO_CONFIDENCIALIDAD__}
            </p>
          </div>
        </div>

        {/* Controles Accesibles del Carrusel */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-ink-muted uppercase tracking-clinical">
            Desliza para examinar experiencias ({reviews.length} testimonios)
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-xs border border-line-subtle bg-surface text-ink transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                !canScrollLeft
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-line-strong hover:bg-surface-elevated'
              }`}
              aria-label="Ver testimonio anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-xs border border-line-subtle bg-surface text-ink transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                !canScrollRight
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-line-strong hover:bg-surface-elevated'
              }`}
              aria-label="Ver siguiente testimonio"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carrusel con Scroll-Snap, Arrastre con Inercia (Momentum) y Pausa en Hover/Foco */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            handleMouseUpOrLeave();
            setIsPaused(false);
          }}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          data-cursor="drag"
          className="flex space-x-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none focus:outline-none cursor-grab active:cursor-grabbing select-none"
          tabIndex={0}
          aria-label="Carrusel de testimonios"
        >
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="w-[300px] sm:w-[360px] lg:w-[380px] shrink-0 snap-start bg-surface border border-line-subtle hover:border-line-strong p-8 rounded-xs shadow-subtle flex flex-col justify-between card-interactive focus-within:border-accent"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-accent">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-[10px] text-ink-muted font-mono">{rev.date}</span>
                </div>

                <blockquote className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-8 italic">
                  &ldquo;{rev.comment}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-line-subtle flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-ink block font-serif">
                    {rev.author}
                  </span>
                  <span className="text-[10px] uppercase tracking-clinical text-accent">
                    {rev.treatment}
                  </span>
                </div>

                <a
                  href={headerInfo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-clinical text-ink-muted hover:text-accent flex items-center space-x-1"
                  aria-label={`Ver reseña de ${rev.author} en Google`}
                >
                  <span>Google</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Barra de progreso de navegación del carrusel */}
        <div className="mt-4 flex items-center justify-center">
          <div className="w-48 h-1 bg-line-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-[width] duration-150 ease-out"
              style={{ width: `${Math.max(12, Math.round(scrollProgress * 100))}%` }}
              role="progressbar"
              aria-valuenow={Math.round(scrollProgress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso de testimonios"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
