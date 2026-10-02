import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { brandConfig } from '@/config/brand';
import { siteContent } from '@/content/site';
import {
  TREATMENTS_DATA,
  TREATMENT_SLUGS,
  getTreatmentBySlug,
} from '@/content/treatments';
import { AccordionFAQ } from '@/components/common/AccordionFAQ';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getMedicalProcedureSchema,
} from '@/lib/seo/schema';
import {
  Clock,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  HelpCircle,
  FileCheck2,
  ChevronRight,
  Phone,
  Sparkles,
  Info,
} from 'lucide-react';

interface TreatmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return TREATMENT_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatmentBySlug(slug);

  if (!treatment) {
    return {
      title: `Tratamiento no encontrado | ${brandConfig.shortName}`,
    };
  }

  const canonicalUrl = `${brandConfig.url}/tratamientos/${treatment.slug}`;

  return {
    title: treatment.metaTitle,
    description: treatment.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: treatment.metaTitle,
      description: treatment.metaDescription,
      url: canonicalUrl,
      type: 'website',
      siteName: brandConfig.name,
      locale: 'es_ES',
    },
  };
}

export default async function TreatmentDetailPage({ params }: TreatmentPageProps) {
  const { slug } = await params;
  const treatment = getTreatmentBySlug(slug);

  if (!treatment) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Especialidades Odontológicas', path: '/tratamientos' },
    { name: treatment.title, path: `/tratamientos/${treatment.slug}` },
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);
  const faqSchema = getFaqSchema(treatment.faq);
  const procedureSchema = getMedicalProcedureSchema({
    name: treatment.title,
    description: treatment.heroDescription,
    path: `/tratamientos/${treatment.slug}`,
    procedureType: treatment.procedureType,
  });

  return (
    <div className="pt-28 lg:pt-36 pb-24 bg-canvas text-ink">
      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={procedureSchema} />

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
          <Link href="/tratamientos" className="hover:text-ink transition-colors">
            Especialidades
          </Link>
          <ChevronRight className="w-3 h-3 text-line-strong" />
          <span className="text-accent font-medium truncate max-w-[200px] sm:max-w-none">
            {treatment.title}
          </span>
        </nav>

        {/* HERO SECTION EDITORIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20 lg:mb-24 pb-16 border-b border-line-subtle">
          {/* Columna Izquierda: Título y Definición Clínica (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                {treatment.heroBadge}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.08]">
              {treatment.title}
            </h1>

            <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed font-normal">
              {treatment.heroSubtitle}
            </p>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              {treatment.heroDescription}
            </p>

            {/* CTAs del Hero */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/contacto?tratamiento=${treatment.slug}`}
                className="touch-target px-8 py-4 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs font-medium transition-colors flex items-center justify-center space-x-2 shadow-subtle group"
              >
                <Calendar className="w-4 h-4 text-canvas" />
                <span>Pedir cita para valoración</span>
                <ArrowUpRight className="w-4 h-4 text-canvas/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <a
                href={`tel:${siteContent.contact.phoneRaw}`}
                className="touch-target px-6 py-4 bg-surface hover:bg-canvas border border-line-subtle text-xs uppercase tracking-clinical text-ink rounded-xs font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4 text-accent" />
                <span>{siteContent.contact.phone}</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Técnica de Consulta y Parámetros (5 cols) */}
          <div className="lg:col-span-5 bg-surface border border-line-strong p-8 rounded-xs shadow-card space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-line-subtle">
              <FileCheck2 className="w-4 h-4 text-accent" />
              <span className="text-xs uppercase tracking-clinical text-ink font-semibold">
                Ficha Técnica del Procedimiento
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <span className="text-[10px] uppercase tracking-clinical text-ink-muted block mb-1">
                  Disciplina Médica
                </span>
                <p className="text-sm font-medium text-ink">
                  {treatment.category}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-clinical text-ink-muted block mb-1">
                  Duración Estimada
                </span>
                <div className="flex items-center space-x-2 text-sm font-medium text-ink font-mono">
                  <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{treatment.durationEstimated}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-clinical text-ink-muted block mb-1">
                  Criterio de Presupuesto
                </span>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {treatment.priceNotice}
                </p>
              </div>

              <div className="p-4 bg-canvas border border-line-subtle rounded-xs space-y-2">
                <div className="flex items-center space-x-2 text-ink">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-xs font-medium">Garantía Biológica</span>
                </div>
                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  Protocolo reglado bajo el principio de preservación tisular. Sin intervenciones agresivas injustificadas.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-line-subtle flex items-center justify-between text-xs text-ink-muted">
              <span>Supervisión facultativa:</span>
              <span className="font-serif text-ink font-medium">
                {brandConfig.medicalDirector.name}
              </span>
            </div>
          </div>
        </div>

        {/* QUÉ ES Y FUNDAMENTO BIOLÓGICO */}
        <section className="mb-20 lg:mb-24" aria-labelledby="what-is-heading">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Bases del Tratamiento
            </span>
            <h2
              id="what-is-heading"
              className="font-serif text-3xl sm:text-4xl text-ink tracking-tight"
            >
              {treatment.whatIs.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              {treatment.whatIs.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base text-ink-secondary leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="lg:col-span-5 bg-surface border border-line-subtle p-6 sm:p-8 rounded-xs space-y-4 shadow-subtle">
              <span className="text-[10px] uppercase tracking-clinical text-ink font-semibold block">
                Puntos Clave del Protocolo
              </span>
              <ul className="space-y-3">
                {treatment.whatIs.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-ink-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PARA QUIÉN ESTÁ INDICADO */}
        <section className="mb-20 lg:mb-24 bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card" aria-labelledby="indications-heading">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Diagnóstico Clínico
            </span>
            <h2
              id="indications-heading"
              className="font-serif text-3xl sm:text-4xl text-ink tracking-tight"
            >
              {treatment.whoIsItFor.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {treatment.whoIsItFor.indications.map((ind, idx) => (
              <div
                key={idx}
                className="bg-canvas border border-line-subtle p-5 rounded-xs flex items-start space-x-3 shadow-subtle"
              >
                <span className="font-mono text-xs text-accent font-bold mt-0.5">
                  0{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {ind}
                </p>
              </div>
            ))}
          </div>

          {/* Nota de Contraindicaciones / Criterio Médico Riguroso */}
          <div className="p-4 bg-canvas/60 border border-line-subtle rounded-xs flex items-start space-x-3 text-xs text-ink-muted">
            <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <strong className="text-ink font-medium">Criterio facultativo: </strong>
              {treatment.whoIsItFor.contraindicationsNotice}
            </p>
          </div>
        </section>

        {/* PROCESO CLÍNICO PASO A PASO */}
        <section className="mb-20 lg:mb-24" aria-labelledby="process-heading">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Secuencia Terapéutica
            </span>
            <h2
              id="process-heading"
              className="font-serif text-3xl sm:text-4xl text-ink tracking-tight"
            >
              El proceso de tratamiento en 4 fases protocolizadas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatment.processSteps.map((step) => (
              <div
                key={step.step}
                className="bg-surface border border-line-subtle p-6 sm:p-8 rounded-xs shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl text-accent tabular-numbers">
                      {step.step}
                    </span>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-ink-muted bg-canvas px-2 py-0.5 rounded-xs border border-line-subtle">
                      <Clock className="w-3 h-3 text-accent" />
                      <span>{step.estimatedTime}</span>
                    </span>
                  </div>

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
        </section>

        {/* CASOS CLÍNICOS DOCUMENTADOS */}
        <section className="mb-20 lg:mb-24" aria-labelledby="cases-heading">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
                Evidencia Clínica
              </span>
              <h2
                id="cases-heading"
                className="font-serif text-3xl sm:text-4xl text-ink tracking-tight"
              >
                Casos clínicos reales documentados
              </h2>
            </div>
            <p className="text-xs text-ink-muted max-w-xs md:text-right">
              Imágenes reales obtenidas en consulta bajo consentimiento informado. Sin retoque fotográfico digital.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {treatment.clinicalCases.map((c) => (
              <div
                key={c.id}
                className="bg-surface border border-line-strong p-6 sm:p-8 rounded-xs shadow-card space-y-6"
              >
                {/* Contenedor de Imagen con Ratio Definido sin CLS */}
                <div
                  className={`w-full ${c.aspectRatio} bg-canvas border border-line-subtle rounded-xs flex flex-col items-center justify-center p-6 text-center text-xs text-ink-muted relative overflow-hidden`}
                >
                  <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-mono text-[11px] font-medium text-ink mb-1 block max-w-sm">
                    {c.placeholderLabel}
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    Proporción 4:3 · Archivo de Gabinete Fotográfico
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink tracking-tight">
                    {c.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-canvas rounded-xs border border-line-subtle">
                      <span className="text-[10px] uppercase tracking-clinical text-ink-muted block mb-1">
                        Diagnóstico Inicial
                      </span>
                      <p className="text-ink-secondary leading-relaxed">
                        {c.diagnosis}
                      </p>
                    </div>

                    <div className="p-3.5 bg-canvas rounded-xs border border-line-subtle">
                      <span className="text-[10px] uppercase tracking-clinical text-ink-muted block mb-1">
                        Resolución Terapéutica
                      </span>
                      <p className="text-ink-secondary leading-relaxed">
                        {c.resolution}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line-subtle text-xs text-ink-muted font-mono">
                    <span>Tiempo de tratamiento:</span>
                    <span className="text-ink font-medium">{c.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES INTERACTIVAS */}
        <section className="mb-20 lg:mb-24" aria-labelledby="faq-heading">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-clinical text-accent font-medium mb-3">
              <HelpCircle className="w-4 h-4 text-accent" />
              <span>Resolución de Dudas</span>
            </div>
            <h2
              id="faq-heading"
              className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-4"
            >
              Preguntas frecuentes sobre este tratamiento
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Criterios clínicos honestos para responder a las inquietudes más habituales antes de acudir a consulta.
            </p>
          </div>

          <AccordionFAQ items={treatment.faq} />
        </section>

        {/* TRATAMIENTOS RELACIONADOS (ENLACES CRUZADOS) */}
        <section className="mb-20 lg:mb-24 pt-16 border-t border-line-subtle" aria-labelledby="related-heading">
          <div className="max-w-2xl mb-10">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Abordaje Multidisciplinar
            </span>
            <h2
              id="related-heading"
              className="font-serif text-3xl sm:text-4xl text-ink tracking-tight"
            >
              Tratamientos complementarios y sinergias clínicas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {treatment.relatedTreatments.map((rel) => (
              <Link
                key={rel.slug}
                href={rel.href}
                className="group bg-surface border border-line-subtle p-6 rounded-xs hover:border-line-strong transition-all duration-200 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
                    {rel.tag}
                  </span>
                  <h3 className="font-serif text-xl text-ink group-hover:text-accent transition-colors mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {rel.shortDesc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-line-subtle flex items-center justify-between text-xs uppercase tracking-clinical font-medium text-ink group-hover:text-accent">
                  <span>Conocer protocolo</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA FINAL DE RESERVA */}
        <div className="bg-surface border border-line-strong p-8 sm:p-12 lg:p-16 rounded-xs shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Primera Consulta Diagnóstica
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-4">
              Valoración clínica personalizada con la Dra. Elena Cala
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
              En tu primera visita realizamos un estudio completo con escaneado 3D para definir el plan de tratamiento más biológico y conservador para tu caso.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            <Link
              href={`/contacto?tratamiento=${treatment.slug}`}
              className="touch-target px-8 py-4 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs font-medium transition-colors flex items-center justify-center space-x-2 shadow-subtle group text-center"
            >
              <Calendar className="w-4 h-4 text-canvas" />
              <span>{siteContent.ctas.primary}</span>
              <ArrowUpRight className="w-4 h-4 text-canvas/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <a
              href={`https://wa.me/${siteContent.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                `Hola, deseo información y cita previa sobre el tratamiento de ${treatment.title}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-6 py-4 bg-canvas border border-line-subtle hover:border-accent text-xs uppercase tracking-clinical text-ink rounded-xs font-medium transition-colors flex items-center justify-center space-x-2 text-center"
            >
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
