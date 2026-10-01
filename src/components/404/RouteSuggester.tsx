'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass } from 'lucide-react';

interface RouteTarget {
  path: string;
  label: string;
  description: string;
  keywords: string[];
}

const KNOWN_ROUTES: RouteTarget[] = [
  {
    path: '/invisalign',
    label: 'Ortodoncia Invisible Invisalign®',
    description: 'Alineadores transparentes SmartTrack® y biomecánica digital ClinCheck®.',
    keywords: ['invisalign', 'invisalgn', 'invisalin', 'ortodoncia', 'alineadores', 'brackets', 'ferula', 'clincheck'],
  },
  {
    path: '/tratamientos',
    label: 'Disciplinas Clínicas y Tratamientos',
    description: 'Carillas cerámicas biomiméticas, implantología guiada y estética dental.',
    keywords: ['tratamientos', 'tratamiento', 'carillas', 'implantes', 'blanqueamiento', 'periodoncia', 'estetica'],
  },
  {
    path: '/equipo',
    label: 'Cuadro Facultativo y Dirección Médica',
    description: 'Trayectoria académica, colegiación oficial y filosofía biológica.',
    keywords: ['equipo', 'doctores', 'doctor', 'doctora', 'alejandro-volta', 'facultativo', 'especialistas'],
  },
  {
    path: '/contacto',
    label: 'Contacto, Cita Previa y Ubicación',
    description: 'Gabinete en Calle Serrano 42, reserva de cita y atención al paciente.',
    keywords: ['contacto', 'cita', 'reservar', 'pedir-cita', 'telefono', 'ubicacion', 'horario', 'mapa', 'direccion'],
  },
];

// Cálculo de distancia Levenshtein simplificada
function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // sustitución
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // inserción o borrado
        );
      }
    }
  }
  return matrix[bn][an];
}

export function RouteSuggester() {
  const [requestedPath, setRequestedPath] = useState<string>('');
  const [suggestedRoute, setSuggestedRoute] = useState<RouteTarget | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      setRequestedPath(path);

      const cleanPath = path.replace(/^\/+|\/+$/g, '');
      if (!cleanPath) return;

      // 1. Coincidencia por palabra clave
      const keywordMatch = KNOWN_ROUTES.find((r) =>
        r.keywords.some((kw) => cleanPath.includes(kw))
      );

      if (keywordMatch) {
        setSuggestedRoute(keywordMatch);
        return;
      }

      // 2. Coincidencia por distancia de Levenshtein
      let minDistance = 999;
      let closest: RouteTarget | null = null;

      KNOWN_ROUTES.forEach((r) => {
        const targetClean = r.path.replace(/^\/+|\/+$/g, '');
        const dist = levenshtein(cleanPath, targetClean);
        if (dist < minDistance && dist <= 3) {
          minDistance = dist;
          closest = r;
        }
      });

      if (closest) {
        setSuggestedRoute(closest);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 text-left">
      {/* Tarjeta de Sugerencia Inteligente de Ruta si se detectó similitud */}
      {suggestedRoute && (
        <div className="p-5 bg-accent/5 border border-accent/20 rounded-xs shadow-subtle space-y-2">
          <div className="flex items-center space-x-2 text-[11px] uppercase tracking-clinical font-semibold text-accent">
            <Compass className="w-3.5 h-3.5" />
            <span>Sugerencia Automática de Navegación</span>
          </div>
          <p className="text-xs text-ink-secondary">
            Has intentado acceder a <code className="px-1.5 py-0.5 bg-canvas border border-line-subtle rounded-xs text-ink font-mono text-[11px]">{requestedPath}</code>.
            ¿Buscabas la siguiente sección clínica?
          </p>
          <div className="pt-2">
            <Link
              href={suggestedRoute.path}
              className="inline-flex items-center space-x-2 text-xs font-medium text-accent hover:text-ink transition-colors group"
            >
              <span className="underline underline-offset-4 group-hover:text-accent font-semibold">{suggestedRoute.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <p className="text-[11px] text-ink-muted mt-0.5">{suggestedRoute.description}</p>
          </div>
        </div>
      )}

      {/* Directorio de Reorientación de Navegación */}
      <div className="p-6 bg-surface border border-line-strong rounded-xs shadow-subtle space-y-4">
        <span className="text-[10px] uppercase tracking-clinical text-ink-muted block font-semibold">
          Reorientar la Navegación Clínica
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Link
            href="/"
            className="p-3 bg-canvas/60 hover:bg-canvas rounded-xs border border-line-subtle hover:border-line-strong text-ink hover:text-accent flex items-center justify-between transition-colors group"
          >
            <div>
              <span className="font-medium block text-ink group-hover:text-accent">Inicio</span>
              <span className="text-[10px] text-ink-muted">Presentación y biomecánica</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/invisalign"
            className="p-3 bg-canvas/60 hover:bg-canvas rounded-xs border border-line-subtle hover:border-line-strong text-ink hover:text-accent flex items-center justify-between transition-colors group"
          >
            <div>
              <span className="font-medium block text-ink group-hover:text-accent">Invisalign®</span>
              <span className="text-[10px] text-ink-muted">Ortodoncia digital 3D</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/tratamientos"
            className="p-3 bg-canvas/60 hover:bg-canvas rounded-xs border border-line-subtle hover:border-line-strong text-ink hover:text-accent flex items-center justify-between transition-colors group"
          >
            <div>
              <span className="font-medium block text-ink group-hover:text-accent">Tratamientos</span>
              <span className="text-[10px] text-ink-muted">Carillas, implantes y estética</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/contacto"
            className="p-3 bg-canvas/60 hover:bg-canvas rounded-xs border border-line-subtle hover:border-line-strong text-ink hover:text-accent flex items-center justify-between transition-colors group"
          >
            <div>
              <span className="font-medium block text-ink group-hover:text-accent">Contacto y Cita</span>
              <span className="text-[10px] text-ink-muted">Serrano 42 · Cita previa</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
