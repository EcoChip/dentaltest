import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';
import {
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

import { brandConfig } from '@/config/brand';

export const metadata: Metadata = {
  title: `Tratamientos Odontológicos en Madrid · Carillas, Implantes y Estética | ${brandConfig.shortName}`,
  description:
    'Especialidades clínicas de preservación tisular en el Barrio de Salamanca: ortodoncia invisible Invisalign®, carillas cerámicas biomiméticas e implantología guiada en Madrid.',
  alternates: {
    canonical: `${brandConfig.url}/tratamientos`,
  },
  openGraph: {
    title: `Tratamientos Odontológicos en Madrid · Carillas, Implantes y Estética | ${brandConfig.shortName}`,
    description:
      'Especialidades clínicas de preservación tisular en el Barrio de Salamanca: ortodoncia invisible, carillas cerámicas e implantología guiada.',
    url: `${brandConfig.url}/tratamientos`,
    type: 'website',
  },
};

export default function TreatmentsPage() {
  const treatments = siteContent.treatments;
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Especialidades Odontológicas', path: '/tratamientos' },
  ]);

  return (
    <div className="pt-28 lg:pt-36 pb-24">
      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera Editorial */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-accent font-medium mb-3">
            <Link href="/" className="text-ink-muted hover:text-ink">
              Inicio
            </Link>
            <span>/</span>
            <span>Especialidades Odontológicas</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight mb-6 leading-[1.08]">
            Disciplinas Clínicas & Protocolos de Preservación
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Abordaje integral de la salud bucodental bajo el principio de mínima intervención y respeto biológico del tejido sano. Diagnóstico tridimensional asistido por ordenador y ejecución microscópica en Madrid.
          </p>
        </div>

        {/* Índice Rápido de Navegación por Hash con Scroll Suave */}
        <div className="mb-16 p-4 sm:p-6 bg-surface border border-line-strong rounded-xs shadow-subtle">
          <span className="text-[10px] uppercase tracking-clinical text-ink-muted font-semibold block mb-3">
            Índice de Tratamientos Clínicos
          </span>
          <nav
            aria-label="Índice de navegación por especialidad"
            className="flex flex-wrap gap-2 sm:gap-3"
          >
            {treatments.map((tr, idx) => (
              <a
                key={tr.id}
                href={`#${tr.slug}`}
                className="touch-target px-3.5 py-2 bg-canvas hover:bg-ink hover:text-canvas border border-line-subtle rounded-xs text-xs text-ink transition-colors flex items-center space-x-1.5"
              >
                <span className="font-mono text-[10px] text-accent">0{idx + 1}</span>
                <span className="font-medium">{tr.title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Bloques Detallados por Tratamiento con Ancla por Hash */}
        <div className="space-y-16">
          {treatments.map((tr, index) => (
            <article
              key={tr.id}
              id={tr.slug}
              className="bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card scroll-mt-28"
            >
              {/* Encabezado del Tratamiento */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-line-subtle">
                <div className="max-w-3xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-[10px] uppercase tracking-clinical font-semibold px-2.5 py-1 bg-accent-soft text-accent rounded-xs">
                      Especialidad 0{index + 1}
                    </span>
                    <span className="text-xs text-ink-muted font-mono">
                      Protocolo Clínico Homologado
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-4">
                    {tr.title}
                  </h2>

                  <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mb-4">
                    {tr.fullDescription}
                  </p>
                </div>

                {/* Tarjeta Lateral de Consulta y Presupuesto */}
                <div className="bg-canvas border border-line-subtle p-6 rounded-xs shrink-0 lg:w-80 space-y-4 shadow-subtle">
                  <div className="flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-clinical text-ink-muted block">
                        Duración Estimada
                      </span>
                      <span className="text-xs font-medium text-ink font-mono">
                        {tr.durationRange}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-line-subtle">
                    <span className="text-[10px] uppercase tracking-clinical text-ink-muted block mb-1">
                      Criterio de Presupuesto
                    </span>
                    <p className="text-[11px] text-ink-secondary leading-relaxed">
                      {tr.priceNotice}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={
                        tr.slug === 'invisalign'
                          ? '/invisalign'
                          : `/contacto?tratamiento=${tr.slug}`
                      }
                      className="touch-target w-full text-center text-xs uppercase tracking-clinical py-3 bg-ink text-canvas hover:bg-accent rounded-xs transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <Calendar className="w-3.5 h-3.5 text-canvas" />
                      <span>{siteContent.ctas.primary}</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Fila Inferior: Qué Incluye + Cuándo se Recomienda */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
                {/* Qué Incluye */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-ink">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <h3 className="text-xs uppercase tracking-clinical font-semibold">
                      Qué incluye el protocolo
                    </h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-ink-secondary">
                    {tr.whatIncludes.map((inc) => (
                      <li key={inc} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cuándo se Recomienda */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-ink">
                    <HelpCircle className="w-4 h-4 text-accent" />
                    <h3 className="text-xs uppercase tracking-clinical font-semibold">
                      Cuándo se recomienda clínicamente
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed bg-canvas p-4 rounded-xs border border-line-subtle">
                    {tr.recommendedWhen}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Global al final de tratamientos */}
        <div className="mt-20 bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-2">
              ¿No tienes certeza de cuál es tu necesidad diagnóstica?
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              En tu primera visita de valoración realizamos un examen bucodental completo con escáner intraoral 3D para definir el plan de tratamiento más conservador.
            </p>
          </div>

          <Link
            href="/contacto"
            className="touch-target px-8 py-4 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs font-medium transition-colors shrink-0 flex items-center space-x-2 shadow-subtle group"
          >
            <Calendar className="w-4 h-4 text-canvas" />
            <span>{siteContent.ctas.primary}</span>
            <ArrowUpRight className="w-4 h-4 text-canvas/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
