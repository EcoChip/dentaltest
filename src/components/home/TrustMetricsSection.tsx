'use client';

import React from 'react';
import { siteContent } from '@/content/site';
import { ShieldCheck, Award, CheckCircle2, FileCheck } from 'lucide-react';

export function TrustMetricsSection() {
  const metrics = siteContent.trustMetrics;
  const leadMetric = metrics[0];
  const secondaryMetrics = metrics.slice(1);

  return (
    <section
      className="py-24 lg:py-32 bg-surface border-t border-line-subtle"
      aria-labelledby="metrics-heading"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera de Sección */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-canvas border border-line-subtle rounded-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
              Resultados y Verificabilidad
            </span>
          </div>
          <h2
            id="metrics-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1]"
          >
            Evidencia clínica documentada y previsibilidad biomecánica
          </h2>
        </div>

        {/* Composición Asimétrica de Alta Gama (5 cols + 7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Métrica Principal Destacada (5 cols) */}
          <div className="lg:col-span-5 bg-canvas border border-line-strong p-8 sm:p-12 rounded-xs shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <ShieldCheck className="w-6 h-6 text-accent" />
                <span className="text-[9px] uppercase tracking-clinical text-ink-muted bg-surface px-2 py-1 rounded-xs border border-line-subtle font-mono">
                  {leadMetric.sourceTag}
                </span>
              </div>

              <div className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-ink tracking-tight mb-4 tabular-numbers">
                {leadMetric.value}
              </div>

              <h3 className="text-sm uppercase tracking-clinical font-semibold text-ink mb-3">
                {leadMetric.label}
              </h3>

              <p className="text-sm text-ink-secondary leading-relaxed">
                {leadMetric.detail} Todos los tratamientos de ortodoncia invisible y rehabilitación estética cuentan con registro cefalométrico previo y seguimiento oclusal postratamiento.
              </p>
            </div>

            <div className="pt-8 mt-8 border-t border-line-subtle flex items-center space-x-2 text-xs text-ink-muted">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Diagnóstico tridimensional con escáner de alta resolución</span>
            </div>
          </div>

          {/* Métricas Secundarias Modulares (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {secondaryMetrics.map((item, index) => {
              const icons = [Award, FileCheck, CheckCircle2];
              const Icon = icons[index % icons.length];

              return (
                <div
                  key={item.id}
                  className="bg-canvas border border-line-subtle hover:border-line-strong p-6 sm:p-8 rounded-xs shadow-subtle flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <Icon className="w-5 h-5 text-accent" />
                      <span className="text-[8px] uppercase tracking-clinical text-ink-muted bg-surface px-1.5 py-0.5 rounded-xs border border-line-subtle font-mono">
                        {item.sourceTag}
                      </span>
                    </div>

                    <div className="font-serif text-3xl sm:text-4xl text-ink font-light tracking-tight mb-2 tabular-numbers">
                      {item.value}
                    </div>

                    <h4 className="text-xs uppercase tracking-clinical font-semibold text-ink mb-2">
                      {item.label}
                    </h4>
                  </div>

                  <p className="text-xs text-ink-secondary leading-relaxed pt-4 border-t border-line-subtle mt-4">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
