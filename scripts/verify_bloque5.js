const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/nda94/.gemini/antigravity/brain/419a7bf0-1a95-44bf-aff8-1d3d90cb44cd';

async function verifyBloque5() {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Test 1: Capture Preloader UI cleanly
  console.log('Capturing Preloader...');
  await page.route('**/*.glb', async route => {
    // Delay GLB response to clearly display the Preloader
    await new Promise(r => setTimeout(r, 1200));
    await route.continue();
  });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_bloque5_preloader.png'),
    fullPage: false
  });
  console.log('Saved evidence_bloque5_preloader.png with delayed GLB');

  // Test 2: Check HTML meta tags
  const metaRobots = await page.getAttribute('meta[name="robots"]', 'content').catch(() => null);
  const metaDescription = await page.getAttribute('meta[name="description"]', 'content').catch(() => null);
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content').catch(() => null);
  const ogSiteName = await page.getAttribute('meta[property="og:site_name"]', 'content').catch(() => null);
  const pageTitle = await page.title();

  console.log('Page Title:', pageTitle);
  console.log('Meta Robots:', metaRobots);
  console.log('Meta Description:', metaDescription);
  console.log('OG Title:', ogTitle);
  console.log('OG Site Name:', ogSiteName);

  // Test 3: Check robots.txt endpoint
  const robotsRes = await page.goto('http://localhost:3000/robots.txt');
  const robotsText = await robotsRes.text();
  console.log('Robots.txt contents:\n', robotsText);

  // Test 4: Check icon.svg endpoint
  const iconRes = await page.goto('http://localhost:3000/icon.svg');
  const iconText = await iconRes.text();
  console.log('Icon.svg contains C path:', iconText.includes('M22 11.5'));

  // Test 5: Check apple-icon endpoint
  const appleIconRes = await page.goto('http://localhost:3000/apple-icon');
  console.log('Apple-icon status:', appleIconRes.status(), 'Content-Type:', appleIconRes.headers()['content-type']);

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'evidence_bloque5_apple_icon.png')
  });

  await browser.close();
  console.log('Bloque 5 verification script completed successfully.');
}

verifyBloque5().catch(err => {
  console.error('Error during Bloque 5 verification:', err);
  process.exit(1);
});
