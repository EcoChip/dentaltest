const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function main() {
  console.log('Verificando correcciones en cabecera: flecha de tratamientos horizontal y animación del botón...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
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
  await page.waitForTimeout(1000);

  // 1. Captura de la cabecera completa en reposo
  const header = page.locator('header');
  const capHeader = path.join(ARTIFACT_DIR, 'header_tratamientos_horizontal.png');
  await header.screenshot({ path: capHeader });
  console.log(`Guardado cabecera: ${capHeader}`);

  // 2. Captura en primer plano de "Tratamientos" con la flecha al lado
  const tratamientosBtn = page.locator('header nav button:has-text("Tratamientos")');
  const capTratamientos = path.join(ARTIFACT_DIR, 'tratamientos_chevron_aligned.png');
  await tratamientosBtn.screenshot({ path: capTratamientos });
  console.log(`Guardado tratamientos zoom: ${capTratamientos}`);

  // 3. Hover sobre el botón de CTA "Reserva tu primera visita" para verificar su nueva animación limpia
  const ctaButton = page.locator('header a:has-text("Reserva tu primera visita")');
  await ctaButton.hover();
  await page.waitForTimeout(300);
  const capCtaHover = path.join(ARTIFACT_DIR, 'header_cta_button_hover.png');
  await ctaButton.screenshot({ path: capCtaHover });
  console.log(`Guardado CTA hover: ${capCtaHover}`);

  await browser.close();
  console.log('Verificación finalizada con éxito.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
