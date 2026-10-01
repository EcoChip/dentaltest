import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clínica Dental Volta & Asociados',
    short_name: 'Clínica Volta',
    description:
      'Odontología estética de precisión, ortodoncia invisible Invisalign® y biomecánica computacional en Madrid.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F6F1',
    theme_color: '#F8F6F1',
    lang: 'es',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
