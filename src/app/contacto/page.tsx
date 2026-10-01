import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { clinicConfig } from '@/config/clinic.config';
import { ContactCTASection } from '@/components/home/ContactCTASection';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Car, Train } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto y Cita Previa en Calle Serrano, Madrid · Clínica Dental Volta',
  description:
    'Solicite su primera visita de diagnóstico en la Calle de Serrano, 42 (Barrio de Salamanca, Madrid). Gabinete digital, acceso adaptado y aparcamiento público bonificado.',
  alternates: {
    canonical: 'https://clinicavolta.es/contacto',
  },
  openGraph: {
    title: 'Contacto y Cita Previa en Calle Serrano, Madrid · Clínica Dental Volta',
    description:
      'Solicite su primera visita de diagnóstico en la Calle de Serrano, 42 (Barrio de Salamanca, Madrid). Gabinete digital y acceso adaptado.',
    url: 'https://clinicavolta.es/contacto',
    type: 'website',
  },
};

export default function ContactPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Contacto y Cita Previa', path: '/contacto' },
  ]);

  return (
    <div className="pt-28 lg:pt-36 pb-24">
      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Cabecera Editorial */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-accent font-medium mb-3">
            <Link href="/" className="text-ink-muted hover:text-ink">Inicio</Link>
            <span>/</span>
            <span>Contacto</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight mb-6">
            Contacto, Ubicación & Solicitud de Cita Previa
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Estamos ubicados en el eje de la Calle de Serrano, en el barrio de Salamanca de Madrid. Disponemos de instalaciones adaptadas, gabinete digital y aparcamiento público bonificado para nuestros pacientes.
          </p>
        </div>

        {/* Tarjetas de Información Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Teléfono */}
          <div className="bg-surface border border-line-subtle p-6 rounded-xs">
            <Phone className="w-5 h-5 text-accent mb-4" />
            <h2 className="text-xs uppercase tracking-clinical font-semibold text-ink mb-1">
              Atención Telefónica
            </h2>
            <p className="text-xs text-ink-muted mb-4">
              Línea directa para citas y consultas de pacientes
            </p>
            <a
              href={`tel:${clinicConfig.contact.phone}`}
              className="text-lg font-serif text-ink hover:text-accent font-medium block"
            >
              {clinicConfig.contact.phoneDisplay}
            </a>
          </div>

          {/* Horario */}
          <div className="bg-surface border border-line-subtle p-6 rounded-xs">
            <Clock className="w-5 h-5 text-accent mb-4" />
            <h2 className="text-xs uppercase tracking-clinical font-semibold text-ink mb-1">
              Horario de Gabinete
            </h2>
            <p className="text-xs text-ink-muted mb-4">
              Atención ininterrumpida con cita previa
            </p>
            <div className="text-xs text-ink space-y-1">
              <p>{clinicConfig.contact.schedule.weekdays}</p>
              <p>{clinicConfig.contact.schedule.friday}</p>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-surface border border-line-subtle p-6 rounded-xs">
            <MapPin className="w-5 h-5 text-accent mb-4" />
            <h2 className="text-xs uppercase tracking-clinical font-semibold text-ink mb-1">
              Sede Central
            </h2>
            <p className="text-xs text-ink-muted mb-4">
              {clinicConfig.contact.address.street}
            </p>
            <p className="text-xs text-ink">
              {clinicConfig.contact.address.postalCode} {clinicConfig.contact.address.city}, España
            </p>
          </div>
        </div>

        {/* Formulario Principal de Reserva */}
        <ContactCTASection />

        {/* Accesos y Transporte */}
        <div className="mt-20 bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-6">
            Cómo llegar y accesibilidad
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-ink-secondary leading-relaxed">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-ink font-semibold uppercase tracking-clinical">
                <Train className="w-4 h-4 text-accent" />
                <span>Transporte Público (Metro & Autobús)</span>
              </div>
              <p>
                <strong>Metro:</strong> Estaciones más cercanas Serrano (Línea 4), Velázquez (Línea 4) y Colón (Línea 4). Estación de Cercanías Renfe Recoletos a 6 minutos a pie.
              </p>
              <p>
                <strong>Autobús EMT:</strong> Líneas 1, 9, 19, 51, 74 y Serrano / Goya.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-ink font-semibold uppercase tracking-clinical">
                <Car className="w-4 h-4 text-accent" />
                <span>Aparcamiento Concertado</span>
              </div>
              <p>
                {clinicConfig.contact.address.parking}. Ofrecemos a nuestros pacientes hasta 2 horas de estacionamiento bonificado presentando el ticket en recepción.
              </p>
              <p className="text-ink-muted text-[11px]">
                El edificio dispone de ascensor adaptado para personas de movilidad reducida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
