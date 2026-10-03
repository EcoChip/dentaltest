'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export interface TechnicalBlueprintHandles {
  setOpacity: (opacity: number) => void;
  setDrawProgress: (progress: number) => void;
  setParallaxY: (offsetPx: number) => void;
}

export const TechnicalBlueprint = forwardRef<
  TechnicalBlueprintHandles,
  {
    typographyContainerRef?: React.RefObject<HTMLDivElement | null>;
    typographyTextRef?: React.RefObject<HTMLDivElement | null>;
  }
>(({ typographyContainerRef, typographyTextRef }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const strokePathsRef = useRef<(SVGPathElement | SVGLineElement | null)[]>([]);
  const dimensionBadgeRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    setOpacity: (opacity: number) => {
      const clamped = Math.max(0, Math.min(1, opacity));
      const isVisible = clamped > 0.005;

      // 1. Capa de tarjeta técnica frontal
      if (containerRef.current) {
        containerRef.current.style.opacity = `${clamped}`;
        containerRef.current.style.visibility = isVisible ? 'visible' : 'hidden';
      }

      // 2. Capa de tipografía gigante trasera (detrás del canvas)
      if (typographyContainerRef?.current) {
        typographyContainerRef.current.style.opacity = `${clamped}`;
        typographyContainerRef.current.style.visibility = isVisible ? 'visible' : 'hidden';
      }
    },
    setDrawProgress: (progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress));
      const offset = 1 - clamped;

      // Animar trazo de todos los trazados SVG con pathLength="1"
      strokePathsRef.current.forEach((el) => {
        if (el) {
          el.style.strokeDashoffset = `${offset}`;
        }
      });

      // Revelar cota de texto y detalles a partir del 40% de trazado
      if (dimensionBadgeRef.current) {
        const badgeOpacity = Math.max(0, Math.min(1, (clamped - 0.35) / 0.35));
        dimensionBadgeRef.current.style.opacity = `${badgeOpacity}`;
        dimensionBadgeRef.current.style.transform = `translate3d(0, ${(1 - badgeOpacity) * 8}px, 0)`;
      }
    },
    setParallaxY: (offsetPx: number) => {
      if (typographyTextRef?.current) {
        typographyTextRef.current.style.transform = `translate3d(0, ${offsetPx}px, 0)`;
      }
    },
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300 select-none overflow-hidden"
      style={{ opacity: 0, visibility: 'hidden' }}
      aria-hidden="true"
    >
      {/* ==============================================================
          ESQUEMA TÉCNICO EN LÍNEA SVG (Corte transversal y cota)
          Solo escritorio / tablet amplia (≥ 1024px)
          Situado en el cuadrante superior izquierdo libre
          ============================================================== */}
      <div className="hidden lg:block absolute top-[16%] left-[5%] xl:left-[8%] w-[330px] bg-canvas/95 backdrop-blur-sm p-5 border border-line-strong rounded-card shadow-card">
        {/* Cabecera del plano técnico */}
        <div className="flex items-center justify-between border-b border-line-subtle pb-2 mb-3">
          <span className="font-mono text-[9px] uppercase tracking-clinical text-accent font-semibold flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Fig. 01 · Corte transversal 1:1</span>
          </span>
          <span className="font-mono text-[9px] text-ink-muted">
            Escala 10:1
          </span>
        </div>

        {/* Gráfico vectorial con trazado animado por scrub */}
        <div className="relative w-full h-[145px] flex items-center justify-center bg-canvas/40 rounded-card border border-line-subtle p-2">
          <svg viewBox="0 0 280 130" className="w-full h-full overflow-visible">
            {/* Cuadrícula milimétrica sutil */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-subtle)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="280" height="130" fill="url(#grid)" opacity="0.6" />

            {/* Contorno corona dental (Esmalte) */}
            <path
              ref={(el) => {
                strokePathsRef.current[0] = el;
              }}
              d="M 50 115 C 65 75, 75 35, 130 35 C 185 35, 195 75, 210 115"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeDasharray="1"
              strokeDashoffset="1"
              pathLength="1"
            />

            {/* Lámina del alineador SmartTrack (capa exterior de 0,75 mm) */}
            <path
              ref={(el) => {
                strokePathsRef.current[1] = el;
              }}
              d="M 42 115 C 58 68, 68 22, 130 22 C 192 22, 202 68, 218 115"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.2"
              strokeDasharray="1"
              strokeDashoffset="1"
              pathLength="1"
            />

            {/* Línea de cota técnica entre diente y lámina */}
            <line
              ref={(el) => {
                strokePathsRef.current[2] = el;
              }}
              x1="130"
              y1="22"
              x2="130"
              y2="35"
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="1"
              strokeDashoffset="1"
              pathLength="1"
            />

            {/* Ticks delimitadores de cota */}
            <line
              ref={(el) => {
                strokePathsRef.current[3] = el;
              }}
              x1="125"
              y1="22"
              x2="135"
              y2="22"
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="1"
              strokeDashoffset="1"
              pathLength="1"
            />
            <line
              ref={(el) => {
                strokePathsRef.current[4] = el;
              }}
              x1="125"
              y1="35"
              x2="135"
              y2="35"
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="1"
              strokeDashoffset="1"
              pathLength="1"
            />

            {/* Línea guía que apunta hacia el rótulo de 0,75 mm */}
            <path
              ref={(el) => {
                strokePathsRef.current[5] = el;
              }}
              d="M 130 28.5 L 155 12 L 230 12"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              pathLength="1"
            />
          </svg>

          {/* Rótulo de cota exacta posicionado en el extremo de la línea guía */}
          <div
            ref={dimensionBadgeRef}
            className="absolute top-2 right-2 transition-transform duration-150 text-right"
            style={{ opacity: 0 }}
          >
            <span className="font-mono text-[13px] font-bold text-accent block tracking-tight">
              0,75 mm
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-ink-secondary block">
              Tolerancia ±0,02 mm
            </span>
          </div>
        </div>

        {/* Leyenda editorial inferior */}
        <div className="mt-2.5 pt-2 border-t border-line-subtle flex items-center justify-between text-[11px] text-ink-secondary">
          <span>El material · Lámina de alta precisión</span>
          <span className="font-mono text-[10px] text-accent font-semibold">SmartTrack</span>
        </div>
      </div>

      {/* ==============================================================
          VERSIÓN MÓVIL SIMPLIFICADA (< 1024px)
          Insignia compacta inferior (despejada de los dientes)
          ============================================================== */}
      <div className="lg:hidden absolute bottom-28 left-1/2 -translate-x-1/2 bg-canvas/95 backdrop-blur-sm border border-line-strong px-4 py-2 rounded-card shadow-card flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span className="font-mono text-[11px] font-medium text-accent tracking-clinical">
          Espesor calibrado: 0,75 mm
        </span>
      </div>
    </div>
  );
});

TechnicalBlueprint.displayName = 'TechnicalBlueprint';
