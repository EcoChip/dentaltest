import type { MetadataRoute } from 'next';
import { brandConfig } from '@/config/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brandConfig.tradeName,
    short_name: brandConfig.shortName,
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
