'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export function InteractiveToothIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const toothGroupRef = useRef<SVGGElement>(null);
  const slotRef = useRef<SVGGElement>(null);
  const [isAligned, setIsAligned] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsAligned(true);
    }
  }, []);

  const toggleAlignment = () => {
    if (prefersReducedMotion) {
      setIsAligned(!isAligned);
      return;
    }

    const nextState = !isAligned;
    setIsAligned(nextState);

    if (toothGroupRef.current) {
      if (nextState) {
        // Encajar en la arcada
        gsap.to(toothGroupRef.current, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.85,
          ease: 'power3.out',
        });
      } else {
        // Desplazar fuera de oclusión
        gsap.to(toothGroupRef.current, {
          x: 28,
          y: -36,
          rotation: 26,
          duration: 0.75,
          ease: 'power2.inOut',
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto my-6 p-6 bg-surface/80 backdrop-blur-xs border border-line-strong rounded-xs shadow-subtle flex flex-col items-center"
      aria-label="Ilustración esquemática de la arcada superior con una pieza dental desplazada"
    >
      {/* Etiqueta de precisión clínica */}
      <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-clinical text-ink-muted mb-4 pb-2 border-b border-line-subtle">
        <span>Esquema Anatómico: Arcada Maxilar</span>
        <span className={isAligned ? 'text-accent font-medium' : 'text-amber-800'}>
          {isAligned ? 'Oclusión: 100% Alineada' : 'Discrepancia: Pieza 1.2 Ausente'}
        </span>
      </div>

      <div className="relative w-full h-44 flex items-center justify-center">
        <svg
          viewBox="0 0 320 160"
          className="w-full h-full overflow-visible select-none"
          role="img"
          aria-hidden="true"
        >
          {/* Ejes de referencia CAD milimétricos */}
          <line x1="20" y1="120" x2="300" y2="120" stroke="var(--border-subtle)" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="160" y1="20" x2="160" y2="140" stroke="var(--border-subtle)" strokeWidth="0.75" strokeDasharray="3 3" />

          {/* Curva de arcada ideal (Línea de Andrews) */}
          <path
            d="M 30,120 C 50,30 270,30 290,120"
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1.25"
            strokeDasharray="4 4"
          />

          {/* Piezas posteriores izquierdas (fijas) */}
          <rect x="36" y="96" width="18" height="20" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.2" transform="rotate(-30 45 106)" />
          <rect x="62" y="70" width="18" height="22" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.2" transform="rotate(-20 71 81)" />
          <rect x="90" y="50" width="18" height="24" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.2" transform="rotate(-10 99 62)" />
          <rect x="116" y="38" width="16" height="25" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.2" transform="rotate(-4 124 50)" />

          {/* Incisivo Central Superior Izquierdo (Fijo) */}
          <rect x="139" y="32" width="19" height="28" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.4" />

          {/* Incisivo Central Superior Derecho (Fijo) */}
          <rect x="162" y="32" width="19" height="28" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.4" />

          {/* HUECO VACÍO: Pieza 1.2 (Incisivo Lateral Derecho) */}
          <g ref={slotRef} className="transition-opacity duration-300">
            <rect
              x="188"
              y="38"
              width="17"
              height="26"
              rx="3"
              fill={isAligned ? 'transparent' : 'rgba(27, 73, 88, 0.04)'}
              stroke={isAligned ? '#1B4958' : 'var(--border-strong)'}
              strokeWidth="1.2"
              strokeDasharray={isAligned ? 'none' : '3 3'}
            />
            {!isAligned && (
              <text
                x="196.5"
                y="54"
                textAnchor="middle"
                fontSize="8"
                fill="var(--text-muted)"
                fontFamily="var(--font-sans)"
                letterSpacing="0.05em"
              >
                1.2
              </text>
            )}
          </g>

          {/* PIEZA MÓVIL: Incisivo Lateral 1.2 que encaja con precisión */}
          <g
            ref={toothGroupRef}
            onClick={toggleAlignment}
            onMouseEnter={() => !prefersReducedMotion && !isAligned && toggleAlignment()}
            className="cursor-pointer"
            style={{
              transformOrigin: '196.5px 51px',
              transform: isAligned ? 'translate(0px, 0px) rotate(0deg)' : 'translate(28px, -36px) rotate(26deg)',
            }}
          >
            <rect
              x="188"
              y="38"
              width="17"
              height="26"
              rx="3"
              fill={isAligned ? '#FFFFFF' : '#F4F1EA'}
              stroke={isAligned ? '#1B4958' : '#C5A059'}
              strokeWidth={isAligned ? '1.5' : '1.8'}
              className="transition-colors duration-300"
            />
            {/* Arista anatómica del esmalte */}
            <line
              x1="193"
              y1="42"
              x2="193"
              y2="58"
              stroke={isAligned ? '#1B4958' : '#C5A059'}
              strokeWidth="0.8"
              opacity="0.5"
            />
          </g>

          {/* Piezas posteriores derechas (fijas) */}
          <rect x="212" y="50" width="18" height="24" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.2" transform="rotate(10 221 62)" />
          <rect x="240" y="70" width="18" height="22" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.2" transform="rotate(20 249 81)" />
          <rect x="266" y="96" width="18" height="20" rx="3" fill="#FFFFFF" stroke="#1A1816" strokeWidth="1.2" transform="rotate(30 275 106)" />
        </svg>
      </div>

      {/* Botón interactivo accesible */}
      <button
        type="button"
        onClick={toggleAlignment}
        className="mt-3 touch-target inline-flex items-center space-x-2 text-xs uppercase tracking-clinical font-medium text-ink-secondary hover:text-ink px-4 py-2 rounded-xs border border-line-subtle hover:border-line-strong bg-canvas transition-colors"
      >
        {isAligned ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>Pieza 1.2 en oclusión correcta (Clic para descolocar)</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-amber-800 animate-spin-slow" />
            <span>Recolocar pieza 1.2 en la arcada</span>
          </>
        )}
      </button>
    </div>
  );
}
