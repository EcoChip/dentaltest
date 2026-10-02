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

  // Scroll through the transition zone (from 10% to 26% of stage scroll)
  const stageHeight = await page.evaluate(() => {
    const stage = document.querySelector('section[aria-label*="ortodoncia"]');
    return stage ? stage.offsetHeight : window.innerHeight * 14;
  });
  const scrollRange = stageHeight - (await page.evaluate(() => window.innerHeight));

  const startY = scrollRange * 0.10;
  const endY = scrollRange * 0.25;
  const steps = 30;
  const stepDistance = (endY - startY) / steps;

  // Jump to start
  await page.evaluate((y) => {
    if (window.__lenis) {
      window.__lenis.scrollTo(y, { immediate: true });
    } else {
      window.scrollTo(0, y);
    }
  }, startY);
  await page.waitForTimeout(400);

  // Animate through Bloque C section
  for (let i = 0; i < steps; i++) {
    await page.evaluate((dist) => {
      if (window.__lenis) {
        window.__lenis.scrollTo(window.scrollY + dist, { immediate: false });
      } else {
        window.scrollBy(0, dist);
      }
    }, stepDistance);
    await page.waitForTimeout(45);
  }

  await page.waitForTimeout(400);

  // Extract metrics
  const perfResult = await page.evaluate(() => {
    const data = window.__perfData;
    const samples = data.frameTimes.slice(10);
    let avgDelta = 16.66;
    let avgFps = 60;
    let minFps = 60;
    let maxDelta = 0;

    if (samples.length > 0) {
      const sum = samples.reduce((a, b) => a + b, 0);
      avgDelta = sum / samples.length;
      avgFps = 1000 / avgDelta;
      maxDelta = Math.max(...samples);
      minFps = 1000 / maxDelta;
    }

    return {
      sampleCount: samples.length,
      avgFps: Math.round(avgFps * 10) / 10,
      minFps: Math.round(minFps * 10) / 10,
      avgFrameTimeMs: Math.round(avgDelta * 100) / 100,
      maxFrameTimeMs: Math.round(maxDelta * 100) / 100,
      longTasks: data.longTasks,
      maxLongTaskMs: Math.round(data.maxLongTask),
      totalLongTaskMs: Math.round(data.longTaskTotalDuration),
    };
  });

  return perfResult;
}

async function captureBloqueC(browser, width, height, fileName, isMobileDevice = false) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: isMobileDevice,
    hasTouch: isMobileDevice,
    deviceScaleFactor: 1,
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
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Scroll to Bloque C (around progress 0.17 of the 14-unit stage, i.e. timeline 2.38 / 14.0)
  await page.evaluate(() => {
    const stage = document.querySelector('section[aria-label*="ortodoncia"]');
    const stageHeight = stage ? stage.offsetHeight : window.innerHeight * 14;
    const scrollRange = stageHeight - window.innerHeight;
    const targetScroll = scrollRange * 0.17;
    if (window.__lenis) {
      window.__lenis.scrollTo(targetScroll, { immediate: true });
    } else {
      window.scrollTo(0, targetScroll);
    }
  });

  await page.waitForTimeout(1400); // Allow scrub and line drawing to settle

  const savePath = path.join(ARTIFACT_DIR, fileName);
  await page.screenshot({ path: savePath, fullPage: false });
  console.log(`Saved Bloque C capture (${width}x${height}): ${savePath}`);

  await context.close();
  return savePath;
}

async function main() {
  console.log('=== BENCHMARK & EVIDENCE CAPTURE — FASE 6 BLOQUE C (ESQUEMA TÉCNICO & PARALLAX) ===');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  // 1. Performance benchmarks
  console.log('\n[1/3] Running Desktop Performance Benchmark (Bloque C)...');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await desktopContext.addInitScript(() => {
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
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  const desktopPerf = await runBenchmark(desktopPage, { isMobile: false, cpuThrottle: 1 });
  await desktopContext.close();
  console.log('Desktop Perf Result (Bloque C):', JSON.stringify(desktopPerf, null, 2));

  console.log('\n[2/3] Running Mobile 4x Throttle Performance Benchmark (Bloque C)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });
  await mobileContext.addInitScript(() => {
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
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  const mobilePerf = await runBenchmark(mobilePage, { isMobile: true, cpuThrottle: 4 });
  await mobileContext.close();
  console.log('Mobile 4x Perf Result (Bloque C):', JSON.stringify(mobilePerf, null, 2));

  // 2. Responsive captures across required viewports (1920, 1440, 768, 375)
  console.log('\n[3/3] Capturing Responsive Evidence across Viewports...');
  await captureBloqueC(browser, 1920, 1080, 'evidence_bloqueC_blueprint_1920px.png', false);
  await captureBloqueC(browser, 1440, 900, 'evidence_bloqueC_blueprint_1440px.png', false);
  await captureBloqueC(browser, 768, 1024, 'evidence_bloqueC_blueprint_768px.png', false);
  await captureBloqueC(browser, 375, 812, 'evidence_bloqueC_blueprint_375px.png', true);

  await browser.close();

  console.log('\n✅ Bloque C benchmarking and captures completed successfully!');
}

main().catch((err) => {
  console.error('Fatal error during Bloque C execution:', err);
  process.exit(1);
});
