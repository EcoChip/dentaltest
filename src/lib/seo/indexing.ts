/**
 * CONTROL DE INDEXACIÓN Y AMBIENTES (SEO DEMO / PRODUCCIÓN)
 *
 * Evita la indexación accidental de entornos de prueba, ramas de preview
 * o despliegues intermedios en *.vercel.app (ej. dentaltest-gamma.vercel.app).
 * Solo permite indexación en el dominio de producción definitivo (clinicacala.es)
 * salvo forzado explícito mediante NEXT_PUBLIC_FORCE_INDEXING=true.
 */

export function isIndexingAllowed(): boolean {
  // 1. Bloqueo explícito por variable de entorno
  if (process.env.NEXT_PUBLIC_BLOCK_INDEXING === 'true') {
    return false;
  }

  // 2. Entornos de preview en Vercel
  if (process.env.VERCEL_ENV === 'preview') {
    return false;
  }

  // 3. Forzado explícito para producción
  if (process.env.NEXT_PUBLIC_FORCE_INDEXING === 'true') {
    return true;
  }

  // 4. Comprobación exhaustiva de variables de despliegue en Vercel
  const urlsToCheck = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
  ].filter(Boolean) as string[];

  // Si cualquier indicador apunta a vercel.app o dentaltest -> es demo -> bloquear indexación
  for (const url of urlsToCheck) {
    if (url.includes('vercel.app') || url.includes('dentaltest')) {
      return false;
    }
  }

  // 5. Solo indexar si apunta con exactitud al dominio canónico definitivo
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return siteUrl === 'https://clinicacala.es' || siteUrl === 'https://www.clinicacala.es';
}

export function getRobotsMetadata() {
  const allow = isIndexingAllowed();

  if (!allow) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'none' as const,
        'max-snippet': -1,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  };
}
