'use client';

import React, { useEffect, useState } from 'react';
import { isMotionDisabled } from '@/config/motion';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  useEffect(() => {
    // Activar solo en escritorio con puntero preciso y sin reducción de movimiento
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || isMotionDisabled()) return;

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]');
      const cursorAttr = cursorTarget?.getAttribute('data-cursor');

      if (cursorAttr === 'view' || cursorAttr === 'ver') {
        setCursorLabel('Ver');
        setHovered(true);
      } else if (cursorAttr === 'drag' || cursorAttr === 'arrastra') {
        setCursorLabel('Arrastra');
        setHovered(true);
      } else {
        const isInteractive = !!target.closest('a, button, input, select, textarea');
        setCursorLabel(null);
        setHovered(isInteractive);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', checkHover, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Animación de seguimiento suave para el halo (RAF lerp)
    let animId: number;
    const followCursor = () => {
      setTrailingPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animId = requestAnimationFrame(followCursor);
    };
    animId = requestAnimationFrame(followCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', checkHover);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* Punto de precisión central */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-ink rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${clicked ? 0.7 : hovered ? 0 : 1})`,
        }}
      />
      {/* Halo óptico quirúrgico con retardo y aceleración GPU mediante scale */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) scale(${
            cursorLabel ? 2.2 : hovered ? 1.45 : clicked ? 0.85 : 1
          })`,
          backgroundColor: cursorLabel
            ? 'rgba(36, 99, 93, 0.92)'
            : hovered
            ? 'rgba(36, 99, 93, 0.12)'
            : 'transparent',
          borderColor: cursorLabel
            ? 'transparent'
            : hovered
            ? 'rgba(36, 99, 93, 0.6)'
            : 'rgba(22, 32, 34, 0.35)',
        }}
      >
        {cursorLabel && (
          <span className="text-[7px] uppercase font-mono tracking-wider font-bold text-white select-none animate-in fade-in duration-150">
            {cursorLabel}
          </span>
        )}
      </div>
    </div>
  );
}
