'use client';

import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { SCENES_CONFIG } from '@/config/scenes';

export interface ArchModelHandles {
  mainRig: THREE.Group | null;
  upperHinge: THREE.Group | null;
  lowerHinge: THREE.Group | null;
  setAlignerReveal: (progress: number) => void;
  setScanBeam: (progress: number) => void;
  getUpperMesh: () => THREE.Object3D | null;
  getLowerMesh: () => THREE.Object3D | null;
}

export const ArchModel = forwardRef<ArchModelHandles, { className?: string }>((props, ref) => {
  const mainRigRef = useRef<THREE.Group>(null);
  const upperHingeRef = useRef<THREE.Group>(null);
  const lowerHingeRef = useRef<THREE.Group>(null);

  const cfg = SCENES_CONFIG.models;

  // Carga con decodificador Draco local exclusivo (cero CDN externos)
  const upperGltf = useGLTF(cfg.upperPath, cfg.dracoDecoderPath);
  const lowerGltf = useGLTF(cfg.lowerPath, cfg.dracoDecoderPath);

  // Material de dientes: MeshPhysicalMaterial sobrio (aspecto clínico de esmalte, no plástico)
  const teethMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(cfg.materials.teeth.color),
      roughness: cfg.materials.teeth.roughness,
      metalness: cfg.materials.teeth.metalness,
      clearcoat: cfg.materials.teeth.clearcoat,
      clearcoatRoughness: cfg.materials.teeth.clearcoatRoughness,
      reflectivity: cfg.materials.teeth.reflectivity,
      side: THREE.DoubleSide,
    });
  }, [cfg]);

  // Shader para la capa del alineador transparente (extrusión por normales + Fresnel)
  const alignerUniforms = useMemo(() => {
    return {
      uColor: { value: new THREE.Color(cfg.materials.aligner.color) },
      uFresnelColor: { value: new THREE.Color(cfg.materials.aligner.fresnelColor) },
      uOpacity: { value: cfg.materials.aligner.opacity },
      uFresnelPower: { value: cfg.materials.aligner.fresnelPower },
      uExtrusion: { value: cfg.materials.aligner.extrusion },
      uReveal: { value: 0.0 }, // 0 = invisible, 1 = completamente revelado
      uScanBeam: { value: -1.0 }, // haz de barrido del escáner
    };
  }, [cfg]);

  const alignerMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: alignerUniforms,
      vertexShader: `
        uniform float uExtrusion;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec3 newPos = position + normal * uExtrusion;
          vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          vWorldPosition = (modelMatrix * vec4(newPos, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uFresnelColor;
        uniform float uOpacity;
        uniform float uFresnelPower;
        uniform float uReveal;
        uniform float uScanBeam;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          float normalizedZ = clamp((vWorldPosition.z + 0.85) / 1.7, 0.0, 1.0);
          bool isAlignerRevealed = normalizedZ <= uReveal && uReveal > 0.005;

          // Haz de luz del escáner intraoral 3D (barrido transversal X de -0.95 a 0.95)
          bool isScanActive = uScanBeam >= 0.0;
          float normalizedX = clamp((vWorldPosition.x + 0.95) / 1.9, 0.0, 1.0);
          float scanGlow = isScanActive ? smoothstep(0.08, 0.0, abs(normalizedX - uScanBeam)) : 0.0;

          // Si no hay alineador revelado en este punto y el escáner no está activo aquí, descartar
          if (!isAlignerRevealed && scanGlow <= 0.01) {
            discard;
          }

          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          float fresnel = clamp(1.0 - abs(dot(normal, viewDir)), 0.0, 1.0);
          float fresnelFactor = pow(fresnel, uFresnelPower);

          vec3 finalColor = vec3(0.0);
          float alpha = 0.0;

          if (isAlignerRevealed) {
            vec3 alignerBase = mix(uColor, uFresnelColor, fresnelFactor);
            // Borde luminoso de corte al revelar
            float edgeGlow = smoothstep(0.08, 0.0, abs(normalizedZ - uReveal));
            alignerBase += vec3(0.4, 0.85, 1.0) * edgeGlow * 1.6;
            finalColor += alignerBase;
            alpha += clamp(uOpacity * (0.35 + fresnelFactor * 0.65) + edgeGlow * 0.45, 0.0, 0.85);
          }

          if (scanGlow > 0.01) {
            vec3 laserColor = vec3(0.15, 0.80, 1.0) * scanGlow * 2.8;
            finalColor += laserColor;
            alpha = max(alpha, scanGlow * 0.9);
          }

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, [alignerUniforms]);

  // Clonar geometrías y aplicar materiales sin mutar las fuentes globales
  const { upperTeeth, upperAligner } = useMemo(() => {
    const teeth = upperGltf.scene.clone(true);
    teeth.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.geometry.computeVertexNormals();
        m.material = teethMaterial;
      }
    });

    const aligner = upperGltf.scene.clone(true);
    aligner.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.geometry.computeVertexNormals();
        m.material = alignerMaterial;
        m.renderOrder = 10;
      }
    });

    return { upperTeeth: teeth, upperAligner: aligner };
  }, [upperGltf, teethMaterial, alignerMaterial]);

  const { lowerTeeth, lowerAligner } = useMemo(() => {
    const teeth = lowerGltf.scene.clone(true);
    teeth.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.geometry.computeVertexNormals();
        m.material = teethMaterial;
      }
    });

    const aligner = lowerGltf.scene.clone(true);
    aligner.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.geometry.computeVertexNormals();
        m.material = alignerMaterial;
        m.renderOrder = 10;
      }
    });

    return { lowerTeeth: teeth, lowerAligner: aligner };
  }, [lowerGltf, teethMaterial, alignerMaterial]);

  // Exponer API imperativa para que el timeline de GSAP mute directamente sin re-renders
  useImperativeHandle(ref, () => ({
    mainRig: mainRigRef.current,
    upperHinge: upperHingeRef.current,
    lowerHinge: lowerHingeRef.current,
    setAlignerReveal: (progress: number) => {
      alignerUniforms.uReveal.value = progress;
    },
    setScanBeam: (progress: number) => {
      alignerUniforms.uScanBeam.value = progress;
    },
    getUpperMesh: () => upperHingeRef.current,
    getLowerMesh: () => lowerHingeRef.current,
  }));

  const uPiv = cfg.hinge.upperPivot;
  const lPiv = cfg.hinge.lowerPivot;

  return (
    <group ref={mainRigRef} name="MainRig">
      {/* Grupo Bisagra Arcada Superior */}
      <group ref={upperHingeRef} position={[uPiv[0], uPiv[1], uPiv[2]]} name="UpperHinge">
        <group position={[-uPiv[0], -uPiv[1], -uPiv[2]]} name="UpperPivotOffset">
          <group position={cfg.offsets.upper}>
            <primitive object={upperTeeth} />
            <primitive object={upperAligner} />
          </group>
        </group>
      </group>

      {/* Grupo Bisagra Arcada Inferior */}
      <group ref={lowerHingeRef} position={[lPiv[0], lPiv[1], lPiv[2]]} name="LowerHinge">
        <group position={[-lPiv[0], -lPiv[1], -lPiv[2]]} name="LowerPivotOffset">
          <group position={cfg.offsets.lower}>
            <primitive object={lowerTeeth} />
            <primitive object={lowerAligner} />
          </group>
        </group>
      </group>
    </group>
  );
});

ArchModel.displayName = 'ArchModel';

useGLTF.preload(SCENES_CONFIG.models.upperPath, SCENES_CONFIG.models.dracoDecoderPath);
useGLTF.preload(SCENES_CONFIG.models.lowerPath, SCENES_CONFIG.models.dracoDecoderPath);
