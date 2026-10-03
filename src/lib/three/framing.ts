/**
 * CÁLCULO DE ENCUADRE ÓPTICO Y ZONA SEGURA 3D
 * 
 * Determina de forma analítica y adaptativa la distancia de cámara, FOV y view offset
 * basándose en:
 * 1. Caja envolvente anatómica real del modelo (arcada cerrada y abierta).
 * 2. Relación de aspecto (aspect) y FOV vertical de la cámara de Three.js.
 * 3. En móvil vertical, el ancho gobierna la distancia con un margen del 6–8%,
 *    verificando que la altura encaje holgadamente dentro de la zona segura superior (55–60% svh).
 * 4. Desplazamiento del centro óptico mediante camera.setViewOffset() sin deformar la perspectiva.
 */

export interface BoundingBox3D {
  min: [number, number, number];
  max: [number, number, number];
  width: number;
  height: number;
  depth: number;
  center: [number, number, number];
}

// Medidas anatómicas verificadas de las mallas GLB en coordenadas de escena
export const MODEL_BBOXES = {
  closed: {
    min: [-0.946, -0.375, -0.823] as [number, number, number],
    max: [0.944, 0.349, 0.846] as [number, number, number],
    width: 1.8904,
    height: 0.7238,
    depth: 1.6687,
    center: [0.0, -0.013, 0.011] as [number, number, number],
  },
  open: {
    min: [-0.951, -0.981, -0.945] as [number, number, number],
    max: [0.950, 0.668, 0.866] as [number, number, number],
    width: 1.9013,
    height: 1.6487,
    depth: 1.8113,
    center: [0.0, -0.156, -0.040] as [number, number, number],
  },
};

export interface FramingOptions {
  viewportWidth: number;
  viewportHeight: number;
  fov?: number; // Grados verticales (default: 33)
  fitMargin?: number; // Margen lateral (default: 0.07 = 7%)
  safeZoneHeightFraction?: number; // Fracción de altura en móvil (default: 0.58 = 58% svh)
  pose?: 'closed' | 'open';
  customBox?: BoundingBox3D;
  isLandscape?: boolean;
}

export interface FramingResult {
  cameraDistance: number;
  fov: number;
  offsetX: number;
  offsetY: number;
  targetOffset: [number, number, number];
  widthGoverns: boolean;
  safeZone: {
    top: number;
    bottom: number;
    height: number;
    centerY: number;
  };
  visibleWorld: {
    width: number;
    height: number;
  };
  modelScreenPercent: {
    width: number;
    height: number;
  };
}

