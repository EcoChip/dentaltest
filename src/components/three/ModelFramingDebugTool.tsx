'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { calculateFraming, MODEL_BBOXES, FramingResult } from '@/lib/three/framing';
import { SCENES_CONFIG } from '@/config/scenes';

export interface FramingParams {
  fitMargin: number;
  safeZoneHeight: number;
  offsetYFactor: number;
  fov: number;
  pose: 'closed' | 'open';
}

export interface FramingMetrics {
  projectedBox: {
    left: number;
    top: number;
    width: number;
    height: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null;
  framingData: FramingResult | null;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * 1. COMPONENTE 3D (Se ejecuta DENTRO del reconciler de Three.js / Canvas)
 * Retorna null en JSX para no colisionar con el árbol R3F.
 */
export function ModelFraming3DHelper() {
  const { camera, size, scene } = useThree();
  const [isDebug, setIsDebug] = useState(false);

  const paramsRef = useRef<FramingParams>({
    fitMargin: 0.07,
    safeZoneHeight: 0.58,
    offsetYFactor: 0.21,
    fov: 33,
    pose: 'closed',
  });

  const helperRef = useRef<THREE.Box3Helper | null>(null);
  const currentBox3Ref = useRef(new THREE.Box3());
  const framingDataRef = useRef<FramingResult | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const active = window.location.search.includes('debug');
    setIsDebug(active);

    if (active) {
      const helper = new THREE.Box3Helper(currentBox3Ref.current, new THREE.Color(0xffaa00));
      scene.add(helper);
      helperRef.current = helper;

      const handleParamChange = (e: Event) => {
        const customEvt = e as CustomEvent<Partial<FramingParams>>;
        if (customEvt.detail) {
          paramsRef.current = { ...paramsRef.current, ...customEvt.detail };
          applyFraming();
        }
      };

      window.addEventListener('cala-framing-param-change', handleParamChange);

      return () => {
        scene.remove(helper);
        window.removeEventListener('cala-framing-param-change', handleParamChange);
      };
    }
  }, [scene]);

  const applyFraming = () => {
    if (!isDebug) return;
    const p = paramsRef.current;
    const res = calculateFraming({
      viewportWidth: size.width,
      viewportHeight: size.height,
      fov: p.fov,
      fitMargin: p.fitMargin,
      safeZoneHeightFraction: p.safeZoneHeight,
      pose: p.pose,
    });

    res.offsetY = Math.round(size.height * p.offsetYFactor);
    framingDataRef.current = res;

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = p.fov;
      camera.near = SCENES_CONFIG.camera.near;
      camera.far = SCENES_CONFIG.camera.far;
      camera.position.z = res.cameraDistance;

      const w = size.width;
      const h = size.height;
      camera.setViewOffset(w, h, res.offsetX, res.offsetY, w, h);
      camera.updateProjectionMatrix();
    }
  };

  useEffect(() => {
    if (isDebug) {
      applyFraming();
    }
  }, [isDebug, size.width, size.height]);

  useFrame(() => {
    if (!isDebug || !(camera instanceof THREE.PerspectiveCamera)) return;

    const p = paramsRef.current;
    const bboxDef = p.pose === 'open' ? MODEL_BBOXES.open : MODEL_BBOXES.closed;
    currentBox3Ref.current.min.set(...bboxDef.min);
    currentBox3Ref.current.max.set(...bboxDef.max);

    if (helperRef.current) {
      helperRef.current.box.copy(currentBox3Ref.current);
    }

    const min = currentBox3Ref.current.min;
    const max = currentBox3Ref.current.max;

    const corners = [
      new THREE.Vector3(min.x, min.y, min.z),
      new THREE.Vector3(min.x, min.y, max.z),
      new THREE.Vector3(min.x, max.y, min.z),
      new THREE.Vector3(min.x, max.y, max.z),
      new THREE.Vector3(max.x, min.y, min.z),
      new THREE.Vector3(max.x, min.y, max.z),
      new THREE.Vector3(max.x, max.y, min.z),
      new THREE.Vector3(max.x, max.y, max.z),
    ];

    let minScreenX = Infinity;
    let maxScreenX = -Infinity;
    let minScreenY = Infinity;
    let maxScreenY = -Infinity;

    const w = size.width;
    const h = size.height;

    corners.forEach((c) => {
      c.project(camera);
      const sx = (c.x * 0.5 + 0.5) * w;
      const sy = (-(c.y * 0.5) + 0.5) * h;

      if (sx < minScreenX) minScreenX = sx;
      if (sx > maxScreenX) maxScreenX = sx;
      if (sy < minScreenY) minScreenY = sy;
      if (sy > maxScreenY) maxScreenY = sy;
    });

    const projectedBox = {
      left: Math.round(minScreenX),
      top: Math.round(minScreenY),
      width: Math.round(maxScreenX - minScreenX),
      height: Math.round(maxScreenY - minScreenY),
      minX: Math.round(minScreenX),
      maxX: Math.round(maxScreenX),
      minY: Math.round(minScreenY),
      maxY: Math.round(maxScreenY),
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<FramingMetrics>('cala-framing-metrics-update', {
          detail: {
            projectedBox,
            framingData: framingDataRef.current,
            viewportWidth: w,
            viewportHeight: h,
          },
        })
      );
    }
  });

  return null;
}

