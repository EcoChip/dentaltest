'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export function TreatmentsSummarySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const treatments = siteContent.treatments;

  return (
    <section
      className="py-24 lg:py-32 bg-surface border-t border-line-subtle"
      aria-labelledby="treatments-summary-heading"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-8">
          <div className="max-w-2xl">
            <ScrollReveal variant="fade-up" distance={12} delay={0.05}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-canvas border border-line-subtle rounded-xs mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
                  Disciplinas Odontológicas
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="mask-line" delay={0.1}>
              <h2
                id="treatments-summary-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1]"
              >
                Odontología de mínima invasión y preservación biológica
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fade-up" delay={0.15}>
            <Link
              href="/tratamientos"
              className="touch-target inline-flex items-center space-x-2 text-xs uppercase tracking-clinical text-ink hover:text-accent font-medium pb-1 border-b border-ink hover:border-accent transition-colors shrink-0"
            >
              <span>Ver Catálogo Completo de Tratamientos</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Lista Editorial con Hover Avanzado */}
        <ScrollReveal
          variant="stagger"
          stagger={0.06}
          delay={0.15}
          className="border-t border-line-strong divide-y divide-line-subtle"
        >
          {treatments.map((treatment, index) => {
            const isHovered = hoveredIndex === index;
            const targetUrl =
              treatment.slug === 'invisalign' ? '/invisalign' : `/tratamientos/${treatment.slug}`;

            return (
              <Link
                key={treatment.id}
                href={targetUrl}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group block py-8 lg:py-10 transition-colors duration-200 focus-visible:outline-accent"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:items-center">
                  {/* Número y Título (5 cols) */}
                  <div className="lg:col-span-5 flex items-baseline space-x-6">
                    <span className="font-serif text-lg sm:text-xl text-ink-muted group-hover:text-accent transition-colors tabular-numbers">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink group-hover:text-accent transition-colors tracking-tight">
                        {treatment.title}
                      </h3>
                      <span className="text-[11px] uppercase tracking-clinical text-ink-muted block mt-1">
                        {treatment.slug === 'invisalign' ? 'Tratamiento Protocolizado' : 'Odontología Especializada'}
                      </span>
                    </div>
                  </div>

                  {/* Descripción Concreta (5 cols) */}
                  <div className="lg:col-span-5">
                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                      {treatment.shortDescription}
                    </p>
                    <div className="mt-2 flex items-center space-x-2 text-[11px] text-ink-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{treatment.whatIncludes[0]}</span>
                    </div>
                  </div>

                  {/* Flecha de Enlace y Acción (2 cols) */}
                  <div className="lg:col-span-2 flex items-center lg:justify-end">
                    <div
                      className={`inline-flex items-center space-x-2 text-xs uppercase tracking-clinical rounded-xs px-4 py-2 border transition-all duration-200 ${
                        isHovered
                          ? 'bg-ink text-canvas border-ink'
                          : 'bg-canvas text-ink border-line-subtle'
                      }`}
                    >
                      <span className="hidden sm:inline">Detalles</span>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isHovered ? 'translate-x-0.5 -translate-y-0.5 text-canvas' : 'text-accent'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
