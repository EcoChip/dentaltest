import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { brandConfig } from '@/config/brand';
import { siteContent } from '@/content/site';
import { BLOG_POSTS } from '@/content/blog';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';
import { ChevronRight, Calendar, ArrowUpRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: `Blog Clínico & Divulgación Odontológica | ${brandConfig.shortName}`,
  description:
    'Artículos clínicos sobre biomecánica de alineadores, carillas cerámicas biomiméticas, implantología guiada y preservación dental en Madrid.',
  alternates: {
    canonical: `${brandConfig.url}/blog`,
  },
  openGraph: {
    title: `Blog Clínico & Divulgación Odontológica | ${brandConfig.shortName}`,
    description:
      'Artículos clínicos sobre biomecánica de alineadores, carillas cerámicas biomiméticas, implantología guiada y preservación dental.',
    url: `${brandConfig.url}/blog`,
    type: 'website',
    siteName: brandConfig.name,
    locale: 'es_ES',
  },
};

export default function BlogIndexPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Divulgación Clínica & Blog', path: '/blog' },
  ]);

  const blogCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${brandConfig.url}/blog#blog`,
    name: `Divulgación Clínica y Criterio Odontológico · ${brandConfig.name}`,
    description:
      'Artículos de divulgación médica especializada sobre ortodoncia invisible, biomimética cerámica, implantología guiada y salud bucal.',
    url: `${brandConfig.url}/blog`,
    publisher: {
      '@type': 'MedicalBusiness',
      name: brandConfig.name,
      url: brandConfig.url,
      logo: `${brandConfig.url}/apple-icon`,
    },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${brandConfig.url}/blog/${post.slug}`,
      datePublished: post.isoDate,
      author: {
        '@type': 'Physician',
        name: post.author.name,
      },
    })),
  };

  return (
    <div className="pt-28 lg:pt-36 pb-24 bg-canvas text-ink">
      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={blogCollectionSchema} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Migas de Pan Visibles & Accesibles */}
        <nav
          aria-label="Ruta de navegación"
          className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-ink-muted mb-6"
        >
          <Link href="/" className="hover:text-ink transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3 text-line-strong" />
          <span className="text-accent font-medium">Divulgación Clínica</span>
        </nav>

        {/* Cabecera Editorial */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
              Criterio Facultativo & Biomecánica
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight mb-6 leading-[1.08]">
            Divulgación Médica & Odontología de Precisión
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Análisis biomecánicos, comparativas de materiales y fundamentación biológica redactados directamente por nuestro cuadro médico. Explicaciones rigurosas y comprensibles para tomar decisiones clínicas con criterio e información veraz.
          </p>
        </div>

        {/* Listado con Filtro Interactivo de Categorías */}
        <div className="mb-24">
          <CategoryFilter posts={BLOG_POSTS} />
        </div>

        {/* Módulo de Newsletter Integrado */}
        <div className="mb-24">
          <NewsletterForm sourceLocation="blog_index" />
        </div>

        {/* CTA Final de Consulta */}
        <div className="bg-surface border border-line-strong p-8 sm:p-12 rounded-xs shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-2">
              ¿Deseas una valoración clínica individualizada?
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              En tu primera visita realizamos un estudio diagnóstico completo con escáner intraoral 3D para definir el tratamiento idóneo según tu anatomía.
            </p>
          </div>

          <Link
            href="/contacto"
            className="touch-target px-8 py-4 bg-ink text-canvas hover:bg-accent text-xs uppercase tracking-clinical rounded-xs font-medium transition-colors shrink-0 flex items-center space-x-2 shadow-subtle group"
          >
            <Calendar className="w-4 h-4 text-canvas" />
            <span>{siteContent.ctas.primary}</span>
            <ArrowUpRight className="w-4 h-4 text-canvas/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
