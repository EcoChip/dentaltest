const { chromium } = require('playwright');

async function main() {
  console.log('--- Medición de Rendimiento con GPU Habilitada en Chrome ---');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: [
      '--enable-gpu',
      '--ignore-gpu-blocklist',
      '--enable-webgl',
      '--disable-dev-shm-usage',
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  await context.addInitScript(() => {
    localStorage.setItem('cala_cookie_consent_v1', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__perf = { frames: [], last: null };
    function tick(now) {
      if (window.__perf.last !== null) {
        window.__perf.frames.push(now - window.__perf.last);
      }
      window.__perf.last = now;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Scroll through sections (TrustMetrics, Treatments, Team, FAQ, Reviews)
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(window.scrollY + 250, { immediate: false });
      } else {
        window.scrollBy(0, 250);
      }
    });
    await page.waitForTimeout(50);
  }

  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(() => {
    const raw = window.__perf.frames;
    // Remove load spikes (first 30 frames)
    const steady = raw.slice(30);
    const sum = steady.reduce((a, b) => a + b, 0);
    const avgDelta = sum / steady.length;
    return {
      totalFrames: steady.length,
      avgFps: Math.round((1000 / avgDelta) * 10) / 10,
      avgFrameTimeMs: Math.round(avgDelta * 100) / 100,
    };
  });

  console.log('Resultados DOM & Scroll con GPU:', JSON.stringify(metrics, null, 2));
  await browser.close();
}

main().catch(console.error);
