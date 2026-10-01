import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Componente seguro para inyectar datos estructurados JSON-LD.
 * Sanea la serialización para neutralizar cualquier posibilidad de inyección XSS
 * mediante secuencias de escape Unicode (\u003c, \u003e, \u0026).
 */
export function JsonLd({ data }: JsonLdProps) {
  const sanitizedJson = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedJson }}
    />
  );
}
