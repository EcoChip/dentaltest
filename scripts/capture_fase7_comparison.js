const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function main() {
  console.log('Iniciando captura comparativa Fase 7: Tema A vs Tema B...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const viewports = [
    { name: '1440px', width: 1440, height: 900 },
    { name: '375px', width: 375, height: 812 },
  ];

  const themes = ['A', 'B'];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const theme of themes) {
      console.log(`\n--- Capturando Tema ${theme} en ${vp.name} ---`);

      // 1. Inicio: Hero 3D
      await page.goto(`http://localhost:3000/?theme=${theme}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000); // Esperar carga de modelo 3D y renderizado
      const heroPath = path.join(ARTIFACT_DIR, `theme_${theme.toLowerCase()}_hero_${vp.name}.png`);
      await page.screenshot({ path: heroPath, fullPage: false });
      console.log(`Guardado: ${heroPath}`);

      // 2. Inicio: Proceso (scroll hasta paso 1/2 del proceso)
      // En 1400svh total, el proceso está alrededor del 45% del scroll
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      await page.evaluate((scrollTarget) => window.scrollTo(0, scrollTarget), maxScroll * 0.44);
      await page.waitForTimeout(2000);
      const procesoPath = path.join(ARTIFACT_DIR, `theme_${theme.toLowerCase()}_proceso_${vp.name}.png`);
      await page.screenshot({ path: procesoPath, fullPage: false });
      console.log(`Guardado: ${procesoPath}`);

      // 3. /invisalign
      await page.goto(`http://localhost:3000/invisalign?theme=${theme}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2500);
      const invisalignPath = path.join(ARTIFACT_DIR, `theme_${theme.toLowerCase()}_invisalign_${vp.name}.png`);
      await page.screenshot({ path: invisalignPath, fullPage: false });
      console.log(`Guardado: ${invisalignPath}`);

      // 4. Formulario (Contacto)
      await page.goto(`http://localhost:3000/contacto?theme=${theme}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const contactoPath = path.join(ARTIFACT_DIR, `theme_${theme.toLowerCase()}_formulario_${vp.name}.png`);
      await page.screenshot({ path: contactoPath, fullPage: false });
      console.log(`Guardado: ${contactoPath}`);

      // 5. Blog
      await page.goto(`http://localhost:3000/blog?theme=${theme}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const blogPath = path.join(ARTIFACT_DIR, `theme_${theme.toLowerCase()}_blog_${vp.name}.png`);
      await page.screenshot({ path: blogPath, fullPage: false });
      console.log(`Guardado: ${blogPath}`);
    }

    await context.close();
  }

  // Medición de rendimiento (FPS) y propiedades de tipografía/contraste
  console.log('\n--- Midiendo Métricas de Tipografía y Rendimiento en Producción ---');
  const benchContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const benchPage = await benchContext.newPage();

  for (const theme of themes) {
    await benchPage.goto(`http://localhost:3000/?theme=${theme}`, { waitUntil: 'networkidle' });
    await benchPage.waitForTimeout(2000);

    const bodyStyle = await benchPage.evaluate(() => {
      const p = document.querySelector('p');
      const h1 = document.querySelector('h1');
      const btn = document.querySelector('a[href="/contacto"]');
      return {
        bodyFontSize: p ? window.getComputedStyle(p).fontSize : 'N/A',
        bodyLineHeight: p ? window.getComputedStyle(p).lineHeight : 'N/A',
        h1FontSize: h1 ? window.getComputedStyle(h1).fontSize : 'N/A',
        h1FontFamily: h1 ? window.getComputedStyle(h1).fontFamily : 'N/A',
        btnBg: btn ? window.getComputedStyle(btn).backgroundColor : 'N/A',
        btnRadius: btn ? window.getComputedStyle(btn).borderRadius : 'N/A',
        dataTheme: document.documentElement.getAttribute('data-theme'),
      };
    });

    console.log(`Estilos calculados para Tema ${theme}:`, bodyStyle);
  }

  await benchContext.close();
  await browser.close();
  console.log('\nTodas las capturas y métricas han sido generadas con éxito.');
}

main().catch((err) => {
  console.error('Error durante la ejecución del script:', err);
  process.exit(1);
});
