import * as THREE from 'three';
import { SCENES_CONFIG } from '@/config/scenes';

/**
 * SHADERS PARA ALINEADOR TRANSLÚCIDO DE ALTA FIDELIDAD Y RENDIMIENTO
 * Clínica Dental Cala — Fase 6 (Bloque A)
 *
 * Arquitectura de doble pasada:
 * 1. BackSide: Renderiza la cara interior con tinte médico profundo para dar volumen
 *    y masa al alineador (sin verse hueco).
 * 2. FrontSide: Renderiza la cara exterior transparente (ultra-translúcida en el centro,
 *    Fresnel en los bordes, reflejos especulares de estudio clínico y reborde luminoso).
 *
 * ZERO 'transmission' de Three.js -> Coste de renderizado mínimo (< +5% tiempo de frame).
 */

export interface AlignerUniforms {
  [key: string]: THREE.IUniform<any>;
  uColor: { value: THREE.Color };
  uFresnelColor: { value: THREE.Color };
  uDeepColor: { value: THREE.Color };
  uBackColor: { value: THREE.Color };
  uExtrusion: { value: number };
  uFresnelPower: { value: number };
  uBaseAlpha: { value: number };
  uEdgeAlpha: { value: number };
  uOpacity: { value: number };
  uReveal: { value: number };
  uScanBeam: { value: number };
  uQualityTier: { value: number }; // 1.0 = High (Desktop), 0.0 = Low (Mobile)
}

export function createAlignerUniforms(): AlignerUniforms {
  const cfg = SCENES_CONFIG.models.materials.aligner;
  return {
    uColor: { value: new THREE.Color(cfg.color) },
    uFresnelColor: { value: new THREE.Color(cfg.fresnelColor) },
    uDeepColor: { value: new THREE.Color(cfg.deepColor) },
    uBackColor: { value: new THREE.Color(cfg.backColor) },
    uExtrusion: { value: cfg.extrusion },
    uFresnelPower: { value: cfg.fresnelPower },
    uBaseAlpha: { value: cfg.baseAlpha },
    uEdgeAlpha: { value: cfg.edgeAlpha },
    uOpacity: { value: cfg.opacity },
    uReveal: { value: 0.0 },
    uScanBeam: { value: -1.0 },
    uQualityTier: { value: 1.0 },
  };
}

