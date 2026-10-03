import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES_CONFIG } from '@/config/scenes';
import type { SceneHandles } from '@/components/three/Scene';
import type { TechnicalBlueprintHandles } from '@/components/home/TechnicalBlueprint';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export interface TimelineSetupOptions {
  stageElement: HTMLElement;
  sceneHandles: SceneHandles;
  blueprintHandles?: TechnicalBlueprintHandles | null;
  countersRef?: {
    cases: HTMLElement | null;
    years: HTMLElement | null;
    concordance: HTMLElement | null;
  };
  onActiveSceneChange?: (sceneId: string, progress: number) => void;
  onCanvasOpacityChange?: (opacity: number) => void;
}

export function setupMasterScrollTimeline({
  stageElement,
  sceneHandles,
  blueprintHandles,
  countersRef,
  onActiveSceneChange,
  onCanvasOpacityChange,
}: TimelineSetupOptions) {
  const mm = gsap.matchMedia();

  // Rotación ociosa suave solo activa en la zona superior (Hero)
  let idleRafId: number | null = null;
  let isIdleActive = true;
  let idleAngle = 0;

  const runIdleRotation = () => {
    if (!isIdleActive) return;
    idleAngle += 0.002;
    if (sceneHandles.archModel?.mainRig) {
      sceneHandles.archModel.mainRig.rotation.y = Math.sin(idleAngle) * 0.12;
      sceneHandles.invalidate();
    }
    idleRafId = requestAnimationFrame(runIdleRotation);
  };
  runIdleRotation();

  // matchMedia para móvil y escritorio
  mm.add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
    },
    (context) => {
      const { isMobile } = context.conditions as { isDesktop: boolean; isMobile: boolean };
      const bpCfg = isMobile
        ? SCENES_CONFIG.camera.breakpoints.mobile
        : SCENES_CONFIG.camera.breakpoints.desktop;

      // Distancia de cámara calculada analíticamente a partir del aspect ratio y bounding box
      const calculated = sceneHandles.cameraRig?.getCalculatedFraming?.();
      const cameraDistance = isMobile && calculated?.cameraDistance
        ? calculated.cameraDistance
        : bpCfg.cameraDistance;

      // Aplicar encuadre inicial responsive al modelo y cámara
      if (sceneHandles.archModel?.mainRig) {
        sceneHandles.archModel.mainRig.position.set(0, 0, 0);
        sceneHandles.archModel.setAlignerReveal(1.0);
      }
      if (sceneHandles.cameraRig?.camera) {
        sceneHandles.cameraRig.camera.position.z = cameraDistance;
      }

      // Crear timeline maestro con scrub estricto
      const master = gsap.timeline({
        onUpdate: () => {
          sceneHandles.invalidate();
        },
        scrollTrigger: {
          trigger: stageElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;

            // Gestionar rotación ociosa: pausar de inmediato al iniciar el scroll
            if (p > 0.01 && isIdleActive) {
              isIdleActive = false;
              if (idleRafId) {
                cancelAnimationFrame(idleRafId);
                idleRafId = null;
              }
            } else if (p <= 0.01 && !isIdleActive) {
              isIdleActive = true;
              runIdleRotation();
            }

            // Desvanecimiento suave del canvas hacia el HTML final (DESPUÉS de S5: 1380 a 1400 svh)
            if (p >= 0.985) {
              const fade = Math.max(0, 1 - (p - 0.985) / 0.015);
              if (onCanvasOpacityChange) onCanvasOpacityChange(fade);
            } else {
              if (onCanvasOpacityChange) onCanvasOpacityChange(1);
            }

            // Notificación de escena activa para textos HTML (14 unidades de svh en total)
            if (onActiveSceneChange) {
              if (p < 0.214) onActiveSceneChange('s1_intro', p);
              else if (p < 0.357) onActiveSceneChange('s2_invisalign', p);
              else if (p < 0.643) onActiveSceneChange('s3_process', p);
              else if (p < 0.714) onActiveSceneChange('s4_occlusion', p);
              else if (p < 0.786) onActiveSceneChange('s5_beat1_cases', p);
              else if (p < 0.857) onActiveSceneChange('s5_beat2_years', p);
              else if (p < 0.929) onActiveSceneChange('s5_beat3_cert', p);
              else onActiveSceneChange('s5_beat4_concordance', p);
            }
          },
        },
      });

      // ====================================================================
      // ESCENA 1 (0 a 300 svh / relativo 0.00 a 0.30):
      // - 0 a 60: Rotación lenta flotante y oclusión cerrada
      // - 60 a 140: Apertura anatómica sobre eje de bisagra condilar
      // - 140 a 250: Dolly travelling cinemático por el hueco interoclusal
      // - 250 a 300: Transición con máscara/fundido a la landing
      // ====================================================================
      master.addLabel('s1_start', 0);

      // (0 a 60): Rotación sutil ociosa
      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            y: 0.06,
            duration: 0.6,
            ease: 'none',
          },
          0
        );
      }

      // (60 a 140): Apertura de bisagra anatómica
      // La superior sube y rota hacia atrás (-X); la inferior baja y rota hacia delante (+X) (power2.inOut)
      if (sceneHandles.archModel?.upperHinge && sceneHandles.archModel?.lowerHinge) {
        master.to(
          sceneHandles.archModel.upperHinge.rotation,
          {
            x: -0.08,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.6
        );

        master.to(
          sceneHandles.archModel.upperHinge.position,
          {
            y: SCENES_CONFIG.models.hinge.upperPivot[1] + 0.18,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.6
        );

        master.to(
          sceneHandles.archModel.lowerHinge.rotation,
          {
            x: 0.22,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.6
        );

        master.to(
          sceneHandles.archModel.lowerHinge.position,
          {
            y: SCENES_CONFIG.models.hinge.lowerPivot[1] - 0.25,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.6
        );
      }

      // (140 a 250): Dolly travelling cinemático por el hueco interoclusal
      if (sceneHandles.cameraRig?.camera) {
        // Avance de cámara hacia el interior del hueco interoclusal
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: 0,
            y: isMobile ? 0.55 : -0.02,
            z: isMobile ? 3.4 : 1.15,
            duration: 1.1,
            ease: 'power2.inOut',
          },
          1.4
        );

        // Orientación del target de la cámara a través del eje bucal
        if (sceneHandles.cameraRig?.target) {
          master.to(
            sceneHandles.cameraRig.target,
            {
              x: 0,
              y: isMobile ? 0.58 : -0.04,
              z: -0.3,
              duration: 1.1,
              ease: 'power2.inOut',
            },
            1.4
          );
        }
      }

      // (250 a 300): Transición y reencuadre hacia Escena 2
      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            z: cameraDistance - 0.2,
            y: 0,
            x: isMobile ? 0 : -0.45,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          2.5
        );

        if (sceneHandles.cameraRig?.target) {
          master.to(
            sceneHandles.cameraRig.target,
            {
              x: 0,
              y: 0,
              z: 0,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            2.5
          );
        }
      }

      // ====================================================================
      // BLOQUE C: CONTENIDO EN EL TRAMO VACÍO PREVIO A LAS ANOTACIONES (1.4 a 3.2)
      // 1. Cifra tipográfica gigante "0,75 mm" detrás del modelo con parallax
      // 2. Esquema técnico SVG con cota y trazado en scrub (stroke-dashoffset)
      // 3. Partículas sutiles de profundidad en el travelling (Points)
      // ====================================================================
      if (sceneHandles.depthParticles) {
        // Aparición sutil de partículas durante el travelling (1.4 a 1.8)
        master.to(
          { opacity: 0 },
          {
            opacity: 0.38,
            duration: 0.4,
            ease: 'power1.out',
            onUpdate: function () {
              sceneHandles.depthParticles?.setOpacity(this.targets()[0].opacity);
            },
          },
          1.4
        );

        // Desvanecimiento al acercarse a Escena 2 (2.7 a 3.1)
        master.to(
          { opacity: 0.38 },
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power1.in',
            onUpdate: function () {
              sceneHandles.depthParticles?.setOpacity(this.targets()[0].opacity);
            },
          },
          2.7
        );
      }

      if (blueprintHandles) {
        // Revelado suave del esquema técnico y cifra tipográfica (1.45 a 1.85)
        master.to(
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power1.out',
            onUpdate: function () {
              blueprintHandles?.setOpacity(this.targets()[0].opacity);
            },
          },
          1.45
        );

        // Trazado del esquema técnico sincronizado al scrub de scroll (1.5 a 2.7)
        master.to(
          { progress: 0 },
          {
            progress: 1,
            duration: 1.2,
            ease: 'power1.inOut',
            onUpdate: function () {
              blueprintHandles?.setDrawProgress(this.targets()[0].progress);
            },
          },
          1.5
        );

        // Parallax vertical de la cifra tipográfica respecto a la cámara (1.4 a 3.0)
        master.to(
          { y: 35 },
          {
            y: -45,
            duration: 1.6,
            ease: 'none',
            onUpdate: function () {
              blueprintHandles?.setParallaxY(this.targets()[0].y);
            },
          },
          1.4
        );

        // Fundido de salida completo antes de que comiencen las anotaciones (2.8 a 3.2)
        master.to(
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power1.in',
            onUpdate: function () {
              blueprintHandles?.setOpacity(this.targets()[0].opacity);
            },
          },
          2.8
        );
      }

      // ====================================================================
      // ESCENA 2 (300 a 500 svh / relativo 0.30 a 0.50):
      // - Modelo se estabiliza a un lado (derecha en desktop, arriba en móvil)
      // - 3 Anotaciones DOM proyectadas ancladas a puntos de la arcada
      // ====================================================================
      master.addLabel('s2_invisalign', 3.0);

      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            y: 0.52,
            x: 0.04,
            duration: 1.5,
            ease: 'power2.inOut',
          },
          3.0
        );
      }

      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: isMobile ? 0 : -0.72,
            z: cameraDistance - 0.2,
            y: isMobile ? 0 : 0.05,
            duration: 1.5,
            ease: 'power2.inOut',
          },
          3.0
        );
      }

      // Revelar anotaciones DOM en Escena 2 (3.3 a 4.7)
      master.to(
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power1.out',
          onUpdate: function () {
            const val = this.targets()[0].opacity;
            sceneHandles.annotations?.setGlobalOpacity(val);
          },
        },
        3.3
      );

      // Sincronizar índice del anclaje móvil activo con el scrub de scroll (3.3 a 4.7)
      master.to(
        {},
        {
          duration: 1.4,
          ease: 'none',
          onUpdate: function () {
            const p = this.progress();
            const idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
            sceneHandles.annotations?.setActiveAnchorIndex(idx);
          },
        },
        3.3
      );

      // Ocultar anotaciones al final de Escena 2 (4.7 a 5.0)
      master.to(
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.in',
          onUpdate: function () {
            const val = this.targets()[0].opacity;
            sceneHandles.annotations?.setGlobalOpacity(val);
          },
        },
        4.7
      );

      // ====================================================================
      // ESCENA 3 (500 a 900 svh / relativo 0.50 a 0.90):
      // - Paso 1 (5.0 a 6.0): Escáner intraoral 3D (barrido de haz de luz)
      // - Paso 2 (6.0 a 7.0): Plan ClinCheck (inspección oclusal tridimensional)
      // - Paso 3 (7.0 a 8.0): Capa alineador transparente SmartTrack (revelado uReveal)
      // - Paso 4 (8.0 a 9.0): Oclusión Clase I y destello especular de luz
      // ====================================================================
      master.addLabel('s3_process', 5.0);

      // Transición previa: retiro virtual del alineador para escanear el esmalte dental (4.75 a 5.0)
      master.to(
        { reveal: 1 },
        {
          reveal: 0,
          duration: 0.25,
          ease: 'power1.inOut',
          onUpdate: function () {
            sceneHandles.archModel?.setAlignerReveal(this.targets()[0].reveal);
          },
        },
        4.75
      );

      // Paso 1: Escáner intraoral 3D (5.1 a 5.95)
      master.to(
        { scan: -1 },
        {
          scan: 0,
          duration: 0.05,
          onUpdate: function () {
            sceneHandles.archModel?.setScanBeam(this.targets()[0].scan);
          },
        },
        5.05
      );

      master.to(
        { scan: 0 },
        {
          scan: 1,
          duration: 0.85,
          ease: 'power1.inOut',
          onUpdate: function () {
            sceneHandles.archModel?.setScanBeam(this.targets()[0].scan);
          },
        },
        5.1
      );

      master.to(
        { scan: 1 },
        {
          scan: -1,
          duration: 0.05,
          onUpdate: function () {
            sceneHandles.archModel?.setScanBeam(this.targets()[0].scan);
          },
        },
        5.95
      );

      // Orientación sutil para el escáner y recentrado de cámara
      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: 0,
            y: 0,
            z: cameraDistance,
            duration: 0.9,
            ease: 'power1.inOut',
          },
          5.0
        );
      }

      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            x: 0.28,
            y: 0.15,
            duration: 0.9,
            ease: 'power1.inOut',
          },
          5.0
        );
      }

      // Paso 2: Planificación digital ClinCheck (6.0 a 7.0)
      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            x: 0.42,
            y: -0.22,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          6.0
        );
      }

      // Paso 3: Revelado del alineador SmartTrack (7.0 a 8.0)
      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            x: 0.14,
            y: 0.22,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          7.0
        );
      }

      master.to(
        { reveal: 0 },
        {
          reveal: 1,
          duration: 0.9,
          ease: 'power2.inOut',
          onUpdate: function () {
            sceneHandles.archModel?.setAlignerReveal(this.targets()[0].reveal);
          },
        },
        7.05
      );

      // Paso 4: Oclusión Perfecta Clase I y Destello Especular (8.0 a 8.8)
      // Arcadas convergen a posición cerrada
      if (sceneHandles.archModel?.upperHinge && sceneHandles.archModel?.lowerHinge) {
        master.to(
          sceneHandles.archModel.upperHinge.rotation,
          { x: 0, duration: 0.8, ease: 'power2.out' },
          8.0
        );
        master.to(
          sceneHandles.archModel.upperHinge.position,
          { y: SCENES_CONFIG.models.hinge.upperPivot[1], duration: 0.8, ease: 'power2.out' },
          8.0
        );
        master.to(
          sceneHandles.archModel.lowerHinge.rotation,
          { x: 0, duration: 0.8, ease: 'power2.out' },
          8.0
        );
        master.to(
          sceneHandles.archModel.lowerHinge.position,
          { y: SCENES_CONFIG.models.hinge.lowerPivot[1], duration: 0.8, ease: 'power2.out' },
          8.0
        );
      }

      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          { x: 0, y: 0, duration: 0.8, ease: 'power2.out' },
          8.0
        );
      }

      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: 0,
            y: 0,
            z: cameraDistance,
            duration: 0.8,
            ease: 'power2.out',
          },
          8.0
        );
      }

      // Destello especular en oclusión final
      master.to(
        { glow: 0 },
        {
          glow: SCENES_CONFIG.lighting.pointGlow.maxIntensity,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: function () {
            sceneHandles.lighting?.setGlowIntensity(this.targets()[0].glow);
          },
        },
        8.3
      );

      master.to(
        { glow: SCENES_CONFIG.lighting.pointGlow.maxIntensity },
        {
          glow: 0,
          duration: 0.4,
          ease: 'power1.in',
          onUpdate: function () {
            sceneHandles.lighting?.setGlowIntensity(this.targets()[0].glow);
          },
        },
        8.7
      );

      // ====================================================================
      // ESCENA 4 (900 a 1000 svh / unidades 9.0 a 10.0):
      // Oclusión Perfecta Clase I y Armonía Facial
      // ====================================================================
      master.addLabel('s4_occlusion', 9.0);

      // ====================================================================
      // ESCENA 5 (1000 a 1400 svh / unidades 10.0 a 14.0):
      // EVIDENCIA CLÍNICA DOCUMENTADA (4 BEATS DE SCROLL SCRUBBEADOS)
      // - Beat 1 (10.0 a 11.0): 1.450+ Casos | Cámara se acerca lentamente
      // - Beat 2 (11.0 a 12.0): 18 Años | Rotación lenta mostrando estabilidad
      // - Beat 3 (12.0 a 13.0): Invisalign Apex | Encuadre frontal de sonrisa
      // - Beat 4 (13.0 a 14.0): 98,7% Previsibilidad | Sobreimpresión fantasma
      // ====================================================================
      master.addLabel('s5_evidence', 10.0);
      master.addLabel('s5_beat1_cases', 10.0);

      const counterVals = {
        cases: 0,
        years: 0,
        concordance: 0,
      };

      // --------------------------------------------------------------------
      // BEAT 1 (10.0 a 11.0): 1.450+ Casos Clínicos Finalizados
      // --------------------------------------------------------------------
      master.to(
        counterVals,
        {
          cases: 1450,
          duration: 0.85,
          ease: 'power1.out',
          onUpdate: () => {
            if (countersRef?.cases) {
              const val = Math.round(counterVals.cases);
              countersRef.cases.textContent = `${val.toLocaleString('es-ES')}+`;
            }
          },
        },
        10.05
      );

      // Cámara se acerca lentamente a los dientes mientras el número sube
      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: isMobile ? 0 : 0.12,
            y: 0,
            z: cameraDistance - (isMobile ? 0.65 : 0.75),
            duration: 0.9,
            ease: 'power2.inOut',
          },
          10.0
        );
      }

      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.position,
          {
            x: isMobile ? 0 : 0.35,
            y: 0,
            z: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          10.0
        );
      }

      // --------------------------------------------------------------------
      // BEAT 2 (11.0 a 12.0): 18 Años de Ejercicio Continuado
      // --------------------------------------------------------------------
      master.addLabel('s5_beat2_years', 11.0);

      master.to(
        counterVals,
        {
          years: 18,
          duration: 0.85,
          ease: 'power1.out',
          onUpdate: () => {
            if (countersRef?.years) {
              const val = Math.round(counterVals.years);
              countersRef.years.textContent = `${val} años`;
            }
          },
        },
        11.05
      );

      // Rotación lenta de la arcada mostrando estabilidad
      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            y: isMobile ? 0.38 : 0.42,
            x: isMobile ? 0.04 : 0.05,
            duration: 0.9,
            ease: 'power1.inOut',
          },
          11.0
        );

        master.to(
          sceneHandles.archModel.mainRig.position,
          {
            x: isMobile ? 0 : -0.35,
            y: 0,
            z: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          11.0
        );
      }

      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: isMobile ? 0 : -0.15,
            y: isMobile ? 0 : 0.02,
            z: cameraDistance - (isMobile ? 0.2 : 0.25),
            duration: 0.9,
            ease: 'power2.inOut',
          },
          11.0
        );
      }

      // --------------------------------------------------------------------
      // BEAT 3 (12.0 a 13.0): Certificación Invisalign Apex (Top 1% Europa)
      // --------------------------------------------------------------------
      master.addLabel('s5_beat3_cert', 12.0);

      // Encuadre frontal de la sonrisa
      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            y: 0,
            x: 0.02,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          12.0
        );

        master.to(
          sceneHandles.archModel.mainRig.position,
          {
            x: isMobile ? 0 : 0.30,
            y: 0,
            z: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          12.0
        );
      }

      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: isMobile ? 0 : 0.1,
            y: isMobile ? 0 : 0,
            z: cameraDistance - (isMobile ? 0.35 : 0.4),
            duration: 0.9,
            ease: 'power2.inOut',
          },
          12.0
        );
      }

      // --------------------------------------------------------------------
      // BEAT 4 (13.0 a 14.0): 98,7% Previsibilidad Biomecánica & Ghost Snap
      // --------------------------------------------------------------------
      master.addLabel('s5_beat4_concordance', 13.0);

      // Sobreimpresión tipo «fantasma» translúcido del plan original sobre el resultado con borde luminoso
      master.to(
        { ghost: 0 },
        {
          ghost: 1,
          duration: 0.85,
          ease: 'power2.inOut',
          onUpdate: function () {
            sceneHandles.archModel?.setGhostProgress(this.targets()[0].ghost);
          },
        },
        13.05
      );

      // Contador scrubbeado a 98,7%
      master.to(
        counterVals,
        {
          concordance: 98.7,
          duration: 0.85,
          ease: 'power1.out',
          onUpdate: () => {
            if (countersRef?.concordance) {
              const val = counterVals.concordance.toFixed(1).replace('.', ',');
              countersRef.concordance.textContent = `${val}%`;
            }
          },
        },
        13.05
      );

      if (sceneHandles.archModel?.mainRig) {
        master.to(
          sceneHandles.archModel.mainRig.position,
          {
            x: isMobile ? 0 : -0.32,
            y: 0,
            z: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          13.0
        );

        master.to(
          sceneHandles.archModel.mainRig.rotation,
          {
            y: isMobile ? 0.15 : 0.16,
            x: isMobile ? 0.03 : 0.04,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          13.0
        );
      }

      if (sceneHandles.cameraRig?.camera) {
        master.to(
          sceneHandles.cameraRig.camera.position,
          {
            x: isMobile ? 0 : -0.12,
            y: 0,
            z: cameraDistance - (isMobile ? 0.4 : 0.45),
            duration: 0.9,
            ease: 'power2.inOut',
          },
          13.0
        );
      }

      // Normalizar duración total a exactamente 14.0 unidades (1 unidad = 100 svh)
      master.addLabel('s5_end', 14.0);
      master.to({}, { duration: 1.0 }, 13.0);

      return () => {
        master.kill();
      };
    }
  );

  return () => {
    isIdleActive = false;
    if (idleRafId) cancelAnimationFrame(idleRafId);
    mm.revert();
  };
}
