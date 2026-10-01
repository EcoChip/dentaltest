'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, Html } from '@react-three/drei';
import { createInvisalignShaderMaterial } from './InvisalignShader';

interface ArchModelsProps {
  animState: {
    upperY: number;
    lowerY: number;
    upperRotX: number;
    lowerRotX: number;
    upperRotZ: number;
    lowerRotZ: number;
    rotY: number;
    rotX: number;
    glowIntensity: number;
    annotationsOpacity: number;
    stepIndex: number;
  };
}

export function ArchModels({ animState }: ArchModelsProps) {
  const upperGroupRef = useRef<THREE.Group>(null);
  const lowerGroupRef = useRef<THREE.Group>(null);
  const mainRigRef = useRef<THREE.Group>(null);

  // Carga con decodificador Draco local
  const upperGltf = useGLTF('/models/arcada_superior.glb', '/draco/');
  const lowerGltf = useGLTF('/models/arcada_inferior.glb', '/draco/');

  // Clonar y aplicar shader SmartTrack®
  const upperScene = useMemo(() => {
    const cloned = upperGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.computeVertexNormals();
        mesh.material = createInvisalignShaderMaterial();
        mesh.renderOrder = 10;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    return cloned;
  }, [upperGltf]);

  const lowerScene = useMemo(() => {
    const cloned = lowerGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.computeVertexNormals();
        mesh.material = createInvisalignShaderMaterial();
        mesh.renderOrder = 10;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    return cloned;
  }, [lowerGltf]);

  // Actualizar transforms sincronizados con el timeline en cada cambio de animState
  useEffect(() => {
    if (upperGroupRef.current) {
      upperGroupRef.current.position.y = animState.upperY;
      upperGroupRef.current.rotation.x = animState.upperRotX;
      upperGroupRef.current.rotation.z = animState.upperRotZ;
    }
    if (lowerGroupRef.current) {
      lowerGroupRef.current.position.y = animState.lowerY;
      lowerGroupRef.current.rotation.x = animState.lowerRotX;
      lowerGroupRef.current.rotation.z = animState.lowerRotZ;
    }
    if (mainRigRef.current) {
      mainRigRef.current.rotation.y = animState.rotY;
      mainRigRef.current.rotation.x = animState.rotX;
    }
  }, [animState]);

  return (
    <group ref={mainRigRef}>
      {/* Arcada Superior */}
      <group ref={upperGroupRef} position={[0, animState.upperY, 0]}>
        <primitive object={upperScene} position={[0.06, 0.08, 0.1]} />

        {/* Anotación 3D 1: Fuerza Biomecánica Continua */}
        {animState.annotationsOpacity > 0.05 && (
          <Html
            position={[0.35, 0.28, 0.45]}
            center
            distanceFactor={5.5}
            style={{
              opacity: animState.annotationsOpacity,
              transition: 'opacity 0.2s ease-out',
              pointerEvents: 'none',
            }}
          >
            <div className="flex items-center space-x-2 bg-canvas/95 border border-line-strong px-2.5 py-1.5 rounded-xs shadow-card backdrop-blur-sm whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div className="text-[10px] leading-tight">
                <p className="font-semibold uppercase tracking-clinical text-ink">Fuerza Biomecánica</p>
                <p className="text-ink-secondary text-[9px]">0,2 mm por alineador</p>
              </div>
            </div>
          </Html>
        )}

        {/* Anotación 3D 2: Margen Gingival Festoneado */}
        {animState.annotationsOpacity > 0.05 && (
          <Html
            position={[-0.45, 0.25, 0.35]}
            center
            distanceFactor={5.5}
            style={{
              opacity: animState.annotationsOpacity,
              transition: 'opacity 0.2s ease-out',
              pointerEvents: 'none',
            }}
          >
            <div className="flex items-center space-x-2 bg-canvas/95 border border-line-strong px-2.5 py-1.5 rounded-xs shadow-card backdrop-blur-sm whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <div className="text-[10px] leading-tight">
                <p className="font-semibold uppercase tracking-clinical text-ink">Corte Festoneado</p>
                <p className="text-ink-secondary text-[9px]">Preservación de encía</p>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* Arcada Inferior */}
      <group ref={lowerGroupRef} position={[0, animState.lowerY, 0]}>
        <primitive object={lowerScene} position={[0.07, -0.08, 0.09]} />

        {/* Anotación 3D 3: Ajuste Oclusal Céntrico */}
        {animState.annotationsOpacity > 0.05 && (
          <Html
            position={[0.0, -0.32, 0.65]}
            center
            distanceFactor={5.5}
            style={{
              opacity: animState.annotationsOpacity,
              transition: 'opacity 0.2s ease-out',
              pointerEvents: 'none',
            }}
          >
            <div className="flex items-center space-x-2 bg-canvas/95 border border-line-strong px-2.5 py-1.5 rounded-xs shadow-card backdrop-blur-sm whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <div className="text-[10px] leading-tight">
                <p className="font-semibold uppercase tracking-clinical text-ink">Ajuste Oclusal</p>
                <p className="text-ink-secondary text-[9px]">Guía canina Clase I</p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

useGLTF.preload('/models/arcada_superior.glb', '/draco/');
useGLTF.preload('/models/arcada_inferior.glb', '/draco/');
