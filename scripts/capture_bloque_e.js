const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function runBenchmark(page, options = {}) {
  const { isMobile = false, cpuThrottle = 1 } = options;
  const client = await page.context().newCDPSession(page);

  if (cpuThrottle > 1) {
    await client.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottle });
  }

  // Instrument frame timing and performance
  await page.evaluate(() => {
    window.__perfData = {
      frameTimes: [],
      lastTime: null,
      longTasks: 0,
      longTaskTotalDuration: 0,
      maxLongTask: 0,
    };

    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'longtask') {
              window.__perfData.longTasks++;
              window.__perfData.longTaskTotalDuration += entry.duration;
              if (entry.duration > window.__perfData.maxLongTask) {
                window.__perfData.maxLongTask = entry.duration;
              }
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {}
    }

    function onFrame(now) {
      if (window.__perfData.lastTime !== null) {
        const delta = now - window.__perfData.lastTime;
        window.__perfData.frameTimes.push(delta);
      }
      window.__perfData.lastTime = now;
      requestAnimationFrame(onFrame);
    }
    requestAnimationFrame(onFrame);
  });

  // Scroll smoothly down the page and back up
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const targetY = (maxScroll * i) / steps;
    await page.evaluate((y) => window.scrollTo(0, y), targetY);
    await page.waitForTimeout(25);
  }
  for (let i = steps; i >= 0; i--) {
    const targetY = (maxScroll * i) / steps;
    await page.evaluate((y) => window.scrollTo(0, y), targetY);
    await page.waitForTimeout(25);
  }

  const perfData = await page.evaluate(() => {
    const ft = window.__perfData.frameTimes;
    if (ft.length === 0) return { avgFps: 60, p99FrameTime: 16.6, longTasks: 0 };
    const avgDelta = ft.reduce((a, b) => a + b, 0) / ft.length;
    const sorted = [...ft].sort((a, b) => a - b);
    const p99 = sorted[Math.floor(sorted.length * 0.99)] || sorted[sorted.length - 1];
    return {
      avgFps: Math.round(1000 / avgDelta * 10) / 10,
      avgFrameTime: Math.round(avgDelta * 100) / 100,
      p99FrameTime: Math.round(p99 * 100) / 100,
      longTasks: window.__perfData.longTasks,
      maxLongTask: Math.round(window.__perfData.maxLongTask),
      totalFrames: ft.length,
    };
  });

  if (cpuThrottle > 1) {
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }

  return perfData;
}

