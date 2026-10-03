'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteContent } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

export function PersistentMobileCTA() {
  const [visible, setVisible] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const pathname = usePathname();

  // Monitorizar scroll para aparecer solo tras el hero (> 350px)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setVisible(scrollY > 350);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitorizar si el formulario de contacto o reserva está en pantalla para ocultarse
  useEffect(() => {
    // Buscar elemento de formulario o sección de contacto
    const targetEl =
      document.getElementById('contacto') ||
      document.getElementById('formulario-cita') ||
      document.querySelector('form');

    if (!targetEl) {
      setFormInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries.some((entry) => entry.isIntersecting);
        setFormInView(isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(targetEl);
    return () => observer.disconnect();
  }, [pathname]);

  const whatsappUrl = `https://wa.me/${siteContent.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    siteContent.contact.whatsappMessage
  )}`;

  const isBarShown = visible && !formInView;

  return (
    <aside
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden p-2.5 sm:p-3 bg-canvas/95 backdrop-blur-md border-t border-line-subtle shadow-lifted transition-all duration-300 ease-out ${
        isBarShown
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="Acciones rápidas de contacto móvil"
      aria-hidden={!isBarShown}
    >
      <div className="max-w-md mx-auto grid grid-cols-12 gap-2">
        {/* Teléfono Directo (3 cols) */}
        <a
          href={`tel:${siteContent.contact.phoneRaw}`}
          onClick={() => trackEvent('phone_click', { location: 'sticky_mobile_bar' })}
          className="col-span-3 min-h-[44px] py-2 px-1 bg-surface hover:bg-surface-elevated border border-line-subtle rounded-xs flex flex-col items-center justify-center text-center transition-colors focus-visible:outline-accent active:bg-line-subtle"
          aria-label={`Llamar por teléfono al ${siteContent.contact.phone}`}
        >
          <Phone className="w-3.5 h-3.5 text-ink mb-0.5" />
          <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
            {siteContent.ctas.phone}
          </span>
        </a>

        {/* WhatsApp Directo (3 cols) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'sticky_mobile_bar' })}
          className="col-span-3 min-h-[44px] py-2 px-1 bg-surface hover:bg-surface-elevated border border-line-subtle rounded-xs flex flex-col items-center justify-center text-center transition-colors focus-visible:outline-accent active:bg-line-subtle"
          aria-label="Abrir chat de WhatsApp para consulta"
        >
          <MessageCircle className="w-3.5 h-3.5 text-accent mb-0.5" />
          <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
            {siteContent.ctas.secondary}
          </span>
        </a>

        {/* CTA Primario Unificado (6 cols) */}
        <Link
          href="/contacto"
          onClick={() => trackEvent('cta_primary_click', { location: 'sticky_mobile_bar' })}
          className="col-span-6 min-h-[44px] py-2 px-2 bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover rounded-btn flex items-center justify-center text-center transition-colors focus-visible:outline-accent shadow-subtle group active:scale-[0.99]"
          aria-label="Ir al formulario de reserva de visita"
        >
          <Calendar className="w-3.5 h-3.5 text-btn-primary-text mr-1.5 shrink-0" />
          <span className="text-[10px] tracking-clinical uppercase text-btn-primary-text font-medium whitespace-nowrap">
            {siteContent.ctas.primaryShort}
          </span>
        </Link>
      </div>
    </aside>
  );
}
