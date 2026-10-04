const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function main() {
  console.log('Iniciando verificación visual y capturas de Hito 2...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Escritorio (1440x900): Header, Botón Magnético, Mega Menú
  console.log('Capturando Cabecera y Botones en Escritorio...');
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
  await deskPage.waitForTimeout(2000);

  // Captura 1: Cabecera con nuevo Button primario y navegación
  const cap1 = path.join(ARTIFACT_DIR, 'hito2_header_desktop.png');
  await deskPage.screenshot({ path: cap1, fullPage: false });
  console.log(`Guardado: ${cap1}`);

  // Captura 2: Mega Menú desplegado con columnas escalonadas
  const treatmentsBtn = deskPage.locator('button:has-text("Tratamientos")').first();
  await treatmentsBtn.hover();
  await deskPage.waitForTimeout(600);
  const cap2 = path.join(ARTIFACT_DIR, 'hito2_megamenu_desktop.png');
  await deskPage.screenshot({ path: cap2, fullPage: false });
  console.log(`Guardado: ${cap2}`);

  // Captura 3: Headroom (scrolling down hides header)
  await deskPage.evaluate(() => window.scrollTo(0, 400));
  await deskPage.waitForTimeout(600);
  const cap3 = path.join(ARTIFACT_DIR, 'hito2_headroom_hidden.png');
  await deskPage.screenshot({ path: cap3, fullPage: false });
  console.log(`Guardado: ${cap3}`);

  // Captura 4: Headroom (scrolling slightly up restores header)
  await deskPage.evaluate(() => window.scrollBy(0, -50));
  await deskPage.waitForTimeout(600);
  const cap4 = path.join(ARTIFACT_DIR, 'hito2_headroom_revealed.png');
  await deskPage.screenshot({ path: cap4, fullPage: false });
  console.log(`Guardado: ${cap4}`);

  await deskContext.close();

  // 2. Móvil (390x844): Menú Móvil con cruz geométrica y enlaces escalonados
  console.log('Capturando Menú Móvil en 390x844...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
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

  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);

  // Abrir menú móvil
  const hamburgerBtn = mobilePage.locator('button[aria-label="Abrir menú de navegación"]');
  await hamburgerBtn.click();
  await mobilePage.waitForTimeout(500);

  const cap5 = path.join(ARTIFACT_DIR, 'hito2_mobile_menu_open.png');
  await mobilePage.screenshot({ path: cap5, fullPage: false });
  console.log(`Guardado: ${cap5}`);

  await mobileContext.close();
  await browser.close();

  console.log('Verificación y capturas de Hito 2 completadas.');
}

main().catch(console.error);
