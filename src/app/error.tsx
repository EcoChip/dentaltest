'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowRight, Phone, AlertCircle } from 'lucide-react';
import { clinicConfig } from '@/config/clinic.config';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error para auditoría de servidor y depuración
    console.error('Error de renderizado capturado en ErrorBoundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen min-h-svh pt-32 pb-24 flex items-center justify-center bg-canvas px-6">
      <div className="max-w-xl w-full mx-auto text-center space-y-8">
        {/* Eyebrow de Estado */}
        <div className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-clinical font-semibold text-amber-800 px-3 py-1 bg-amber-500/10 border border-amber-800/20 rounded-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Error 500 · Interrupción Biomecánica</span>
        </div>

        {/* Titular y Explicación */}
        <div className="space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
            Discrepancia en la carga del protocolo
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans max-w-md mx-auto">
            Se ha producido una interrupción en el procesamiento de datos de esta sección. Nuestro equipo técnico ha registrado el evento. Puedes reintentar la conexión de inmediato.
          </p>

          {error.digest && (
            <p className="text-[11px] text-ink-muted font-mono tracking-wider">
              Diagnóstico de servidor: <span className="bg-surface px-2 py-0.5 border border-line-subtle rounded-xs">{error.digest}</span>
            </p>
          )}
        </div>

        {/* Acciones de recuperación */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="touch-target w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs font-semibold transition-all duration-300 shadow-subtle group"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Reintentar conexión</span>
          </button>

          <Link
            href="/"
            className="touch-target w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-surface text-ink hover:text-accent border border-line-strong hover:border-line-subtle text-xs uppercase tracking-clinical rounded-xs font-medium transition-colors"
          >
            <span>Volver al Inicio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Soporte directo */}
        <div className="pt-6 border-t border-line-subtle text-xs text-ink-muted flex items-center justify-center space-x-2">
          <Phone className="w-3.5 h-3.5 text-accent" />
          <span>Atención telefónica en recepción: </span>
          <a
            href={`tel:${clinicConfig.contact.phone}`}
            className="font-medium text-ink hover:text-accent underline underline-offset-4"
          >
            {clinicConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
