'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { clinicConfig } from '@/config/clinic.config';
import { siteContent } from '@/content/site';
import { Preloader } from '@/components/common/Preloader';
import { setupMasterScrollTimeline } from '@/lib/scroll/timeline';
import type { SceneHandles } from '@/components/three/Scene';
import { ArrowDown, CheckCircle2, ShieldCheck, Sparkles, Award, FileCheck } from 'lucide-react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { TrustMetricsSection } from '@/components/home/TrustMetricsSection';
import { TechnicalBlueprint, TechnicalBlueprintHandles } from './TechnicalBlueprint';

// Carga diferida de la Escena 3D aislada en su propio componente
const Scene = dynamic(() => import('@/components/three/Scene').then((mod) => mod.Scene), {
  ssr: false,
});

export function HomeScrollytelling() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandles>(null);
  const blueprintRef = useRef<TechnicalBlueprintHandles>(null);
  const typographyContainerRef = useRef<HTMLDivElement>(null);
  const typographyTextRef = useRef<HTMLDivElement>(null);

  // Refs de las tarjetas HTML para animarlas directamente desde GSAP con 0 re-renders
  const cardS1Ref = useRef<HTMLDivElement>(null);
  const cardS2Ref = useRef<HTMLDivElement>(null);
  const cardS3Step1Ref = useRef<HTMLDivElement>(null);
  const cardS3Step2Ref = useRef<HTMLDivElement>(null);
  const cardS3Step3Ref = useRef<HTMLDivElement>(null);
  const cardS3Step4Ref = useRef<HTMLDivElement>(null);
  const cardS4FinalRef = useRef<HTMLDivElement>(null);

  // S5: Evidencia Clínica (4 beats de scroll scrubbeados)
  const cardS5Beat1Ref = useRef<HTMLDivElement>(null);
  const cardS5Beat2Ref = useRef<HTMLDivElement>(null);
  const cardS5Beat3Ref = useRef<HTMLDivElement>(null);
  const cardS5Beat4Ref = useRef<HTMLDivElement>(null);

  // Elementos DOM para contadores numéricos scrubbeados por scroll
  const casesCounterRef = useRef<HTMLSpanElement>(null);
  const yearsCounterRef = useRef<HTMLSpanElement>(null);
  const concordanceCounterRef = useRef<HTMLSpanElement>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    // Comprobar preferencia de movimiento reducido o ausencia de soporte WebGL
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hasWebGL = true;
    try {
      const c = document.createElement('canvas');
      hasWebGL = !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      hasWebGL = false;
    }

    if (prefersReduced || !hasWebGL) {
      setIsFallbackMode(true);
      setPreloaderDone(true);
    }
  }, []);

  useEffect(() => {
    if (!preloaderDone || !is3DReady) return;

    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;

    // Configuración del timeline maestro unificado de GSAP
    const cleanupTimeline = setupMasterScrollTimeline({
      stageElement: stage,
      sceneHandles: scene,
      blueprintHandles: blueprintRef.current,
      countersRef: {
        cases: casesCounterRef.current,
        years: yearsCounterRef.current,
        concordance: concordanceCounterRef.current,
      },
      onActiveSceneChange: (sceneId, progress) => {
        // Manipulación DOM directa sin setState para 0 re-renders
        const updateOpacity = (el: HTMLElement | null, visible: boolean) => {
          if (!el) return;
          el.style.opacity = visible ? '1' : '0';
          el.style.pointerEvents = visible ? 'auto' : 'none';
        };

        // Escena 1 a 4 (escala relativa a 1400 svh / 14 unidades)
        const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
        updateOpacity(cardS1Ref.current, progress < 0.10);
        updateOpacity(
          cardS2Ref.current,
          isDesktop
            ? progress >= 0.20 && progress < 0.35
            : progress >= 0.20 && progress < 0.25
        );

        // Pasos del proceso clínico
        updateOpacity(cardS3Step1Ref.current, progress >= 0.35 && progress < 0.42);
        updateOpacity(cardS3Step2Ref.current, progress >= 0.42 && progress < 0.50);
        updateOpacity(cardS3Step3Ref.current, progress >= 0.50 && progress < 0.57);
        updateOpacity(cardS3Step4Ref.current, progress >= 0.57 && progress < 0.64);
        updateOpacity(cardS4FinalRef.current, progress >= 0.64 && progress < 0.71);

        // Escena 5: Evidencia clínica en 4 beats
        updateOpacity(cardS5Beat1Ref.current, progress >= 0.71 && progress < 0.785);
        updateOpacity(cardS5Beat2Ref.current, progress >= 0.785 && progress < 0.855);
        updateOpacity(cardS5Beat3Ref.current, progress >= 0.855 && progress < 0.925);
        updateOpacity(cardS5Beat4Ref.current, progress >= 0.925 && progress < 0.985);
      },
      onCanvasOpacityChange: (opacity) => {
        if (canvasContainerRef.current) {
          canvasContainerRef.current.style.opacity = `${opacity}`;
          canvasContainerRef.current.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
        }
      },
    });

    // Refrescar ScrollTrigger tras inicializar
    ScrollTrigger.refresh();

    return () => {
      cleanupTimeline();
    };
  }, [preloaderDone, is3DReady]);

  if (isFallbackMode) {
    return (
      <>
        <section className="relative w-full bg-canvas text-ink py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        {/* Hero Accesible */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs mb-6 shadow-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
                {clinicConfig.tagline}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-light text-ink tracking-tight leading-[1.05] mb-6">
              La odontología estética no transforma tu sonrisa.{' '}
              <span className="italic font-normal text-accent block sm:inline">
                Revela su armonía natural.
              </span>
            </h1>

            <p className="text-base text-ink-secondary leading-relaxed max-w-xl mb-8">
              Ortodoncia invisible planificada mediante escáner intraoral 3D y simulación computacional de fuerzas biomecánicas. Precisión milimétrica bajo la dirección médica del {clinicConfig.medicalDirector.name}.
            </p>

            <a
              href="#contacto"
              className="inline-flex items-center px-6 py-3.5 bg-ink text-canvas hover:bg-accent transition-colors duration-200 text-xs tracking-clinical uppercase font-medium rounded-xs"
            >
              Pedir primera consulta de diagnóstico
            </a>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative border border-line-strong rounded-xs overflow-hidden shadow-card bg-surface">
              <img
                src="/images/hero-fallback-arch.png"
                alt="Arcadas dentales en oclusión Clase I planificada"
                className="w-full h-auto object-cover"
              />
              <div className="p-4 bg-canvas/90 border-t border-line-subtle text-[11px] text-ink-secondary">
                Simulación anatómica oclusal Clase I en reposo
              </div>
            </div>
          </div>
        </div>

        {/* Sección SmartTrack */}
        <div className="bg-surface p-8 sm:p-12 border border-line-strong rounded-xs shadow-card mb-24">
          <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
            Ingeniería de Materiales
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight mb-4">
            SmartTrack®: Polímero termomoldeado de 0,75 mm
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed mb-6 max-w-3xl">
            Material multicapa patentado que ofrece elasticidad constante de baja intensidad. Se adapta íntimamente a las crestas dentales y reproduce la línea del margen gingival mediante corte por láser individualizado.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ink-muted">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Sin alambres metálicos ni rozaduras mucosas</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Extraíble para higiene bucal y alimentación normal</span>
            </div>
          </div>
        </div>

        {/* Proceso en 4 Pasos Accesible */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
              Protocolo Clínico
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
              El proceso hacia una oclusión fisiológica perfecta
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-surface border border-line-subtle rounded-xs shadow-subtle">
              <span className="font-serif text-xl text-accent mb-2 block">01</span>
              <h3 className="font-serif text-lg text-ink mb-2">Escaneo Intraoral 3D</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Registro óptico de 6.000 fps sin pastas de impresión ni náuseas en 3 minutos.
              </p>
            </div>
            <div className="p-6 bg-surface border border-line-subtle rounded-xs shadow-subtle">
              <span className="font-serif text-xl text-accent mb-2 block">02</span>
              <h3 className="font-serif text-lg text-ink mb-2">Plan ClinCheck® 3D</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Planificación computacional de fuerzas y visualización previa del resultado.
              </p>
            </div>
            <div className="p-6 bg-surface border border-line-subtle rounded-xs shadow-subtle">
              <span className="font-serif text-xl text-accent mb-2 block">03</span>
              <h3 className="font-serif text-lg text-ink mb-2">Férulas Seriadas</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Alineadores transparentes con cambio cada 7–10 días con microdesplazamiento continuo.
              </p>
            </div>
            <div className="p-6 bg-surface border border-line-subtle rounded-xs shadow-subtle">
              <span className="font-serif text-xl text-accent mb-2 block">04</span>
              <h3 className="font-serif text-lg text-ink mb-2">Retención Vivera®</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Retenedores nocturnos de alta durabilidad para garantizar estabilidad de por vida.
              </p>
            </div>
          </div>
        </div>
      </section>
      <TrustMetricsSection />
    </>
  );
}

return (
  <>
    <Preloader onLoaded={() => setPreloaderDone(true)} />

    {/* Escenario Maestro de Scrollytelling en svh (14 unidades = 1400 svh) */}
    <section
      ref={stageRef}
      className="relative w-full h-[1400svh] bg-canvas"
      aria-label="Escenario interactivo de ortodoncia invisible y biomecánica dental"
    >
        {/* Póster de carga progresiva inmediato (< 0.2 s) para garantizar CERO frames en blanco */}
        <div
          className="fixed top-0 left-0 w-full h-screen h-[100svh] pointer-events-none z-0 flex items-center justify-center transition-opacity duration-700 bg-canvas"
          style={{ opacity: is3DReady ? 0 : 1 }}
        >
          <div className="relative w-full max-w-4xl px-6 flex items-center justify-center">
            <img
              src="/images/hero-fallback-arch.png"
              alt="Arcadas dentales en oclusión estética"
              className="w-full max-w-md h-auto object-contain opacity-95"
              loading="eager"
            />
          </div>
        </div>

        {/* Capa de Fondo (Detrás del 3D): Cifra Tipográfica Gigante 0,75 mm con Parallax (Bloque C) */}
        <div
          ref={typographyContainerRef}
          className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center transition-opacity duration-300 overflow-hidden"
          style={{ opacity: 0, visibility: 'hidden' }}
          aria-hidden="true"
        >
          <div ref={typographyTextRef} className="relative text-center will-change-transform">
            <span
              className="font-serif text-[22vw] lg:text-[18vw] font-light leading-none tracking-tighter block select-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.2px rgba(27, 78, 94, 0.18)',
              }}
            >
              0,75 mm
            </span>
            <span className="font-mono text-[10px] lg:text-xs tracking-clinical uppercase text-accent/50 block mt-2">
              Calibración de espesor biomecánico · SmartTrack®
            </span>
          </div>
        </div>

        {/* Canvas Fijo a Pantalla Completa (z-1, detrás del contenido con pointer-events: none) */}
        <div
          ref={canvasContainerRef}
          className="fixed top-0 left-0 w-full h-screen h-[100svh] pointer-events-none z-1 transition-opacity duration-500 bg-transparent"
          style={{ opacity: is3DReady ? 1 : 0 }}
        >
          <Scene ref={sceneRef} onSceneReady={() => setIs3DReady(true)} />
        </div>

        {/* Esquema Técnico SVG Frontal (Bloque C) */}
        <TechnicalBlueprint
          ref={blueprintRef}
          typographyContainerRef={typographyContainerRef}
          typographyTextRef={typographyTextRef}
        />

        {/* Capa de Contenido HTML con scroll natural sobre el Canvas */}
        <div className="relative z-10 w-full pointer-events-none">
          {/* ==============================================================
              ESCENA 1: Intro y Oclusión Frontal (0 a 300 svh)
              ============================================================== */}
          <div
            ref={cardS1Ref}
            className="fixed top-0 left-0 right-0 w-full h-screen h-[100svh] flex flex-col justify-center pt-20 sm:pt-28 px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-auto z-20"
            style={{ opacity: 1 }}
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface border border-line-subtle rounded-xs mb-6 shadow-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] tracking-clinical uppercase text-ink font-medium">
                  {clinicConfig.tagline}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-ink tracking-tight leading-[1.15] mb-6">
                La odontología estética no transforma tu sonrisa.{' '}
                <span className="italic text-accent block sm:inline">
                  Revela su armonía natural.
                </span>
              </h1>

              <p className="text-base text-ink-secondary leading-relaxed max-w-xl mb-8">
                Ortodoncia invisible planificada mediante escáner intraoral 3D y simulación de fuerzas biomecánicas. Precisión milimétrica bajo la dirección médica de la {clinicConfig.medicalDirector.name}.
              </p>

              <div className="flex items-center space-x-3 text-xs tracking-clinical uppercase text-ink-muted">
                <ArrowDown className="w-4 h-4 text-accent animate-bounce" />
                <span>Desplaza para observar la anatomía y desarticulación</span>
              </div>
            </div>
          </div>

          {/* ==============================================================
              ESCENA 2: Qué es Invisalign & SmartTrack (300 a 500 svh)
              ============================================================== */}
          <div
            ref={cardS2Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-end pb-24 lg:pb-0 lg:justify-center px-6 lg:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md pointer-events-auto bg-canvas/95 lg:bg-canvas backdrop-blur-sm p-6 sm:p-8 border border-line-strong rounded-card shadow-card">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
                El material
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight mb-4">
                Alineadores SmartTrack: precisión de 0,75 mm
              </h2>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mb-4">
                Plástico biomédico multicapa que aplica una presión suave y continua sobre cada diente. Se recorta con precisión láser siguiendo la línea natural de tu encía para evitar cualquier molestia.
              </p>
              <div className="space-y-2 pt-2 border-t border-line-subtle text-xs text-ink-muted">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  <span>Sin alambres metálicos ni rozaduras mucosas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  <span>Extraíble para higiene bucal y alimentación normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==============================================================
              ESCENA 3: El Proceso en 4 Pasos (500 a 900 svh)
              ============================================================== */}
          {/* Paso 1: Escáner iTero */}
          <div
            ref={cardS3Step1Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas p-6 sm:p-8 border border-line-strong rounded-card shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  El proceso
                </span>
                <span className="font-serif text-sm text-ink-muted">01 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                01. Escáner intraoral 3D
              </h3>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
                Registro óptico de alta precisión en solo 3 minutos. Sin pastas de impresión ni molestias, capturando cada detalle anatómico con total exactitud.
              </p>
            </div>
          </div>

          {/* Paso 2: Plan ClinCheck */}
          <div
            ref={cardS3Step2Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas p-6 sm:p-8 border border-line-strong rounded-card shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  El proceso
                </span>
                <span className="font-serif text-sm text-ink-muted">02 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                02. Plan digital a tu medida
              </h3>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
                La Dra. Elena Cala diseña cada fase del movimiento dental en 3D. Podrás ver cómo evolucionará y cómo quedará tu sonrisa antes de empezar.
              </p>
            </div>
          </div>

          {/* Paso 3: Serie de Alineadores */}
          <div
            ref={cardS3Step3Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas p-6 sm:p-8 border border-line-strong rounded-card shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  El proceso
                </span>
                <span className="font-serif text-sm text-ink-muted">03 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                03. Tus alineadores personalizados
              </h3>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
                Recibes tu serie de férulas transparentes. Cada juego se utiliza entre 7 y 10 días, guiando tus dientes a su posición de forma gradual y cómoda.
              </p>
            </div>
          </div>

          {/* Paso 4: Retención */}
          <div
            ref={cardS3Step4Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas p-6 sm:p-8 border border-line-strong rounded-card shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  El proceso
                </span>
                <span className="font-serif text-sm text-ink-muted">04 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                04. Revisiones y retención
              </h3>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
                Al concluir el movimiento activo, fijamos retenedores nocturnos a medida para mantener la alineación y armonía de tu sonrisa a lo largo de los años.
              </p>
            </div>
          </div>

          {/* ==============================================================
              ESCENA 4: Oclusión Clase I y Resultado Final (900 svh)
              ============================================================== */}
          <div
            ref={cardS4FinalRef}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center items-center text-center px-6 max-w-4xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="bg-canvas p-8 sm:p-10 border border-line-strong rounded-card shadow-card pointer-events-auto max-w-2xl">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-3">
                Oclusión en armonía
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-4">
                Función masticatoria y armonía facial en equilibrio
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-lg mx-auto">
                Las arcadas asientan en su posición anatómica óptima. Equilibrio entre estética de la sonrisa, salud periodontal y protección articular.
              </p>
            </div>
          </div>

          {/* ==============================================================
              ESCENA 5: Evidencia Clínica (1000 a 1400 svh / 4 beats)
              ============================================================== */}

          {/* Beat 1: Casos Clínicos Finalizados (1000 a 1100 svh) */}
          <div
            ref={cardS5Beat1Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-start md:justify-center pt-24 sm:pt-28 md:pt-0 px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none z-20"
            style={{ opacity: 0 }}
          >
            <div className="max-w-lg pointer-events-auto bg-canvas p-6 sm:p-10 border border-line-strong rounded-card shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Evidencia clínica · 01 / 04
                </span>
                <span className="text-[9px] uppercase tracking-clinical text-ink-muted bg-surface px-2 py-0.5 rounded-card border border-line-subtle font-mono">
                  {siteContent.trustMetrics[0].sourceTag}
                </span>
              </div>

              <div className="mb-2">
                <span
                  ref={casesCounterRef}
                  className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-ink tracking-tight tabular-numbers block leading-none"
                >
                  0+
                </span>
              </div>

              <h3 className="text-xs sm:text-sm uppercase tracking-clinical font-semibold text-ink mb-3">
                {siteContent.trustMetrics[0].label}
              </h3>

              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-4">
                {siteContent.trustMetrics[0].detail} Todos los tratamientos cuentan con registro cefalométrico computacional previo y seguimiento oclusal postratamiento.
              </p>

              <div className="pt-3 border-t border-line-subtle text-[11px] text-ink-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>Cámara en aproximación lenta: macrofotografía del detalle oclusal</span>
              </div>
            </div>
          </div>

          {/* Beat 2: Ejercicio Facultativo Continuado (1100 a 1200 svh) */}
          <div
            ref={cardS5Beat2Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-start md:justify-center items-center sm:items-end pt-24 sm:pt-28 md:pt-0 px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none z-20"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md w-full ml-auto pointer-events-auto bg-canvas p-6 sm:p-9 border border-line-strong rounded-card shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  Trayectoria · 02 / 04
                </span>
                <span className="text-[9px] uppercase tracking-clinical text-ink-muted bg-surface px-2 py-0.5 rounded-card border border-line-subtle font-mono">
                  {siteContent.trustMetrics[1].sourceTag}
                </span>
              </div>

              <div className="mb-2">
                <span
                  ref={yearsCounterRef}
                  className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-ink tracking-tight tabular-numbers block leading-none"
                >
                  0 años
                </span>
              </div>

              <h3 className="text-xs sm:text-sm uppercase tracking-clinical font-semibold text-ink mb-2">
                {siteContent.trustMetrics[1].label}
              </h3>

              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-4">
                {siteContent.trustMetrics[1].detail} Criterio conservador basado en la preservación del esmalte dental y la función masticatoria fisiológica.
              </p>

              <div className="pt-3 border-t border-line-subtle text-[11px] text-ink-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>Rotación orbital: estabilidad tridimensional de la arcada</span>
              </div>
            </div>
          </div>

          {/* Beat 3: Certificación Oficial Invisalign Apex (1200 a 1300 svh) */}
          <div
            ref={cardS5Beat3Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-start md:justify-center pt-24 sm:pt-28 md:pt-0 px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none z-20"
            style={{ opacity: 0 }}
          >
            <div className="max-w-lg pointer-events-auto bg-canvas p-6 sm:p-10 border border-line-strong rounded-card shadow-card relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-line-subtle rounded-card">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] tracking-clinical uppercase text-accent font-semibold">
                    Certificación oficial · 03 / 04
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-clinical text-ink-muted bg-surface px-2 py-0.5 rounded-card border border-line-subtle font-mono">
                  {siteContent.trustMetrics[2].sourceTag}
                </span>
              </div>

              <div className="mb-2">
                <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ink tracking-tight block leading-tight">
                  {siteContent.trustMetrics[2].value}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm uppercase tracking-clinical font-semibold text-ink mb-3">
                {siteContent.trustMetrics[2].label}
              </h3>

              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-5">
                {siteContent.trustMetrics[2].detail} Máxima categoría facultativa otorgada por Align Technology basada en volumen documentado, rigor biomecánico y predictibilidad en casos complejos.
              </p>

              <div className="p-3 bg-surface border border-line-subtle rounded-card text-[11px] text-ink-secondary flex items-center justify-between">
                <span className="font-medium text-ink">Supervisión facultativa continua</span>
                <span className="text-accent font-semibold tracking-clinical uppercase text-[10px]">
                  Encuadre frontal clínico
                </span>
              </div>
            </div>
          </div>

          {/* Beat 4: Previsibilidad Biomecánica & Ghost Arch (1300 a 1400 svh) */}
          <div
            ref={cardS5Beat4Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-start md:justify-center items-center sm:items-end pt-24 sm:pt-28 md:pt-0 px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none z-20"
            style={{ opacity: 0 }}
          >
            <div className="max-w-lg w-full ml-auto pointer-events-auto bg-canvas p-6 sm:p-10 border border-line-strong rounded-card shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Previsibilidad digital · 04 / 04
                </span>
                <span className="text-[9px] uppercase tracking-clinical text-ink-muted bg-surface px-2 py-0.5 rounded-card border border-line-subtle font-mono">
                  {siteContent.trustMetrics[3].sourceTag}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-accent/30 rounded-card mb-4">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] tracking-clinical uppercase text-accent font-semibold">
                  Plan ClinCheck ↔ Oclusión Real
                </span>
              </div>

              <div className="mb-2">
                <span
                  ref={concordanceCounterRef}
                  className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-ink tracking-tight tabular-numbers block leading-none"
                >
                  0,0%
                </span>
              </div>

              <h3 className="text-xs sm:text-sm uppercase tracking-clinical font-semibold text-ink mb-3">
                {siteContent.trustMetrics[3].label}
              </h3>

              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-4">
                {siteContent.trustMetrics[3].detail} Sobreimpresión del modelo matemático predictivo sobre el resultado oclusal alcanzado, demostrando tolerancia inferior a 0,2 mm.
              </p>

              <div className="pt-3 border-t border-line-subtle text-[11px] text-ink-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>Sobreimpresión fantasma con borde luminoso encajada en el modelo</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
