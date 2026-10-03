import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Newsreader, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { clinicConfig } from '@/config/clinic.config';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PersistentMobileCTA } from '@/components/layout/PersistentMobileCTA';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { CookieBanner } from '@/components/common/CookieBanner';
import { PageTransition } from '@/components/layout/PageTransition';
import { JsonLd } from '@/components/seo/JsonLd';
import { getClinicSchema, getWebSiteSchema } from '@/lib/seo/schema';
import { ThemeSwitcherPreview } from '@/components/common/ThemeSwitcherPreview';

// TEMA A: Serif cálido de bajo contraste, orgánico y humano (Newsreader)
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif-warm',
  display: 'swap',
});

// TEMA B: Serif editorial clásico aligerado (Playfair Display)
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif-editorial',
  display: 'swap',
});

// Tipografía Sans médica humanista y legible para ambos temas
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF7' },
    { media: '(prefers-color-scheme: dark)', color: '#162022' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { brandConfig } from '@/config/brand';
import { getRobotsMetadata } from '@/lib/seo/indexing';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || brandConfig.url),
  title: {
    default: `${clinicConfig.name} · Ortodoncia Invisible & Estética Dental en Madrid`,
    template: `%s | ${clinicConfig.name}`,
  },
  description:
    `Clínica dental de alta especialización en ortodoncia invisible Invisalign®, carillas cerámicas biomiméticas e implantología guiada. Dirección médica por la ${clinicConfig.medicalDirector.name}.`,
  keywords: [
    'ortodoncia invisible madrid',
    'invisalign madrid serrano',
    'clinica dental estetica madrid',
    'carillas de porcelana feldespatica',
    'implantologia guiada 3d',
    'clinica dental barrio salamanca',
  ],
  authors: [{ name: clinicConfig.medicalDirector.name }],
  robots: getRobotsMetadata(),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: brandConfig.url,
    siteName: clinicConfig.name,
    title: `${clinicConfig.name} · Ortodoncia Invisible de Alta Precisión`,
    description: clinicConfig.claim,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${clinicConfig.name} - Gabinete Dental y Ortodoncia 3D`,
      },
    ],
  },
  alternates: {
    canonical: brandConfig.url,
  },
  manifest: '/manifest.webmanifest',
  twitter: {
    card: 'summary_large_image',
    title: `${clinicConfig.name} · Ortodoncia Invisible & Estética Dental en Madrid`,
    description: clinicConfig.claim,
    site: brandConfig.social.twitter,
    creator: brandConfig.social.twitter,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clinicSchema = getClinicSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${playfair.variable} ${plusJakarta.variable}`}
      data-theme="A"
    >
      <head>
        {/* Sincronización Inmediata del Tema Visual (?theme=A o ?theme=B) sin parpadeo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var params = new URLSearchParams(window.location.search);
                  var theme = params.get('theme');
                  if (theme === 'A' || theme === 'B') {
                    localStorage.setItem('cala_theme_choice', theme);
                    document.documentElement.setAttribute('data-theme', theme);
                  } else {
                    var saved = localStorage.getItem('cala_theme_choice');
                    document.documentElement.setAttribute('data-theme', (saved === 'B' ? 'B' : 'A'));
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'A');
                }
              })();
            `,
          }}
        />
        {/* Google Analytics 4 Consent Mode v2 (Estado 'denied' por defecto según RGPD / AEPD) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted'
              });
            `,
          }}
        />
        {/* Datos Estructurados Schema.org Seguros (XSS-sanitized) */}
        <JsonLd data={clinicSchema} />
        <JsonLd data={webSiteSchema} />
      </head>
      <body className="font-sans bg-canvas text-ink antialiased selection:bg-accent selection:text-white">
        {/* Capa de textura analógica sutil */}
        <div className="analog-grain" aria-hidden="true" />

        {/* Cursor personalizado de precisión para escritorio */}
        <CustomCursor />

        {/* Proveedor de Scroll Suave sincronizado con GSAP */}
        <SmoothScrollProvider>
          <Header />
          <PageTransition>
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </PageTransition>
          <Footer />
          <PersistentMobileCTA />
          <CookieBanner />
          <Suspense fallback={null}>
            <ThemeSwitcherPreview />
          </Suspense>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
