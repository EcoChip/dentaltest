import * as THREE from 'three';

export interface BreakpointConfig {
  cameraDistance: number;
  cameraPosition: [number, number, number];
  modelOffset: [number, number, number];
  fov: number;
  dprMax: number;
}

export const SCENES_CONFIG = {
  models: {
    upperPath: '/models/arcada_superior.glb',
    lowerPath: '/models/arcada_inferior.glb',
    dracoDecoderPath: '/draco/',
    // Bisagra anatómica (eje X en cóndilos mandibulares)
    hinge: {
      axis: [1, 0, 0] as [number, number, number],
      upperPivot: [0.0, 0.25, -0.95] as [number, number, number],
      lowerPivot: [0.0, 0.15, -0.95] as [number, number, number],
    },
    // Offsets de montaje anatómico del GLB para oclusión cerrada inicial
    offsets: {
      upper: [0.0, -0.10, 0.0] as [number, number, number],
      lower: [0.0, 0.10, 0.0] as [number, number, number],
    },
    // Materiales de alta fidelidad clínica (MeshPhysicalMaterial)
    materials: {
      teeth: {
        color: '#FBF8F2', // Esmalte dental natural, luminoso y limpio
        roughness: 0.32,
        metalness: 0.0,
        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        reflectivity: 0.5,
      },
      aligner: {
        color: '#F4F9FB', // Plástico médico casi incoloro, cristalino y transparente
        fresnelColor: '#FFFFFF', // Blanco diamante para reflejos especulares de clínica diáfana
        deepColor: '#A8C7D2', // Tinte claro y suave de poliuretano (se elimina el azul oscuro #13384D)
        backColor: '#D2E4EB', // Cara interior clara con volumen sutil
        opacity: 0.65, // Ligero y transparente
        fresnelPower: 2.8,
        baseAlpha: 0.035, // Transparencia central casi pura (3.5%): esmalte visible nítido
        edgeAlpha: 0.52, // Opacidad suave en tangentes: 52% (silueta fina sin pesadez)
        extrusion: 0.007, // Extrusión a lo largo de las normales (0.75 mm escala)
      },
    },
  },
  camera: {
    fov: 32,
    near: 0.01,
    far: 100,
    lookAtDefault: [0, 0, 0] as [number, number, number],
    breakpoints: {
      mobile: {
        cameraDistance: 4.8,
        cameraPosition: [0, -0.2, 4.8],
        modelOffset: [0, 0.60, 0], // En retrato eleva el modelo dejando libre la zona inferior
        fov: 34,
        dprMax: 1.5,
      } as BreakpointConfig,
      tablet: {
        cameraDistance: 4.4,
        cameraPosition: [0, 0, 4.4],
        modelOffset: [0, 0.15, 0],
        fov: 32,
        dprMax: 1.75,
      } as BreakpointConfig,
      desktop: {
        cameraDistance: 3.9,
        cameraPosition: [0, 0, 3.9],
        modelOffset: [0, 0, 0],
        fov: 32,
        dprMax: 2.0,
      } as BreakpointConfig,
      wide: {
        cameraDistance: 3.7,
        cameraPosition: [0, 0, 3.7],
        modelOffset: [0, 0, 0],
        fov: 30,
        dprMax: 2.0,
      } as BreakpointConfig,
    },
  },
  lighting: {
    keyLight: {
      color: '#FFFFFF',
      intensity: 2.2,
      position: [3.0, 5.0, 4.0] as [number, number, number],
    },
    fillLight: {
      color: '#F6F9FA', // Relleno blanco clínico neutro y suave
      intensity: 1.2,
      position: [-3.5, -1.0, 3.0] as [number, number, number],
    },
    rimLight: {
      color: '#FFFFFF', // Luz de contorno blanca brillante
      intensity: 1.4,
      position: [0.0, 4.0, -3.5] as [number, number, number],
    },
    ambientLight: {
      color: '#FFFFFF',
      intensity: 0.85,
    },
    pointGlow: {
      color: '#70E0D0',
      maxIntensity: 2.5,
      distance: 6.0,
      position: [0.0, 0.0, 1.5] as [number, number, number],
    },
    shadows: {
      opacity: 0.35,
      blur: 2.2,
      position: [0, -0.75, 0] as [number, number, number],
    },
  },
  scrollRanges: {
    intro: {
      totalSvh: 300,
      rotationIdleEnd: 60,
      separationEnd: 140,
      dollyEnd: 250,
      transitionEnd: 300,
    },
    invisalign: {
      startSvh: 300,
      endSvh: 500,
    },
    process: {
      startSvh: 500,
      endSvh: 900,
      step1Scanner: 600,
      step2Plan: 700,
      step3Aligner: 800,
      step4Review: 900,
    },
    occlusion: {
      startSvh: 900,
      endSvh: 1000,
    },
    evidence: {
      startSvh: 1000,
      beat1Cases: 1100,
      beat2Years: 1200,
      beat3Cert: 1300,
      beat4Concordance: 1400,
      endSvh: 1400,
    },
    fadeExit: {
      startSvh: 1380,
      endSvh: 1400,
    },
  },
};
