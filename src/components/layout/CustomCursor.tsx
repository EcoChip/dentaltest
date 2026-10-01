'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Activar solo en escritorio con puntero preciso
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = !!target.closest('a, button, input, select, textarea, [data-cursor]');
      setHovered(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', checkHover, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Animación de seguimiento suave para el halo
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
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-ink rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${clicked ? 0.7 : hovered ? 0 : 1})`,
        }}
      />
      {/* Halo óptico quirúrgico con retardo */}
      <div
        className="fixed top-0 left-0 rounded-full border border-ink/40 -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color] duration-200 ease-out"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
          width: hovered ? '44px' : '26px',
          height: hovered ? '44px' : '26px',
          backgroundColor: hovered ? 'rgba(28, 78, 94, 0.12)' : 'transparent',
          borderColor: hovered ? 'rgba(28, 78, 94, 0.6)' : 'rgba(18, 19, 20, 0.35)',
        }}
      />
    </div>
  );
}
