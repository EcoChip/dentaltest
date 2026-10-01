'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { SCENES_CONFIG } from '@/config/scenes';

export interface LightingHandles {
  setGlowIntensity: (intensity: number) => void;
}

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
      <>
        {/* Luces Directas Clínicas */}
        <ambientLight color={cfg.ambientLight.color} intensity={cfg.ambientLight.intensity} />
        <directionalLight
          position={cfg.keyLight.position}
          intensity={cfg.keyLight.intensity}
          color={cfg.keyLight.color}
        />
        <directionalLight
          position={cfg.fillLight.position}
          intensity={cfg.fillLight.intensity}
          color={cfg.fillLight.color}
        />
        <directionalLight
          position={cfg.rimLight.position}
          intensity={cfg.rimLight.intensity}
          color={cfg.rimLight.color}
        />

        {/* Luz puntual de destello oclusal */}
        <pointLight
          ref={glowLightRef}
          position={cfg.pointGlow.position}
          color={cfg.pointGlow.color}
          distance={cfg.pointGlow.distance}
          intensity={0}
        />

        {/* Entorno de estudio clínico con Lightformers locales (sin HDRI remotos) */}
        <Environment resolution={128}>
          <group rotation={[Math.PI / 4, 0, 0]}>
            {/* Softbox superior principal */}
            <Lightformer
              form="rect"
              intensity={1.5}
              position={[0, 4, 2]}
              scale={[5, 2, 1]}
              target={[0, 0, 0]}
              color="#FFFFFF"
            />
            {/* Reflector lateral frío */}
            <Lightformer
              form="rect"
              intensity={0.8}
              position={[-4, 1, -1]}
              scale={[3, 3, 1]}
              color="#B0D5F0"
            />
            {/* Reflector rasante inferior cálido */}
            <Lightformer
              form="ring"
              intensity={0.5}
              position={[0, -3, 2]}
              scale={2}
              color="#F8F6F1"
            />
          </group>
        </Environment>

        {/* Sombras de Contacto Suaves */}
        {!disableShadows && (
          <ContactShadows
            position={cfg.shadows.position}
            opacity={cfg.shadows.opacity}
            scale={4}
            blur={cfg.shadows.blur}
            far={1.5}
            color="#121314"
          />
        )}
      </>
    );
  }
);

Lighting.displayName = 'Lighting';
