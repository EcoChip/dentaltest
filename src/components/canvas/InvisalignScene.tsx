'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ArchModels } from './ArchModels';

export interface ScrollyAnimState {
  upperY: number;
  lowerY: number;
  upperRotX: number;
  lowerRotX: number;
  upperRotZ: number;
  lowerRotZ: number;
  rotY: number;
  rotX: number;
  cameraX: number;
  cameraZ: number;
  glowIntensity: number;
  annotationsOpacity: number;
  stepIndex: number;
}

interface InvisalignSceneProps {
  animState: ScrollyAnimState;
  isVisible?: boolean;
}

// Controlador de cámara dinámico integrado en el bucle R3F
function CameraController({ animState }: { animState: ScrollyAnimState }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    // Posición objetivo según breakpoint y scroll
    const targetX = isMobile ? 0 : animState.cameraX;
    const targetY = isMobile ? -0.05 : 0;
    const targetZ = isMobile ? 5.4 : isTablet ? 4.8 : animState.cameraZ;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Halo arquitectónico de profundidad
function DepthRings() {
  return (
    <group position={[0.2, 0, -2.5]}>
      <mesh>
        <ringGeometry args={[1.5, 1.515, 72]} />
        <meshBasicMaterial color="#1C4E5E" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[2.2, 2.215, 72]} />
        <meshBasicMaterial color="#1C4E5E" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function InvisalignScene({ animState, isVisible = true }: InvisalignSceneProps) {
  const [dpr, setDpr] = useState(1.5);
  const glowLightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      setDpr(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    }
  }, []);

  useEffect(() => {
    if (glowLightRef.current) {
      glowLightRef.current.intensity = animState.glowIntensity;
    }
  }, [animState.glowIntensity]);

  if (!isVisible) return null;

  return (
    <div className="w-full h-full relative" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.3], fov: 34 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <CameraController animState={animState} />

        {/* Iluminación Quirúrgica / Estudio Médico */}
        <ambientLight intensity={0.75} />
        <directionalLight position={[3.0, 5.0, 5.0]} intensity={2.0} color="#FFFFFF" />
        <directionalLight position={[-4.0, -1.0, 3.5]} intensity={1.2} color="#89c2d9" />
        <directionalLight position={[0, 4, -4]} intensity={1.6} color="#caf0f8" />
        <pointLight ref={glowLightRef} position={[0, 0, 1.6]} color="#64dfdf" distance={6} intensity={0} />

        {/* Anillos de profundidad de fondo */}
        <DepthRings />

        {/* Modelos de las Arcadas */}
        <Suspense fallback={null}>
          <ArchModels animState={animState} />
        </Suspense>
      </Canvas>
    </div>
  );
}
