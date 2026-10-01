'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ArchModel, ArchModelHandles } from './ArchModel';
import { CameraRig, CameraRigHandles } from './CameraRig';
import { Lighting, LightingHandles } from './Lighting';
import { Annotations, AnnotationsHandles } from './Annotations';
import { SCENES_CONFIG } from '@/config/scenes';

export interface SceneHandles {
  archModel: ArchModelHandles | null;
  cameraRig: CameraRigHandles | null;
  lighting: LightingHandles | null;
  annotations: AnnotationsHandles | null;
  invalidate: () => void;
}

function SceneBridge({
  onInit,
  annotationsRef,
  cameraRigRef,
  archModelRef,
}: {
  onInit: (inv: () => void) => void;
  annotationsRef: React.RefObject<AnnotationsHandles | null>;
  cameraRigRef: React.RefObject<CameraRigHandles | null>;
  archModelRef: React.RefObject<ArchModelHandles | null>;
}) {
  const { invalidate, size, gl } = useThree();

  useEffect(() => {
    onInit(invalidate);
  }, [invalidate, onInit]);

  // Manejador de pérdida de contexto WebGL
  useEffect(() => {
    const canvasEl = gl.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost. Intentando recuperar...');
    };
    const handleContextRestored = () => {
      console.info('WebGL context restored.');
      invalidate();
    };

    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, invalidate]);

  // En cada renderizado, proyectar anotaciones en el espacio de pantalla
  useFrame(() => {
    if (cameraRigRef.current?.camera && annotationsRef.current) {
      const mainRig = archModelRef.current?.mainRig;
      annotationsRef.current.updatePositions(
        cameraRigRef.current.camera,
        size.width,
        size.height,
        mainRig ? mainRig.matrixWorld : undefined
      );
    }
  });

  return null;
}

export const Scene = forwardRef<SceneHandles, { className?: string; isVisible?: boolean }>(
  ({ className = '', isVisible = true }, ref) => {
    const archModelRef = useRef<ArchModelHandles>(null);
    const cameraRigRef = useRef<CameraRigHandles>(null);
    const lightingRef = useRef<LightingHandles>(null);
    const annotationsRef = useRef<AnnotationsHandles>(null);

    const invalidateFnRef = useRef<() => void>(() => {});

    const [dpr, setDpr] = useState<[number, number]>([1, 2]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setDpr([1, 1.5]);
        setIsMobile(true);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      archModel: archModelRef.current,
      cameraRig: cameraRigRef.current,
      lighting: lightingRef.current,
      annotations: annotationsRef.current,
      invalidate: () => {
        invalidateFnRef.current();
      },
    }));

    if (!isVisible) return null;

    return (
      <div className={`relative w-full h-full pointer-events-none select-none ${className}`} aria-hidden="true">
        {/* Canvas WebGL a pantalla completa */}
        <Canvas
          frameloop="demand"
          dpr={dpr}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
          }}
        >
          <SceneBridge
            onInit={(inv) => {
              invalidateFnRef.current = inv;
            }}
            annotationsRef={annotationsRef}
            cameraRigRef={cameraRigRef}
            archModelRef={archModelRef}
          />

          <CameraRig ref={cameraRigRef} />
          <Lighting ref={lightingRef} disableShadows={isMobile} />

          <Suspense fallback={null}>
            <ArchModel ref={archModelRef} />
          </Suspense>
        </Canvas>

        {/* Overlay DOM de Anotaciones Quirúrgicas Proyectadas */}
        <Annotations ref={annotationsRef} />
      </div>
    );
  }
);

Scene.displayName = 'Scene';
