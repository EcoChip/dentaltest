import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { brandConfig } from '@/config/brand';
import { siteContent } from '@/content/site';
import { TREATMENTS_DATA, TREATMENT_SLUGS } from '@/content/treatments';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';
import { HashRedirect } from '@/components/treatments/HashRedirect';
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Layers,
  Activity,
  Scan,
} from 'lucide-react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Parallax } from '@/components/motion/Parallax';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: `Tratamientos Odontológicos en Madrid · Especialidades de Preservación | ${brandConfig.shortName}`,
  description:
    'Directorio de especialidades clínicas en el Barrio de Salamanca: ortodoncia invisible Invisalign®, carillas cerámicas, implantología guiada, periodoncia y prevención.',
  alternates: {
    canonical: `${brandConfig.url}/tratamientos`,
  },
  openGraph: {
    title: `Tratamientos Odontológicos en Madrid · Especialidades de Preservación | ${brandConfig.shortName}`,
    description:
      'Directorio de especialidades clínicas en el Barrio de Salamanca: ortodoncia invisible, carillas de porcelana, implantología guiada y estética biomimética.',
    url: `${brandConfig.url}/tratamientos`,
    type: 'website',
    siteName: brandConfig.name,
    locale: 'es_ES',
  },
};

export default function TreatmentsIndexPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Especialidades Odontológicas', path: '/tratamientos' },
  ]);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de Especialidades Odontológicas',
    description: 'Disciplinas clínicas de odontología de mínima intervención y preservación tisular.',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ortodoncia Invisible Invisalign®',
        url: `${brandConfig.url}/invisalign`,
      },
      ...TREATMENT_SLUGS.map((slug, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: TREATMENTS_DATA[slug].title,
        url: `${brandConfig.url}/tratamientos/${slug}`,
      })),
    ],
  };

  return (
    <div className="pt-28 lg:pt-36 pb-24 bg-canvas text-ink">
      {/* Redirección silenciosa para URLs antiguas con ancla */}
      <HashRedirect />

      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Migas de Pan Visibles & Accesibles */}
        <nav
          aria-label="Ruta de navegación"
          className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-ink-muted mb-6"
        >
          <Link href="/" className="hover:text-ink transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3 text-line-strong" />
          <span className="text-accent font-medium">Especialidades Odontológicas</span>
        </nav>

        {/* Cabecera Editorial */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <ScrollReveal variant="fade-up" distance={12} delay={0.05}>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                Directorio de Disciplinas Clínicas
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="mask-line" delay={0.1}>
            <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight mb-6 leading-[1.08]">
              Disciplinas Odontológicas & Protocolos de Preservación
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.15}>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
              Abordaje integral de la salud bucodental bajo el principio innegociable de mínima intervención y respeto biológico del tejido sano. Planificación tridimensional asistida por ordenador y ejecución microscópica en el Barrio de Salamanca, Madrid.
            </p>
          </ScrollReveal>
        </div>

        {/* TRATAMIENTO INSIGNIA DESTACADO: INVISALIGN® */}
        <ScrollReveal variant="fade-up" delay={0.15} className="mb-20">
          <div className="bg-surface border border-line-strong p-8 sm:p-12 lg:p-14 rounded-xs shadow-card relative overflow-hidden card-interactive">
            <Parallax speed={0.05} className="absolute top-0 right-0 w-72 h-72 pointer-events-none">
              <div className="w-full h-full bg-accent/5 rounded-full blur-3xl" />
            </Parallax>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-clinical font-semibold px-2.5 py-1 bg-accent-soft text-accent rounded-xs">
                    Tratamiento Insignia
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    Alineadores SmartTrack® de 0,75 mm
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
                  Ortodoncia Invisible Invisalign®
                </h2>

                <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-2xl">
                  Alineación dental de alta precisión mediante férulas transparentes secuenciales y planificación computacional ClinCheck® 3D. Microdesplazamiento fisiológico continuo supervisado por la {brandConfig.medicalDirector.name}.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs text-ink-secondary">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>Escáner intraoral 3D sin pastas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>Sin rozaduras metálicas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>Simulación digital antes de iniciar</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-center items-start lg:items-end gap-4">
                <Button
                  href="/invisalign"
                  variant="primary"
                  size="lg"
                  showArrow
                  className="w-full sm:w-auto text-center"
                >
                  Explorar Protocolo 3D
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* DIRECTORIO DE ESPECIALIDADES CLÍNICAS INDIVIDUALES */}
        <div className="space-y-8 mb-24">
          <div className="flex items-center justify-between pb-4 border-b border-line-subtle">
            <span className="text-xs uppercase tracking-clinical text-ink-muted font-medium">
              Especialidades con Protocolo Propio
            </span>
            <span className="text-xs font-mono text-ink-muted">
              5 Especialidades Clínicas
            </span>
          </div>

          <ScrollReveal
            variant="stagger"
            stagger={0.06}
            delay={0.15}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {TREATMENT_SLUGS.map((slug, idx) => {
              const item = TREATMENTS_DATA[slug];
              return (
                <article
                  key={slug}
                  className="group bg-surface border border-line-subtle hover:border-line-strong p-8 rounded-xs shadow-subtle card-interactive flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl text-accent tabular-numbers">
                        0{idx + 1}
                      </span>
                      <span className="text-[10px] uppercase tracking-clinical text-ink-muted bg-canvas px-2.5 py-1 rounded-xs border border-line-subtle">
                        {item.category}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl text-ink group-hover:text-accent transition-colors tracking-tight">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed line-clamp-3">
                      {item.heroSubtitle}
                    </p>

                    <div className="pt-2 border-t border-line-subtle flex items-center space-x-2 text-xs font-mono text-ink-muted">
                      <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">{item.durationEstimated}</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-line-subtle">
                    <Link
                      href={`/tratamientos/${item.slug}`}
                      className="touch-target w-full px-4 py-2.5 bg-canvas group-hover:bg-ink group-hover:text-canvas text-ink border border-line-subtle group-hover:border-ink rounded-xs text-xs uppercase tracking-clinical font-medium transition-all duration-200 flex items-center justify-between"
                    >
                      <span>Ver detalles y casos</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-accent group-hover:text-canvas group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </ScrollReveal>
        </div>

        {/* PILARES BIOLÓGICOS Y TECNOLÓGICOS */}
        <section className="mb-24 py-16 px-8 sm:px-12 bg-surface border border-line-strong rounded-xs shadow-subtle">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Estándares Clínicos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Tecnología de diagnóstico y preservación tisular
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-canvas border border-line-subtle flex items-center justify-center text-accent">
                <Scan className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-ink">Diagnóstico 3D CBCT</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Tomografía volumétrica de haz cónico con mínima dosis de radiación para evaluar hueso, raíces y articulaciones con resolución nanométrica.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-canvas border border-line-subtle flex items-center justify-center text-accent">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-ink">Magnificación Microscópica</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Toda intervención adhesiva, periodontal o restauradora se realiza bajo magnificación óptica para proteger cada micra de esmalte sano.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-canvas border border-line-subtle flex items-center justify-center text-accent">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-ink">Biomateriales Certificados</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Cerámicas feldespáticas vítreas, titanio biocompatible de grado médico y composites biocompatibles libres de bisfenoles agresivos.
              </p>
            </div>
          </div>
        </section>

        {/* CTA FINAL DE VALORACIÓN */}
        <div className="bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-2">
              ¿No tienes certeza de qué tratamiento necesitas?
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              En tu primera visita de valoración realizamos un examen bucodental completo con escáner intraoral 3D para definir el plan más biológico y conservador.
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
