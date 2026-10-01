'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          backgroundColor: '#F8F6F1',
          color: '#1A1816',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E0D8',
              borderRadius: '3px',
              padding: '40px 32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#8A532B',
                fontWeight: 600,
                display: 'inline-block',
                marginBottom: '16px',
                padding: '4px 10px',
                backgroundColor: 'rgba(138, 83, 43, 0.08)',
                borderRadius: '2px',
              }}
            >
              Error Crítico Global · Sistema Biomecánico
            </span>

            <h1
              style={{
                fontSize: '28px',
                lineHeight: 1.25,
                margin: '0 0 16px 0',
                letterSpacing: '-0.02em',
                fontWeight: 600,
                color: '#1A1816',
              }}
            >
              Interrupción en la Plataforma Clínica
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: '#4A4844',
                lineHeight: 1.6,
                margin: '0 0 24px 0',
              }}
            >
              Se ha producido una excepción imprevista en el núcleo de la aplicación. Puedes reiniciar el estado del navegador para recuperar la sesión diagnóstica.
            </p>

            {error.digest && (
              <p
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#7A7670',
                  margin: '0 0 24px 0',
                }}
              >
                Código de diagnóstico: {error.digest}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  backgroundColor: '#1A1816',
                  color: '#F8F6F1',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'background-color 0.2s',
                }}
              >
                Reiniciar Interfaz
              </button>

              <a
                href="/"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#F8F6F1',
                  color: '#1A1816',
                  border: '1px solid #D5CEBF',
                  padding: '12px 20px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderRadius: '2px',
                }}
              >
                Volver al Inicio
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
