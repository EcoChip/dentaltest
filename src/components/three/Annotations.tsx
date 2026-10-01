'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';

export interface AnnotationItem {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number]; // Coordenadas mundiales 3D
}

export const ANNOTATIONS_DATA: AnnotationItem[] = [
  {
    id: 'ann-1',
    title: 'Fuerza Biomecánica Constante',
    subtitle: 'Micro-desplazamiento de 0,2 mm por férula',
    position: [0.36, 0.12, 0.32],
  },
  {
    id: 'ann-2',
    title: 'Margen Gingival Festoneado',
    subtitle: 'Corte individualizado sin presión en encía',
    position: [0.0, 0.30, 0.42],
  },
  {
    id: 'ann-3',
    title: 'Ajuste Oclusal Céntrico',
    subtitle: 'Preservación de la guía canina Clase I',
    position: [-0.38, -0.16, -0.15],
  },
];

export interface AnnotationsHandles {
  updatePositions: (
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
    modelMatrix?: THREE.Matrix4
  ) => void;
  setGlobalOpacity: (opacity: number) => void;
}

export const Annotations = forwardRef<AnnotationsHandles, { className?: string }>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const globalOpacityRef = useRef(0);

  const tempVec = useRef(new THREE.Vector3());

  useImperativeHandle(ref, () => ({
    setGlobalOpacity: (opacity: number) => {
      globalOpacityRef.current = opacity;
      if (containerRef.current) {
        containerRef.current.style.opacity = `${opacity}`;
        containerRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      }
    },
    updatePositions: (
      camera: THREE.PerspectiveCamera,
      width: number,
      height: number,
      modelMatrix?: THREE.Matrix4
    ) => {
      if (globalOpacityRef.current <= 0.01) return;

      ANNOTATIONS_DATA.forEach((item, idx) => {
        const el = itemRefs.current[idx];
        if (!el) return;

        tempVec.current.set(item.position[0], item.position[1], item.position[2]);
        if (modelMatrix) {
          tempVec.current.applyMatrix4(modelMatrix);
        }
        tempVec.current.project(camera);

        // Si el punto queda detrás de la cámara (z > 1) o fuera de pantalla
        const isBehind = tempVec.current.z > 1;
        const isOffscreen =
          tempVec.current.x < -1.15 ||
          tempVec.current.x > 1.15 ||
          tempVec.current.y < -1.15 ||
          tempVec.current.y > 1.15;

        if (isBehind || isOffscreen) {
          el.style.opacity = '0';
          return;
        }

        // Convertir coordenadas normalizadas [-1, 1] a píxeles de pantalla
        const screenX = (tempVec.current.x * 0.5 + 0.5) * width;
        const screenY = (-(tempVec.current.y * 0.5) + 0.5) * height;

        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
        el.style.opacity = `${globalOpacityRef.current}`;
      });
    },
  }));

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 overflow-hidden"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {ANNOTATIONS_DATA.map((item, idx) => (
        <div
          key={item.id}
          ref={(node) => {
            itemRefs.current[idx] = node;
          }}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2 transition-transform duration-75 ease-out"
        >
          {/* Marcador óptico quirúrgico con halo clínico */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping absolute opacity-70" />
            <span className="w-2 h-2 rounded-full bg-accent relative z-10" />
          </div>

          {/* Línea conectora fina */}
          <div className="w-4 sm:w-6 h-[1px] bg-accent/60" />

          {/* Tarjeta de información editorial */}
          <div className="bg-canvas/95 border border-line-strong px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xs shadow-card backdrop-blur-md whitespace-nowrap text-left">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-clinical font-semibold text-ink block leading-none mb-0.5">
              {item.title}
            </span>
            <span className="text-[8px] sm:text-[9px] text-ink-secondary hidden sm:block leading-none">
              {item.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});

Annotations.displayName = 'Annotations';
