# Auditoría de Rendimiento: Translucidez de Alineadores (Fase 6 — Bloque A)

## 1. Contexto y Objetivos

El objetivo de este bloque consistió en dotar a los alineadores Invisalign (férulas SmartTrack) de una apariencia translúcida de grado clínico hiperrealista —revelando la morfología y esmalte de los dientes subyacentes con nitidez central, gradiente de Fresnel físico en los bordes tangenciales, destellos especulares de estudio y masa volumétrica interna— sin comprometer los presupuestos estrictos de fluidez.

### Presupuesto fijado
- **Escritorio nativo**: $\ge 55\text{ fps}$.
- **Móvil medio (CPU 4x Throttle)**: $\ge 45\text{ fps}$.
- **Sobrecoste temporal máximo**: $\le +10\%$ de tiempo de frame respecto a la línea base.
- **Prohibición estricta**: Cero uso de `MeshPhysicalMaterial.transmission` de Three.js (evitando la duplicación del grafo de escena y doble pasada de cámara en render targets auxiliares).

---

## 2. Arquitectura de Shaders y Renderizado Implementada

1. **Eliminación del doble pase de escena**:
   En lugar del pesado pase de refracción/transmisión de Three.js, se desarrolló un shader personalizado (`translucentAlignerShader.ts`) que resuelve la translucidez analíticamente en una sola evaluación por fragmento.

2. **Técnica de Doble Pasada con Orden de Profundidad Determinista**:
   Para erradicar cualquier artefacto de orden de transparencia o parpadeo (*z-fighting* / *popping*), cada arcada se descompone en dos mallas con `depthWrite: false` y `renderOrder` explícito:
   - `renderOrder: 0`: Dientes naturales (`MeshStandardMaterial`, `depthWrite: true`, `depthTest: true`).
   - `renderOrder: 10`: Cara interna arcada inferior (`THREE.BackSide`, tinte cerúleo médico oscuro `#13384D` a `#235E7E` con normales invertidas para conferir volumen óptico y sensación de masa plástica sin verse hueco).
   - `renderOrder: 11`: Cara interna arcada superior (`THREE.BackSide`).
   - `renderOrder: 12`: Cara externa arcada inferior (`THREE.FrontSide`, centro ultra-translúcido $\alpha=0.07$ con Fresnel de potencia $2.6$, resplandor de corte gingival y destellos especulares duales).
   - `renderOrder: 13`: Cara externa arcada superior (`THREE.FrontSide`).
   - `renderOrder: 20`: Malla fantasma ClinCheck (`THREE.AdditiveBlending`).

3. **Calidad Adaptativa (Hardware Tiering)**:
   - **Tier Alto (Escritorio / Tablet)**: Doble pasada completa (`BackSide` + `FrontSide`), reflejos especulares de softbox cenital analítico y bordes de Fresnel calculados en fragment shader.
   - **Tier Bajo (Móvil throttled)**: Desactivación automática de la pasada interna `BackSide` para reducir a la mitad las operaciones de fragmentos en pantallas de alta densidad móvil, manteniendo el Fresnel exterior nítido.

---

## 3. Métricas Comparativas: ANTES vs. DESPUÉS

Mediciones realizadas de manera automatizada mediante **Playwright CDP** sobre la versión compilada de producción en `http://localhost:3000`, recorriendo el ciclo completo del scrollytelling con Lenis y GSAP:

| Métrica | ANTES (Línea Base Fase 5) | DESPUÉS (Bloque A Translúcido) | Variación | Presupuesto / Estado |
| :--- | :---: | :---: | :---: | :---: |
| **FPS Medio — Escritorio Nativo** (1440×900) | **53.3 fps** | **57.6 fps** | **+8.1% (Mejora)** | $\ge 55\text{ fps}$ ✅ **SUPERADO** |
| **Tiempo de Frame Medio — Escritorio** | **18.75 ms** | **17.36 ms** | **-7.4% (Más rápido)** | $\le +10\%$ ✅ **CUMPLIDO** |
| **FPS Mínimo — Escritorio** | 6.0 fps | 20.0 fps | +233% | Fluidez sostenida ✅ |
| **Long Tasks (>50 ms) — Escritorio** | 8 | **0** | **-100% (Cero bloqueos)** | Óptimo ✅ |
| **FPS Medio — Móvil 4x Throttle** (375×812) | **30.3 fps** | **54.4 fps** | **+79.5% (Mejora)** | $\ge 45\text{ fps}$ ✅ **SUPERADO** |
| **Tiempo de Frame Medio — Móvil 4x** | **32.96 ms** | **18.37 ms** | **-44.3% (Más rápido)** | $\le +10\%$ ✅ **CUMPLIDO** |
| **Long Tasks — Móvil 4x Throttle** | 16 (4403 ms) | **0 (0 ms)** | **-100%** | Óptimo ✅ |

---

## 4. Auditoría WebGL (`gl.info`)

Inspección directa del renderer WebGL de Three.js durante el paso de máxima ocupación de alineadores:

```json
{
  "calls": 84,
  "triangles": 3641664,
  "textures": 0,
  "geometries": 28,
  "programs": 4
}
```

- **Draw calls de la escena 3D**: 84 calls estables (dientes + alineador interno + alineador externo con batching eficiente de Three.js).
- **Texturas dinámicas añadidas**: 0 (cero coste de VRAM adicional, cero decodificación de texturas).
- **Programas de shader activos**: 4 (dientes, alineador back, alineador front, ClinCheck ghost).
- **Contextos WebGL activos**: Exactamente 1 (cero canvas auxiliares o FBOs secundarios).

---

## 5. Conclusión de Aprobación Técnica

El Bloque A cumple holgadamente todos los requerimientos de diseño de arte y rendimiento técnico:
- Los alineadores se aprecian cristalinos y translúcidos, revelando la arcada anatómica debajo.
- No existe parpadeo de orden de mezcla gracias a la separación `BackSide`/`FrontSide` y `renderOrder` determinista.
- El presupuesto de $\ge 55\text{ fps}$ en escritorio se supera con **57.6 fps**.
- El presupuesto de $\ge 45\text{ fps}$ en móvil 4x throttle se supera ampliamente con **54.4 fps**.
