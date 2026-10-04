'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingFormData } from '@/lib/validation/bookingSchema';
import { siteContent } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import {
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Phone,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface BookingFormProps {
  className?: string;
  sourceLocation?: string;
  defaultMotive?: BookingFormData['motive'];
}

export function BookingForm({
  className = '',
  sourceLocation = 'booking_form',
  defaultMotive = 'invisalign',
}: BookingFormProps) {
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [serverErrorMessage, setServerErrorMessage] = useState<string>('');
  const [referenceId, setReferenceId] = useState<string>('');

  const formContent = siteContent.form;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      motive: defaultMotive,
      message: '',
      rgpdConsent: undefined,
      honeypot: '',
    },
    mode: 'onBlur',
    shouldFocusError: true,
  });

  const onSubmit = async (data: BookingFormData) => {
    setSubmissionStatus('submitting');
    setServerErrorMessage('');
    trackEvent('form_submit_attempt', { location: sourceLocation, treatment: data.motive });

    try {
      const response = await fetch('/api/cita', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Ha ocurrido un problema al procesar su solicitud. Por favor, inténtelo de nuevo.'
        );
      }

      setReferenceId(result.referenceId || `CALA-${Date.now().toString().slice(-6)}`);
      setSubmissionStatus('success');
      trackEvent('form_submit_success', {
        location: sourceLocation,
        treatment: data.motive,
      });
    } catch (err: any) {
      console.error('[Booking Submit Error]', err);
      setServerErrorMessage(
        err.message ||
          'No se pudo conectar con el servidor. Por favor, reintente o contacte directamente por teléfono.'
      );
      setSubmissionStatus('error');
      trackEvent('form_submit_error', {
        location: sourceLocation,
        metadata: { error: err.message },
      });
    }
  };

  const handleResetForm = () => {
    reset();
    setSubmissionStatus('idle');
    setServerErrorMessage('');
  };

  return (
    <div className={`bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card ${className}`}>
      {/* ESTADO: ÉXITO */}
      {submissionStatus === 'success' ? (
        <div
          className="py-8 flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="w-16 h-16 bg-accent-soft border border-accent/30 rounded-full flex items-center justify-center text-accent">
            <svg
              className="w-8 h-8 text-accent animate-stroke-draw"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
              Petición Registrada con Éxito
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              Solicitud de cita recibida
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">
              {formContent.successNextStep}
            </p>
          </div>

          <div className="w-full max-w-md p-4 bg-canvas border border-line-subtle rounded-xs space-y-2 text-left text-xs">
            <div className="flex justify-between items-center text-ink-muted">
              <span>Código de seguimiento:</span>
              <span className="font-mono font-medium text-ink bg-surface px-2 py-0.5 rounded-xs border border-line-subtle">
                {referenceId}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-muted">
              <span>Tiempo estimado de respuesta:</span>
              <span className="font-medium text-ink font-mono">{formContent.responseTime}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="touch-target inline-flex items-center space-x-2 text-xs uppercase tracking-clinical text-accent hover:text-ink transition-colors font-medium border-b border-accent pb-0.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Enviar otra solicitud de valoración</span>
            </button>
          </div>
        </div>
      ) : (
        /* ESTADO: FORMULARIO ACTIVO (O CON ERROR) */
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Mensaje de Error de Servidor / Red */}
          {submissionStatus === 'error' && (
            <div
              className="p-4 bg-red-50 border border-red-200 rounded-xs flex items-start space-x-3 text-xs text-red-900 animate-in fade-in duration-200"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium">{serverErrorMessage}</p>
                <div className="flex items-center space-x-4 pt-1">
                  <button
                    type="submit"
                    className="underline font-semibold hover:text-red-700"
                  >
                    Reintentar envío
                  </button>
                  <span>o</span>
                  <a
                    href={`tel:${siteContent.contact.phoneRaw}`}
                    className="inline-flex items-center space-x-1 underline font-semibold hover:text-red-700"
                  >
                    <Phone className="w-3 h-3 inline" />
                    <span>Llamar al {siteContent.contact.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Campo Honeypot Oculto contra Bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_field">No rellenar este campo si eres humano</label>
            <input
              type="text"
              id="hp_field"
              tabIndex={-1}
              autoComplete="off"
              {...register('honeypot')}
            />
          </div>

          {/* Fila: Nombre y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nombre y Apellidos */}
            <div className="space-y-2">
              <label
                htmlFor="booking_name"
                className="text-xs uppercase tracking-clinical text-ink font-semibold flex items-center justify-between"
              >
                <span>Nombre y Apellidos *</span>
              </label>
              <input
                type="text"
                id="booking_name"
                required
                autoComplete="name"
                placeholder="Ej. María Gómez Ortiz"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'booking_name_error' : undefined}
                {...register('name')}
                className={`w-full min-h-[48px] px-4 py-3 bg-canvas border rounded-xs text-base text-ink placeholder:text-ink-muted focus:outline-none transition-all duration-200 focus:ring-2 ${
                  errors.name
                    ? 'animate-error-shake border-red-600 focus:border-red-600 focus:ring-red-500/20'
                    : 'border-line-subtle focus:border-accent focus:ring-accent/25'
                }`}
              />
              {errors.name && (
                <p
                  id="booking_name_error"
                  className="text-xs text-red-600 flex items-center space-x-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label
                htmlFor="booking_phone"
                className="text-xs uppercase tracking-clinical text-ink font-semibold flex items-center justify-between"
              >
                <span>Teléfono de Contacto *</span>
              </label>
              <input
                type="tel"
                id="booking_phone"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="600 000 000"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'booking_phone_error' : undefined}
                {...register('phone')}
                className={`w-full min-h-[48px] px-4 py-3 bg-canvas border rounded-xs text-base text-ink placeholder:text-ink-muted focus:outline-none transition-all duration-200 focus:ring-2 ${
                  errors.phone
                    ? 'animate-error-shake border-red-600 focus:border-red-600 focus:ring-red-500/20'
                    : 'border-line-subtle focus:border-accent focus:ring-accent/25'
                }`}
              />
              {errors.phone && (
                <p
                  id="booking_phone_error"
                  className="text-xs text-red-600 flex items-center space-x-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* Fila: Email y Motivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Correo Electrónico (Opcional) */}
            <div className="space-y-2">
              <label
                htmlFor="booking_email"
                className="text-xs uppercase tracking-clinical text-ink font-semibold flex items-center justify-between"
              >
                <span>Correo Electrónico (Opcional)</span>
              </label>
              <input
                type="email"
                id="booking_email"
                inputMode="email"
                autoComplete="email"
                placeholder="ejemplo@correo.es"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'booking_email_error' : undefined}
                {...register('email')}
                className={`w-full min-h-[48px] px-4 py-3 bg-canvas border rounded-xs text-base text-ink placeholder:text-ink-muted focus:outline-none transition-all duration-200 focus:ring-2 ${
                  errors.email
                    ? 'animate-error-shake border-red-600 focus:border-red-600 focus:ring-red-500/20'
                    : 'border-line-subtle focus:border-accent focus:ring-accent/25'
                }`}
              />
              {errors.email && (
                <p
                  id="booking_email_error"
                  className="text-xs text-red-600 flex items-center space-x-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Motivo de Consulta */}
            <div className="space-y-2">
              <label
                htmlFor="booking_motive"
                className="text-xs uppercase tracking-clinical text-ink font-semibold"
              >
                <span>Motivo de Consulta</span>
              </label>
              <select
                id="booking_motive"
                {...register('motive')}
                className="w-full min-h-[48px] px-4 py-3 bg-canvas border border-line-subtle focus:border-accent focus:ring-2 focus:ring-accent/25 rounded-xs text-base text-ink focus:outline-none transition-all duration-200"
              >
                {formContent.motives.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observaciones o Preferencias */}
          <div className="space-y-2">
            <label
              htmlFor="booking_message"
              className="text-xs uppercase tracking-clinical text-ink font-semibold"
            >
              <span>Observaciones o Preferencias Horarias (Opcional)</span>
            </label>
            <textarea
              id="booking_message"
              rows={3}
              placeholder="Indica si prefieres citas de mañana o tarde, o cualquier aclaración sobre tu disponibilidad..."
              {...register('message')}
              className={`w-full px-4 py-3 bg-canvas border rounded-xs text-base text-ink placeholder:text-ink-muted focus:outline-none transition-all duration-200 focus:ring-2 resize-y ${
                errors.message
                  ? 'animate-error-shake border-red-600 focus:border-red-600 focus:ring-red-500/20'
                  : 'border-line-subtle focus:border-accent focus:ring-accent/25'
              }`}
            />
            {errors.message && (
              <p className="text-xs text-red-600 flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.message.message}</span>
              </p>
            )}
          </div>

          {/* Casilla RGPD desmarcada por defecto */}
          <div className="space-y-2 pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                id="booking_rgpd"
                required
                {...register('rgpdConsent')}
                className="mt-1 w-4 h-4 rounded-xs border-line-strong text-accent focus:ring-accent"
              />
              <span className="text-xs text-ink-secondary leading-relaxed">
                He leído y acepto la{' '}
                <Link
                  href="/privacidad"
                  target="_blank"
                  className="text-accent underline underline-offset-2 hover:text-ink font-medium"
                >
                  política de privacidad
                </Link>{' '}
                y autorizo el tratamiento de mis datos de contacto para la citación médica. *
              </span>
            </label>
            {errors.rgpdConsent && (
              <p
                id="booking_rgpd_error"
                className="text-xs text-red-600 flex items-center space-x-1 pl-7"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.rgpdConsent.message}</span>
              </p>
            )}
          </div>

          {/* Aclaración sobre Urgencias Médicas (Obligatorio) */}
          <div className="p-3.5 bg-canvas border border-line-subtle rounded-xs flex items-start space-x-3 text-xs text-ink-secondary">
            <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {formContent.urgencyDisclaimer}
            </p>
          </div>

          {/* Botón de Envío Principal */}
          <button
            type="submit"
            disabled={isSubmitting || submissionStatus === 'submitting'}
            className="touch-target w-full min-h-[50px] bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text text-xs uppercase tracking-clinical py-4 px-6 rounded-btn font-medium transition-all duration-200 active:scale-[0.98] shadow-subtle flex items-center justify-center space-x-2 group disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting || submissionStatus === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 text-btn-primary-text animate-spin shrink-0" />
                <span>Procesando solicitud...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 text-btn-primary-text" />
                <span>{siteContent.ctas.primary}</span>
                <Send className="w-3.5 h-3.5 text-btn-primary-text/80 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
