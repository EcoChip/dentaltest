import type { MetadataRoute } from 'next';
import { brandConfig } from '@/config/brand';
import { isIndexingAllowed } from '@/lib/seo/indexing';

export default function robots(): MetadataRoute.Robots {
  // Si estamos en un entorno de demo/staging/preview o dominio no canónico, bloquear la indexación de rastreadores
  if (!isIndexingAllowed()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || brandConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
