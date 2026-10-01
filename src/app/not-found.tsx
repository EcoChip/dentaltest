import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { InteractiveToothIllustration } from '@/components/404/InteractiveToothIllustration';
import { RouteSuggester } from '@/components/404/RouteSuggester';
import { FocusHeading } from '@/components/404/FocusHeading';

export const metadata: Metadata = {
  title: '404 · Pieza fuera de oclusión',
  description: 'La página solicitada no existe o ha sido reubicada en nuestro servidor.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen min-h-svh pt-32 pb-24 flex items-center justify-center bg-canvas px-6">
      <div className="max-w-2xl w-full mx-auto text-center space-y-8">
        {/* Eyebrow de precisión */}
        <div className="inline-block text-[11px] uppercase tracking-clinical font-semibold text-accent px-3 py-1 bg-surface border border-line-subtle rounded-xs">
          Error 404 · Pieza Fuera de Oclusión
        </div>

        {/* Titular con foco inicial programático para accesibilidad */}
        <div className="space-y-4">
          <FocusHeading>Aquí falta una pieza</FocusHeading>
          <p className="text-sm sm:text-base text-ink-secondary max-w-lg mx-auto leading-relaxed font-sans">
            Al igual que en un caso ortodóncico con espacio interdental imprevisto, la ruta que buscas no se encuentra en su posición anatómica. Puedes recolocar la pieza en el esquema CAD o continuar tu navegación clínica.
          </p>
        </div>

        {/* Esquema interactivo SVG con alineación de pieza dental */}
        <InteractiveToothIllustration />

        {/* Sugerencia inteligente de ruta basada en la URL solicitada + directorio */}
        <RouteSuggester />

        {/* Acciones principales y CTA rector unificado */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contacto#reserva-cita"
            className="touch-target w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs font-semibold transition-all duration-300 shadow-subtle group"
          >
            <span>Reserva tu primera visita</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/"
            className="touch-target w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-surface text-ink hover:text-accent border border-line-strong hover:border-line-subtle text-xs uppercase tracking-clinical rounded-xs font-medium transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
