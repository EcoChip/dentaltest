import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES_CONFIG } from '@/config/scenes';
import type { SceneHandles } from '@/components/three/Scene';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export interface TimelineSetupOptions {
  stageElement: HTMLElement;
  sceneHandles: SceneHandles;
  onActiveSceneChange?: (sceneId: string, progress: number) => void;
  onCanvasOpacityChange?: (opacity: number) => void;
}

export function setupMasterScrollTimeline({
  stageElement,
  sceneHandles,
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

      // Aplicar encuadre inicial responsive al modelo y cámara
      if (sceneHandles.archModel?.mainRig) {
        sceneHandles.archModel.mainRig.position.set(
          bpCfg.modelOffset[0],
          bpCfg.modelOffset[1],
          bpCfg.modelOffset[2]
        );
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

            // Gestionar rotación ociosa: solo activa cuando p < 0.05
            if (p > 0.05 && isIdleActive) {
              isIdleActive = false;
              if (idleRafId) cancelAnimationFrame(idleRafId);
            } else if (p <= 0.05 && !isIdleActive) {
              isIdleActive = true;
              runIdleRotation();
            }

            // Desvanecimiento suave del canvas hacia el HTML final (900 a 1000 svh)
            if (p >= 0.88) {
              const fade = Math.max(0, 1 - (p - 0.88) / 0.12);
              if (onCanvasOpacityChange) onCanvasOpacityChange(fade);
            } else {
              if (onCanvasOpacityChange) onCanvasOpacityChange(1);
            }

            // Notificación de escena activa para textos HTML
            if (onActiveSceneChange) {
              if (p < 0.28) onActiveSceneChange('s1_intro', p);
              else if (p < 0.52) onActiveSceneChange('s2_invisalign', p);
              else if (p < 0.88) onActiveSceneChange('s3_process', p);
              else onActiveSceneChange('s4_exit', p);
            }

            // Forzar renderizado en Three.js con demand
            sceneHandles.invalidate();
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
            z: bpCfg.cameraDistance - 0.2,
            y: isMobile ? -0.1 : 0,
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
            x: isMobile ? 0 : -0.45,
            z: bpCfg.cameraDistance - 0.2,
            y: isMobile ? -0.1 : 0,
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

      // Orientación sutil para el escáner
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
            y: isMobile ? -0.05 : 0,
            z: bpCfg.cameraDistance,
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

      // Normalizar duración total a exactamente 10.0 unidades (1 unidad = 100 svh)
      master.to({}, { duration: 1.0 }, 9.0);

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