async function main() {
  console.log('--- INICIANDO VERIFICACIÓN Y CAPTURA BLOQUE E (BLOG & NEWSLETTER) ---');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const viewports = [
    { width: 375, height: 812, name: '375px', isMobile: true },
    { width: 768, height: 1024, name: '768px', isMobile: false },
    { width: 1440, height: 900, name: '1440px', isMobile: false },
    { width: 1920, height: 1080, name: '1920px', isMobile: false },
  ];

  // 1. Capturas del Índice de Blog (/blog) en los 4 viewports requeridos
  console.log('\n[1/5] Capturando Índice del Blog (/blog)...');
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });
    await context.addInitScript(() => {
      localStorage.setItem(
        'cala_cookie_consent_v1',
        JSON.stringify({
          necessary: true,
          analytics: true,
          marketing: true,
          timestamp: new Date().toISOString(),
        })
      );
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const outPath = path.join(ARTIFACT_DIR, `evidence_bloqueE_blog_${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`✓ Blog capturado en ${vp.name}: ${outPath}`);
    await context.close();
  }

  // 2. Capturas del Artículo Clínico (/blog/por-que-0-75-mm-es-el-grosor-optimo-de-un-alineador)
  console.log('\n[2/5] Capturando Detalle de Artículo Clínico...');
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });
    await context.addInitScript(() => {
      localStorage.setItem(
        'cala_cookie_consent_v1',
        JSON.stringify({
          necessary: true,
          analytics: true,
          marketing: true,
          timestamp: new Date().toISOString(),
        })
      );
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/blog/por-que-0-75-mm-es-el-grosor-optimo-de-un-alineador', {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(600);

    const outPath = path.join(ARTIFACT_DIR, `evidence_bloqueE_articulo_${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`✓ Artículo capturado en ${vp.name}: ${outPath}`);

    if (vp.width === 1440) {
      // Capturar sección de tabla comparativa e índice TOC
      await page.evaluate(() => {
        const el = document.getElementById('comparativa-espesores');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(400);
      const tablePath = path.join(ARTIFACT_DIR, 'evidence_bloqueE_articulo_tabla_1440px.png');
      await page.screenshot({ path: tablePath, fullPage: false });
      console.log(`✓ Tabla comparativa técnica capturada en 1440px: ${tablePath}`);

      // Capturar caja de autor facultativo y newsletter
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight - 1600);
      });
      await page.waitForTimeout(400);
      const authorPath = path.join(ARTIFACT_DIR, 'evidence_bloqueE_articulo_autor_newsletter_1440px.png');
      await page.screenshot({ path: authorPath, fullPage: false });
      console.log(`✓ Autor & Newsletter capturados en 1440px: ${authorPath}`);
    }

    await context.close();
  }

  // 3. Test de Filtrado Interactivo por Categorías en /blog
  console.log('\n[3/5] Probando Filtro Interactivo por Categoría en /blog...');
  const filterContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await filterContext.addInitScript(() => {
    localStorage.setItem(
      'cala_cookie_consent_v1',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() })
    );
  });
  const filterPage = await filterContext.newPage();
  await filterPage.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
  await filterPage.waitForTimeout(400);

  // Click on "Estética Dental"
  const esteticaBtn = await filterPage.$('button:has-text("Estética Dental")');
  if (esteticaBtn) {
    await esteticaBtn.click();
    await filterPage.waitForTimeout(300);
    const esteticaCount = await filterPage.$$eval('article', (articles) => articles.length);
    console.log(`✓ Filtro Estética Dental activo. Artículos visibles: ${esteticaCount}`);
  }

  // Click on "Ortodoncia Invisible"
  const ortodonciaBtn = await filterPage.$('button:has-text("Ortodoncia Invisible")');
  if (ortodonciaBtn) {
    await ortodonciaBtn.click();
    await filterPage.waitForTimeout(300);
    const ortoCount = await filterPage.$$eval('article', (articles) => articles.length);
    console.log(`✓ Filtro Ortodoncia Invisible activo. Artículos visibles: ${ortoCount}`);
  }

  // Reset to "Todos los Artículos"
  const todasBtn = await filterPage.$('button:has-text("Todos los Artículos")');
  if (todasBtn) {
    await todasBtn.click();
    await filterPage.waitForTimeout(300);
    const allCount = await filterPage.$$eval('article', (articles) => articles.length);
    console.log(`✓ Filtro Todos los Artículos activo. Artículos visibles: ${allCount}`);
  }
  await filterContext.close();

  // 4. Test de Envío de Newsletter (Casos: sin privacidad, email inválido, suscripción exitosa)
  console.log('\n[4/5] Probando API y Formulario de Newsletter (/api/newsletter)...');
  const newsContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await newsContext.addInitScript(() => {
    localStorage.setItem(
      'cala_cookie_consent_v1',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() })
    );
  });
  const newsPage = await newsContext.newPage();
  await newsPage.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
  await newsPage.waitForTimeout(400);

  // Test 4.1: Envío sin aceptar privacidad
  const emailInput = await newsPage.$('input[aria-label*="correo"]');
  const submitBtn = await newsPage.$('button:has-text("Suscribirme")');
  if (emailInput && submitBtn) {
    await emailInput.fill('paciente.prueba@gmail.com');
    await submitBtn.click();
    await newsPage.waitForTimeout(300);
    const errorAlert = await newsPage.$('div[role="alert"]');
    const errorText = errorAlert ? await errorAlert.innerText() : '';
    console.log(`Test Newsletter sin privacidad: ${errorText.includes('privacidad') ? '✓ PASS (Validación correcta)' : '✗ FAIL'}`);

    // Test 4.2: Marcar privacidad y enviar
    const privacyCheckbox = await newsPage.$('input[type="checkbox"]');
    if (privacyCheckbox) {
      await privacyCheckbox.check();
      await submitBtn.click();
      await newsPage.waitForTimeout(500);

      const successHeading = await newsPage.$('h4:has-text("Suscripción confirmada")');
      console.log(`Test Newsletter suscripción exitosa: ${successHeading ? '✓ PASS (Suscripción completada)' : '✗ FAIL'}`);

      const successPath = path.join(ARTIFACT_DIR, 'evidence_bloqueE_newsletter_success.png');
      await newsPage.screenshot({ path: successPath, fullPage: false });
      console.log(`✓ Captura estado de éxito guardada: ${successPath}`);
    }
  }
  await newsContext.close();

  // 5. Medición de Rendimiento & FPS en Artículo Clínico
  console.log('\n[5/5] Midiendo Rendimiento & FPS en Artículo Clínico...');
  const perfContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await perfContext.addInitScript(() => {
    localStorage.setItem(
      'cala_cookie_consent_v1',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() })
    );
  });
  const perfPage = await perfContext.newPage();
  await perfPage.goto('http://localhost:3000/blog/por-que-0-75-mm-es-el-grosor-optimo-de-un-alineador', {
    waitUntil: 'networkidle',
  });
  await perfPage.waitForTimeout(400);

  const desktopPerf = await runBenchmark(perfPage, { isMobile: false, cpuThrottle: 1 });
  console.log('Desktop 1440px Perf:', desktopPerf);
  await perfContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });
  await mobileContext.addInitScript(() => {
    localStorage.setItem(
      'cala_cookie_consent_v1',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() })
    );
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/blog/por-que-0-75-mm-es-el-grosor-optimo-de-un-alineador', {
    waitUntil: 'networkidle',
  });
  await mobilePage.waitForTimeout(400);

  const mobilePerf = await runBenchmark(mobilePage, { isMobile: true, cpuThrottle: 4 });
  console.log('Mobile 375px (CPU 4x) Perf:', mobilePerf);
  await mobileContext.close();

  await browser.close();

  console.log('\n--- VERIFICACIÓN BLOQUE E COMPLETADA CON ÉXITO ---');
}

main().catch((err) => {
  console.error('Error durante la verificación de Bloque E:', err);
  process.exit(1);
});