export function calculateFraming(options: FramingOptions): FramingResult {
  const {
    viewportWidth: w,
    viewportHeight: h,
    fov = 33,
    fitMargin = 0.07, // 7% de margen lateral por defecto (dentro de 6-8%)
    safeZoneHeightFraction = 0.58, // 58% de altura útil superior para el modelo
    pose = 'closed',
    customBox,
  } = options;

  const box = customBox || (pose === 'open' ? MODEL_BBOXES.open : MODEL_BBOXES.closed);
  const aspect = w / h;
  const isLandscape = w > h;
  const isMobilePortrait = !isLandscape && w < 768;

  const radFovYHalf = ((fov * 0.5) * Math.PI) / 180;
  const tanFovYHalf = Math.tan(radFovYHalf);
  const tanFovXHalf = aspect * tanFovYHalf;

  let cameraDistance = 4.0;
  let offsetX = 0;
  let offsetY = 0;
  let widthGoverns = true;
  const targetOffset: [number, number, number] = [0, box.center[1], 0];

  const safeZone = {
    top: 0,
    bottom: isMobilePortrait ? Math.round(h * safeZoneHeightFraction) : h,
    height: isMobilePortrait ? Math.round(h * safeZoneHeightFraction) : h,
    centerY: isMobilePortrait ? (safeZoneHeightFraction * 0.5) : 0.5,
  };

  if (isMobilePortrait) {
    // -------------------------------------------------------------------------
    // MÓVIL VERTICAL (360x640, 375x667, 390x844, 430x932, 768x1024)
    // En vertical manda el ancho:
    // Ajustar por ancho con margen del 6-8% y verificar que cabe en la zona segura superior (55-60%)
    // -------------------------------------------------------------------------
    const availableWidthFactor = Math.max(0.70, 1.0 - 2 * fitMargin);
    const dWidth = (box.width * 0.5) / (availableWidthFactor * tanFovXHalf);

    // Verificación de altura en la zona segura (58% de la pantalla)
    const availableHeightFactor = Math.max(0.40, safeZoneHeightFraction * (1.0 - 2 * fitMargin));
    const dHeight = (box.height * 0.5) / (availableHeightFactor * tanFovYHalf);

    widthGoverns = dWidth >= dHeight;
    // La distancia que garantiza que ambos ejes caben con su margen
    const optimalDistance = Math.max(dWidth, dHeight);
    cameraDistance = optimalDistance;

    // Centrado exacto del modelo en la zona segura superior mediante setViewOffset:
    // El centro de la zona segura está a safeZoneHeightFraction / 2 desde la parte superior (ej: 0.29).
    // El centro del canvas completo está a 0.50.
    // Desplazamiento hacia arriba en fracción de pantalla:
    const upwardShiftFraction = 0.50 - safeZone.centerY; // ej: 0.50 - 0.29 = +0.21
    // En Three.js setViewOffset(w, h, offsetX, offsetY, w, h):
    // offsetY positivo mueve el frustum hacia abajo, haciendo que el modelo se proyecte hacia ARRIBA.
    offsetY = Math.round(h * upwardShiftFraction);
    offsetX = 0;

  } else if (isLandscape && h < 550) {
    // -------------------------------------------------------------------------
    // MÓVIL APAISADO (ej: 844x390, 667x375)
    // En apaisado manda la altura: texto a la izquierda, modelo a la derecha
    // -------------------------------------------------------------------------
    const availableHeightFactor = Math.max(0.60, 1.0 - 2 * fitMargin);
    cameraDistance = (box.height * 0.5) / (availableHeightFactor * tanFovYHalf);
    widthGoverns = false;

    // Modelo desplazado al cuadrante derecho (65-75% del ancho)
    offsetX = Math.round(-w * 0.22);
    offsetY = 0;

  } else if (w >= 1024) {
    // -------------------------------------------------------------------------
    // ESCRITORIO (1024, 1440, 1920)
    // Texto en columna izquierda (38-42%), modelo centrado a la derecha (74-76%)
    // -------------------------------------------------------------------------
    const availableHeightFactor = 0.84;
    cameraDistance = (box.height * 0.5) / (availableHeightFactor * tanFovYHalf);
    widthGoverns = false;

    const xFactor = w >= 1440 ? 0.22 : 0.25;
    offsetX = Math.round(-w * xFactor);
    offsetY = 0;

  } else {
    // Tablet vertical (768x1024)
    const availableWidthFactor = 1.0 - 2 * fitMargin;
    const dWidth = (box.width * 0.5) / (availableWidthFactor * tanFovXHalf);
    const availableHeightFactor = safeZoneHeightFraction * (1.0 - 2 * fitMargin);
    const dHeight = (box.height * 0.5) / (availableHeightFactor * tanFovYHalf);

    cameraDistance = Math.max(dWidth, dHeight);
    widthGoverns = dWidth >= dHeight;
    offsetY = Math.round(h * (0.50 - safeZone.centerY));
    offsetX = 0;
  }

  // Dimensiones del mundo visibles a la distancia calculada
  const visH = 2 * cameraDistance * tanFovYHalf;
  const visW = visH * aspect;

  return {
    cameraDistance,
    fov,
    offsetX,
    offsetY,
    targetOffset,
    widthGoverns,
    safeZone,
    visibleWorld: {
      width: visW,
      height: visH,
    },
    modelScreenPercent: {
      width: (box.width / visW) * 100,
      height: (box.height / visH) * 100,
    },
  };
}
