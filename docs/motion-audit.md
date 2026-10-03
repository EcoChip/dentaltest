# Auditoría Global del Sistema de Movimiento y Animaciones

> **Regla de Oro**: No duplicar ni apilar animaciones sobre elementos que ya cuentan con transiciones pulidas. Proteger de forma absoluta el rendimiento de la escena 3D y el frameloop ($\ge 55\text{ fps}$ en escritorio, $\ge 45\text{ fps}$ en móvil con CPU 4x).

---

## 1. Tabla Maestra de Componentes y Estado de Animación

| Elemento / Componente | Archivo Fuente | Animación Existente | Acción | Notas Técnicas y Justificación |
| :--- | :--- | :--- | :--- | :--- |
| **Escena 3D & Hero Scrollytelling** | `HomeScrollytelling.tsx`, `timeline.ts`, `ArchModel.tsx` | Timeline maestro GSAP (1400svh scrub), mutación directa de refs Three.js, shaders de translucidez | **MANTENER INTACTO** | **Prohibido tocar.** Cero re-renders. Mantiene los 60 fps en desktop y 45+ fps en móvil. |
| **Preloader 3D Inicial** | `Preloader.tsx` | `transition-opacity duration-700 ease-out`, barra `duration-200` en porcentaje Drei | **MANTENER** | Funciona de manera fluida y sobria; no requiere capas adicionales. |
| **Transición entre Páginas** | `PageTransition.tsx`, `globals.css` | `.page-transition-enter` (`pageFadeIn 0.25s ease-out` de solo opacidad) | **MANTENER** | Evita layout shift (CLS < 0.01) y protege elementos con `position: fixed`. |
| **Scroll Suave Lenis** | `SmoothScrollProvider.tsx` | Sincronización ticker Lenis ↔ GSAP `ScrollTrigger.update`, respeto de `prefers-reduced-motion` | **MANTENER** | Integración nativa perfecta con inercia controlada (1.15s). |
| **Cabecera (Contenedor)** | `Header.tsx` | Cambio de clase Tailwind en scroll (`transition-all duration-300`, backdrop blur, padding) | **AJUSTAR** | Incorporar comportamiento *headroom* (ocultar al bajar tras scroll > 120px, reaparecer al subir) con transición de transform. |
| **Enlaces de Navegación** | `Header.tsx` | Subrayado estático `h-[1px]` con color condicional | **AJUSTAR** | Añadir subrayado dinámico que entra por la izquierda y sale por la derecha (`transform: scaleX(0 -> 1)`), con indicador activo. |
| **Menú Móvil Pantalla Completa** | `Header.tsx` | `animate-in fade-in zoom-in-95 duration-200` en overlay | **AJUSTAR** | Reemplazar por apertura editorial con entrada escalonada (*stagger*) de los enlaces de navegación y datos de contacto. |
| **Botón Hamburguesa Móvil** | `Header.tsx` | Intercambio condicional de iconos SVG (`Menu` vs `X`) | **AJUSTAR** | Sustituir por icono animado accesible con 3 líneas que transmutan geométricamente en cruz (transform rotation/scale). |
| **Mega Menú Tratamientos** | `TreatmentsMegaMenu.tsx` | Panel con `animate-in fade-in slide-in-from-top-2 duration-200` | **AJUSTAR** | Mantener el panel y añadir entrada escalonada sutil de las 3 columnas y de sus tarjetas internas. |
| **Botón Primario (CTA Cita)** | Varios (`Header`, `HomeScrollytelling`, etc.) | Hover de color Tailwind `transition-colors`, flecha `group-hover:translate-x-0.5` | **AÑADIR** | En escritorio: hover magnético sutil (±4px), texto con roll o flecha fluida. En móvil/todos: `:active` con escala `0.97`, foco visible y ripple al toque. |
| **Botón Secundario / Outline** | Varios (`Header`, `Contacto`, etc.) | Hover de borde y color de texto | **AÑADIR** | Borde dibujado o relleno direccional con pseudo-elemento, escala `:active 0.97`. |
| **Botones de Teléfono / WhatsApp** | `Header.tsx`, `ContactCTASection.tsx`, `PersistentMobileCTA.tsx` | Hover de color básico | **AÑADIR** | Microinteracción de pulso suave en icono y respuesta háptica visual al clic/toque. |
| **Barra Móvil Flotante (Sticky)** | `PersistentMobileCTA.tsx` | `translate-y-0 opacity-100` con `transition-all duration-300 ease-out` | **MANTENER + AJUSTAR** | Mantener la lógica de visibilidad; añadir pulso de atención ultra-sutil en el CTA primario sin parpadeos. |
| **Cursor Personalizado** | `CustomCursor.tsx` | Punto central y halo seguidor con RAF lerp 0.18, `(pointer: fine)` | **AJUSTAR** | Cambiar animación de `width/height` a `scale` (GPU 60fps) y añadir estados de texto dinámico: `"Ver"` sobre imágenes y `"Arrastra"` sobre carruseles. |
| **Acordeón Preguntas Frecuentes** | `AccordionFAQ.tsx` | Grid CSS `0fr -> 1fr` con `duration-350 ease-[0.16,1,0.3,1]`, rotación `rotate-180` de Chevron | **MANTENER** | Impecable rendimiento y accesibilidad nativa; refresca ScrollTrigger automáticamente. |
| **Ilustración 404 de Pieza Dental** | `InteractiveToothIllustration.tsx` | GSAP `gsap.to(tooth, { x, y, rotation, duration: 0.85, ease: 'power3.out' })` | **MANTENER** | Implementación quirúrgica ya terminada y adaptada a `prefers-reduced-motion`. |
| **Formulario de Reserva** | `BookingForm.tsx` | `animate-in fade-in` en estado de éxito/error; inputs estándar con borde | **AÑADIR** | Anillo de foco animado en inputs, sacudida (*shake*) sutil en validación de error, botón con spinner → check SVG dibujado en éxito. |
| **Formulario de Newsletter** | `NewsletterForm.tsx` | Spinner en botón de envío y mensaje con fade-in | **AÑADIR** | Entrada suave de mensaje de confirmación, anillo de foco coherente con tokens de movimiento. |
| **Carrusel de Reseñas** | `ReviewsSection.tsx` | Scroll suave manual + autoplay por intervalo con pausa en hover | **AJUSTAR** | Añadir interacción de arrastre (*drag*) táctil con inercia, indicador de progreso y cursor `"Arrastra"` en escritorio. |
| **Titulares de Sección** | Páginas (`/`, `/invisalign`, `/tratamientos`, etc.) | Ninguna animación de entrada | **AÑADIR** | Revelado por líneas con máscara (`overflow-hidden`, traslación `y: 24 -> 0px` con `opacity: 0 -> 1`). |
| **Párrafos y Listas de Valor** | Secciones editoriales | Ninguna animación | **AÑADIR** | Fundido y subida en cascada (`stagger: 0.05s`, `y: 16 -> 0px`). |
| **Tarjetas de Servicios y Equipo** | `TreatmentsSummarySection`, `DoctorSpotlightSection`, `/equipo` | Hover de borde/fondo estático | **AÑADIR** | Hover de elevación (4px) animando la opacidad de un pseudo-elemento con sombra (cero animación de `box-shadow` directo), zoom sutil `1.04` en contenedores visuales. |
| **Contadores Numéricos** | `TrustMetricsSection.tsx` | Textos estáticos (`860+`, `18+`, `99,2%`) | **AÑADIR** | Animación de conteo numérico que se dispara una sola vez (`once: true`) al intersectar con el viewport. |
| **Parallax en Formas e Imágenes** | Páginas internas y destacados | Ninguno | **AÑADIR** | Parallax sutil ($\pm 5\text{--}8\%$) con ScrollTrigger únicamente sobre imágenes y fondos decorativos (nunca en textos). Reducido o apagado en móvil. |
| **Barra de Progreso de Lectura** | Layout global / Blog | Ninguna | **AÑADIR** | Barra superior milimétrica ($2\,\text{px}$) indicadora del progreso de scroll de la página. |
| **Botón "Volver Arriba"** | Layout global | Ninguno | **AÑADIR** | Botón flotante accesible con indicador circular de progreso que aparece tras el 35% de scroll. |
| **Pestañas de Filtro de Blog** | `CategoryFilter.tsx` | Cambio instantáneo de clase en botón activo | **AÑADIR** | Indicador deslizante suave (*sliding pill*) detrás de la pestaña seleccionada. |
| **Footer (Wordmark y Enlaces)** | `Footer.tsx` | Enlaces con cambio simple de color | **AÑADIR** | Revelado del wordmark grande de marca al llegar al fondo y subrayado interactivo en enlaces. |

