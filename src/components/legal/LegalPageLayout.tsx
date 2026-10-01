'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { legalConfig } from '@/content/legal';

interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  cookiesTable?: Array<{
    name: string;
    provider: string;
    purpose: string;
    duration: string;
    type: string;
  }>;
}

interface LegalPageLayoutProps {
  title: string;
  lawSubtitle: string;
  sections: LegalSection[];
  activeRoute: string;
}

export function LegalPageLayout({
  title,
  lawSubtitle,
  sections,
  activeRoute,
}: LegalPageLayoutProps) {
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div className="pt-28 lg:pt-36 pb-24 bg-canvas text-ink">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Aviso visible de borrador en entorno de desarrollo / revisión legal */}
        <aside
          className="mb-8 p-4 bg-amber-500/10 border border-amber-800/20 rounded-xs text-amber-900 flex items-start space-x-3 text-xs leading-relaxed"
          aria-label="Aviso de borrador legal"
        >
          <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block uppercase tracking-clinical text-[11px] text-amber-900">
              {legalConfig.warningNotice}
            </strong>
            <span>
              Este documento contiene marcadores explícitos indicados como{' '}
              <code className="bg-canvas px-1.5 py-0.5 rounded-xs border border-line-subtle font-mono text-[11px]">
                [COMPLETAR: ...]
              </code>
              . La clínica no debe publicar este texto sin la validación previa de su delegado de protección de datos o asesor legal colegiado.
            </span>
          </div>
        </aside>

        {/* Cabecera y Miga de Pan */}
        <div className="mb-10">
          <nav aria-label="Miga de pan" className="flex items-center space-x-2 text-xs uppercase tracking-clinical text-ink-muted mb-4">
            <Link href="/" className="hover:text-accent transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3 text-line-strong" />
            <span className="text-ink font-medium">{title}</span>
          </nav>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink tracking-tight mb-3">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-secondary">
            <span className="font-sans text-accent font-medium">{lawSubtitle}</span>
            <span className="text-line-strong">•</span>
            <div className="inline-flex items-center space-x-1.5 text-ink-muted">
              <Clock className="w-3.5 h-3.5" />
              <span>Última actualización: {legalConfig.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Menú de pestañas entre documentos legales */}
        <div className="mb-10 flex border-b border-line-subtle text-xs uppercase tracking-clinical">
          <Link
            href="/aviso-legal"
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px ${
              activeRoute === '/aviso-legal'
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            Aviso Legal
          </Link>
          <Link
            href="/privacidad"
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px ${
              activeRoute === '/privacidad'
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            Política de Privacidad
          </Link>
          <Link
            href="/cookies"
            className={`pb-3 px-4 font-medium transition-colors border-b-2 -mb-px ${
              activeRoute === '/cookies'
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            Política de Cookies
          </Link>
        </div>

        {/* Índice interactivo con anclas */}
        <div className="mb-12 p-6 bg-surface border border-line-subtle rounded-xs shadow-subtle">
          <span className="text-[10px] uppercase tracking-clinical font-semibold text-ink-muted block mb-3">
            Índice de Contenidos
          </span>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {sections.map((sec, idx) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="text-ink hover:text-accent transition-colors flex items-center space-x-2"
                >
                  <span className="font-mono text-ink-muted text-[11px]">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="underline underline-offset-2">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Cuerpo del documento con ancho de lectura confortable (<= 75 caracteres) */}
        <article className="max-w-[72ch] space-y-12 text-sm text-ink-secondary leading-relaxed font-sans">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-36 space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl text-ink tracking-tight border-b border-line-subtle pb-2">
                {sec.title}
              </h2>

              {sec.paragraphs &&
                sec.paragraphs.map((p, pIdx) => {
                  // Destacar marcadores [COMPLETAR: ...]
                  const parts = p.split(/(\[COMPLETAR:[^\]]+\])/g);
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('[COMPLETAR:')) {
                          return (
                            <mark
                              key={partIdx}
                              className="bg-amber-500/20 text-amber-950 font-mono text-[12px] px-1.5 py-0.5 rounded-xs border border-amber-500/40"
                            >
                              {part}
                            </mark>
                          );
                        }
                        return part;
                      })}
                    </p>
                  );
                })}

              {sec.cookiesTable && (
                <div className="overflow-x-auto my-6 border border-line-strong rounded-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface border-b border-line-strong text-[11px] uppercase tracking-clinical text-ink font-semibold">
                        <th className="p-3">Nombre</th>
                        <th className="p-3">Proveedor</th>
                        <th className="p-3">Finalidad</th>
                        <th className="p-3">Duración</th>
                        <th className="p-3">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-subtle">
                      {sec.cookiesTable.map((cookie) => (
                        <tr key={cookie.name} className="hover:bg-surface/50 transition-colors">
                          <td className="p-3 font-mono text-[11px] font-medium text-ink">{cookie.name}</td>
                          <td className="p-3">{cookie.provider}</td>
                          <td className="p-3 leading-relaxed">{cookie.purpose}</td>
                          <td className="p-3 font-mono text-[11px]">{cookie.duration}</td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-clinical rounded-xs font-medium bg-surface border border-line-subtle">
                              {cookie.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
