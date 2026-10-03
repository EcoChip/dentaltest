/**
 * SISTEMA GLOBAL DE MOVIMIENTO Y ANIMACIONES (Fuente Única de Verdad)
 * Clínica Dental Cala & Asociados
 *
 * Define duraciones, curvas de aceleración (easings), distancias, staggers
 * y utilidades de detección responsive y accesibilidad (prefers-reduced-motion y ?motion=off).
 */

export const MOTION_TOKENS = {
  // Duraciones en segundos (para GSAP) y milisegundos (para CSS)
  durations: {
    fast: 0.18, // 180 ms - Microinteracciones, hovers, ripples, toggles
    medium: 0.35, // 350 ms - Desplegables, tarjetas, transiciones de tabs, dialogos
    slow: 0.75, // 750 ms - Entradas editoriales, scroll reveals, máscaras
  },
  durationsMs: {
    fast: 180,
    medium: 350,
    slow: 750,
  },

  // Curvas de aceleración / Easings calibrados para estética clínica de alta gama
  easings: {
    // 1. Curva de Entrada: Deceleración elegante y quirúrgica
    entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
    entranceGsap: 'power3.out',

    // 2. Curva de Salida: Aceleración sobria sin rebote
    exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
    exitGsap: 'power2.in',

    // 3. Curva de Transición: Movimiento continuo y fluido
    transition: 'cubic-bezier(0.25, 1, 0.5, 1)',
    transitionGsap: 'power2.out',

    // 4. Micro-resorte ultra sutil (solo para magnetismo de cursor y toques :active)
    subtleSpring: 'cubic-bezier(0.34, 1.25, 0.64, 1)',
  },

  // Distancias de traslación espacial (en píxeles)
  distances: {
    sm: 8, // Microdesplazamientos de flechas y chips
    md: 16, // Subida de párrafos, listas y elementos secundarios
    lg: 24, // Titulares principales y revelados de tarjetas
  },

  // Tiempos de retardo escalonado entre hijos (Staggers)
  staggers: {
    tight: 0.04, // 40 ms - Enlaces de menú y listas densas
    normal: 0.06, // 60 ms - Tarjetas de tratamientos y columnas
    relaxed: 0.08, // 80 ms - Pasos del protocolo y doctores
  },

  // Umbrales de intersección para ScrollTrigger / IntersectionObserver
  thresholds: {
    default: 0.15,
    early: 0.05,
    late: 0.3,
  },

  // Modificadores para dispositivos móviles (reducción de 20-30% para agilidad)
  mobile: {
    distanceMultiplier: 0.75, // 25% menos recorrido
    durationMultiplier: 0.85, // 15% más rápido
    maxParallaxPercent: 0.04, // Parallax limitado a máx 4% en móvil
  },

  // Desplazamiento máximo de parallax en escritorio (±5–8%)
  parallax: {
    desktopOffset: 0.06, // 6%
    mobileOffset: 0.03, // 3%
  },
} as const;

/**
 * Determina si el sistema de animaciones debe desactivarse por completo:
 * 1. Preferencia de usuario del sistema operativo (prefers-reduced-motion: reduce)
 * 2. Parámetro explícito de depuración en URL (?motion=off)
 */
export function isMotionDisabled(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Comprobar parámetro en URL para testeo y benchmark (?motion=off)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('motion') === 'off') {
    return true;
  }

  // 2. Comprobar media query de accesibilidad
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Comprueba si el dispositivo actual soporta hover preciso de ratón (Escritorio)
 */
export function isHoverCapable(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Obtiene las distancias y duraciones adaptadas según si el viewport es móvil
 */
export function getResponsiveMotionParams(isMobile: boolean) {
  const disabled = isMotionDisabled();

  if (disabled) {
    return {
      durationFast: 0,
      durationMedium: 0,
      durationSlow: 0,
      distanceSm: 0,
      distanceMd: 0,
      distanceLg: 0,
      staggerNormal: 0,
      disabled: true,
    };
  }

  const factorDist = isMobile ? MOTION_TOKENS.mobile.distanceMultiplier : 1;
  const factorDur = isMobile ? MOTION_TOKENS.mobile.durationMultiplier : 1;

  return {
    durationFast: MOTION_TOKENS.durations.fast * factorDur,
    durationMedium: MOTION_TOKENS.durations.medium * factorDur,
    durationSlow: MOTION_TOKENS.durations.slow * factorDur,
    distanceSm: Math.round(MOTION_TOKENS.distances.sm * factorDist),
    distanceMd: Math.round(MOTION_TOKENS.distances.md * factorDist),
    distanceLg: Math.round(MOTION_TOKENS.distances.lg * factorDist),
    staggerNormal: MOTION_TOKENS.staggers.normal * factorDur,
    disabled: false,
  };
}