---

## 2. Directrices de Rendimiento y Prevención de Duplicación

1. **Uso de Librería Única**: Se aprovecha **GSAP 3.15** y **ScrollTrigger** (ya instalados y sincronizados con Lenis) junto a clases de transición de Tailwind CSS. Cero librerías externas adicionales.
2. **Propiedades Aceleradas por Hardware**:
   - Se anima **exclusivamente**: `transform` (`translate3d`, `scale`, `rotate`), `opacity` y `clip-path`.
   - **Prohibido**: animar `width`, `height`, `top`, `left`, `margin`, `padding` o `box-shadow` directamente en bucles o transiciones continuas.
   - Para sombras en hover, se anima la `opacity` de un pseudo-elemento `::after` pre-renderizado con la sombra.
3. **Control de `will-change`**:
   - `will-change: transform, opacity` se aplica únicamente durante el ciclo de animación o en elementos de cursor, y se remueve al finalizar para no saturar la memoria VRAM de dispositivos móviles.
4. **Ciclo de Vida y Limpieza**:
   - Cada hook o utilidad registrará sus triggers dentro de `gsap.context()` y ejecutará `.revert()` en el desmontaje (`useEffect return`).
5. **Accesibilidad e Inmunidad a Pruebas**:
   - Si `prefers-reduced-motion: reduce` está activo o si se navega con `?motion=off`, todas las utilidades de animación aplican estado final inmediato (duración 0s / opacidad 1).
