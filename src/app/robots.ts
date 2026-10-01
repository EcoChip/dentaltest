import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Si estamos en un entorno de staging o preview, bloquear la indexación de rastreadores
  if (process.env.NEXT_PUBLIC_BLOCK_INDEXING === 'true' || process.env.VERCEL_ENV === 'preview') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clinicavolta.es';

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
