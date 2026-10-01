'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';
import { getCookieConsent, saveCookieConsent } from '@/lib/analytics';

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const existingConsent = getCookieConsent();
    if (!existingConsent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setPreferences({
        analytics: existingConsent.analytics,
        marketing: existingConsent.marketing,
      });
    }
  }, []);

  // Escuchar el evento global para abrir la configuración desde el footer en cualquier momento
  useEffect(() => {
    const handleOpenModal = () => {
      previousFocusedElement.current = document.activeElement as HTMLElement;
      setShowModal(true);
    };

    window.addEventListener('cala_open_cookie_modal', handleOpenModal);
    return () => {
      window.removeEventListener('cala_open_cookie_modal', handleOpenModal);
    };
  }, []);

  // Gestión de accesibilidad en el modal: Foco atrapado y tecla Escape
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        previousFocusedElement.current?.focus();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Mover foco al modal al abrir
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>('button, input');
    firstFocusable?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  if (!mounted) return null;

  const handleAcceptAll = () => {
    saveCookieConsent({ analytics: true, marketing: true });
    setPreferences({ analytics: true, marketing: true });
    setShowBanner(false);
    setShowModal(false);
    previousFocusedElement.current?.focus();
  };

  const handleRejectAll = () => {
    saveCookieConsent({ analytics: false, marketing: false });
    setPreferences({ analytics: false, marketing: false });
    setShowBanner(false);
    setShowModal(false);
    previousFocusedElement.current?.focus();
  };

  const handleSaveCustom = () => {
    saveCookieConsent(preferences);
    setShowBanner(false);
    setShowModal(false);
    previousFocusedElement.current?.focus();
  };

  return (
    <>
      {/* Banner Principal con la MISMA prominencia visual para Aceptar y Rechazar (Criterio AEPD) */}
      {showBanner && (
        <aside
          className="fixed bottom-[4.25rem] sm:bottom-6 left-4 right-4 sm:left-8 sm:right-auto sm:max-w-xl z-40 p-5 bg-surface border border-line-strong rounded-xs shadow-lifted animate-in slide-in-from-bottom duration-300"
          role="region"
          aria-label="Aviso de cookies y consentimiento RGPD"
        >
          <div className="flex items-start space-x-3.5">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="space-y-2.5">
              <h2 className="text-xs uppercase tracking-clinical font-semibold text-ink">
                Privacidad y Gestión de Cookies (LSSI-CE & RGPD)
              </h2>
              <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                Utilizamos cookies técnicas imprescindibles para la navegación y, con tu autorización previa, cookies analíticas anónimas (GA4 Consent Mode v2) para optimizar el rendimiento de la clínica.{' '}
                <Link href="/cookies" className="underline underline-offset-2 hover:text-accent font-medium">
                  Ver política completa
                </Link>.
              </p>

              {/* Botones de acción con la MISMA prominencia visual */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="touch-target flex-1 sm:flex-none px-4 py-2.5 bg-ink text-canvas hover:bg-accent border border-ink hover:border-accent text-[11px] uppercase tracking-clinical rounded-xs font-semibold transition-colors text-center"
                >
                  Aceptar todas
                </button>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="touch-target flex-1 sm:flex-none px-4 py-2.5 bg-ink text-canvas hover:bg-accent border border-ink hover:border-accent text-[11px] uppercase tracking-clinical rounded-xs font-semibold transition-colors text-center"
                >
                  Rechazar todas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    previousFocusedElement.current = document.activeElement as HTMLElement;
                    setShowModal(true);
                  }}
                  className="touch-target px-3.5 py-2.5 text-[11px] uppercase tracking-clinical text-ink-secondary hover:text-ink border border-line-subtle hover:border-line-strong rounded-xs transition-colors"
                >
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Modal de Configuración Granular de Cookies */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
        >
          <div
            ref={modalRef}
            className="bg-canvas border border-line-strong max-w-lg w-full p-6 sm:p-8 rounded-xs shadow-lifted space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-line-subtle pb-4">
              <div>
                <h3 id="cookie-settings-title" className="font-serif text-xl sm:text-2xl text-ink">
                  Configuración de Consentimiento
                </h3>
                <p className="text-[11px] text-ink-muted uppercase tracking-clinical mt-0.5">
                  Directiva ePrivacy · Ley 34/2002
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  previousFocusedElement.current?.focus();
                }}
                className="text-ink-muted hover:text-ink p-1 rounded-xs hover:bg-surface transition-colors"
                aria-label="Cerrar ventana de configuración"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed font-sans">
              En cumplimiento del Reglamento General de Protección de Datos (RGPD) y las directrices de la AEPD, ninguna cookie no técnica será instalada sin tu consentimiento previo e inequívoco. Puedes modificar tus preferencias en cualquier momento.
            </p>

            <div className="space-y-3.5 text-xs text-ink-secondary">
              {/* Categoría: Cookies Técnicas (Obligatorias) */}
              <div className="p-4 bg-surface border border-line-subtle rounded-xs flex items-start justify-between">
                <div className="pr-4">
                  <span className="font-semibold text-ink uppercase tracking-clinical text-[11px] block">
                    1. Cookies Técnicas y de Navegación
                  </span>
                  <p className="mt-1 text-ink-muted leading-relaxed text-[11px]">
                    Necesarias para la entrega del servicio, prevención de ataques DDoS, gestión segura de la sesión y carga de recursos WebGL locales. Exentas de consentimiento según el art. 22.2 LSSI-CE.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold text-accent px-2 py-1 bg-surface border border-line-strong rounded-xs shrink-0">
                  Obligatorias
                </span>
              </div>

              {/* Categoría: Cookies Analíticas */}
              <div className="p-4 bg-surface border border-line-subtle rounded-xs flex items-start justify-between">
                <div className="pr-4">
                  <label htmlFor="analytics-consent" className="font-semibold text-ink uppercase tracking-clinical text-[11px] block cursor-pointer">
                    2. Cookies Analíticas (Google Analytics 4)
                  </label>
                  <p className="mt-1 text-ink-muted leading-relaxed text-[11px]">
                    Permiten medir de forma disociada y agregada la afluencia de pacientes a las distintas secciones clínicas mediante Consent Mode v2 con anonimización de IP.
                  </p>
                </div>
                <input
                  id="analytics-consent"
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-4 h-4 text-accent border-line-strong rounded-xs focus:ring-accent shrink-0 mt-1 cursor-pointer"
                  aria-label="Permitir cookies analíticas"
                />
              </div>

              {/* Categoría: Cookies de Marketing */}
              <div className="p-4 bg-surface border border-line-subtle rounded-xs flex items-start justify-between">
                <div className="pr-4">
                  <label htmlFor="marketing-consent" className="font-semibold text-ink uppercase tracking-clinical text-[11px] block cursor-pointer">
                    3. Cookies de Personalización y Medios Externos
                  </label>
                  <p className="mt-1 text-ink-muted leading-relaxed text-[11px]">
                    Habilitan la integración de servicios cartográficos externos (Google Maps interactivo). Si no las activas, el mapa se mantendrá en formato vectorial estático seguro.
                  </p>
                </div>
                <input
                  id="marketing-consent"
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-4 h-4 text-accent border-line-strong rounded-xs focus:ring-accent shrink-0 mt-1 cursor-pointer"
                  aria-label="Permitir cookies de medios externos"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-line-subtle">
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="touch-target flex-1 sm:flex-none px-4 py-2 bg-canvas hover:bg-surface border border-line-strong text-[11px] uppercase tracking-clinical text-ink rounded-xs transition-colors"
                >
                  Rechazar todas
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="touch-target flex-1 sm:flex-none px-4 py-2 bg-canvas hover:bg-surface border border-line-strong text-[11px] uppercase tracking-clinical text-ink rounded-xs transition-colors"
                >
                  Aceptar todas
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveCustom}
                className="touch-target w-full sm:w-auto px-6 py-2.5 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs font-semibold transition-colors shadow-subtle"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
