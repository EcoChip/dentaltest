const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function main() {
  console.log('Iniciando verificación y captura exhaustiva de encuadre móvil...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const resolutions = [
    { name: '360x640', width: 360, height: 640, desc: 'Android Compacto' },
    { name: '375x667', width: 375, height: 667, desc: 'iPhone SE (altura corta)' },
    { name: '390x844', width: 390, height: 844, desc: 'iPhone 13/14' },
    { name: '430x932', width: 430, height: 932, desc: 'iPhone Pro Max' },
    { name: '768x1024', width: 768, height: 1024, desc: 'Tablet Vertical' },
    { name: '844x390', width: 844, height: 390, desc: 'Móvil Horizontal' },
  ];

  // 1. Captura de la Herramienta de Calibración (?debug) en 390x844
  console.log('\n--- Capturando Herramienta de Ajuste 3D (?debug) en 390x844 ---');
  const debugContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const debugPage = await debugContext.newPage();
  await debugPage.addInitScript(() => {
    localStorage.setItem(
      'cala_cookie_consent_v1',
      JSON.stringify({ necessary: true, analytics: false, preferences: false, timestamp: Date.now() })
    );
  });
  await debugPage.goto('http://localhost:3000/?debug', { waitUntil: 'networkidle' });
  await debugPage.waitForTimeout(3000);
  const debugPath = path.join(ARTIFACT_DIR, 'encuadre_debug_tool_390x844.png');
  await debugPage.screenshot({ path: debugPath, fullPage: false });
  console.log(`Guardado debug tool: ${debugPath}`);
  await debugContext.close();

  // 2. Capturas en cada resolución solicitada (Escenas 1, 2, 3, 5)
  for (const res of resolutions) {
    console.log(`\n=== Procesando ${res.desc} (${res.name}) ===`);
    const context = await browser.newContext({
      viewport: { width: res.width, height: res.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem(
        'cala_cookie_consent_v1',
        JSON.stringify({ necessary: true, analytics: false, preferences: false, timestamp: Date.now() })
      );
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Esperar carga 3D completa

    const maxScroll = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);

    // Escena 1: Hero (scroll = 0)
    const s1Path = path.join(ARTIFACT_DIR, `encuadre_${res.name}_s1_hero.png`);
    await page.screenshot({ path: s1Path, fullPage: false });
    console.log(`  S1 Hero guardado: ${s1Path}`);

    // Si es una de las 3 resoluciones principales (360x640, 390x844, 430x932), capturamos además Escenas 2, 3 y 5
    if (['360x640', '390x844', '430x932'].includes(res.name)) {
      // Escena 2: Invisalign & Anotaciones (progress = 0.22)
      await page.evaluate(() => window.scrollTo(0, 13 * window.innerHeight * 0.22));
      await page.waitForTimeout(1000);
      const s2Path = path.join(ARTIFACT_DIR, `encuadre_${res.name}_s2_invisalign.png`);
      await page.screenshot({ path: s2Path, fullPage: false });
      console.log(`  S2 Invisalign guardado: ${s2Path}`);

      // Escena 3: Proceso Escáner 3D / Paso 1 (progress = 0.38)
      await page.evaluate(() => window.scrollTo(0, 13 * window.innerHeight * 0.38));
      await page.waitForTimeout(1000);
      const s3Path = path.join(ARTIFACT_DIR, `encuadre_${res.name}_s3_proceso.png`);
      await page.screenshot({ path: s3Path, fullPage: false });
      console.log(`  S3 Proceso guardado: ${s3Path}`);

      // Escena 5: Evidencia Clínica (progress = 0.74)
      await page.evaluate(() => window.scrollTo(0, 13 * window.innerHeight * 0.74));
      await page.waitForTimeout(1000);
      const s5Path = path.join(ARTIFACT_DIR, `encuadre_${res.name}_s5_evidencia.png`);
      await page.screenshot({ path: s5Path, fullPage: false });
      console.log(`  S5 Evidencia guardado: ${s5Path}`);
    }

    await context.close();
  }

  // 3. Comprobación de que no hay cambios ni regresión en Escritorio (1440x900)
  console.log('\n--- Verificando Escritorio (1440x900) para confirmar cero regresión ---');
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
  await deskPage.waitForTimeout(3000);
  const deskPath = path.join(ARTIFACT_DIR, 'encuadre_1440x900_desk_check.png');
  await deskPage.screenshot({ path: deskPath, fullPage: false });
  console.log(`Guardado escritorio: ${deskPath}`);
  await deskContext.close();

  await browser.close();
  console.log('\nTodas las capturas de verificación de encuadre móvil han finalizado.');
}

main().catch(console.error);
