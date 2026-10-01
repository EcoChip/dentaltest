'use client';

import React from 'react';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { ArrowUpRight, Award, GraduationCap, Stethoscope } from 'lucide-react';

export function DoctorSpotlightSection() {
  const team = siteContent.team;

  return (
    <section
      className="py-24 lg:py-32 bg-canvas border-t border-line-subtle"
      aria-labelledby="team-summary-heading"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
                Cuadro Facultativo Colegiado
              </span>
            </div>
            <h2
              id="team-summary-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1]"
            >
              Dirección médica continuada y especialización facultativa
            </h2>
          </div>

          <Link
            href="/equipo"
            className="touch-target inline-flex items-center space-x-2 text-xs uppercase tracking-clinical text-ink hover:text-accent font-medium pb-1 border-b border-ink hover:border-accent transition-colors shrink-0"
          >
            <span>Conocer al Equipo Completo</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Rejilla Asimétrica Editorial de 3 Perfiles (Sin tarjetas idénticas de plantilla) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Perfil 1: Director Médico (6 cols - mayor jerarquía) */}
          <div className="lg:col-span-6 bg-surface border border-line-strong p-8 sm:p-10 rounded-xs shadow-card flex flex-col justify-between">
            <div>
              {/* Bloque de Foto Placeholder Neutro con ratio definido y etiqueta explícita */}
              <div className="aspect-[16/10] bg-canvas border border-line-subtle rounded-xs mb-8 flex flex-col justify-between p-6 relative overflow-hidden">
                <div className="flex items-center justify-between z-10">
                  <span className="text-[9px] uppercase tracking-clinical px-2.5 py-1 bg-surface border border-line-subtle text-ink-muted rounded-xs font-mono">
                    {team[0].imagePlaceholder}
                  </span>
                  <span className="text-[9px] uppercase tracking-clinical px-2 py-0.5 bg-accent text-canvas rounded-xs font-medium">
                    Dirección Médica
                  </span>
                </div>

                <div className="z-10">
                  <span className="text-[11px] font-mono text-ink-secondary bg-canvas/90 px-2 py-1 rounded-xs border border-line-subtle">
                    {team[0].collegiateNumber} · {team[0].college}
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight mb-2">
                {team[0].name}
              </h3>
              <p className="text-xs uppercase tracking-clinical text-accent font-medium mb-4">
                {team[0].title}
              </p>

              <p className="text-sm text-ink-secondary leading-relaxed mb-6">
                {team[0].bio}
              </p>

              <blockquote className="border-l-2 border-accent pl-4 text-xs italic text-ink-secondary mb-6 leading-relaxed">
                &ldquo;{team[0].values}&rdquo;
              </blockquote>
            </div>

            <div className="pt-6 border-t border-line-subtle flex items-center justify-between text-xs text-ink-muted">
              <span className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-accent" />
                <span>Invisalign Diamond Apex</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-accent" />
                <span>Docencia de Posgrado UCM</span>
              </span>
            </div>
          </div>

          {/* Perfiles 2 y 3: Doctores Especialistas (6 cols en 2 filas apiladas) */}
          <div className="lg:col-span-6 flex flex-col space-y-8 justify-between">
            {team.slice(1).map((doctor) => (
              <div
                key={doctor.id}
                className="bg-surface border border-line-subtle hover:border-line-strong p-6 sm:p-8 rounded-xs shadow-subtle flex flex-col justify-between transition-colors flex-1"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <span className="text-[9px] uppercase tracking-clinical px-2 py-0.5 bg-canvas border border-line-subtle text-ink-muted rounded-xs font-mono">
                      {doctor.imagePlaceholder}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted">
                      {doctor.collegiateNumber}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl sm:text-2xl text-ink tracking-tight mb-1">
                    {doctor.name}
                  </h4>
                  <p className="text-xs uppercase tracking-clinical text-accent font-medium mb-3">
                    {doctor.title}
                  </p>

                  <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                    {doctor.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-line-subtle flex items-center space-x-2 text-xs text-ink-muted">
                  <Stethoscope className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">{doctor.values}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