/**
 * 2. OVERLAY DOM (Se ejecuta en React DOM estándar, FUERA del Canvas de Three.js)
 */
export function ModelFramingOverlay() {
  const [isDebug, setIsDebug] = useState(false);
  const [params, setParams] = useState<FramingParams>({
    fitMargin: 0.07,
    safeZoneHeight: 0.58,
    offsetYFactor: 0.21,
    fov: 33,
    pose: 'closed',
  });

  const [metrics, setMetrics] = useState<FramingMetrics>({
    projectedBox: null,
    framingData: null,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 390,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 844,
  });

  const [minimized, setMinimized] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const active = window.location.search.includes('debug');
    setIsDebug(active);

    if (active) {
      const handleMetrics = (e: Event) => {
        const customEvt = e as CustomEvent<FramingMetrics>;
        if (customEvt.detail) {
          setMetrics(customEvt.detail);
        }
      };

      window.addEventListener('cala-framing-metrics-update', handleMetrics);
      return () => {
        window.removeEventListener('cala-framing-metrics-update', handleMetrics);
      };
    }
  }, []);

  const updateParam = <K extends keyof FramingParams>(key: K, value: FramingParams[K]) => {
    const next = { ...params, [key]: value };
    setParams(next);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<Partial<FramingParams>>('cala-framing-param-change', {
          detail: { [key]: value },
        })
      );
    }
  };

  const handleCopyConfig = () => {
    const configToCopy = {
      fitMargin: params.fitMargin,
      offsetY: params.offsetYFactor,
      fov: params.fov,
      safeZoneHeight: params.safeZoneHeight,
      targetOffset: [0, 0, 0],
      cameraDistance: metrics.framingData?.cameraDistance
        ? Math.round(metrics.framingData.cameraDistance * 100) / 100
        : 7.2,
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(configToCopy, null, 2)).catch(() => {});
    }
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (!isDebug) return null;

  const { projectedBox, framingData, viewportWidth, viewportHeight } = metrics;
  const safeBottomPx = Math.round(viewportHeight * params.safeZoneHeight);

  return (
    <>
      {/* 1. VISUALIZACIÓN DE LA ZONA SEGURA DEL MODELO */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none z-[9990] transition-all border-b-2 border-dashed border-emerald-500/90 bg-emerald-500/10 flex flex-col justify-between p-2"
        style={{ height: `${safeBottomPx}px` }}
      >
        <div className="flex items-center justify-between">
          <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight shadow">
            [ZONA SEGURA MODELO 3D: 0 a {safeBottomPx}px ({Math.round(params.safeZoneHeight * 100)}% svh)]
          </span>
          <span className="bg-emerald-950/90 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono">
            Centro Óptico: y={Math.round(safeBottomPx / 2)}px
          </span>
        </div>
        <div className="text-right">
          <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/60 px-2 py-0.5 rounded text-[9px] font-mono">
            Límite inferior zona útil modelo ↓
          </span>
        </div>
      </div>

      {/* 2. PROYECCIÓN 2D DE LA CAJA ENVOLVENTE EN PANTALLA */}
      {projectedBox && (
        <div
          className="fixed pointer-events-none z-[9991] border-2 border-dashed border-amber-400 bg-amber-400/10 transition-none"
          style={{
            left: `${projectedBox.left}px`,
            top: `${projectedBox.top}px`,
            width: `${projectedBox.width}px`,
            height: `${projectedBox.height}px`,
          }}
        >
          <div className="absolute -top-5 left-0 bg-amber-950/90 text-amber-300 border border-amber-400 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow">
            Caja 3D: {projectedBox.width}px × {projectedBox.height}px (
            {Math.round((projectedBox.width / (viewportWidth || 1)) * 100)}% W)
          </div>
          <div className="absolute -bottom-5 right-0 bg-amber-950/90 text-amber-300 px-1.5 py-0.2 rounded text-[8px] font-mono">
            Margen lat: {Math.round((((viewportWidth || 1) - projectedBox.width) / 2 / (viewportWidth || 1)) * 100)}%
          </div>
        </div>
      )}

      {/* 3. PANEL INTERACTIVO FLOTANTE DE CALIBRACIÓN */}
      <div
        className="fixed bottom-4 right-4 z-[9999] bg-[#12161A]/95 text-slate-100 p-4 rounded-xl border border-accent/60 shadow-2xl backdrop-blur-md text-xs font-mono max-w-[340px] w-full"
        style={{ maxHeight: minimized ? 'auto' : '88vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-300 text-[12px]">Calibrador 3D (?debug)</span>
          </div>
          <button
            type="button"
            onClick={() => setMinimized(!minimized)}
            className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 bg-white/5 rounded border border-white/10"
          >
            {minimized ? 'Expandir' : 'Minimizar'}
          </button>
        </div>

        {!minimized && (
          <div className="space-y-3">
            {/* Medidas y estado */}
            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Viewport:</span>
                <span className="text-white font-semibold">
                  {viewportWidth} × {viewportHeight} px
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distancia Cámara:</span>
                <span className="text-emerald-400 font-semibold">
                  {framingData?.cameraDistance ? framingData.cameraDistance.toFixed(2) : '--'} u
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Eje que gobierna:</span>
                <span className={framingData?.widthGoverns ? 'text-cyan-300 font-bold' : 'text-amber-300 font-bold'}>
                  {framingData?.widthGoverns ? 'ANCHO (Horizontal)' : 'ALTO (Vertical)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ViewOffset Y:</span>
                <span className="text-white font-mono">+{framingData?.offsetY ?? 0} px</span>
              </div>
            </div>

            {/* Selector de Pose */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Pose Anatómica:</span>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => updateParam('pose', 'closed')}
                  className={`px-2.5 py-1 rounded text-[10px] border transition-colors ${
                    params.pose === 'closed'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  Cerrada
                </button>
                <button
                  type="button"
                  onClick={() => updateParam('pose', 'open')}
                  className={`px-2.5 py-1 rounded text-[10px] border transition-colors ${
                    params.pose === 'open'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  Abierta (1.4 u)
                </button>
              </div>
            </div>

            {/* Slider Margen (fitMargin) */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">fitMargin:</span>
                <span className="text-accent font-bold">{(params.fitMargin * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.16"
                step="0.005"
                value={params.fitMargin}
                onChange={(e) => updateParam('fitMargin', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <span className="text-[9px] text-slate-400">Margen lateral (presupuesto 6–8%)</span>
            </div>

            {/* Slider Altura Zona Segura (safeZoneHeight) */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Zona Segura Alto:</span>
                <span className="text-emerald-400 font-bold">{Math.round(params.safeZoneHeight * 100)}% svh</span>
              </div>
              <input
                type="range"
                min="0.45"
                max="0.75"
                step="0.01"
                value={params.safeZoneHeight}
                onChange={(e) => updateParam('safeZoneHeight', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[9px] text-slate-400">Porción superior útil (presupuesto 55–60%)</span>
            </div>

            {/* Slider Desplazamiento Óptico (offsetYFactor) */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">offsetY Factor:</span>
                <span className="text-cyan-300 font-bold">+{params.offsetYFactor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.20"
                max="0.35"
                step="0.01"
                value={params.offsetYFactor}
                onChange={(e) => updateParam('offsetYFactor', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[9px] text-slate-400">Desplazamiento frustum (+0.21 centra en 58%)</span>
            </div>

            {/* Slider FOV */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Camera FOV:</span>
                <span className="text-white font-bold">{params.fov}°</span>
              </div>
              <input
                type="range"
                min="26"
                max="44"
                step="1"
                value={params.fov}
                onChange={(e) => updateParam('fov', parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Botón de Copiado */}
            <button
              type="button"
              onClick={handleCopyConfig}
              className={`w-full py-2.5 px-3 rounded-lg font-bold text-center text-xs transition-all ${
                copyFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'bg-accent hover:bg-accent/90 text-white shadow-lg'
              }`}
            >
              {copyFeedback ? '✓ ¡Configuración Copiada!' : '📋 Copiar Config a Portapapeles'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Exportación por defecto para compatibilidad
export const ModelFramingDebugTool = ModelFraming3DHelper;
