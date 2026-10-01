'use client';

import React, { useState } from 'react';
import { siteContent } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';

export function StaticClinicMap() {
  const [interactiveLoaded, setInteractiveLoaded] = useState(false);
  const address = siteContent.contact.address;

  // URL directa para abrir en la app de mapas del usuario
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteContent.brand.name}, ${address.street}, ${address.postalCode} ${address.city}`
  )}`;

  return (
    <div className="relative w-full border border-line-strong rounded-xs overflow-hidden bg-surface shadow-subtle">
      {/* Vista de Mapa Estático Editorial de Alta Precisión (Sin cookies ni iframes de terceros) */}
      {!interactiveLoaded ? (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#EBE7DF] overflow-hidden flex flex-col justify-between p-6">
          {/* Trazado Vectorial Arquitectónico de Calles del Barrio de Salamanca */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Manzanas Urbanas */}
            <rect x="40" y="40" width="180" height="100" fill="#DFD9CD" rx="2" />
            <rect x="250" y="40" width="220" height="100" fill="#DFD9CD" rx="2" />
            <rect x="500" y="40" width="260" height="100" fill="#DFD9CD" rx="2" />

            <rect x="40" y="170" width="180" height="120" fill="#DFD9CD" rx="2" />
            <rect x="250" y="170" width="220" height="120" fill="#D7D0C2" rx="2" />
            <rect x="500" y="170" width="260" height="120" fill="#DFD9CD" rx="2" />

            <rect x="40" y="320" width="180" height="90" fill="#DFD9CD" rx="2" />
            <rect x="250" y="320" width="220" height="90" fill="#DFD9CD" rx="2" />
            <rect x="500" y="320" width="260" height="90" fill="#DFD9CD" rx="2" />

            {/* Ejes Viales Principales */}
            {/* Calle de Serrano (Eje vertical central) */}
            <line x1="235" y1="0" x2="235" y2="450" stroke="#FFFFFF" strokeWidth="26" />
            <line x1="235" y1="0" x2="235" y2="450" stroke="#C2BCB0" strokeWidth="1" strokeDasharray="6 6" />

            {/* Calle de Jorge Juan (Eje horizontal superior) */}
            <line x1="0" y1="155" x2="800" y2="155" stroke="#FFFFFF" strokeWidth="22" />

            {/* Calle de Goya (Eje horizontal inferior) */}
            <line x1="0" y1="305" x2="800" y2="305" stroke="#FFFFFF" strokeWidth="22" />

            {/* Calle de Claudio Coello (Eje vertical derecho) */}
            <line x1="485" y1="0" x2="485" y2="450" stroke="#FFFFFF" strokeWidth="20" />

            {/* Rótulos de Calles */}
            <text x="245" y="30" fill="#75797C" fontSize="10" fontFamily="sans-serif" letterSpacing="2">
              CALLE DE SERRANO
            </text>
            <text x="50" y="150" fill="#75797C" fontSize="9" fontFamily="sans-serif" letterSpacing="1.5">
              CALLE DE JORGE JUAN
            </text>
            <text x="50" y="300" fill="#75797C" fontSize="9" fontFamily="sans-serif" letterSpacing="1.5">
              CALLE DE GOYA
            </text>
            <text x="495" y="30" fill="#75797C" fontSize="9" fontFamily="sans-serif" letterSpacing="1.5">
              CALLE CLAUDIO COELLO
            </text>
          </svg>

          {/* Marcador de la Clínica (Serrano 42) */}
          <div className="absolute top-[215px] left-[225px] transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-accent/25 animate-ping" />
              <div className="w-9 h-9 rounded-full bg-accent text-canvas flex items-center justify-center shadow-lifted border-2 border-canvas">
                <MapPin className="w-5 h-5 text-canvas" />
              </div>
            </div>
            <div className="mt-2 px-3 py-1.5 bg-ink text-canvas rounded-xs shadow-card text-[11px] font-serif tracking-tight whitespace-nowrap border border-ink">
              {siteContent.brand.name} · Serrano, 42
            </div>
          </div>

          {/* Marcador de Metro Serrano */}
          <div className="absolute top-[305px] left-[235px] transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center space-x-1 bg-surface/90 px-2 py-0.5 rounded-xs border border-line-subtle text-[9px] font-mono text-ink">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            <span>Metro Serrano (L4)</span>
          </div>

          {/* Marcador de Parking Colón */}
          <div className="absolute top-[155px] left-[90px] transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center space-x-1 bg-surface/90 px-2 py-0.5 rounded-xs border border-line-subtle text-[9px] font-mono text-ink">
            <span className="w-3 h-3 bg-blue-700 text-canvas rounded-xs flex items-center justify-center text-[7px] font-bold">P</span>
            <span>Parking Plaza Colón</span>
          </div>

          {/* Barra Superior con Información y Botón de Apertura */}
          <div className="relative z-30 flex items-center justify-between">
            <div className="bg-canvas/95 backdrop-blur-sm border border-line-subtle px-3 py-1.5 rounded-xs shadow-subtle flex items-center space-x-2">
              <Compass className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
                Serrano, 42 · Barrio de Salamanca
              </span>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-3.5 py-1.5 bg-canvas/95 hover:bg-ink hover:text-canvas border border-line-strong rounded-xs shadow-subtle text-[11px] tracking-clinical uppercase text-ink transition-colors flex items-center space-x-1.5"
            >
              <span>Abrir Mapa</span>
              <ExternalLink className="w-3 h-3 text-accent" />
            </a>
          </div>

          {/* Pie del Mapa con Consentimiento de Interactividad */}
          <div className="relative z-30 bg-canvas/95 backdrop-blur-sm border border-line-subtle p-3 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-clinical text-ink-muted block">
                Privacidad de navegación
              </span>
              <p className="text-[11px] text-ink-secondary">
                Mostrando plano estático sin transferir cookies a Google.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                trackEvent('map_interactive_load', { location: 'contact_map' });
                setInteractiveLoaded(true);
              }}
              className="touch-target px-3 py-1.5 bg-surface hover:bg-surface-elevated border border-line-subtle text-[10px] uppercase tracking-clinical text-accent font-medium rounded-xs transition-colors shrink-0"
            >
              Cargar Google Maps Interactivo
            </button>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
          <iframe
            title="Ubicación de Clínica Dental Volta en Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.195323877969!2d-3.6894318!3d40.4266184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422899dc6a9117%3A0x6b2b516f4ad1c4e7!2sCalle%20de%20Serrano%2C%2042%2C%2028001%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
