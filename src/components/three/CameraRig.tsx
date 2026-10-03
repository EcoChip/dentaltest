'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { SCENES_CONFIG, BreakpointConfig } from '@/config/scenes';

export interface CameraRigHandles {
  camera: THREE.PerspectiveCamera | null;
  target: THREE.Vector3;
  setLookAt: (x: number, y: number, z: number) => void;
  getBreakpointConfig: () => BreakpointConfig;
}

export const CameraRig = forwardRef<CameraRigHandles, {}>((props, ref) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const targetRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...SCENES_CONFIG.camera.lookAtDefault)
  );
  const { size, set } = useThree();

  const getBreakpoint = (): BreakpointConfig => {
    const w = size.width;
    const bp = SCENES_CONFIG.camera.breakpoints;
    if (w < 768) return bp.mobile;
    if (w < 1024) return bp.tablet;
    if (w < 1440) return bp.desktop;
    return bp.wide;
  };

  useImperativeHandle(ref, () => ({
    camera: cameraRef.current,
    target: targetRef.current,
    setLookAt: (x: number, y: number, z: number) => {
      targetRef.current.set(x, y, z);
    },
    getBreakpointConfig: getBreakpoint,
  }));

  // Sincronizar cámara activa de Three.js con nuestra PerspectiveCamera y aplicar View Offset responsive
  useEffect(() => {
    if (cameraRef.current) {
      set({ camera: cameraRef.current });
      const bp = getBreakpoint();
      cameraRef.current.fov = bp.fov;
      cameraRef.current.near = SCENES_CONFIG.camera.near;
      cameraRef.current.far = SCENES_CONFIG.camera.far;

      const w = size.width;
      const h = size.height;
      const isLandscape = w > h;

      if (w >= 1024 || (isLandscape && w >= 640)) {
        // Escritorio y horizontal: Texto en columna izquierda (38-40%), modelo desplazado a la derecha
        // Desplazamiento del eje óptico hacia la derecha (74-76% del ancho) sin distorsión de perspectiva
        const xOffsetFactor = w >= 1440 ? 0.22 : 0.26;
        cameraRef.current.setViewOffset(w, h, -w * xOffsetFactor, 0, w, h);
      } else {
        // Móvil vertical y tablet vertical: Texto arriba, modelo debajo sin recortes
        // Desplazamiento hacia la mitad inferior de la pantalla (yOffset de -h * 0.22 a -h * 0.24)
        const yOffsetFactor = w <= 480 ? 0.24 : 0.20;
        cameraRef.current.setViewOffset(w, h, 0, -h * yOffsetFactor, w, h);
      }

      cameraRef.current.updateProjectionMatrix();
    }
  }, [size.width, size.height, set]);

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
