# Auditoría de Rendimiento 3D — ANTES (Línea Base)
**Entorno de Medición**: Chrome DevTools Protocol con CPU 4x Throttling (Simulación Dispositivo Gama Media)  
**Resolución de Prueba**: 1440 x 900 px (DPR 2.0)  
**Fecha**: 1 de octubre de 2026  

---

## 1. Métricas Cuantitativas Registradas

| Métrica de Rendimiento | Valor Inicial (Antes) | Umbral Objetivo del Brief | Estado |
| :--- | :---: | :---: | :---: |
| **FPS Promedio (Scroll)** | **20.4 fps** | $ge$ 55 fps | ⚠️ A mejorar |
| **FPS Mínimo (Tirones/Stutter)** | **0.7 fps** | $ge$ 45 fps | ❌ Crítico |
| **FPS 1% Low** | **0.7 fps** | $ge$ 45 fps | ❌ Crítico |
| **Long Tasks (> 50 ms)** | **49 tareas** | 0 tareas | ❌ Crítico |
| **Long Tasks Severos (> 100 ms)** | **14 tareas** | 0 tareas | ❌ Crítico |
| **Long Task Máxima** | **2671 ms** | < 50 ms | ❌ Bloqueo hilo principal |
| **Duración Acumulada Long Tasks** | **12278 ms** | < 100 ms | ❌ Saturación |
| **Tiempo de Scripting (CDP)** | **9715 ms** | Mínimo | — |
| **Tiempo de Layout (CDP)** | **2856 ms** | Mínimo | — |
| **Contextos WebGL Activos** | **3** | 1 único | ⚠️ Verificar |
| **Memoria JS Heap Usada** | **12 MB** | < 80 MB | Aceptable |

---

## 2. Detalle de Long Tasks Registradas (> 50 ms)

- **Tarea #1**: 58 ms (Iniciada a los 524 ms)
- **Tarea #2**: 2671 ms (Iniciada a los 795 ms)
- **Tarea #3**: 476 ms (Iniciada a los 3481 ms)
- **Tarea #4**: 205 ms (Iniciada a los 4038 ms)
- **Tarea #5**: 552 ms (Iniciada a los 4335 ms)
- **Tarea #6**: 96 ms (Iniciada a los 4893 ms)
- **Tarea #7**: 358 ms (Iniciada a los 4990 ms)
- **Tarea #8**: 201 ms (Iniciada a los 5920 ms)
- **Tarea #9**: 306 ms (Iniciada a los 6236 ms)
- **Tarea #10**: 81 ms (Iniciada a los 6603 ms)
- **Tarea #11**: 791 ms (Iniciada a los 6902 ms)
- **Tarea #12**: 237 ms (Iniciada a los 7694 ms)
- **Tarea #13**: 120 ms (Iniciada a los 8072 ms)
- **Tarea #14**: 70 ms (Iniciada a los 8195 ms)
- **Tarea #15**: 59 ms (Iniciada a los 8830 ms)
- **Tarea #16**: 2471 ms (Iniciada a los 9348 ms)
- **Tarea #17**: 1426 ms (Iniciada a los 11869 ms)
- **Tarea #18**: 79 ms (Iniciada a los 13301 ms)
- **Tarea #19**: 133 ms (Iniciada a los 13465 ms)
- **Tarea #20**: 108 ms (Iniciada a los 13598 ms)
- **Tarea #21**: 74 ms (Iniciada a los 13735 ms)
- **Tarea #22**: 67 ms (Iniciada a los 13870 ms)
- **Tarea #23**: 59 ms (Iniciada a los 14113 ms)
- **Tarea #24**: 67 ms (Iniciada a los 14465 ms)
- **Tarea #25**: 76 ms (Iniciada a los 14540 ms)
- **Tarea #26**: 64 ms (Iniciada a los 14668 ms)
- **Tarea #27**: 52 ms (Iniciada a los 14737 ms)
- **Tarea #28**: 52 ms (Iniciada a los 14803 ms)
- **Tarea #29**: 57 ms (Iniciada a los 15088 ms)
- **Tarea #30**: 56 ms (Iniciada a los 15171 ms)
- **Tarea #31**: 59 ms (Iniciada a los 15265 ms)
- **Tarea #32**: 57 ms (Iniciada a los 15556 ms)
- **Tarea #33**: 61 ms (Iniciada a los 15973 ms)
- **Tarea #34**: 51 ms (Iniciada a los 16054 ms)
- **Tarea #35**: 55 ms (Iniciada a los 16428 ms)
- **Tarea #36**: 57 ms (Iniciada a los 16795 ms)
- **Tarea #37**: 60 ms (Iniciada a los 16919 ms)
- **Tarea #38**: 56 ms (Iniciada a los 17193 ms)
- **Tarea #39**: 82 ms (Iniciada a los 17276 ms)
- **Tarea #40**: 63 ms (Iniciada a los 17393 ms)
- **Tarea #41**: 66 ms (Iniciada a los 17805 ms)
- **Tarea #42**: 59 ms (Iniciada a los 18089 ms)
- **Tarea #43**: 52 ms (Iniciada a los 18300 ms)
- **Tarea #44**: 63 ms (Iniciada a los 18715 ms)
- **Tarea #45**: 58 ms (Iniciada a los 18887 ms)
- **Tarea #46**: 58 ms (Iniciada a los 19182 ms)
- **Tarea #47**: 61 ms (Iniciada a los 19431 ms)
- **Tarea #48**: 73 ms (Iniciada a los 19730 ms)
- **Tarea #49**: 65 ms (Iniciada a los 19806 ms)

---

## 3. Diagnóstico Forense: Comparativa Hero vs. Visor Interactivo

El visor interactivo (`/invisalign`) opera con extrema fluidez porque:
1. **Material Simple y Directo**: Utiliza un `ShaderMaterial` propio de un solo pase con cálculo Fresnel directo, sin `MeshPhysicalMaterial`, sin `clearcoat`, sin `transmission` ni pases adicionales de refracción.
2. **Cero Luces Dinámicas Pesadas**: Utiliza 3 directional lights estáticas sencillas sin pases de sombra ni `<ContactShadows>`.
3. **Cero `<Environment>` con `<Lightformer>` dinámicos**: El visor no genera cubemap dinámico en tiempo real ni cámaras auxiliares.
4. **Cero Duplicación de Geometrías**: El visor instancia las arcadas una sola vez; el Hero clona 4 mallas completas (2 para dientes físicos + 2 para la capa de alineador superpuesta).
5. **Cero Blur DOM sobre el Canvas**: El visor no tiene contenedores HTML con `backdrop-filter: blur()` fijos ocupando la totalidad del viewport mientras se mueve el scroll.
