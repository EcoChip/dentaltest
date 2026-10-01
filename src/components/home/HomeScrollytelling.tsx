'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { clinicConfig } from '@/config/clinic.config';
import { Preloader } from '@/components/common/Preloader';
import { setupMasterScrollTimeline } from '@/lib/scroll/timeline';
import type { SceneHandles } from '@/components/three/Scene';
import { ArrowDown, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Carga diferida de la Escena 3D aislada en su propio componente
const Scene = dynamic(() => import('@/components/three/Scene').then((mod) => mod.Scene), {
  ssr: false,
});

export function HomeScrollytelling() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandles>(null);

  // Refs de las tarjetas HTML para animarlas directamente desde GSAP con 0 re-renders
  const cardS1Ref = useRef<HTMLDivElement>(null);
  const cardS2Ref = useRef<HTMLDivElement>(null);
  const cardS3Step1Ref = useRef<HTMLDivElement>(null);
  const cardS3Step2Ref = useRef<HTMLDivElement>(null);
  const cardS3Step3Ref = useRef<HTMLDivElement>(null);
  const cardS3Step4Ref = useRef<HTMLDivElement>(null);
  const cardS4FinalRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

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
    if (!preloaderDone) return;

    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;

    // Configuración del timeline maestro unificado de GSAP
    const cleanupTimeline = setupMasterScrollTimeline({
      stageElement: stage,
      sceneHandles: scene,
      onActiveSceneChange: (sceneId, progress) => {
        // Manipulación DOM directa sin setState para 0 re-renders
        const updateOpacity = (el: HTMLElement | null, visible: boolean) => {
          if (!el) return;
          el.style.opacity = visible ? '1' : '0';
          el.style.pointerEvents = visible ? 'auto' : 'none';
        };

        // Card S1 (Hero) visible durante la oclusión y la apertura anatómica (0 a 140 svh)
        // Se desvanece durante el dolly cinemático para dejar la experiencia 3D pura
        updateOpacity(cardS1Ref.current, progress < 0.14);
        updateOpacity(cardS2Ref.current, progress >= 0.28 && progress < 0.50);

        // Pasos del proceso clínico (100 svh por paso exacto)
        updateOpacity(cardS3Step1Ref.current, progress >= 0.50 && progress < 0.60);
        updateOpacity(cardS3Step2Ref.current, progress >= 0.60 && progress < 0.70);
        updateOpacity(cardS3Step3Ref.current, progress >= 0.70 && progress < 0.80);
        updateOpacity(cardS3Step4Ref.current, progress >= 0.80 && progress < 0.90);
        updateOpacity(cardS4FinalRef.current, progress >= 0.90 && progress < 0.98);
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
  }, [preloaderDone]);

  if (isFallbackMode) {
    return (
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
    );
  }

  return (
    <>
      <Preloader onLoaded={() => setPreloaderDone(true)} />

      {/* Escenario Maestro de Scrollytelling en svh */}
      <section
        ref={stageRef}
        className="relative w-full h-[1000svh] bg-canvas"
        aria-label="Escenario interactivo de ortodoncia invisible y biomecánica dental"
      >
        {/* Canvas Fijo a Pantalla Completa (detrás del contenido con pointer-events: none) */}
        <div
          ref={canvasContainerRef}
          className="fixed top-0 left-0 w-full h-screen h-[100svh] pointer-events-none z-0 transition-opacity duration-300"
          style={{ opacity: 1 }}
        >
          <Scene ref={sceneRef} />
        </div>

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

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-ink tracking-tight leading-[1.05] mb-6">
                La odontología estética no transforma tu sonrisa.{' '}
                <span className="italic font-normal text-accent block sm:inline">
                  Revela su armonía natural.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl mb-8">
                Ortodoncia invisible planificada mediante escáner intraoral 3D y simulación computacional de fuerzas biomecánicas. Precisión milimétrica bajo la dirección médica del {clinicConfig.medicalDirector.name}.
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
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md pointer-events-auto bg-canvas/90 backdrop-blur-md p-6 sm:p-8 border border-line-strong rounded-xs shadow-card">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-2">
                Ingeniería de Materiales
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight mb-4">
                SmartTrack®: Polímero termomoldeado de 0,75 mm
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-4">
                Material multicapa patentado que ofrece elasticidad constante de baja intensidad. Se adapta íntimamente a las crestas dentales y reproduce la línea del margen gingival mediante corte por láser individualizado.
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
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas/90 backdrop-blur-md p-6 sm:p-8 border border-line-strong rounded-xs shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  Protocolo Clínico
                </span>
                <span className="font-serif text-sm text-ink-muted">01 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                01. Escaneado Intraoral 3D iTero
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Registro óptico de 6.000 fotogramas por segundo. Sin pastas de impresión ni molestias, capturando la microanatomía dental en 3 minutos.
              </p>
            </div>
          </div>

          {/* Paso 2: Plan ClinCheck */}
          <div
            ref={cardS3Step2Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas/90 backdrop-blur-md p-6 sm:p-8 border border-line-strong rounded-xs shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  Protocolo Clínico
                </span>
                <span className="font-serif text-sm text-ink-muted">02 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                02. Planificación Digital ClinCheck®
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                El Dr. Alejandro Volta planifica cada micro-movimiento dental en software tridimensional. Visualizas el resultado final antes de comenzar.
              </p>
            </div>
          </div>

          {/* Paso 3: Serie de Alineadores */}
          <div
            ref={cardS3Step3Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas/90 backdrop-blur-md p-6 sm:p-8 border border-line-strong rounded-xs shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  Protocolo Clínico
                </span>
                <span className="font-serif text-sm text-ink-muted">03 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                03. Fabricación & Férulas Seriadas
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Recibes tu serie personalizada de alineadores transparentes. Cada juego se utiliza de 7 a 10 días, desplazando de forma milimétrica cada pieza.
              </p>
            </div>
          </div>

          {/* Paso 4: Retención Vivera */}
          <div
            ref={cardS3Step4Ref}
            className="fixed top-0 left-0 w-full h-screen h-[100svh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto transition-opacity duration-500 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div className="max-w-md ml-auto pointer-events-auto bg-canvas/90 backdrop-blur-md p-6 sm:p-8 border border-line-strong rounded-xs shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-line-subtle pb-3">
                <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold">
                  Protocolo Clínico
                </span>
                <span className="font-serif text-sm text-ink-muted">04 / 04</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">
                04. Retención & Estabilidad Vivera®
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Al concluir el movimiento activo, colocamos retenedores nocturnos de alta durabilidad para garantizar que la alineación permanezca inalterable.
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
            <div className="bg-canvas/95 backdrop-blur-md p-8 sm:p-10 border border-line-strong rounded-xs shadow-card pointer-events-auto max-w-2xl">
              <span className="text-[10px] uppercase tracking-clinical text-accent font-semibold block mb-3">
                Oclusión Perfecta Clase I
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight mb-4">
                Función masticatoria y armonía facial en equilibrio
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-lg mx-auto">
                Las arcadas asientan en su posición anatómica óptima. Equilibrio entre estética de la sonrisa, salud periodontal y protección articular.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
