import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { brandConfig } from '@/config/brand';
import { siteContent } from '@/content/site';
import {
  BLOG_POSTS,
  BLOG_SLUGS,
  getBlogPostBySlug,
} from '@/content/blog';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  getBreadcrumbSchema,
  getMedicalArticleSchema,
} from '@/lib/seo/schema';
import {
  Clock,
  Calendar,
  User,
  ArrowUpRight,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: `Artículo no encontrado | ${brandConfig.shortName}`,
    };
  }

  const canonicalUrl = `${brandConfig.url}/blog/${post.slug}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.isoDate,
      authors: [post.author.name],
      section: post.category,
      siteName: brandConfig.name,
      locale: 'es_ES',
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Divulgación Clínica', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);
  const articleSchema = getMedicalArticleSchema({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    publishedDate: post.isoDate,
    authorName: post.author.name,
    authorId: post.author.id,
    category: post.category,
  });

  const relatedArticles = post.relatedArticlesSlugs
    .map((s) => getBlogPostBySlug(s))
    .filter(Boolean);

  return (
    <div className="pt-28 lg:pt-36 pb-24 bg-canvas text-ink">
      {/* Datos Estructurados JSON-LD */}
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />

      <article className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Migas de Pan Visibles & Accesibles */}
        <nav
          aria-label="Ruta de navegación"
          className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-ink-muted mb-6"
        >
          <Link href="/" className="hover:text-ink transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3 text-line-strong" />
          <Link href="/blog" className="hover:text-ink transition-colors">
            Divulgación
          </Link>
          <ChevronRight className="w-3 h-3 text-line-strong" />
          <span className="text-accent font-medium truncate max-w-[200px] sm:max-w-none">
            {post.category}
          </span>
        </nav>

        {/* CABECERA DEL ARTÍCULO */}
        <header className="max-w-4xl mb-16 pb-12 border-b border-line-subtle space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
              {post.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-ink-secondary leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Barra de Metadatos Facultativos */}
          <div className="pt-4 flex flex-wrap items-center gap-y-4 gap-x-8 text-xs text-ink-muted border-t border-line-subtle">
            {/* Autor */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-surface border border-line-strong flex items-center justify-center text-accent font-serif font-bold text-xs">
                {post.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .filter((_, i) => i === 1 || i === 2)
                  .join('')}
              </div>
              <div>
                <Link
                  href={post.author.profileHref}
                  className="font-medium text-ink hover:text-accent transition-colors block"
                >
                  {post.author.name}
                </Link>
                <span className="text-[11px] text-ink-muted block">
                  {post.author.title.split(' · ')[0]}
                </span>
              </div>
            </div>

            {/* Fecha y Revisión */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <div>
                <span className="block text-ink">{post.publishedDate}</span>
                <span className="text-[10px] text-ink-muted block font-mono">
                  {post.reviewedDate}
                </span>
              </div>
            </div>

            {/* Tiempo de Lectura */}
            <div className="flex items-center space-x-1.5 font-mono text-ink">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>{post.readTime} de lectura</span>
            </div>
          </div>
        </header>

        {/* CUERPO DEL ARTÍCULO (GRID 12 COLS: 4 TOC + 8 CONTENIDO) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Columna Izquierda: Tabla de Contenidos Sticky (4 cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <TableOfContents items={post.toc} />

            {/* Tarjeta de Consulta Breve */}
            <div className="p-6 bg-surface border border-line-subtle rounded-xs space-y-4 shadow-subtle">
              <div className="flex items-center space-x-2 text-ink">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-xs uppercase tracking-clinical font-semibold">
                  Consulta Facultativa
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                ¿Tienes dudas sobre este procedimiento aplicado a tu caso clínico particular?
              </p>
              <Link
                href={`/contacto?tema=${post.slug}`}
                className="touch-target w-full text-center text-xs uppercase tracking-clinical py-2.5 bg-ink text-canvas hover:bg-accent rounded-xs transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <span>Pedir cita médica</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-canvas" />
              </Link>
            </div>
          </aside>

          {/* Columna Derecha: Contenido Clínico Detallado (8 cols) */}
          <main className="lg:col-span-8 space-y-16">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32 space-y-6">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight pt-2 border-t border-line-subtle">
                  {section.title}
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-ink-secondary leading-relaxed font-normal">
                  {section.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Callouts Clínicos */}
                {section.callout && (
                  <div
                    className={`p-6 rounded-xs border flex items-start space-x-4 shadow-subtle ${
                      section.callout.type === 'warning'
                        ? 'bg-amber-50/50 border-amber-300/80 text-amber-950'
                        : section.callout.type === 'evidence'
                        ? 'bg-accent-soft/40 border-accent/30 text-ink'
                        : 'bg-surface border-line-strong text-ink'
                    }`}
                  >
                    {section.callout.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    ) : section.callout.type === 'evidence' ? (
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 text-xs">
                      <strong className="font-serif text-sm block tracking-tight">
                        {section.callout.title}
                      </strong>
                      <p className="leading-relaxed opacity-90">
                        {section.callout.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tablas Comparativas Técnicas */}
                {section.table && (
                  <div className="overflow-x-auto my-6 border border-line-subtle rounded-xs bg-surface shadow-subtle">
                    <table className="w-full text-left text-xs">
                      {section.table.caption && (
                        <caption className="p-3 text-[11px] font-mono text-ink-muted text-left border-b border-line-subtle bg-canvas">
                          {section.table.caption}
                        </caption>
                      )}
                      <thead>
                        <tr className="bg-canvas border-b border-line-strong text-ink uppercase tracking-clinical text-[10px]">
                          {section.table.headers.map((h, idx) => (
                            <th key={idx} className="p-3.5 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line-subtle text-ink-secondary">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-canvas/50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3.5">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}

            {/* TRATAMIENTOS RELACIONADOS CON EL ARTÍCULO */}
            <div className="pt-8 border-t border-line-strong space-y-4">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block">
                Aplicación Práctica en Clínica
              </span>
              <h3 className="font-serif text-2xl text-ink tracking-tight">
                Tratamientos vinculados a este artículo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {post.relatedTreatments.map((rt) => (
                  <Link
                    key={rt.href}
                    href={rt.href}
                    className="p-5 bg-surface border border-line-subtle hover:border-line-strong rounded-xs shadow-subtle group transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-serif text-lg text-ink group-hover:text-accent transition-colors mb-1">
                        {rt.title}
                      </h4>
                      <p className="text-xs text-ink-secondary leading-relaxed">
                        {rt.description}
                      </p>
                    </div>
                    <div className="pt-4 mt-3 border-t border-line-subtle flex items-center justify-between text-xs text-accent font-medium uppercase tracking-clinical">
                      <span>Ver protocolo clínico</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CAJA DE AUTOR FACULTATIVO */}
            <div className="bg-surface border border-line-strong p-8 rounded-xs shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line-subtle">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-canvas border border-line-strong flex items-center justify-center text-accent font-serif font-bold text-lg">
                    {post.author.name
                      .split(' ')
                      .map((n) => n[0])
                      .filter((_, i) => i === 1 || i === 2)
                      .join('')}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block">
                      Autor Facultativo
                    </span>
                    <h3 className="font-serif text-xl text-ink">
                      {post.author.name}
                    </h3>
                    <span className="text-xs text-ink-muted">
                      {post.author.collegiateNumber} · {post.author.college}
                    </span>
                  </div>
                </div>

                <Link
                  href={post.author.profileHref}
                  className="touch-target px-4 py-2 border border-line-subtle hover:border-accent text-xs uppercase tracking-clinical text-ink rounded-xs font-medium transition-colors shrink-0"
                >
                  Ver trayectoria médica →
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {post.author.bioSummary}
              </p>
            </div>

            {/* FORMULARIO DE NEWSLETTER EMBEBIDO */}
            <NewsletterForm sourceLocation="article_bottom" />

            {/* ARTÍCULOS RELACIONADOS RECOMENDADOS */}
            {relatedArticles.length > 0 && (
              <div className="pt-8 border-t border-line-subtle space-y-6">
                <h3 className="font-serif text-2xl text-ink tracking-tight">
                  Otras lecturas recomendadas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => {
                    if (!rel) return null;
                    return (
                      <Link
                        key={rel.slug}
                        href={`/blog/${rel.slug}`}
                        className="group p-6 bg-surface border border-line-subtle hover:border-line-strong rounded-xs shadow-subtle transition-all duration-200 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block">
                            {rel.category}
                          </span>
                          <h4 className="font-serif text-lg text-ink group-hover:text-accent transition-colors leading-snug">
                            {rel.title}
                          </h4>
                          <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                            {rel.excerpt}
                          </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-line-subtle flex items-center justify-between text-xs text-ink-muted group-hover:text-accent">
                          <span className="font-mono text-[11px]">{rel.readTime}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ENLACE DE VUELTA AL BLOG */}
        <div className="mt-16 pt-8 border-t border-line-subtle flex items-center justify-between">
          <Link
            href="/blog"
            className="touch-target inline-flex items-center space-x-2 text-xs uppercase tracking-clinical text-ink hover:text-accent font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a todos los artículos</span>
          </Link>

          <Link
            href="/contacto"
            className="touch-target inline-flex items-center space-x-2 text-xs uppercase tracking-clinical text-accent hover:text-ink font-medium transition-colors"
          >
            <span>Reservar primera visita en clínica</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
