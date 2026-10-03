'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface NewsletterFormProps {
  className?: string;
  sourceLocation?: string;
  compact?: boolean;
}

export function NewsletterForm({
  className = '',
  sourceLocation = 'blog',
  compact = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!privacyAccepted) {
      setStatus('error');
      setErrorMessage('Es imprescindible aceptar la política de privacidad para suscribirse.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Introduce una dirección de correo electrónico válida.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), privacyAccepted }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus('error');
        setErrorMessage(data.error || 'No se pudo completar la suscripción.');
        return;
      }

      setStatus('success');
      trackEvent('newsletter_subscribe', { location: sourceLocation });
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage('Error de conexión con el servidor. Inténtalo de nuevo.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`p-6 bg-surface border border-line-strong rounded-xs shadow-subtle ${className}`}>
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-serif text-base text-ink font-medium">
              Suscripción confirmada
            </h4>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Gracias por unirte al boletín de Clínica Cala. Recibirás periódicamente publicaciones sobre biomecánica dental y avances clínicos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-8 bg-surface border border-line-subtle rounded-xs shadow-subtle ${className}`}>
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-1">
          Divulgación & Criterio Facultativo
        </span>
        <h3 className="font-serif text-xl sm:text-2xl text-ink tracking-tight mb-2">
          Boletín Clínico de Odontología de Precisión
        </h3>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Recibe en tu correo análisis biomecánicos, comparativas de materiales y criterios médicos redactados directamente por nuestro cuadro facultativo. Sin spam comercial.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="tu.correo@ejemplo.com"
              disabled={status === 'loading'}
              required
              aria-label="Dirección de correo electrónico para suscripción al boletín"
              className="touch-target w-full pl-10 pr-4 py-3 bg-canvas border border-line-subtle rounded-input text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="touch-target px-6 py-3 bg-btn-primary hover:bg-btn-primary-hover text-btn-primary-text text-xs uppercase tracking-clinical rounded-btn font-medium transition-colors flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50 group"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Suscribiendo...</span>
              </>
            ) : (
              <>
                <span>Suscribirme</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Checkbox de Privacidad Obligatorio */}
        <div className="flex items-start space-x-2.5 text-xs text-ink-muted">
          <input
            type="checkbox"
            id={`newsletter-privacy-${sourceLocation}`}
            checked={privacyAccepted}
            onChange={(e) => {
              setPrivacyAccepted(e.target.checked);
              if (status === 'error') setStatus('idle');
            }}
            required
            className="mt-0.5 rounded-xs border-line-strong text-accent focus:ring-accent"
          />
          <label
            htmlFor={`newsletter-privacy-${sourceLocation}`}
            className="text-[11px] leading-relaxed cursor-pointer select-none"
          >
            He leído y acepto la{' '}
            <Link href="/privacidad" className="underline hover:text-ink text-ink-secondary">
              política de privacidad
            </Link>{' '}
            para el envío periódico de artículos y comunicaciones informativas de la clínica.
          </label>
        </div>

        {/* Mensaje de Error Accesible */}
        {status === 'error' && (
          <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-xs border border-red-200" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}
