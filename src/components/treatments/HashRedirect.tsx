'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HASH_REDIRECT_MAP } from '@/content/treatments';

/**
 * Componente silencioso de redirección por hash para compatibilidad retrospectiva.
 * Redirige URLs heredadas como `/tratamientos#carillas-porcelana` hacia sus
 * rutas limpias canónicas correspondientes (`/tratamientos/carillas-de-porcelana`)
 * de forma inmediata en cliente, sin parpadeos visuales ni errores 404.
 */
export function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;

      const targetUrl = HASH_REDIRECT_MAP[hash];
      if (targetUrl) {
        router.replace(targetUrl);
      }
    };

    // Evaluar inmediatamente tras el montaje en el cliente
    handleHash();

    // Evaluar en caso de cambios dinámicos del hash
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [router]);

  return null;
}
