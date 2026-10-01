const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function verifyBrand() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  // Set cookie consent to avoid banner obscuring content
  await context.addInitScript(() => {
    localStorage.setItem('cala_cookie_consent_v1', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
  });

  const page = await context.newPage();

  console.log('Navigating to Home...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of Header & Hero
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_brand_home_hero.png'),
    clip: { x: 0, y: 0, width: 1440, height: 800 }
  });
  console.log('Saved evidence_brand_home_hero.png');

  // Check footer on Home
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_brand_footer.png'),
    clip: { x: 0, y: 450, width: 1440, height: 450 }
  });
  console.log('Saved evidence_brand_footer.png');

  // Check Equipo page
  console.log('Navigating to /equipo...');
  await page.goto('http://localhost:3000/equipo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_brand_equipo.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('Saved evidence_brand_equipo.png');

  // Check Aviso Legal page
  console.log('Navigating to /aviso-legal...');
  await page.goto('http://localhost:3000/aviso-legal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_brand_aviso_legal.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('Saved evidence_brand_aviso_legal.png');

  // Check page titles and brand presence
  const homeTitle = await page.evaluate(async () => {
    const res = await fetch('/');
    const text = await res.text();
    const titleMatch = text.match(/<title>(.*?)<\/title>/);
    return titleMatch ? titleMatch[1] : '';
  });
  console.log('Home title:', homeTitle);

  const avisoLegalTitle = await page.title();
  console.log('Aviso Legal page title:', avisoLegalTitle);

  await browser.close();
  console.log('Verification finished successfully.');
}

verifyBrand().catch(err => {
  console.error('Error during brand verification:', err);
  process.exit(1);
});
