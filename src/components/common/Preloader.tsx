'use client';

import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { clinicConfig } from '@/config/clinic.config';

interface PreloaderProps {
  onLoaded?: () => void;
}

export function Preloader({ onLoaded }: PreloaderProps) {
  const { progress, active } = useProgress();
  const [completed, setCompleted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Si la carga de modelos llega al 100% o no hay descargas activas tras unos ms
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setCompleted(true);
        if (onLoaded) onLoaded();
      }, 400);

      const hideTimer = setTimeout(() => {
        setHidden(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [progress, onLoaded]);

  // Si ya no está activo y pasó un tiempo de gracia de seguridad
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!active && progress === 0) {
        setCompleted(true);
        if (onLoaded) onLoaded();
        setTimeout(() => setHidden(true), 600);
      }
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, [active, progress, onLoaded]);

  if (hidden) return null;

  const currentPercent = Math.min(Math.round(progress), 100);

  return (
    <div
      className={`fixed inset-0 z-[9990] bg-canvas flex flex-col justify-between p-8 sm:p-12 transition-opacity duration-700 ease-out ${
        completed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-label="Cargando experiencia tridimensional"
    >
      {/* Cabecera del Preloader */}
      <div className="flex items-center justify-between border-b border-line-subtle pb-4">
        <span className="font-serif text-lg tracking-tight text-ink">
          {clinicConfig.name}
        </span>
        <span className="text-[11px] uppercase tracking-clinical text-ink-muted">
          Entorno 3D Biomecánico
        </span>
      </div>

      {/* Centro: Indicador numérico monumental y estado */}
      <div className="max-w-lg mx-auto text-center space-y-4">
        <div className="font-serif text-6xl sm:text-8xl text-ink font-light tracking-tighter tabular-numbers">
          {currentPercent}
          <span className="text-2xl text-accent font-sans ml-1">%</span>
        </div>

        <p className="text-xs uppercase tracking-clinical text-ink-secondary">
          Descifrando malla anatómica y texturas SmartTrack® (2,93 MB)
        </p>

        {/* Barra de progreso milimétrica */}
        <div className="w-48 sm:w-64 mx-auto h-[2px] bg-line-subtle overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-200 ease-out"
            style={{ width: `${currentPercent}%` }}
          />
        </div>
      </div>

      {/* Pie del Preloader */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-muted border-t border-line-subtle pt-4 gap-2">
        <span>Draco 3D Geometry Decompressor</span>
        <span>Alineadores ortodóncicos digitales</span>
      </div>
    </div>
  );
}
