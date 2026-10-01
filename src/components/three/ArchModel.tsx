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
  setGhostProgress: (progress: number) => void;
  getUpperMesh: () => THREE.Object3D | null;
  getLowerMesh: () => THREE.Object3D | null;
}

export const ArchModel = forwardRef<ArchModelHandles, { className?: string }>((props, ref) => {
  const mainRigRef = useRef<THREE.Group>(null);
  const upperHingeRef = useRef<THREE.Group>(null);
  const lowerHingeRef = useRef<THREE.Group>(null);
  const ghostUpperOffsetRef = useRef<THREE.Group>(null);
  const ghostLowerOffsetRef = useRef<THREE.Group>(null);

  const cfg = SCENES_CONFIG.models;

  // Carga con decodificador Draco local exclusivo (cero CDN externos)
  const upperGltf = useGLTF(cfg.upperPath, cfg.dracoDecoderPath);
  const lowerGltf = useGLTF(cfg.lowerPath, cfg.dracoDecoderPath);

  // Material de dientes: MeshStandardMaterial de alto rendimiento con culling FrontSide
  // Elimina el overhead de MeshPhysicalMaterial (clearcoat) y DoubleSide
  const teethMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.materials.teeth.color),
      roughness: 0.32,
      metalness: 0.04,
      side: THREE.FrontSide,
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

  // Shader para la sobreimpresión «fantasma» translúcida del plan ClinCheck (Beat 4)
  const ghostUniforms = useMemo(() => {
    return {
      uColor: { value: new THREE.Color('#3A92C5') },
      uGlowColor: { value: new THREE.Color('#70E0D0') },
      uOpacity: { value: 0.0 },
      uSnap: { value: 0.0 },
    };
  }, []);

  const ghostMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: ghostUniforms,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        uniform float uOpacity;
        uniform float uSnap;

        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          if (uOpacity <= 0.005) {
            discard;
          }
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = clamp(1.0 - abs(dot(normal, viewDir)), 0.0, 1.0);
          float rim = pow(fresnel, 2.2);

          vec3 baseColor = mix(uColor, uGlowColor, rim);
          baseColor += vec3(0.35, 0.85, 1.0) * (uSnap * 0.9);

          float alpha = clamp(uOpacity * (0.26 + rim * 0.74) + uSnap * 0.35, 0.0, 0.95);
          gl_FragColor = vec4(baseColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [ghostUniforms]);

  // Clonar geometrías y aplicar materiales sin mutar las fuentes globales
  const { upperTeeth, upperAligner, upperGhost } = useMemo(() => {
    const teeth = upperGltf.scene.clone(true);
    teeth.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.material = teethMaterial;
      }
    });

    const aligner = upperGltf.scene.clone(true);
    aligner.visible = false;
    aligner.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.material = alignerMaterial;
        m.renderOrder = 10;
      }
    });

    const ghost = upperGltf.scene.clone(true);
    ghost.visible = false;
    ghost.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.material = ghostMaterial;
        m.renderOrder = 20;
      }
    });

    return { upperTeeth: teeth, upperAligner: aligner, upperGhost: ghost };
  }, [upperGltf, teethMaterial, alignerMaterial, ghostMaterial]);

  const { lowerTeeth, lowerAligner, lowerGhost } = useMemo(() => {
    const teeth = lowerGltf.scene.clone(true);
    teeth.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.material = teethMaterial;
      }
    });

    const aligner = lowerGltf.scene.clone(true);
    aligner.visible = false;
    aligner.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.material = alignerMaterial;
        m.renderOrder = 10;
      }
    });

    const ghost = lowerGltf.scene.clone(true);
    ghost.visible = false;
    ghost.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const m = c as THREE.Mesh;
        m.material = ghostMaterial;
        m.renderOrder = 20;
      }
    });

    return { lowerTeeth: teeth, lowerAligner: aligner, lowerGhost: ghost };
  }, [lowerGltf, teethMaterial, alignerMaterial, ghostMaterial]);

  // Exponer API imperativa para que el timeline de GSAP mute directamente sin re-renders
  useImperativeHandle(ref, () => ({
    mainRig: mainRigRef.current,
    upperHinge: upperHingeRef.current,
    lowerHinge: lowerHingeRef.current,
    setAlignerReveal: (progress: number) => {
      alignerUniforms.uReveal.value = progress;
      const shouldBeVisible = progress > 0.005 || alignerUniforms.uScanBeam.value >= 0.0;
      if (upperAligner.visible !== shouldBeVisible) {
        upperAligner.visible = shouldBeVisible;
        lowerAligner.visible = shouldBeVisible;
      }
    },
    setScanBeam: (progress: number) => {
      alignerUniforms.uScanBeam.value = progress;
      const shouldBeVisible = progress >= 0.0 || alignerUniforms.uReveal.value > 0.005;
      if (upperAligner.visible !== shouldBeVisible) {
        upperAligner.visible = shouldBeVisible;
        lowerAligner.visible = shouldBeVisible;
      }
    },
    setGhostProgress: (progress: number) => {
      const isVisible = progress > 0.002;
      if (upperGhost.visible !== isVisible) {
        upperGhost.visible = isVisible;
        lowerGhost.visible = isVisible;
      }
      ghostUniforms.uOpacity.value = Math.min(1.0, progress * 1.35);
      ghostUniforms.uSnap.value = progress > 0.91 ? Math.sin((progress - 0.91) / 0.09 * Math.PI) : 0.0;

      // El plan virtual comienza desplazado y encaja con 100% de concordancia en el resultado oclusal
      const factor = Math.max(0, 1.0 - progress);
      if (ghostUpperOffsetRef.current) {
        ghostUpperOffsetRef.current.position.set(0.035 * factor, 0.045 * factor, 0.05 * factor);
        ghostUpperOffsetRef.current.rotation.set(0.03 * factor, -0.05 * factor, 0.02 * factor);
      }
      if (ghostLowerOffsetRef.current) {
        ghostLowerOffsetRef.current.position.set(-0.03 * factor, -0.04 * factor, 0.045 * factor);
        ghostLowerOffsetRef.current.rotation.set(-0.02 * factor, 0.035 * factor, -0.015 * factor);
      }
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
            <group ref={ghostUpperOffsetRef}>
              <primitive object={upperGhost} />
            </group>
          </group>
        </group>
      </group>

      {/* Grupo Bisagra Arcada Inferior */}
      <group ref={lowerHingeRef} position={[lPiv[0], lPiv[1], lPiv[2]]} name="LowerHinge">
        <group position={[-lPiv[0], -lPiv[1], -lPiv[2]]} name="LowerPivotOffset">
          <group position={cfg.offsets.lower}>
            <primitive object={lowerTeeth} />
            <primitive object={lowerAligner} />
            <group ref={ghostLowerOffsetRef}>
              <primitive object={lowerGhost} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

ArchModel.displayName = 'ArchModel';

useGLTF.preload(SCENES_CONFIG.models.upperPath, SCENES_CONFIG.models.dracoDecoderPath);
useGLTF.preload(SCENES_CONFIG.models.lowerPath, SCENES_CONFIG.models.dracoDecoderPath);
