'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { SCENES_CONFIG, BreakpointConfig } from '@/config/scenes';
import { calculateFraming, FramingResult } from '@/lib/three/framing';

export interface FramingOverrideParams {
  fitMargin?: number;
  offsetY?: number;
  safeZoneHeight?: number;
  fov?: number;
}

export interface CameraRigHandles {
  camera: THREE.PerspectiveCamera | null;
  target: THREE.Vector3;
  setLookAt: (x: number, y: number, z: number) => void;
  getBreakpointConfig: () => BreakpointConfig;
  getCalculatedFraming: () => FramingResult;
  applyFramingOverride: (params: FramingOverrideParams) => void;
}

export const CameraRig = forwardRef<CameraRigHandles, {}>((props, ref) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const targetRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...SCENES_CONFIG.camera.lookAtDefault)
  );
  const { size, set } = useThree();

  const [overrideParams, setOverrideParams] = useState<FramingOverrideParams | null>(null);

  // Cache para inmunidad a la barra del navegador (evitar saltos en scroll)
  const lastWidthRef = useRef<number>(0);
  const lastHeightRef = useRef<number>(0);
  const lastOrientationRef = useRef<'portrait' | 'landscape'>('portrait');
  const cachedFramingRef = useRef<FramingResult | null>(null);

  const getBreakpoint = useCallback((): BreakpointConfig => {
    const w = size.width;
    const bp = SCENES_CONFIG.camera.breakpoints;
    if (w < 768) return bp.mobile;
    if (w < 1024) return bp.tablet;
    if (w < 1440) return bp.desktop;
    return bp.wide;
  }, [size.width]);

  // Cálculo analítico del encuadre
  const computeCurrentFraming = useCallback((): FramingResult => {
    const w = size.width;
    const h = size.height;
    const bp = getBreakpoint();

    const fov = overrideParams?.fov ?? bp.fov;
    const fitMargin = overrideParams?.fitMargin ?? SCENES_CONFIG.camera.safeZone.mobile.fitMargin;
    const safeZoneHeight =
      overrideParams?.safeZoneHeight ?? SCENES_CONFIG.camera.safeZone.mobile.bottom;

    const res = calculateFraming({
      viewportWidth: w,
      viewportHeight: h,
      fov,
      fitMargin,
      safeZoneHeightFraction: safeZoneHeight,
      pose: 'closed',
    });

    if (overrideParams?.offsetY !== undefined) {
      res.offsetY = Math.round(h * overrideParams.offsetY);
    }

    return res;
  }, [size.width, size.height, getBreakpoint, overrideParams]);

  useImperativeHandle(ref, () => ({
    camera: cameraRef.current,
    target: targetRef.current,
    setLookAt: (x: number, y: number, z: number) => {
      targetRef.current.set(x, y, z);
    },
    getBreakpointConfig: getBreakpoint,
    getCalculatedFraming: () => cachedFramingRef.current || computeCurrentFraming(),
    applyFramingOverride: (params: FramingOverrideParams) => {
      setOverrideParams(params);
    },
  }));

  // Sincronizar cámara activa de Three.js y aplicar View Offset analítico
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;

    set({ camera: cam });

    const w = size.width;
    const h = size.height;
    const currentOrientation: 'portrait' | 'landscape' = w > h ? 'landscape' : 'portrait';

    // Inmunidad a la barra de dirección en móvil (ignoreMobileResize):
    // Si el ancho no ha cambiado, la orientación es la misma y el cambio de alto es <= 120px,
    // NO reencuadramos para evitar saltos durante el scroll.
    const isMicroHeightResize =
      lastWidthRef.current === w &&
      lastOrientationRef.current === currentOrientation &&
      Math.abs(lastHeightRef.current - h) <= 120 &&
      cachedFramingRef.current !== null &&
      !overrideParams;

    if (isMicroHeightResize) {
      return;
    }

    lastWidthRef.current = w;
    lastHeightRef.current = h;
    lastOrientationRef.current = currentOrientation;

    const framing = computeCurrentFraming();
    cachedFramingRef.current = framing;

    cam.fov = framing.fov;
    cam.near = SCENES_CONFIG.camera.near;
    cam.far = SCENES_CONFIG.camera.far;

    // En móvil vertical: centrado en la zona segura superior (55-60% svh) con offsetY positivo
    // En escritorio y móvil horizontal: desplazamiento horizontal con offsetX
    cam.setViewOffset(w, h, framing.offsetX, framing.offsetY, w, h);
    cam.updateProjectionMatrix();

    if (typeof window !== 'undefined') {
      (window as unknown as { __currentFraming?: FramingResult }).__currentFraming = framing;
    }
  }, [size.width, size.height, set, computeCurrentFraming, overrideParams]);

  // Actualización de orientación hacia el target en cada frame activo
  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(targetRef.current);
    }
  });

  const initialBp = SCENES_CONFIG.camera.breakpoints.desktop;

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={initialBp.cameraPosition}
      fov={initialBp.fov}
      near={SCENES_CONFIG.camera.near}
      far={SCENES_CONFIG.camera.far}
    />
  );
});

CameraRig.displayName = 'CameraRig';
