'use client';

import React from 'react';
import { siteContent } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { StaticClinicMap } from '@/components/common/StaticClinicMap';
import { BookingForm } from '@/components/forms/BookingForm';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Car,
  Train,
} from 'lucide-react';

import { ScrollReveal } from '@/components/motion/ScrollReveal';

export function ContactCTASection() {
  const formContent = siteContent.form;
  const contact = siteContent.contact;

  const whatsappUrl = `https://wa.me/${contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    contact.whatsappMessage
  )}`;

  return (
    <section
      id="contacto"
      className="py-24 lg:py-32 bg-canvas border-t border-line-strong relative"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera Principal a Pantalla Completa */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <ScrollReveal variant="fade-up" distance={12} delay={0.05}>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
                Consulta de Valoración Inicial
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="mask-line" delay={0.1}>
            <h2
              id="contact-heading"
              className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.08] mb-6"
            >
              {formContent.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.15}>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
              {formContent.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* Estructura en 2 Grandes Bloques: Formulario (7 cols) + Información y Mapa (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Bloque 1: Formulario con react-hook-form y Zod (7 cols) */}
          <div className="lg:col-span-7">
            <BookingForm sourceLocation="home_cta_section" defaultMotive="invisalign" />
          </div>

          {/* Bloque 2: Vías Rápidas, Datos de la Sede y Mapa Estático (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            {/* Vías Inmediatas de Atención Directa */}
            <div className="bg-surface border border-line-strong p-8 rounded-xs shadow-card space-y-6">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block">
                Atención Inmediata
              </span>

              {/* Botón WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { location: 'contact_section' })}
                className="touch-target p-4 bg-canvas hover:bg-surface-elevated border border-line-subtle hover:border-accent rounded-xs flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-clinical font-semibold text-ink block">
                      Consultas por WhatsApp
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Horario de consulta: 09:30 a 20:00 h
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-accent font-medium">Abrir →</span>
              </a>

              {/* Botón Teléfono Directo */}
              <a
                href={`tel:${contact.phoneRaw}`}
                onClick={() => trackEvent('phone_click', { location: 'contact_section' })}
                className="touch-target p-4 bg-canvas hover:bg-surface-elevated border border-line-subtle hover:border-accent rounded-xs flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-surface text-ink flex items-center justify-center border border-line-subtle">
                    <Phone className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-clinical font-semibold text-ink block">
                      Recepción Telefónica
                    </span>
                    <span className="text-xs text-ink font-serif">
                      {contact.phone}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-ink-muted group-hover:text-ink font-medium">Llamar →</span>
              </a>

              {/* Horario y Localización Detallada */}
              <div className="pt-6 border-t border-line-subtle space-y-4 text-xs text-ink-secondary">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ink block">{contact.address.street}</strong>
                    <span>{contact.address.postalCode} {contact.address.city} ({contact.address.area})</span>
                    <p className="text-[11px] text-ink-muted mt-0.5">{contact.address.accessDetails}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p>{contact.schedule.weekdays}</p>
                    <p>{contact.schedule.friday}</p>
                    <p className="text-[11px] text-ink-muted mt-0.5">{contact.schedule.weekend}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Train className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>Metro: {contact.address.metro}</span>
                </div>

                <div className="flex items-start space-x-3">
                  <Car className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>Aparcamiento: {contact.address.parking}</span>
                </div>
              </div>
            </div>

            {/* Plano Estático de Situación */}
            <div>
              <StaticClinicMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
