'use client';

import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';

export interface DepthParticlesHandles {
  setOpacity: (opacity: number) => void;
}

export const DepthParticles = forwardRef<DepthParticlesHandles, {}>((props, ref) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Generar 220 partículas en el pasillo tridimensional interoclusal del dolly
  const particlesGeometry = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);

    // Semilla determinista para consistencia visual entre renders
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribución a lo largo del corredor de avance de la cámara (Z: 0.2 a 3.4)
      positions[i3] = (pseudoRandom() - 0.5) * 3.2; // X
      positions[i3 + 1] = (pseudoRandom() - 0.5) * 1.8; // Y
      positions[i3 + 2] = 0.2 + pseudoRandom() * 3.2; // Z
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.016,
      color: new THREE.Color('#3A7D8C'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  useImperativeHandle(ref, () => ({
    setOpacity: (opacity: number) => {
      if (materialRef.current) {
        materialRef.current.opacity = Math.max(0, Math.min(0.45, opacity));
        if (pointsRef.current) {
          pointsRef.current.visible = opacity > 0.005;
        }
      }
    },
  }));

  return (
    <points
      ref={pointsRef}
      geometry={particlesGeometry}
      material={material}
      ref-material={materialRef}
      visible={false}
      frustumCulled={false}
    />
  );
});

DepthParticles.displayName = 'DepthParticles';
