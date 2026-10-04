const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function main() {
  console.log('Iniciando verificación visual y capturas de Hito 4 (Formularios, Carrusel con momentum, Reading bar, Back to top, Tabs deslizantes, Wordmark footer)...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    // 1. Escritorio - Contacto & Formularios (1440x900)
    console.log('\n--- 1. Pruebas de Formularios (/contacto) ---');
    const deskContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const deskPage = await deskContext.newPage();
    await deskPage.addInitScript(() => {
      localStorage.setItem(
        'cala_cookie_consent_v1',
        JSON.stringify({ necessary: true, analytics: false, preferences: false, timestamp: Date.now() })
      );
    });

    await deskPage.goto('http://localhost:3000/contacto', { waitUntil: 'networkidle' });
    await deskPage.waitForTimeout(1000);

    // Focus ring animado en input de Nombre
    const nameInput = deskPage.locator('#booking_name');
    await nameInput.focus();
    await deskPage.waitForTimeout(300);
    const capFormFocus = path.join(ARTIFACT_DIR, 'hito4_form_focus_ring.png');
    await deskPage.screenshot({ path: capFormFocus });
    console.log(`Guardado focus ring: ${capFormFocus}`);

    // Disparar validación para probar shake de error
    const submitBtn = deskPage.locator('form button[type="submit"]').first();
    await submitBtn.click();
    await deskPage.waitForTimeout(400);
    const capFormShake = path.join(ARTIFACT_DIR, 'hito4_form_error_shake.png');
    await deskPage.screenshot({ path: capFormShake });
    console.log(`Guardado error shake: ${capFormShake}`);

    // Rellenar formulario válidamente para probar spinner + checkmark SVG animado
    await nameInput.fill('Dra. Elena Martínez');
    await deskPage.locator('#booking_phone').fill('612345678');
    await deskPage.locator('#booking_email').fill('elena.martinez@ejemplo.com');
    await deskPage.locator('#booking_rgpd').check();
    await submitBtn.click();
    
    // Esperar respuesta y animación SVG
    await deskPage.waitForTimeout(2000);
    const capFormSuccess = path.join(ARTIFACT_DIR, 'hito4_form_success_checkmark.png');
    await deskPage.screenshot({ path: capFormSuccess });
    console.log(`Guardado confirmación y checkmark SVG: ${capFormSuccess}`);

    // 2. Reviews Carousel & Momentum Drag en Inicio
    console.log('\n--- 2. Pruebas de Carrusel con Momentum (/ - Reviews) ---');
    await deskPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await deskPage.waitForTimeout(1200);

    await deskPage.evaluate(() => {
      const el = document.querySelector('section[aria-labelledby="reviews-title"]');
      if (el) {
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView({ behavior: 'instant' });
        }
      }
    });
    await deskPage.waitForTimeout(800);

    const capReviewsInitial = path.join(ARTIFACT_DIR, 'hito4_reviews_initial.png');
    await deskPage.screenshot({ path: capReviewsInitial });
    console.log(`Guardado carrusel inicial: ${capReviewsInitial}`);

    // Simular arrastre (drag) con ratón en el carrusel
    const carousel = deskPage.locator('div[data-cursor="drag"]');
    const box = await carousel.boundingBox();
    if (box) {
      await deskPage.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
      await deskPage.mouse.down();
      await deskPage.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 12 });
      await deskPage.mouse.up();
      // Permitir que la inercia (momentum raf) se complete
      await deskPage.waitForTimeout(1000);
    }
    const capReviewsDragged = path.join(ARTIFACT_DIR, 'hito4_reviews_dragged_momentum.png');
    await deskPage.screenshot({ path: capReviewsDragged });
    console.log(`Guardado carrusel arrastrado con inercia: ${capReviewsDragged}`);

    // 3. Botón flotante Volver Arriba y Barra de Progreso de Lectura
    console.log('\n--- 3. Pruebas de Reading Bar y Botón Volver Arriba ---');
    // Scroll a mitad de página
    await deskPage.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight * 0.5);
    });
    await deskPage.waitForTimeout(600);

    const capBackToTop = path.join(ARTIFACT_DIR, 'hito4_back_to_top_and_reading_bar.png');
    await deskPage.screenshot({ path: capBackToTop });
    console.log(`Guardado back to top y reading bar: ${capBackToTop}`);

    // 4. Footer Wordmark y Enlaces
    console.log('\n--- 4. Pruebas de Wordmark en Footer ---');
    await deskPage.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await deskPage.waitForTimeout(1000);

    const capFooter = path.join(ARTIFACT_DIR, 'hito4_footer_wordmark.png');
    await deskPage.screenshot({ path: capFooter });
    console.log(`Guardado footer wordmark: ${capFooter}`);

    // 5. Blog Category Filter (Pill deslizante)
    console.log('\n--- 5. Pruebas de Blog Tabs Deslizantes (/blog) ---');
    await deskPage.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
    await deskPage.waitForTimeout(1000);

    const capBlogInitial = path.join(ARTIFACT_DIR, 'hito4_blog_tabs_initial.png');
    await deskPage.screenshot({ path: capBlogInitial });
    console.log(`Guardado blog tabs inicial: ${capBlogInitial}`);

    // Clic en pestaña de Ortodoncia Invisible
    const tabOrto = deskPage.locator('button[role="tab"]:has-text("Ortodoncia")');
    await tabOrto.click();
    await deskPage.waitForTimeout(500);

    const capBlogTabMoved = path.join(ARTIFACT_DIR, 'hito4_blog_tabs_pill_moved.png');
    await deskPage.screenshot({ path: capBlogTabMoved });
    console.log(`Guardado blog tabs pill deslizado: ${capBlogTabMoved}`);

    // Hover sobre tarjeta de artículo para verificar card-interactive
    const blogCard = deskPage.locator('article.card-interactive').first();
    await blogCard.hover();
    await deskPage.waitForTimeout(400);

    const capBlogCardHover = path.join(ARTIFACT_DIR, 'hito4_blog_card_hover.png');
    await deskPage.screenshot({ path: capBlogCardHover });
    console.log(`Guardado blog card hover: ${capBlogCardHover}`);

    // 6. Vista Móvil (375x667)
    console.log('\n--- 6. Pruebas en Móvil (375x667) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.addInitScript(() => {
      localStorage.setItem(
        'cala_cookie_consent_v1',
        JSON.stringify({ necessary: true, analytics: false, preferences: false, timestamp: Date.now() })
      );
    });

    await mobilePage.goto('http://localhost:3000/contacto', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    const capMobileForm = path.join(ARTIFACT_DIR, 'hito4_mobile_form.png');
    await mobilePage.screenshot({ path: capMobileForm });
    console.log(`Guardado mobile form: ${capMobileForm}`);

    await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await mobilePage.evaluate(() => {
      const el = document.querySelector('section[aria-labelledby="reviews-title"]');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await mobilePage.waitForTimeout(800);

    const capMobileReviews = path.join(ARTIFACT_DIR, 'hito4_mobile_reviews.png');
    await mobilePage.screenshot({ path: capMobileReviews });
    console.log(`Guardado mobile reviews: ${capMobileReviews}`);

    await deskContext.close();
    await mobileContext.close();
    console.log('\n¡Verificación de Hito 4 completada con éxito!');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
