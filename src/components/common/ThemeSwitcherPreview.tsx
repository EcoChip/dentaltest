'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Sun, Sparkles } from 'lucide-react';

/**
 * Conmutador de Temas Visuales (Fase 7 - Review Mode)
 * Permite alternar entre ?theme=A (Luminoso y natural) y ?theme=B (Editorial premium aligerado).
 * Demuestra que la transición ocurre 100% a través de tokens sin tocar componentes.
 */
export function ThemeSwitcherPreview() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState<'A' | 'B'>('A');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const themeParam = searchParams.get('theme');
    if (themeParam === 'A' || themeParam === 'B') {
      setCurrentTheme(themeParam);
      document.documentElement.setAttribute('data-theme', themeParam);
      try {
        localStorage.setItem('cala_theme_choice', themeParam);
      } catch (e) {}
    } else {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('cala_theme_choice') : null;
      const effectiveTheme = saved === 'B' ? 'B' : 'A';
      setCurrentTheme(effectiveTheme);
      document.documentElement.setAttribute('data-theme', effectiveTheme);
    }
  }, [searchParams]);

  const switchTheme = (targetTheme: 'A' | 'B') => {
    setCurrentTheme(targetTheme);
    document.documentElement.setAttribute('data-theme', targetTheme);
    try {
      localStorage.setItem('cala_theme_choice', targetTheme);
    } catch (e) {}

    // Actualizar URL conservando la ruta actual
    const params = new URLSearchParams(searchParams.toString());
    params.set('theme', targetTheme);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!mounted) return null;

  return (
    <aside
      aria-label="Selector de tema visual de dirección de arte"
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[999] pointer-events-auto"
    >
      <div className="flex items-center space-x-1 p-1 bg-surface-elevated/95 backdrop-blur-md border border-line-strong rounded-btn shadow-lifted">
        <button
          type="button"
          onClick={() => switchTheme('A')}
          className={`touch-target px-3 py-1.5 rounded-btn text-xs font-medium transition-all flex items-center space-x-1.5 ${
            currentTheme === 'A'
              ? 'bg-btn-primary text-btn-primary-text shadow-subtle'
              : 'text-ink-secondary hover:text-ink'
          }`}
          aria-pressed={currentTheme === 'A'}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Tema A (Natural)</span>
        </button>

        <button
          type="button"
          onClick={() => switchTheme('B')}
          className={`touch-target px-3 py-1.5 rounded-btn text-xs font-medium transition-all flex items-center space-x-1.5 ${
            currentTheme === 'B'
              ? 'bg-btn-primary text-btn-primary-text shadow-subtle'
              : 'text-ink-secondary hover:text-ink'
          }`}
          aria-pressed={currentTheme === 'B'}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tema B (Editorial)</span>
        </button>
      </div>
    </aside>
  );
}
