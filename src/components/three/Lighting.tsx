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
        <ambientLight color={cfg.ambientLight.color} intensity={cfg.ambientLight.intensity} />

        {/* Luz Frontal Superior Clave (Key Light) */}
        <directionalLight
          position={cfg.keyLight.position}
          intensity={cfg.keyLight.intensity}
          color={cfg.keyLight.color}
        />

        {/* Luz Lateral de Relleno Neutro Diurno (Fill Light) */}
        <directionalLight
          position={cfg.fillLight.position}
          intensity={cfg.fillLight.intensity}
          color={cfg.fillLight.color}
        />

        {/* Luz Trasera / Cenital de Recorte Blanco Especular (Rim Light) */}
        <directionalLight
          position={cfg.rimLight.position}
          intensity={cfg.rimLight.intensity}
          color={cfg.rimLight.color}
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
