import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  trailingSlash: false,

  async redirects() {
    return [
      {
        source: '/ortodoncia-invisible',
        destination: '/invisalign',
        permanent: true,
      },
      {
        source: '/clinica',
        destination: '/equipo',
        permanent: true,
      },
      {
        source: '/doctores',
        destination: '/equipo',
        permanent: true,
      },
      {
        source: '/cita-previa',
        destination: '/contacto',
        permanent: true,
      },
      {
        source: '/pedir-cita',
        destination: '/contacto',
        permanent: true,
      },
      {
        source: '/ubicacion',
        destination: '/contacto',
        permanent: true,
      },
      {
        source: '/politica-de-privacidad',
        destination: '/privacidad',
        permanent: true,
      },
      {
        source: '/politica-de-cookies',
        destination: '/cookies',
        permanent: true,
      },
      {
        source: '/aviso-legal-lssi',
        destination: '/aviso-legal',
        permanent: true,
      },
    ];
  },

  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https://www.google-analytics.com https://*.google.com;
      font-src 'self' https://fonts.gstatic.com data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      frame-src 'self' https://www.google.com https://maps.google.com;
      worker-src 'self' blob:;
      connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
