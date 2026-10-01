'use client';

import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { createInvisalignShaderMaterial } from './InvisalignShader';
import { RotateCcw } from 'lucide-react';

function LightArchModels() {
  const upperGltf = useGLTF('/models/arcada_superior.glb', '/draco/');
  const lowerGltf = useGLTF('/models/arcada_inferior.glb', '/draco/');

  const upperScene = useMemo(() => {
    const cloned = upperGltf.scene.clone(true);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.computeVertexNormals();
        mesh.material = createInvisalignShaderMaterial();
        mesh.renderOrder = 10;
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
      }
    });
    return cloned;
  }, [lowerGltf]);

  return (
    <group position={[0, 0, 0]}>
      {/* Arcada superior colocada en posición estética */}
      <group position={[0, 0.16, 0]}>
        <primitive object={upperScene} position={[0.06, 0.08, 0.1]} />
      </group>
      {/* Arcada inferior en posición oclusal */}
      <group position={[0, -0.16, 0]}>
        <primitive object={lowerScene} position={[0.07, -0.08, 0.09]} />
      </group>
    </group>
  );
}

export function InvisalignLightViewer() {
  return (
    <div className="w-full h-full relative bg-surface border border-line-strong rounded-xs overflow-hidden shadow-card">
      <Canvas
        camera={{ position: [0, 0.2, 3.8], fov: 32 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3.0, 5.0, 4.0]} intensity={2.0} color="#FFFFFF" />
        <directionalLight position={[-3.0, -2.0, 3.0]} intensity={1.2} color="#89c2d9" />
        <directionalLight position={[0, 3, -3]} intensity={1.5} color="#caf0f8" />

        <Suspense fallback={null}>
          <LightArchModels />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          minDistance={2.5}
          maxDistance={5.5}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Indicador de interacción 3D para el usuario */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-xs text-ink-muted">
        <span className="flex items-center space-x-1.5 bg-canvas/90 px-2.5 py-1 rounded-xs border border-line-subtle backdrop-blur-sm">
          <RotateCcw className="w-3.5 h-3.5 text-accent animate-spin-slow" />
          <span className="text-[10px] uppercase tracking-clinical">Arrastra para rotar 360° · Scroll para zoom</span>
        </span>
        <span className="text-[10px] font-mono bg-canvas/90 px-2 py-1 rounded-xs border border-line-subtle hidden sm:inline-block">
          SmartTrack® 3D Viewer
        </span>
      </div>
    </div>
  );
}
