'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export interface TreatmentItem {
  id: string;
  name: string;
  shortDesc: string;
  timeEstimate: string;
  href: string;
  badge?: string;
}

export interface TreatmentCategory {
  id: string;
  title: string;
  items: TreatmentItem[];
}

export const TREATMENTS_NAV_DATA: TreatmentCategory[] = [
  {
    id: 'ortodoncia-invisible',
    title: 'Ortodoncia Invisible',
    items: [
      {
        id: 'invisalign-comprehensive',
        name: 'Invisalign Comprehensive',
        shortDesc: 'Alineación de alta precisión para maloclusiones y apiñamiento con SmartTrack.',
        timeEstimate: '6–18 meses',
        href: '/invisalign',
      },
      {
        id: 'invisalign-first-teen',
        name: 'Invisalign First & Teen',
        shortDesc: 'Ortodoncia interceptiva infantil y guía de erupción para adolescentes.',
        timeEstimate: '6–14 meses',
        href: '/invisalign#first-teen',
        badge: 'Destacado',
      },
      {
        id: 'invisalign-lite-express',
        name: 'Invisalign Lite & Express',
        shortDesc: 'Corrección estética focalizada para recidivas o leves rotaciones anteriores.',
        timeEstimate: '3–6 meses',
        href: '/invisalign#lite-express',
      },
    ],
  },
  {
    id: 'estetica-dental',
    title: 'Estética Dental',
    items: [
      {
        id: 'carillas-porcelana',
        name: 'Carillas de Porcelana',
        shortDesc: 'Láminas feldespáticas ultrafinas (0,2–0,4 mm) biomiméticas sin tallado agresivo.',
        timeEstimate: '2–3 citas',
        href: '/tratamientos/carillas-de-porcelana',
      },
      {
        id: 'blanqueamiento-combinado',
        name: 'Blanqueamiento Combinado',
        shortDesc: 'Activación clínica por luz fría combinada con férulas domiciliarias nocturnas.',
        timeEstimate: '3 semanas',
        href: '/tratamientos/blanqueamiento-dental',
      },
      {
        id: 'cirugia-periodontal',
        name: 'Cirugía Plástica Gingival',
        shortDesc: 'Remodelado microquirúrgico del margen y corrección de sonrisa gingival.',
        timeEstimate: '1–2 citas',
        href: '/tratamientos/cirugia-periodontal',
      },
    ],
  },
  {
    id: 'implantologia-conservadora',
    title: 'Implantología y Conservadora',
    items: [
      {
        id: 'implantes-guiados',
        name: 'Implantes Guiados por TAC 3D',
        shortDesc: 'Fijaciones de titanio con férula estereolitográfica CBCT y postoperatorio mínimo.',
        timeEstimate: '1 sesión · Carga inmed.',
        href: '/tratamientos/implantes-dentales',
      },
      {
        id: 'profilaxis-gbt',
        name: 'Profilaxis Avanzada GBT',
        shortDesc: 'Terapia guiada por biopelícula indolora para eliminación de sarro y biofilm.',
        timeEstimate: '1 sesión anual',
        href: '/tratamientos/odontologia-conservadora',
      },
      {
        id: 'odontologia-conservadora',
        name: 'Odontología Conservadora',
        shortDesc: 'Restauraciones biomiméticas y sellado hermético que preservan el esmalte sano.',
        timeEstimate: '1 cita por pieza',
        href: '/tratamientos/odontologia-conservadora',
      },
    ],
  },
];

