'use client';

import React from 'react';
import Link from 'next/link';
import { clinicConfig } from '@/config/clinic.config';
import { siteContent } from '@/content/site';
import { trackEvent, openCookieSettings } from '@/lib/analytics';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-line-subtle text-ink pt-16 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Fila Principal de Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-line-subtle">
          {/* Columna 1: Marca y Filosofía Clínica (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-tight text-ink font-normal">
                {siteContent.brand.name}
              </span>
            </Link>
            <p className="text-xs text-ink-secondary leading-relaxed max-w-sm">
              {siteContent.brand.subclaim} {siteContent.brand.philosophy}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] uppercase tracking-clinical text-ink-muted border border-line-subtle px-3 py-1.5 rounded-xs">
                Registro Sanitario: {clinicConfig.legal.registrySanitaryCode}
              </span>
            </div>
          </div>

          {/* Columna 2: Navegación de Especialidades (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <span className="text-[11px] uppercase tracking-clinical text-ink-muted font-medium">
              Especialidades Clínicas
            </span>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              {siteContent.treatments.map((treatment) => (
                <li key={treatment.id}>
                  <Link
                    href={
                      treatment.slug === 'invisalign'
                        ? '/invisalign'
                        : `/tratamientos/${treatment.slug}`
                    }
                    className="hover:text-accent transition-colors flex items-center justify-between group py-0.5"
                  >
                    <span>{treatment.title}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Información Institucional y Equipo (2 cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <span className="text-[11px] uppercase tracking-clinical text-ink-muted font-medium">
              Clínica
            </span>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li>
                <Link href="/equipo" className="hover:text-accent transition-colors py-0.5 block">
                  Cuadro Médico Colegiado
                </Link>
              </li>
              <li>
                <Link href="/invisalign" className="hover:text-accent transition-colors py-0.5 block">
                  Protocolo Invisalign®
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-accent transition-colors py-0.5 block">
                  Instalaciones y Gabinete
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  onClick={() => trackEvent('cta_primary_click', { location: 'footer_link' })}
                  className="hover:text-accent transition-colors py-0.5 block font-medium text-ink"
                >
                  {siteContent.ctas.primary}
                </Link>
              </li>
              <li>
                <a
                  href={clinicConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center space-x-1 py-0.5"
                >
                  <span>Casos en Instagram</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Ubicación y Horarios (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <span className="text-[11px] uppercase tracking-clinical text-ink-muted font-medium">
              Sede Principal
            </span>
            <div className="space-y-2 text-xs text-ink-secondary leading-relaxed">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                <span>
                  {siteContent.contact.address.street}
                  <br />
                  {siteContent.contact.address.postalCode} {siteContent.contact.address.city}
                </span>
              </p>
              <p className="text-[11px] text-ink-muted pl-5">
                Metro: {siteContent.contact.address.metro}
              </p>
              <p className="flex items-start space-x-2 pt-2">
                <Clock className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                <span>
                  {siteContent.contact.schedule.weekdays}
                  <br />
                  {siteContent.contact.schedule.friday}
                </span>
              </p>
              <p className="flex items-center space-x-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <a
                  href={`tel:${siteContent.contact.phoneRaw}`}
                  onClick={() => trackEvent('phone_click', { location: 'footer' })}
                  className="hover:text-accent font-medium text-ink"
                >
                  {siteContent.contact.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Fila Inferior: Créditos, Colegiado y Enlaces Legales */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-ink-muted gap-4">
          <div className="space-y-1">
            <p>
              © {currentYear} {siteContent.brand.legalName} · CIF {clinicConfig.legal.cif}
            </p>
            <p className="text-[11px]">
              Dirección médica: {clinicConfig.medicalDirector.name} ({clinicConfig.medicalDirector.collegiateNumber}, {clinicConfig.medicalDirector.college}).
            </p>
          </div>

          {/* Enlaces Legales requeridos por normativa española y LSSI/RGPD */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <Link href="/aviso-legal" className="hover:text-ink transition-colors underline-offset-4 hover:underline">
              Aviso Legal
            </Link>
            <Link href="/privacidad" className="hover:text-ink transition-colors underline-offset-4 hover:underline">
              Política de Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-ink transition-colors underline-offset-4 hover:underline">
              Política de Cookies
            </Link>
            <button
              type="button"
              onClick={() => openCookieSettings()}
              className="hover:text-ink transition-colors underline-offset-4 hover:underline cursor-pointer text-left"
            >
              Configurar cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
