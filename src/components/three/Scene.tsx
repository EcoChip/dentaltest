'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ArchModel, ArchModelHandles } from './ArchModel';
import { CameraRig, CameraRigHandles } from './CameraRig';
import { Lighting, LightingHandles } from './Lighting';
import { Annotations, AnnotationsHandles } from './Annotations';
import { DepthParticles, DepthParticlesHandles } from './DepthParticles';
import { RaycastDebugTool } from './RaycastDebugTool';
import { ModelFraming3DHelper, ModelFramingOverlay } from './ModelFramingDebugTool';
import { SCENES_CONFIG } from '@/config/scenes';

export interface SceneHandles {
  archModel: ArchModelHandles | null;
  cameraRig: CameraRigHandles | null;
  lighting: LightingHandles | null;
  annotations: AnnotationsHandles | null;
  depthParticles: DepthParticlesHandles | null;
  invalidate: () => void;
}

interface SceneProps {
  className?: string;
  isVisible?: boolean;
  onSceneReady?: () => void;
}

function SceneBridge({
  onInit,
  onSceneReady,
  annotationsRef,
  cameraRigRef,
  archModelRef,
}: {
  onInit: (inv: () => void) => void;
  onSceneReady?: () => void;
  annotationsRef: React.RefObject<AnnotationsHandles | null>;
  cameraRigRef: React.RefObject<CameraRigHandles | null>;
  archModelRef: React.RefObject<ArchModelHandles | null>;
}) {
  const { invalidate, size, gl, scene, camera } = useThree();

  useEffect(() => {
    onInit(invalidate);
  }, [invalidate, onInit]);

  // Precompilación inmediata de shaders y subida de mallas a la GPU
  // Evita el micro-stutter y bloqueo de 2.6s en el primer movimiento de scroll
  useEffect(() => {
    try {
      if (scene && camera) {
        gl.compile(scene, camera);
        invalidate();
        if (onSceneReady) {
          onSceneReady();
        }
        if (typeof window !== 'undefined') {
          (window as unknown as { __threeScene?: unknown; __threeCamera?: unknown; __archModelHandles?: unknown }).__threeScene = scene;
          (window as unknown as { __threeScene?: unknown; __threeCamera?: unknown; __archModelHandles?: unknown }).__threeCamera = camera;
          (window as unknown as { __threeScene?: unknown; __threeCamera?: unknown; __archModelHandles?: unknown }).__archModelHandles = archModelRef.current;
        }
      }
    } catch (e) {
      console.warn('Aviso: precompilación de shaders WebGL:', e);
      if (onSceneReady) onSceneReady();
    }
  }, [gl, scene, camera, invalidate, onSceneReady]);

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
    if (cameraRigRef.current?.camera && annotationsRef.current && archModelRef.current) {
      annotationsRef.current.updatePositions(
        cameraRigRef.current.camera,
        size.width,
        size.height,
        archModelRef.current
      );
    }
  });

  return null;
}

export const Scene = forwardRef<SceneHandles, SceneProps>(
  ({ className = '', isVisible = true, onSceneReady }, ref) => {
    const archModelRef = useRef<ArchModelHandles>(null);
    const cameraRigRef = useRef<CameraRigHandles>(null);
    const lightingRef = useRef<LightingHandles>(null);
    const annotationsRef = useRef<AnnotationsHandles>(null);
    const depthParticlesRef = useRef<DepthParticlesHandles>(null);

    const invalidateFnRef = useRef<() => void>(() => {});

    // DPR limitado estrictamente a 1.5 en escritorio y 1.25 en móvil para evitar saturación de shaders
    const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setDpr([1, 1.25]);
        setIsMobile(true);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      archModel: archModelRef.current,
      cameraRig: cameraRigRef.current,
      lighting: lightingRef.current,
      annotations: annotationsRef.current,
      depthParticles: depthParticlesRef.current,
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
            toneMappingExposure: 1.15,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
            if (typeof window !== 'undefined') {
              (window as unknown as { __getGlInfo: () => Record<string, unknown> }).__getGlInfo = () => ({
                calls: gl.info.render.calls,
                triangles: gl.info.render.triangles,
                textures: gl.info.memory.textures,
                geometries: gl.info.memory.geometries,
                programs: gl.info.programs ? gl.info.programs.length : 0,
              });
            }
          }}
        >
          <SceneBridge
            onInit={(inv) => {
              invalidateFnRef.current = inv;
            }}
            onSceneReady={onSceneReady}
            annotationsRef={annotationsRef}
            cameraRigRef={cameraRigRef}
            archModelRef={archModelRef}
          />

          <CameraRig ref={cameraRigRef} />
          <Lighting ref={lightingRef} disableShadows={isMobile} />

          <Suspense fallback={null}>
            <ArchModel ref={archModelRef} tier={isMobile ? 'low' : 'high'} />
            <RaycastDebugTool />
            <ModelFraming3DHelper />
            <DepthParticles ref={depthParticlesRef} />
          </Suspense>
        </Canvas>

        {/* Overlay DOM de Anotaciones Quirúrgicas Proyectadas */}
        <Annotations ref={annotationsRef} />

        {/* Overlay DOM del Calibrador de Encuadre (?debug) */}
        <ModelFramingOverlay />
      </div>
    );
  }
);

Scene.displayName = 'Scene';
