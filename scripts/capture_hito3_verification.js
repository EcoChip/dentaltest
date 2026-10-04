const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function main() {
  console.log('Iniciando verificación visual y capturas de Hito 3 (Scroll Reveals, Parallax, Contadores y Tarjetas)...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Escritorio (1440x900)
  console.log('--- 1. Pruebas en Escritorio (1440x900) ---');
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

  await deskPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(1500);

  // Scroll hasta Métricas de Confianza (TrustMetricsSection)
  console.log('Scrolleando hasta TrustMetricsSection para verificar contadores animados...');
  await deskPage.evaluate(() => {
    const el = document.querySelector('section[aria-labelledby="metrics-heading"]');
    if (el) {
      if ((window).__lenis) {
        (window).__lenis.scrollTo(el, { immediate: true });
      } else {
        el.scrollIntoView({ behavior: 'instant' });
      }
    }
  });
  await deskPage.waitForTimeout(2000); // Dar tiempo a que el contador GSAP complete (1.3s)

  const cap1 = path.join(ARTIFACT_DIR, 'hito3_trust_metrics_desktop.png');
  await deskPage.screenshot({ path: cap1, fullPage: false });
  console.log(`Guardado: ${cap1}`);

  // Hover en la tarjeta principal de TrustMetrics para verificar elevación y sombra
  const mainMetricCard = deskPage.locator('section[aria-labelledby="metrics-heading"] .card-interactive').first();
  await mainMetricCard.hover();
  await deskPage.waitForTimeout(500);
  const cap1Hover = path.join(ARTIFACT_DIR, 'hito3_metric_card_hover.png');
  await deskPage.screenshot({ path: cap1Hover, fullPage: false });
  console.log(`Guardado: ${cap1Hover}`);

  // Scroll hasta DoctorSpotlightSection
  console.log('Scrolleando hasta DoctorSpotlightSection...');
  await deskPage.evaluate(() => {
    const el = document.querySelector('section[aria-labelledby="team-summary-heading"]');
    if (el) {
      if ((window).__lenis) {
        (window).__lenis.scrollTo(el, { immediate: true });
      } else {
        el.scrollIntoView({ behavior: 'instant' });
      }
    }
  });
  await deskPage.waitForTimeout(1500);

  // Hover sobre la tarjeta del director médico para verificar zoom suave de foto
  const doctorPhoto = deskPage.locator('.card-zoom-img').first();
  await doctorPhoto.hover();
  await deskPage.waitForTimeout(500);
  const cap2 = path.join(ARTIFACT_DIR, 'hito3_doctor_spotlight_desktop.png');
  await deskPage.screenshot({ path: cap2, fullPage: false });
  console.log(`Guardado: ${cap2}`);

  // Scroll hasta ReviewsSection
  console.log('Scrolleando hasta ReviewsSection...');
  await deskPage.evaluate(() => {
    const el = document.querySelector('section[aria-labelledby="reviews-title"]');
    if (el) {
      if ((window).__lenis) {
        (window).__lenis.scrollTo(el, { immediate: true });
      } else {
        el.scrollIntoView({ behavior: 'instant' });
      }
    }
  });
  await deskPage.waitForTimeout(1000);
  const cap3 = path.join(ARTIFACT_DIR, 'hito3_reviews_desktop.png');
  await deskPage.screenshot({ path: cap3, fullPage: false });
  console.log(`Guardado: ${cap3}`);

  // 2. Página de Tratamientos (/tratamientos)
  console.log('Navegando a /tratamientos para verificar tarjeta insignia con Parallax y tarjetas de especialidades...');
  await deskPage.goto('http://localhost:3000/tratamientos', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(1500);

  const cap4 = path.join(ARTIFACT_DIR, 'hito3_tratamientos_page_desktop.png');
  await deskPage.screenshot({ path: cap4, fullPage: false });
  console.log(`Guardado: ${cap4}`);

  // Scroll a la rejilla de especialidades
  await deskPage.evaluate(() => window.scrollBy(0, 600));
  await deskPage.waitForTimeout(1000);
  const cap5 = path.join(ARTIFACT_DIR, 'hito3_tratamientos_grid_desktop.png');
  await deskPage.screenshot({ path: cap5, fullPage: false });
  console.log(`Guardado: ${cap5}`);

  // 3. Página de Equipo (/equipo)
  console.log('Navegando a /equipo para verificar artículos médicos y valores deontológicos...');
  await deskPage.goto('http://localhost:3000/equipo', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(1500);

  const cap6 = path.join(ARTIFACT_DIR, 'hito3_equipo_page_desktop.png');
  await deskPage.screenshot({ path: cap6, fullPage: false });
  console.log(`Guardado: ${cap6}`);

  await deskContext.close();

  // 4. Móvil (375x812)
  console.log('--- 2. Pruebas en Móvil (375x812) ---');
  const mobContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
  });
  const mobPage = await mobContext.newPage();
  await mobPage.addInitScript(() => {
    localStorage.setItem(
      'cala_cookie_consent_v1',
      JSON.stringify({ necessary: true, analytics: false, preferences: false, timestamp: Date.now() })
    );
  });

  await mobPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobPage.waitForTimeout(1500);

  await mobPage.evaluate(() => {
    const el = document.querySelector('section[aria-labelledby="metrics-heading"]');
    if (el) {
      if ((window).__lenis) {
        (window).__lenis.scrollTo(el, { immediate: true });
      } else {
        el.scrollIntoView({ behavior: 'instant' });
      }
    }
  });
  await mobPage.waitForTimeout(1600);
  const capMob1 = path.join(ARTIFACT_DIR, 'hito3_trust_metrics_mobile_375.png');
  await mobPage.screenshot({ path: capMob1, fullPage: false });
  console.log(`Guardado: ${capMob1}`);

  await mobPage.evaluate(() => {
    const el = document.querySelector('section[aria-labelledby="team-summary-heading"]');
    if (el) {
      if ((window).__lenis) {
        (window).__lenis.scrollTo(el, { immediate: true });
      } else {
        el.scrollIntoView({ behavior: 'instant' });
      }
    }
  });
  await mobPage.waitForTimeout(1200);
  const capMob2 = path.join(ARTIFACT_DIR, 'hito3_doctor_spotlight_mobile_375.png');
  await mobPage.screenshot({ path: capMob2, fullPage: false });
  console.log(`Guardado: ${capMob2}`);

  await mobContext.close();

  // 5. Verificación de Accesibilidad: ?motion=off
  console.log('--- 3. Verificación de Modo Sin Movimiento (?motion=off) ---');
  const motionOffContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const motionOffPage = await motionOffContext.newPage();
  await motionOffPage.goto('http://localhost:3000/?motion=off', { waitUntil: 'networkidle' });
  await motionOffPage.waitForTimeout(1000);

  // Comprobar que los contadores están presentes de inmediato con su valor final
  const metricText = await motionOffPage.locator('.tabular-numbers').first().innerText();
  console.log(`Métrica verificada en ?motion=off: "${metricText}" (Esperado valor completo sin ocultación)`);

  const capMotionOff = path.join(ARTIFACT_DIR, 'hito3_motion_off_desktop.png');
  await motionOffPage.screenshot({ path: capMotionOff, fullPage: false });
  console.log(`Guardado: ${capMotionOff}`);

  await motionOffContext.close();
  await browser.close();
  console.log('¡Todas las verificaciones de Hito 3 completadas con éxito!');
}

main().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
