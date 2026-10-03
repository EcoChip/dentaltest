'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { SCENES_CONFIG } from '@/config/scenes';
import { createAlignerUniforms, createAlignerMaterials } from './translucentAlignerShader';

export interface AnchorWorldData {
  position: THREE.Vector3;
  normal: THREE.Vector3;
}

export interface ArchModelHandles {
  mainRig: THREE.Group | null;
  upperHinge: THREE.Group | null;
  lowerHinge: THREE.Group | null;
  setAlignerReveal: (progress: number) => void;
  setScanBeam: (progress: number) => void;
  setGhostProgress: (progress: number) => void;
  setQualityTier: (tier: 'high' | 'low') => void;
  getAnchorWorldData: (index: number) => AnchorWorldData | null;
  getUpperMesh: () => THREE.Object3D | null;
  getLowerMesh: () => THREE.Object3D | null;
}

export const ArchModel = forwardRef<ArchModelHandles, { className?: string; tier?: 'high' | 'low' }>(
  ({ tier = 'high' }, ref) => {
    const mainRigRef = useRef<THREE.Group>(null);
    const upperHingeRef = useRef<THREE.Group>(null);
    const lowerHingeRef = useRef<THREE.Group>(null);
    const ghostUpperOffsetRef = useRef<THREE.Group>(null);
    const ghostLowerOffsetRef = useRef<THREE.Group>(null);

    // Refs para anclajes anatómicos vinculados al modelo
    const anchor1Ref = useRef<THREE.Group>(null);
    const anchor2Ref = useRef<THREE.Group>(null);
    const anchor3Ref = useRef<THREE.Group>(null);
    const tempAnchorPos = useRef(new THREE.Vector3());
    const tempAnchorNormal = useRef(new THREE.Vector3());

    const cfg = SCENES_CONFIG.models;

    // Carga con decodificador Draco local exclusivo (cero CDN externos)
    const upperGltf = useGLTF(cfg.upperPath, cfg.dracoDecoderPath);
    const lowerGltf = useGLTF(cfg.lowerPath, cfg.dracoDecoderPath);

    // Material de dientes: MeshStandardMaterial de alto rendimiento con culling FrontSide
    const teethMaterial = useMemo(() => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(cfg.materials.teeth.color),
        roughness: 0.32,
        metalness: 0.04,
        side: THREE.FrontSide,
      });
    }, [cfg]);

    // Materiales translúcidos de dos pasadas para el alineador SmartTrack
    // BackSide (volumen interno oscuro/tintado) + FrontSide (centro transparente + Fresnel + especular)
    const alignerUniforms = useMemo(() => createAlignerUniforms(), []);
    const { backMaterial, frontMaterial } = useMemo(
      () => createAlignerMaterials(alignerUniforms),
      [alignerUniforms]
    );

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

    // Sombra de contacto óptica difusa para anclar el modelo sobre el lienzo luminoso
    const contactShadowMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          void main() {
            vec2 center = vUv - vec2(0.5);
            center.x *= 0.82;
            float dist = length(center);
            float core = smoothstep(0.35, 0.02, dist) * 0.16;
            float penumbra = smoothstep(0.48, 0.08, dist) * 0.10;
            float alpha = core + penumbra;
            gl_FragColor = vec4(vec3(0.08, 0.13, 0.14), alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }, []);

    // Clonar geometrías y aplicar materiales con orden determinista de renderizado:
    // Dientes (0) -> Inferior Back (10) -> Superior Back (11) -> Inferior Front (12) -> Superior Front (13) -> Ghost (20)
    const { upperTeeth, upperAlignerBack, upperAlignerFront, upperGhost } = useMemo(() => {
      const teeth = upperGltf.scene.clone(true);
      teeth.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.material = teethMaterial;
          m.renderOrder = 0;
        }
      });

      const alignerBack = upperGltf.scene.clone(true);
      alignerBack.visible = true;
      alignerBack.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.material = backMaterial;
          m.renderOrder = 11;
        }
      });

      const alignerFront = upperGltf.scene.clone(true);
      alignerFront.visible = true;
      alignerFront.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.material = frontMaterial;
          m.renderOrder = 13;
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

      return {
        upperTeeth: teeth,
        upperAlignerBack: alignerBack,
        upperAlignerFront: alignerFront,
        upperGhost: ghost,
      };
    }, [upperGltf, teethMaterial, backMaterial, frontMaterial, ghostMaterial]);

    const { lowerTeeth, lowerAlignerBack, lowerAlignerFront, lowerGhost } = useMemo(() => {
      const teeth = lowerGltf.scene.clone(true);
      teeth.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.material = teethMaterial;
          m.renderOrder = 0;
        }
      });

      const alignerBack = lowerGltf.scene.clone(true);
      alignerBack.visible = true;
      alignerBack.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.material = backMaterial;
          m.renderOrder = 10;
        }
      });

      const alignerFront = lowerGltf.scene.clone(true);
      alignerFront.visible = true;
      alignerFront.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.material = frontMaterial;
          m.renderOrder = 12;
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

      return {
        lowerTeeth: teeth,
        lowerAlignerBack: alignerBack,
        lowerAlignerFront: alignerFront,
        lowerGhost: ghost,
      };
    }, [lowerGltf, teethMaterial, backMaterial, frontMaterial, ghostMaterial]);

    // Sincronizar tier adaptativo
    useEffect(() => {
      const isLow = tier === 'low';
      alignerUniforms.uQualityTier.value = isLow ? 0.0 : 1.0;
      const shouldBeVisible =
        alignerUniforms.uReveal.value > 0.005 || alignerUniforms.uScanBeam.value >= 0.0;
      upperAlignerFront.visible = shouldBeVisible;
      lowerAlignerFront.visible = shouldBeVisible;
      upperAlignerBack.visible = !isLow && shouldBeVisible;
      lowerAlignerBack.visible = !isLow && shouldBeVisible;
    }, [tier, alignerUniforms, upperAlignerFront, lowerAlignerFront, upperAlignerBack, lowerAlignerBack]);

    // Exponer API imperativa para que el timeline de GSAP mute directamente sin re-renders
    useImperativeHandle(ref, () => ({
      mainRig: mainRigRef.current,
      upperHinge: upperHingeRef.current,
      lowerHinge: lowerHingeRef.current,
      setQualityTier: (newTier: 'high' | 'low') => {
        const isLow = newTier === 'low';
        alignerUniforms.uQualityTier.value = isLow ? 0.0 : 1.0;
        const shouldBeVisible =
          alignerUniforms.uReveal.value > 0.005 || alignerUniforms.uScanBeam.value >= 0.0;
        upperAlignerBack.visible = !isLow && shouldBeVisible;
        lowerAlignerBack.visible = !isLow && shouldBeVisible;
        upperAlignerFront.visible = shouldBeVisible;
        lowerAlignerFront.visible = shouldBeVisible;
      },
      setAlignerReveal: (progress: number) => {
        alignerUniforms.uReveal.value = progress;
        const shouldBeVisible = progress > 0.005 || alignerUniforms.uScanBeam.value >= 0.0;
        const isLow = alignerUniforms.uQualityTier.value < 0.5;

        if (upperAlignerFront.visible !== shouldBeVisible) {
          upperAlignerFront.visible = shouldBeVisible;
          lowerAlignerFront.visible = shouldBeVisible;
        }
        const backVisible = !isLow && shouldBeVisible;
        if (upperAlignerBack.visible !== backVisible) {
          upperAlignerBack.visible = backVisible;
          lowerAlignerBack.visible = backVisible;
        }
      },
      setScanBeam: (progress: number) => {
        alignerUniforms.uScanBeam.value = progress;
        const shouldBeVisible = progress >= 0.0 || alignerUniforms.uReveal.value > 0.005;
        const isLow = alignerUniforms.uQualityTier.value < 0.5;

        if (upperAlignerFront.visible !== shouldBeVisible) {
          upperAlignerFront.visible = shouldBeVisible;
          lowerAlignerFront.visible = shouldBeVisible;
        }
        const backVisible = !isLow && shouldBeVisible;
        if (upperAlignerBack.visible !== backVisible) {
          upperAlignerBack.visible = backVisible;
          lowerAlignerBack.visible = backVisible;
        }
      },
      setGhostProgress: (progress: number) => {
        const isVisible = progress > 0.002;
        if (upperGhost.visible !== isVisible) {
          upperGhost.visible = isVisible;
          lowerGhost.visible = isVisible;
        }
        ghostUniforms.uOpacity.value = Math.min(1.0, progress * 1.35);
        ghostUniforms.uSnap.value =
          progress > 0.91 ? Math.sin(((progress - 0.91) / 0.09) * Math.PI) : 0.0;

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
      getAnchorWorldData: (index: number) => {
        const anchors = [
          { ref: anchor1Ref, normal: [0.22, 0.68, 0.70] },
          { ref: anchor2Ref, normal: [-0.08, 0.15, 0.98] },
          { ref: anchor3Ref, normal: [0.18, 0.94, 0.28] },
        ];
        const target = anchors[index];
        if (!target || !target.ref.current) return null;

        target.ref.current.getWorldPosition(tempAnchorPos.current);
        tempAnchorNormal.current
          .set(target.normal[0], target.normal[1], target.normal[2])
          .transformDirection(target.ref.current.matrixWorld)
          .normalize();

        return {
          position: tempAnchorPos.current,
          normal: tempAnchorNormal.current,
        };
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
              <primitive object={upperAlignerBack} />
              <primitive object={upperAlignerFront} />
              <group ref={ghostUpperOffsetRef}>
                <primitive object={upperGhost} />
              </group>
              {/* Anclajes Anatómicos Arcada Superior */}
              <group ref={anchor1Ref} position={[0.18, 0.28, 0.44]} name="AnchorGingival" />
              <group ref={anchor2Ref} position={[-0.06, 0.08, 0.56]} name="AnchorIncisor" />
            </group>
          </group>
        </group>

        {/* Grupo Bisagra Arcada Inferior */}
        <group ref={lowerHingeRef} position={[lPiv[0], lPiv[1], lPiv[2]]} name="LowerHinge">
          <group position={[-lPiv[0], -lPiv[1], -lPiv[2]]} name="LowerPivotOffset">
            <group position={cfg.offsets.lower}>
              <primitive object={lowerTeeth} />
              <primitive object={lowerAlignerBack} />
              <primitive object={lowerAlignerFront} />
              <group ref={ghostLowerOffsetRef}>
                <primitive object={lowerGhost} />
              </group>
              {/* Anclaje Anatómico Arcada Inferior */}
              <group ref={anchor3Ref} position={[0.38, 0.12, 0.15]} name="AnchorOcclusal" />
            </group>
          </group>
        </group>

        {/* Sombra de Contacto Óptica Suave */}
        <mesh position={[0, -0.62, 0.12]} rotation={[-Math.PI / 2, 0, 0]} material={contactShadowMaterial}>
          <planeGeometry args={[3.2, 2.5]} />
        </mesh>
      </group>
    );
  }
);

ArchModel.displayName = 'ArchModel';

useGLTF.preload(SCENES_CONFIG.models.upperPath, SCENES_CONFIG.models.dracoDecoderPath);
useGLTF.preload(SCENES_CONFIG.models.lowerPath, SCENES_CONFIG.models.dracoDecoderPath);
