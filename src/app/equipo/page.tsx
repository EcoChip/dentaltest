import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getDoctorsSchema } from '@/lib/seo/schema';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  HeartHandshake,
  Microscope,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cuadro Médico Odontológico en Madrid · Dr. Alejandro Volta | Clínica Volta',
  description:
    'Cuadro facultativo de dedicación exclusiva adscrito al COEM. Dirección médica por el Dr. Alejandro Volta en el Barrio de Salamanca, Madrid.',
  alternates: {
    canonical: 'https://clinicavolta.es/equipo',
  },
  openGraph: {
    title: 'Cuadro Médico Odontológico en Madrid · Dr. Alejandro Volta | Clínica Volta',
    description:
      'Cuadro facultativo de dedicación exclusiva adscrito al COEM. Dirección médica por el Dr. Alejandro Volta en Madrid.',
    url: 'https://clinicavolta.es/equipo',
    type: 'website',
  },
};

export default function TeamPage() {
  const team = siteContent.team;
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Cuadro Facultativo', path: '/equipo' },
  ]);
  const doctorsSchema = getDoctorsSchema();

  const clinicalValues = [
    {
      icon: Microscope,
      title: 'Mínima Invasión Tisular',
      description:
        'Priorizamos siempre la conservación del esmalte dental y la encía original antes de considerar cualquier tratamiento irreversible.',
    },
    {
      icon: ShieldCheck,
      title: 'Atención Directa por Especialista',
      description:
        'Cada revisión de ortodoncia o acto clínico es ejecutado directamente por el doctor especialista colegiado, sin intermediación de operadores auxiliares.',
    },
    {
      icon: HeartHandshake,
      title: 'Honestidad Diagnóstica',
      description:
        'No prescribimos tratamientos innecesarios. Las decisiones clínicas se fundamentan exclusivamente en pruebas radiológicas y registros tridimensionales.',
    },
  ];

  return (
    <div className="pt-28 lg:pt-36 pb-24">
      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={doctorsSchema} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera Editorial */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-accent font-medium mb-3">
            <Link href="/" className="text-ink-muted hover:text-ink">
              Inicio
            </Link>
            <span>/</span>
            <span>Equipo Médico</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight mb-6 leading-[1.08]">
            Cuadro Facultativo & Filosofía Biológica
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Nuestros doctores aúnan dedicación exclusiva por especialidad, formación universitaria continuada y docencia en posgrado. Cada tratamiento se diseña de forma colegiada para garantizar la máxima estabilidad funcional y biológica.
          </p>
        </div>

        {/* Listado de Perfiles Médicos */}
        <div className="space-y-16 mb-24">
          {team.map((doctor, index) => (
            <article
              key={doctor.id}
              className="bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Columna Izquierda: Retrato / Placeholder Editorial (5 cols) */}
              <div className="lg:col-span-5">
                <div className="aspect-[4/5] bg-canvas border border-line-subtle rounded-xs p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono uppercase tracking-clinical px-2.5 py-1 bg-surface text-ink font-semibold rounded-xs border border-line-subtle">
                      {doctor.collegiateNumber}
                    </span>
                    <span className="text-[9px] uppercase tracking-clinical px-2 py-0.5 bg-accent-soft text-accent rounded-xs font-semibold">
                      {doctor.college}
                    </span>
                  </div>

                  <div className="z-10 py-6 my-auto text-center">
                    <span className="text-[10px] font-mono text-ink-muted uppercase tracking-clinical bg-surface/90 px-3 py-1 rounded-xs border border-line-subtle inline-block">
                      {doctor.imagePlaceholder}
                    </span>
                  </div>

                  <div className="z-10">
                    <span className="text-[11px] uppercase tracking-clinical text-accent font-semibold block mb-1">
                      {doctor.title.split('·')[0]}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                      {doctor.name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Formación, Biografía y Filosofía (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-clinical text-ink-muted font-medium mb-4">
                    {doctor.title}
                  </h3>
                  <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mb-6">
                    {doctor.bio}
                  </p>

                  <div className="p-5 bg-canvas border border-line-subtle rounded-xs mb-6">
                    <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
                      Filosofía de Trabajo
                    </span>
                    <blockquote className="text-xs sm:text-sm italic text-ink leading-relaxed">
                      &ldquo;{doctor.values}&rdquo;
                    </blockquote>
                  </div>
                </div>

                <div className="pt-6 border-t border-line-subtle flex items-center justify-between">
                  <span className="text-xs text-ink-muted">
                    Consulta individualizada con cita previa
                  </span>
                  <Link
                    href={`/contacto?doctor=${doctor.id}`}
                    className="touch-target px-4 py-2 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs transition-colors flex items-center space-x-1.5"
                  >
                    <span>Pedir Consulta</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Valores Éticos de la Clínica */}
        <div className="mb-24 bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-subtle">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Compromiso Deontológico
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Los principios que rigen nuestra práctica médica
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clinicalValues.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-canvas border border-line-subtle p-6 rounded-xs space-y-3"
                >
                  <Icon className="w-6 h-6 text-accent mb-2" />
                  <h3 className="font-serif text-xl text-ink tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Global */}
        <div className="bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-2">
              Conoce a nuestro equipo en una primera consulta diagnóstica
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Examen con escáner intraoral 3D, fotografías clínicas y plan terapéutico sin compromiso.
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