const vertexShader = `
  uniform float uExtrusion;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    // Extrusión a lo largo de las normales de la arcada dental
    vec3 newPos = position + normal * uExtrusion;
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(newPos, 1.0)).xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShaderBack = `
  uniform vec3 uDeepColor;
  uniform vec3 uBackColor;
  uniform float uReveal;
  uniform float uScanBeam;
  uniform float uOpacity;
  uniform float uQualityTier;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  void main() {
    float normalizedZ = clamp((vWorldPosition.z + 0.85) / 1.7, 0.0, 1.0);
    bool isRevealed = normalizedZ <= uReveal && uReveal > 0.005;
    bool isScanActive = uScanBeam >= 0.0;
    float normalizedX = clamp((vWorldPosition.x + 0.95) / 1.9, 0.0, 1.0);
    float scanGlow = isScanActive ? smoothstep(0.08, 0.0, abs(normalizedX - uScanBeam)) : 0.0;

    if (!isRevealed && scanGlow <= 0.01) {
      discard;
    }

    // Cara interior: invertir la normal para simular la luz refractada en la superficie cóncava
    vec3 normal = -normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    float fresnel = clamp(1.0 - abs(dot(normal, viewDir)), 0.0, 1.0);
    float interiorDepth = pow(fresnel, 1.8);

    // Tinte más oscuro y con cuerpo en el interior (da masa al alineador)
    vec3 color = mix(uDeepColor, uBackColor, interiorDepth);

    if (isRevealed) {
      float edgeGlow = smoothstep(0.06, 0.0, abs(normalizedZ - uReveal));
      color += vec3(0.2, 0.6, 0.9) * edgeGlow * 1.2;
    }

    if (scanGlow > 0.01) {
      color += vec3(0.1, 0.7, 1.0) * scanGlow * 2.2;
    }

    // En tier bajo la opacidad interior se atenúa para ahorrar coste de mezcla
    float alphaMultiplier = mix(0.5, 1.0, uQualityTier);
    float alpha = clamp(uOpacity * (0.16 + interiorDepth * 0.38) * alphaMultiplier, 0.0, 0.60);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const fragmentShaderFront = `
  uniform vec3 uColor;
  uniform vec3 uFresnelColor;
  uniform float uFresnelPower;
  uniform float uBaseAlpha;
  uniform float uEdgeAlpha;
  uniform float uReveal;
  uniform float uScanBeam;
  uniform float uQualityTier;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  void main() {
    float normalizedZ = clamp((vWorldPosition.z + 0.85) / 1.7, 0.0, 1.0);
    bool isRevealed = normalizedZ <= uReveal && uReveal > 0.005;
    bool isScanActive = uScanBeam >= 0.0;
    float normalizedX = clamp((vWorldPosition.x + 0.95) / 1.9, 0.0, 1.0);
    float scanGlow = isScanActive ? smoothstep(0.08, 0.0, abs(normalizedX - uScanBeam)) : 0.0;

    if (!isRevealed && scanGlow <= 0.01) {
      discard;
    }

    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Efecto Fresnel físico para polímero SmartTrack (0.75 mm)
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnel = clamp(1.0 - NdotV, 0.0, 1.0);
    float fresnelFactor = pow(fresnel, uFresnelPower);

    // Destellos especulares suaves de las fuentes de iluminación clínica
    vec3 lightDir1 = normalize(vec3(3.0, 5.0, 4.0));
    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    float spec1 = pow(max(dot(normal, halfDir1), 0.0), 40.0);

    vec3 lightDir2 = normalize(vec3(-3.5, -1.5, 3.0));
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 22.0);

    // Reborde luminoso fino en los ángulos tangenciales
    float rim = pow(fresnel, 4.6);

    // Reflejo especular de estudio analítico (simula softbox cenital sin envMap pesado)
    vec3 studioReflection = vec3(0.0);
    if (uQualityTier > 0.5) {
      vec3 reflDir = reflect(-viewDir, normal);
      float softboxTop = smoothstep(0.35, 0.90, reflDir.y) * 0.28;
      float softboxSide = smoothstep(0.40, 0.95, -reflDir.x) * 0.14;
      studioReflection = vec3(softboxTop + softboxSide);
    }

    // Mezcla de color: transparente en el centro + borde luminoso blanco diamante
    vec3 alignerColor = mix(uColor, uFresnelColor, fresnelFactor);
    alignerColor += uFresnelColor * (spec1 * 0.85 + spec2 * 0.35 + rim * 0.45);
    alignerColor += studioReflection;

    // Resplandor del corte gingival en el frente de revelado
    if (isRevealed) {
      float edgeGlow = smoothstep(0.07, 0.0, abs(normalizedZ - uReveal));
      alignerColor += vec3(0.35, 0.85, 1.0) * edgeGlow * 1.8;
    }

    // Haz de barrido láser del escáner intraoral 3D
    if (scanGlow > 0.01) {
      alignerColor += vec3(0.15, 0.80, 1.0) * scanGlow * 2.8;
    }

    // Translucidez: centro casi transparente (revela dientes), borde opaco
    float alpha = clamp(
      uBaseAlpha + fresnelFactor * uEdgeAlpha + spec1 * 0.40 + rim * 0.35,
      0.0,
      0.95
    );

    if (scanGlow > 0.01) {
      alpha = max(alpha, scanGlow * 0.9);
    }

    gl_FragColor = vec4(alignerColor, alpha);
  }
`;

export function createAlignerMaterials(uniforms: AlignerUniforms) {
  // 1. Pasada de caras traseras (BackSide)
  const backMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: fragmentShaderBack,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
  });

  // 2. Pasada de caras delanteras (FrontSide)
  const frontMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: fragmentShaderFront,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
  });

  return { backMaterial, frontMaterial };
}
