'use client';

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { CLINICAL_ANCHORS, AnnotationAnchor } from '@/config/anchors';
import type { ArchModelHandles } from './ArchModel';

export interface AnnotationsHandles {
  updatePositions: (
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
    archModelHandles: ArchModelHandles
  ) => void;
  setGlobalOpacity: (opacity: number) => void;
  setActiveAnchorIndex: (index: number) => void;
}

export const Annotations = forwardRef<AnnotationsHandles, { className?: string }>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globalOpacityRef = useRef(0);

  // Modo móvil: ficha activa fija al pie de la escena (1, 2 o 3)
  const [activeMobileAnchor, setActiveMobileAnchor] = useState<number>(0);

  // Refs de marcadores DOM (puntos en pantalla)
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Refs de carteles editoriales (desktop)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Refs de trazados SVG (líneas con codo)
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const tempVec = useRef(new THREE.Vector3());
  const tempDir = useRef(new THREE.Vector3());

  useImperativeHandle(ref, () => ({
    setGlobalOpacity: (opacity: number) => {
      globalOpacityRef.current = opacity;
      if (containerRef.current) {
        containerRef.current.style.opacity = `${opacity}`;
        containerRef.current.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none';
      }
    },
    setActiveAnchorIndex: (index: number) => {
      if (index >= 0 && index < CLINICAL_ANCHORS.length) {
        setActiveMobileAnchor(index);
      }
    },
    updatePositions: (
      camera: THREE.PerspectiveCamera,
      width: number,
      height: number,
      archModelHandles: ArchModelHandles
    ) => {
      if (globalOpacityRef.current <= 0.01) return;

      const isMobile = width < 1024;
      const margin = isMobile ? 16 : 24;
      const cardWidth = 220;
      const cardHeight = 68;

      CLINICAL_ANCHORS.forEach((item, idx) => {
        const markerEl = markerRefs.current[idx];
        const cardEl = cardRefs.current[idx];
        const pathEl = pathRefs.current[idx];

        if (!markerEl) return;

        // Obtener posición y normal mundiales reales del anclaje hijo de la arcada
        const anchorData = archModelHandles.getAnchorWorldData(idx);
        if (!anchorData) {
          markerEl.style.opacity = '0';
          if (cardEl) cardEl.style.opacity = '0';
          if (pathEl) pathEl.style.opacity = '0';
          return;
        }

        const { position: worldPos, normal: worldNormal } = anchorData;

        // Producto escalar entre normal de superficie y vector visual hacia la cámara
        // Oculta o atenúa suavemente si la cara está de espaldas
        tempDir.current.subVectors(camera.position, worldPos).normalize();
        const dot = worldNormal.dot(tempDir.current);
        const isFacing = dot > -0.05;
        const faceAttenuation = Math.max(0, Math.min(1, (dot + 0.05) / 0.18));

        // Proyectar coordenadas 3D al espacio normalizado de pantalla [-1, 1]
        tempVec.current.copy(worldPos).project(camera);

        const isBehind = tempVec.current.z > 1;
        const isOffscreen =
          tempVec.current.x < -1.15 ||
          tempVec.current.x > 1.15 ||
          tempVec.current.y < -1.15 ||
          tempVec.current.y > 1.15;

        if (isBehind || isOffscreen || !isFacing) {
          markerEl.style.opacity = '0';
          if (cardEl) cardEl.style.opacity = '0';
          if (pathEl) pathEl.style.opacity = '0';
          return;
        }

        // Convertir coordenadas normalizadas a píxeles exactos de pantalla
        const screenX = (tempVec.current.x * 0.5 + 0.5) * width;
        const screenY = (-(tempVec.current.y * 0.5) + 0.5) * height;

        const effectiveOpacity = globalOpacityRef.current * faceAttenuation;

        // 1. Posicionar el marcador táctil / óptico
        markerEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
        markerEl.style.opacity = `${effectiveOpacity}`;

        // 2. En modo móvil: los carteles flotantes no existen (se usa el pie fijo)
        if (isMobile) {
          if (cardEl) cardEl.style.opacity = '0';
          if (pathEl) pathEl.style.opacity = '0';
          return;
        }

        // 3. En modo escritorio: cálculo de zona libre para evitar solapar el alineador
        let targetX = screenX + item.lineOffset[0];
        let targetY = screenY + item.lineOffset[1];

        // Detección de colisión con los bordes de la pantalla (evitar corte lateral a la derecha)
        let flipHorizontal = false;
        if (item.preferredSide === 'right') {
          if (targetX + cardWidth > width - margin) {
            // No cabe a la derecha: voltear hacia la izquierda
            targetX = screenX - 60 - cardWidth;
            flipHorizontal = true;
          }
        } else {
          if (targetX < margin) {
            // No cabe a la izquierda: voltear a la derecha
            targetX = screenX + 60;
            flipHorizontal = true;
          }
        }

        // Delimitar verticalmente dentro del margen del viewport
        targetY = Math.max(margin + 40, Math.min(height - margin - cardHeight, targetY));

        // Actualizar cartel
        if (cardEl) {
          cardEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
          cardEl.style.opacity = `${effectiveOpacity}`;
        }

        // 4. Generar trazado de línea guía en codo (SVG)
        if (pathEl) {
          const elbowX = flipHorizontal
            ? screenX + (item.preferredSide === 'right' ? -35 : 35)
            : screenX + item.lineOffset[0] * 0.45;
          const elbowY = targetY + cardHeight * 0.5;
          const cardAnchorX = flipHorizontal ? targetX + cardWidth : targetX;

          const pathD = `M ${screenX} ${screenY} L ${elbowX} ${elbowY} L ${cardAnchorX} ${elbowY}`;
          pathEl.setAttribute('d', pathD);
          pathEl.style.opacity = `${effectiveOpacity * 0.85}`;
        }
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
      {/* Capa de trazados SVG de líneas guía con codo (Escritorio) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible hidden lg:block">
        {CLINICAL_ANCHORS.map((_, idx) => (
          <path
            key={`path-${idx}`}
            ref={(node) => {
              pathRefs.current[idx] = node;
            }}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            className="transition-opacity duration-150"
          />
        ))}
      </svg>

      {/* Marcadores Anclados sobre el Modelo 3D */}
      {CLINICAL_ANCHORS.map((item, idx) => (
        <div
          key={item.id}
          ref={(node) => {
            markerRefs.current[idx] = node;
          }}
          onClick={() => setActiveMobileAnchor(idx)}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group"
        >
          {/* Vista Escritorio: Punto óptico con anillo sutil */}
          <div className="hidden lg:flex relative items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-accent animate-ping absolute opacity-50" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent border-2 border-canvas relative z-10 shadow-sm transition-transform group-hover:scale-125" />
          </div>

          {/* Vista Móvil / Tablet: Insignia numérica táctil de 28px (1, 2, 3) */}
          <div
            className={`lg:hidden relative flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold shadow-card transition-all ${
              activeMobileAnchor === idx
                ? 'bg-accent text-white ring-2 ring-accent ring-offset-2 scale-110'
                : 'bg-canvas text-ink border border-line-strong'
            }`}
          >
            <span>{item.orderNumber}</span>
          </div>
        </div>
      ))}

      {/* Carteles Editoriales Flotantes (Solo Escritorio ≥ 1024px — Ubicados en zona libre sin tapar) */}
      {CLINICAL_ANCHORS.map((item, idx) => (
        <div
          key={`card-${item.id}`}
          ref={(node) => {
            cardRefs.current[idx] = node;
          }}
          className="hidden lg:block absolute top-0 left-0 bg-canvas border border-line-strong p-3.5 rounded-card shadow-card max-w-[220px] pointer-events-auto text-left"
        >
          <div className="flex items-center space-x-1.5 mb-1">
            <span className="text-[10px] tracking-clinical font-mono font-medium text-accent">
              0{item.orderNumber} · {item.badge}
            </span>
          </div>
          <h4 className="text-[13px] font-medium text-ink tracking-tight leading-snug">
            {item.title}
          </h4>
          <p className="text-[12px] text-ink-secondary leading-snug mt-1">
            {item.description}
          </p>
        </div>
      ))}

      {/* Pie de Escena Fijo en Móvil / Tablet (< 1024px) (No flotante, situado al pie sin tapar el alineador) */}
      <div className="lg:hidden absolute bottom-20 left-4 right-4 max-w-md mx-auto pointer-events-auto bg-canvas border border-line-strong p-4 rounded-card shadow-lifted">
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-line-subtle">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-accent text-canvas text-[11px] font-mono font-bold flex items-center justify-center">
              {CLINICAL_ANCHORS[activeMobileAnchor].orderNumber}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-clinical text-accent font-semibold">
              {CLINICAL_ANCHORS[activeMobileAnchor].badge}
            </span>
          </div>
          <div className="flex space-x-1.5">
            {CLINICAL_ANCHORS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveMobileAnchor(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeMobileAnchor === i ? 'bg-accent w-4' : 'bg-line-strong'
                }`}
                aria-label={`Ver detalle de anclaje ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <h4 className="text-[14px] font-serif text-ink font-normal tracking-tight mb-1">
          {CLINICAL_ANCHORS[activeMobileAnchor].title}
        </h4>
        <p className="text-[12px] text-ink-secondary leading-relaxed">
          {CLINICAL_ANCHORS[activeMobileAnchor].description}
        </p>
      </div>
    </div>
  );
});

Annotations.displayName = 'Annotations';
