'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { SCENES_CONFIG } from '@/config/scenes';

export interface LightingHandles {
  setGlowIntensity: (intensity: number) => void;
}

/**
 * Sistema de Iluminación de Estudio Clínico de Alto Rendimiento.
 * 
 * OPTIMIZACIÓN CLAVE FASE 5:
 * Se eliminan <Environment> dinámico y <ContactShadows> en tiempo real,
 * los cuales generaban 2 contextos WebGL auxiliares y múltiples pases de cámara
 * fuera de pantalla, provocando tirones y un cuello de botella de 12 segundos.
 * 
 * Se adopta la configuración ligera y ultra-fluida del visor interactivo:
 * iluminación direccional balanceada con contrastes clínicos cálido/frío.
 */
export const Lighting = forwardRef<LightingHandles, { disableShadows?: boolean }>(
  ({ disableShadows = false }, ref) => {
    const glowLightRef = useRef<THREE.PointLight>(null);

    useImperativeHandle(ref, () => ({
      setGlowIntensity: (intensity: number) => {
        if (glowLightRef.current) {
          glowLightRef.current.intensity = intensity;
        }
      },
    }));

    const cfg = SCENES_CONFIG.lighting;

    return (
      <group name="LightingRig">
        {/* Luz Ambiental Base para conservar el detalle oclusal en zonas de sombra */}
        <ambientLight color="#FFFFFF" intensity={0.75} />

        {/* Luz Frontal Superior Clave (Key Light) */}
        <directionalLight
          position={[3.0, 5.0, 4.0]}
          intensity={2.0}
          color="#FFFFFF"
        />

        {/* Luz Lateral de Relleno Cerúleo Frío (Fill Light) */}
        <directionalLight
          position={[-3.5, -1.5, 3.0]}
          intensity={1.2}
          color="#89c2d9"
        />

        {/* Luz Trasera / Cenital de Recorte Especular (Rim Light) */}
        <directionalLight
          position={[0.0, 3.5, -3.0]}
          intensity={1.4}
          color="#caf0f8"
        />

        {/* Luz puntual de destello oclusal (controlada dinámicamente por el timeline) */}
        <pointLight
          ref={glowLightRef}
          position={cfg.pointGlow.position}
          color={cfg.pointGlow.color}
          distance={cfg.pointGlow.distance}
          intensity={0}
        />
      </group>
    );
  }
);

Lighting.displayName = 'Lighting';
