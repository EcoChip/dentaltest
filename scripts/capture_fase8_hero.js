const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function main() {
  console.log('Iniciando captura y verificación Fase 8: Afinado del Hero...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const viewports = [
    { name: '375px', width: 375, height: 812, desc: 'Móvil Vertical' },
    { name: '768px', width: 768, height: 1024, desc: 'Tablet Vertical' },
    { name: '1024px', width: 1024, height: 768, desc: 'Escritorio Entrada / Tablet Apaisado' },
    { name: '1440px', width: 1440, height: 900, desc: 'Escritorio Estándar' },
    { name: '1920px', width: 1920, height: 1080, desc: 'Escritorio Panorámico' },
    { name: '844px_landscape', width: 844, height: 390, desc: 'Móvil Apaisado' },
  ];

  for (const vp of viewports) {
    console.log(`\n--- Capturando ${vp.desc} (${vp.name}) [${vp.width}x${vp.height}] ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Establecer consentimiento previo para que el banner de cookies no tape el contenido del Hero
    await page.addInitScript(() => {
      localStorage.setItem(
        'cala_cookie_consent_v1',
        JSON.stringify({ necessary: true, analytics: false, preferences: false, timestamp: Date.now() })
      );
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Esperar carga de modelo 3D y renderizado

    // Obtener métricas de WebGL directamente del contexto de la aplicación
    const glInfo = await page.evaluate(() => {
      const fn = window.__getGlInfo;
      return typeof fn === 'function' ? fn() : null;
    });
    console.log('WebGL gl.info:', glInfo);

    // Captura del Hero
    const screenshotPath = path.join(ARTIFACT_DIR, `fase8_hero_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Guardado: ${screenshotPath}`);

    await context.close();
  }

  await browser.close();
  console.log('\nTodas las capturas de la Fase 8 se han completado con éxito.');
}

main().catch((err) => {
  console.error('Error durante la captura:', err);
  process.exit(1);
});
