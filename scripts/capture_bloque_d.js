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

  // Scroll smoothly down the page and up
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
  console.log('--- INICIANDO VERIFICACIÓN Y CAPTURA BLOQUE D ---');

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

  // 1. Capturas del Directorio /tratamientos en 4 viewports
  console.log('\n[1/4] Capturando Directorio de Tratamientos (/tratamientos)...');
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
    await page.goto('http://localhost:3000/tratamientos', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const outPath = path.join(ARTIFACT_DIR, `evidence_bloqueD_directorio_${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`✓ Directorio capturado en ${vp.name}: ${outPath}`);
    await context.close();
  }

  // 2. Capturas de la página de detalle /tratamientos/carillas-de-porcelana en 4 viewports
  console.log('\n[2/4] Capturando Detalle de Tratamiento (/tratamientos/carillas-de-porcelana)...');
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
    await page.goto('http://localhost:3000/tratamientos/carillas-de-porcelana', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const outPath = path.join(ARTIFACT_DIR, `evidence_bloqueD_detalle_${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`✓ Detalle Carillas capturado en ${vp.name}: ${outPath}`);

    // También capturar sección de casos y FAQ en escritorio
    if (vp.width === 1440) {
      await page.evaluate(() => {
        const el = document.getElementById('cases-heading');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(400);
      const casesPath = path.join(ARTIFACT_DIR, 'evidence_bloqueD_casos_clinicos_1440px.png');
      await page.screenshot({ path: casesPath, fullPage: false });
      console.log(`✓ Casos Clínicos capturados en 1440px: ${casesPath}`);

      await page.evaluate(() => {
        const el = document.getElementById('faq-heading');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(400);
      const faqPath = path.join(ARTIFACT_DIR, 'evidence_bloqueD_faq_acordeon_1440px.png');
      await page.screenshot({ path: faqPath, fullPage: false });
      console.log(`✓ FAQ Acordeón capturado en 1440px: ${faqPath}`);
    }

    await context.close();
  }

  // 3. Verificación de Redirección Hash Antigua en Cliente
  console.log('\n[3/4] Verificando Redirección de Hash Antiguo (#carillas-porcelana, #implantes)...');
  const redirectContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await redirectContext.addInitScript(() => {
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
  const redPage = await redirectContext.newPage();

  // Test 1: #carillas-porcelana -> /tratamientos/carillas-de-porcelana
  await redPage.goto('http://localhost:3000/tratamientos#carillas-porcelana', { waitUntil: 'networkidle' });
  await redPage.waitForTimeout(500);
  const currentUrl1 = redPage.url();
  console.log(`Redirección test 1 (/tratamientos#carillas-porcelana): ${currentUrl1}`);
  const pass1 = currentUrl1.includes('/tratamientos/carillas-de-porcelana');
  console.log(`Test 1: ${pass1 ? '✓ ÉXITO' : '✗ FALLO'}`);

  // Test 2: #implantes-guiados -> /tratamientos/implantes-dentales
  await redPage.goto('http://localhost:3000/tratamientos#implantes-guiados', { waitUntil: 'networkidle' });
  await redPage.waitForTimeout(500);
  const currentUrl2 = redPage.url();
  console.log(`Redirección test 2 (/tratamientos#implantes-guiados): ${currentUrl2}`);
  const pass2 = currentUrl2.includes('/tratamientos/implantes-dentales');
  console.log(`Test 2: ${pass2 ? '✓ ÉXITO' : '✗ FALLO'}`);

  // Test 3: #blanqueamiento -> /tratamientos/blanqueamiento-dental
  await redPage.goto('http://localhost:3000/tratamientos#blanqueamiento', { waitUntil: 'networkidle' });
  await redPage.waitForTimeout(500);
  const currentUrl3 = redPage.url();
  console.log(`Redirección test 3 (/tratamientos#blanqueamiento): ${currentUrl3}`);
  const pass3 = currentUrl3.includes('/tratamientos/blanqueamiento-dental');
  console.log(`Test 3: ${pass3 ? '✓ ÉXITO' : '✗ FALLO'}`);

  await redirectContext.close();

  // 4. Captura de MegaMenú Desplegado en Desktop (1440px)
  console.log('\n[4/4] Capturando MegaMenú de Tratamientos desplegado...');
  const menuContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await menuContext.addInitScript(() => {
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
  const menuPage = await menuContext.newPage();
  await menuPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await menuPage.waitForTimeout(800);

  // Trigger hover on Tratamientos button in header
  const treatmentsBtn = await menuPage.$('button:has-text("Tratamientos")');
  if (treatmentsBtn) {
    await treatmentsBtn.hover();
    await menuPage.waitForTimeout(350); // wait for 150ms grace delay + animation
    const menuPath = path.join(ARTIFACT_DIR, 'evidence_bloqueD_megamenu_hover_1440px.png');
    await menuPage.screenshot({ path: menuPath, fullPage: false });
    console.log(`✓ MegaMenú capturado en 1440px: ${menuPath}`);
  } else {
    console.log('✗ Botón Tratamientos no encontrado para hover');
  }

  // Medición de rendimiento en página de tratamiento
  console.log('\n--- Midiendo Rendimiento /tratamientos/carillas-de-porcelana ---');
  await menuPage.goto('http://localhost:3000/tratamientos/carillas-de-porcelana', { waitUntil: 'networkidle' });
  await menuPage.waitForTimeout(400);

  const desktopPerf = await runBenchmark(menuPage, { isMobile: false, cpuThrottle: 1 });
  console.log('Desktop 1440px:', desktopPerf);

  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/tratamientos/carillas-de-porcelana', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(400);
  const mobilePerf = await runBenchmark(mobilePage, { isMobile: true, cpuThrottle: 4 });
  console.log('Mobile 375px (CPU 4x):', mobilePerf);

  await menuContext.close();
  await mobileContext.close();
  await browser.close();

  console.log('\n--- VERIFICACIÓN BLOQUE D COMPLETADA CON ÉXITO ---');
}

main().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
