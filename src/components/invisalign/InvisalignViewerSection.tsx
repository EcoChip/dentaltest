'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const InvisalignLightViewer = dynamic(
  () => import('@/components/canvas/InvisalignLightViewer').then((mod) => mod.InvisalignLightViewer),
  { ssr: false }
);

export function InvisalignViewerSection() {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hasWebGL = true;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      hasWebGL = false;
    }

    if (prefersReducedMotion || !hasWebGL) {
      setUseFallback(true);
    }
  }, []);

  if (useFallback) {
    return (
      <div className="w-full h-full relative bg-surface border border-line-strong rounded-xs overflow-hidden shadow-card flex flex-col justify-center items-center p-6">
        <img
          src="/images/hero-fallback-arch.png"
          alt="Modelo tridimensional de arcadas en oclusión SmartTrack®"
          className="w-full max-h-[360px] object-contain"
        />
        <span className="text-[10px] font-mono text-ink-muted mt-2">
          Representación estática oclusal · Modelo anatómico SmartTrack®
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <InvisalignLightViewer />
    </div>
  );
}
