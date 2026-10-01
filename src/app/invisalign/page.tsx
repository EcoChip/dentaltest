import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { InvisalignViewerSection } from '@/components/invisalign/InvisalignViewerSection';
import { AccordionFAQ } from '@/components/common/AccordionFAQ';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFaqSchema } from '@/lib/seo/schema';
import {
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Clock,
  Scan,
  ShieldCheck,
} from 'lucide-react';

import { brandConfig } from '@/config/brand';

export const metadata: Metadata = {
  title: `Invisalign en Madrid · Ortodoncia Invisible con Planificación ClinCheck® | ${brandConfig.shortName}`,
  description:
    `Alineadores transparentes SmartTrack® con planificación computacional 3D ClinCheck® en el Barrio de Salamanca, Madrid. Dirección por la ${brandConfig.medicalDirector.name}.`,
  alternates: {
    canonical: `${brandConfig.url}/invisalign`,
  },
  openGraph: {
    title: `Invisalign en Madrid · Ortodoncia Invisible con Planificación ClinCheck® | ${brandConfig.shortName}`,
    description:
      'Alineadores transparentes SmartTrack® con planificación computacional 3D ClinCheck® en el Barrio de Salamanca, Madrid.',
    url: `${brandConfig.url}/invisalign`,
    type: 'website',
  },
};

export default function InvisalignPage() {
  const invisalign = siteContent.invisalignPage;
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ortodoncia Invisible', path: '/invisalign' },
  ]);
  const faqSchema = getFaqSchema(invisalign.faq);

  return (
    <div className="pt-28 lg:pt-36 pb-24">
      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera Editorial */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-accent font-medium mb-3">
            <Link href="/" className="text-ink-muted hover:text-ink">
              Inicio
            </Link>
            <span>/</span>
            <span>Especialidades</span>
            <span>/</span>
            <span>Ortodoncia Invisible</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight mb-6 leading-[1.08]">
            {invisalign.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            {invisalign.heroSubtitle}
          </p>
        </div>

        {/* Visor 3D Ligero y Explicación SmartTrack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-24">
          <div className="lg:col-span-7 h-[420px] sm:h-[480px]">
            <InvisalignViewerSection />
          </div>

          <div className="lg:col-span-5 bg-surface border border-line-strong p-8 sm:p-10 rounded-xs shadow-subtle flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block">
                Ingeniería de Polímeros
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
                SmartTrack®: Fuerza suave y constante de 0,75 mm
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                A diferencia de los acetatos termoformados genéricos, el material multicapa patentado SmartTrack® presenta una tasa superior de elasticidad continua. Permite un control milimétrico sobre el centro de rotación y traslación dental sin fuerzas traumáticas.
              </p>

              <div className="space-y-2 pt-2 border-t border-line-subtle text-xs text-ink-secondary">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Borde recortado por láser siguiendo el festón gingival</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Transparencia óptica con acabado antirreflejo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Removible para higiene bucal completa y alimentación</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-line-subtle mt-6 flex items-center justify-between">
              <span className="text-xs text-ink-muted">Dirección Médica Certificada:</span>
              <span className="text-xs font-serif font-medium text-ink">
                {brandConfig.medicalDirector.name}
              </span>
            </div>
          </div>
        </div>

        {/* Proceso Clínico Paso a Paso */}
        <div className="mb-24">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Protocolo Terapéutico
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              El proceso de tratamiento en 4 etapas protocolizadas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {invisalign.processSteps.map((step) => (
              <div
                key={step.step}
                className="bg-surface border border-line-subtle p-6 sm:p-8 rounded-xs shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-accent mb-4 block tabular-numbers">
                    {step.step}
                  </span>
                  <h3 className="font-serif text-xl text-ink mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparativa Sobria: Alineadores vs Brackets */}
        <div className="mb-24 bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-subtle">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Criterio Médico Comparado
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-3">
              {invisalign.comparison.title}
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              {invisalign.comparison.disclaimer}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-line-strong">
                  <th className="py-4 font-semibold text-ink uppercase tracking-clinical w-1/4">
                    Aspecto Clínico
                  </th>
                  <th className="py-4 font-semibold text-accent uppercase tracking-clinical w-3/8">
                    Alineadores Transparentes (Invisalign®)
                  </th>
                  <th className="py-4 font-semibold text-ink-muted uppercase tracking-clinical w-3/8">
                    Ortodoncia Convencional (Brackets)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle">
                {invisalign.comparison.criteria.map((row) => (
                  <tr key={row.aspect} className="hover:bg-canvas/40 transition-colors">
                    <td className="py-4 font-medium text-ink align-top">{row.aspect}</td>
                    <td className="py-4 text-ink-secondary leading-relaxed align-top pr-6">
                      {row.aligners}
                    </td>
                    <td className="py-4 text-ink-muted leading-relaxed align-top">
                      {row.brackets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidatos y Duración Orientativa */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 items-stretch">
          {/* Candidatos (7 cols) */}
          <div className="lg:col-span-7 bg-surface border border-line-subtle p-8 sm:p-12 rounded-xs">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Diagnóstico y Selección de Casos
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight mb-6">
              {invisalign.candidates.title}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {invisalign.candidates.items.map((item) => (
                <li key={item} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Duración Orientativa (5 cols) */}
          <div className="lg:col-span-5 bg-surface border border-line-subtle p-8 sm:p-12 rounded-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-accent mb-4">
                <Clock className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-clinical font-semibold">
                  Tiempos Clínicos Orientativos
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight mb-4">
                ¿Cuánto dura un tratamiento?
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-6">
                La duración depende estrictamente de la complejidad biomecánica, la respuesta tisular individual y el cumplimiento en el uso de los alineadores (22 h al día).
              </p>
              <div className="p-4 bg-canvas border border-line-subtle rounded-xs space-y-1 text-xs">
                <span className="text-ink-muted block text-[10px] uppercase tracking-clinical">
                  Rango estimado por complejidad:
                </span>
                <p className="font-mono text-ink font-medium">
                  {siteContent.treatments[0].durationRange}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted pt-6 border-t border-line-subtle mt-6">
              En la primera consulta de diagnóstico se entrega el plan temporal individualizado tras realizar el escaneado 3D.
            </p>
          </div>
        </div>

        {/* Preguntas Frecuentes (FAQ) en Acordeón Accesible */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Dudas Clínicas Habituales
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Preguntas frecuentes sobre ortodoncia invisible
            </h2>
          </div>

          <AccordionFAQ items={invisalign.faq} />
        </div>

        {/* CTA Primario Unificado */}
        <div className="bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-2">
              Comienza tu estudio de ortodoncia 3D
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Diagnóstico con escáner intraoral iTero, simulación digital ClinCheck® y valoración personalizada con la {brandConfig.medicalDirector.name}.
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