interface TreatmentsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function TreatmentsMegaMenu({
  isOpen,
  onClose,
  triggerRef,
  onMouseEnter,
  onMouseLeave,
}: TreatmentsMegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Manejador de teclado accesible: Escape para cerrar y navegación cíclica por Tab
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      id="treatments-mega-menu"
      role="region"
      aria-label="Menú desplegable de tratamientos clínicos"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 w-full bg-canvas border-b border-line-subtle shadow-2xl transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columnas de Categorías Clínicas (9 columnas de 12) */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-8">
            {TREATMENTS_NAV_DATA.map((cat, catIdx) => (
              <div
                key={cat.id}
                className="flex flex-col space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                style={{ animationDelay: `${catIdx * 60}ms` }}
              >
                <div className="flex items-center space-x-2 pb-2 border-b border-line-subtle/60">
                  <span className="text-xs font-medium text-accent">
                    {cat.title}
                  </span>
                </div>

                <div className="flex flex-col space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        trackEvent('nav_treatment_click', { treatment: item.id });
                        onClose();
                      }}
                      style={{ animationDelay: `${catIdx * 60 + itemIdx * 35}ms` }}
                      className="group/item flex flex-col p-2.5 -mx-2.5 rounded-xs transition-all duration-200 hover:bg-surface hover:translate-x-1 focus-visible:outline-accent"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-ink group-hover/item:text-accent transition-colors flex items-center space-x-1.5">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="text-[9px] uppercase tracking-wider bg-accent/10 text-accent px-1.5 py-0.5 rounded-2xs font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <ChevronRight className="w-3 h-3 text-ink-muted/50 group-hover/item:text-accent group-hover/item:translate-x-0.5 transition-all" />
                      </div>

                      <p className="text-[11px] text-ink-secondary line-clamp-1 mt-1 leading-snug">
                        {item.shortDesc}
                      </p>

                      <div className="flex items-center space-x-1 text-[10px] text-ink-muted mt-1.5">
                        <Clock className="w-2.5 h-2.5 text-accent" />
                        <span>{item.timeEstimate}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Columna Destacada Lateral: Invisalign First / Teen (3 columnas de 12) */}
          <div
            className="lg:col-span-3 bg-surface p-5 rounded-xs border border-line-subtle flex flex-col justify-between h-full animate-in fade-in slide-in-from-right-2 duration-300 fill-mode-both"
            style={{ animationDelay: '180ms' }}
          >
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-clinical bg-accent text-canvas px-2 py-0.5 rounded-2xs font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Destacado</span>
                </span>
                <span className="text-[10px] text-ink-muted uppercase tracking-clinical">
                  Ortodoncia Infanto-Juvenil
                </span>
              </div>

              <h4 className="font-serif text-base text-ink mb-1 font-normal tracking-tight">
                Invisalign First & Teen
              </h4>

              <p className="text-[11px] text-ink-secondary leading-relaxed mb-4">
                Corrección preventiva de arcadas en crecimiento con tecnología SmartTrack. Férulas transparentes extraíbles con guía eruptiva para adolescentes.
              </p>

              <div className="bg-canvas p-3 rounded-card border border-line-subtle/80 flex items-center space-x-2.5 mb-4">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span className="text-[10px] text-ink-secondary leading-tight">
                  Supervisado por la Dra. Elena Cala · Proveedora Oficial Apex
                </span>
              </div>
            </div>

            <Link
              href="/invisalign"
              onClick={() => {
                trackEvent('nav_featured_click', { treatment: 'invisalign_teen' });
                onClose();
              }}
              className="inline-flex items-center justify-between text-xs text-accent font-medium hover:text-ink transition-colors group/cta pt-2 border-t border-line-subtle/80"
            >
              <span>Protocolo Invisalign</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Barra Inferior del Mega Menú: Enlace a Tratamientos General */}
        <div className="mt-8 pt-4 border-t border-line-subtle/60 flex items-center justify-between text-xs">
          <span className="text-[11px] text-ink-muted">
            Diagnóstico clínico personalizado y simulación digital 3D en primera visita.
          </span>
          <Link
            href="/tratamientos"
            onClick={onClose}
            className="text-[11px] tracking-clinical uppercase text-ink hover:text-accent font-medium transition-colors flex items-center space-x-1"
          >
            <span>Ver índice completo de tratamientos</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
