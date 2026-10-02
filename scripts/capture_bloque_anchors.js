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

  // Scroll smoothly through Scene 2 (around 30% to 45% of total scrollytelling height)
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const startY = totalHeight * 0.20;
  const endY = totalHeight * 0.45;
  const steps = 30;
  const stepDistance = (endY - startY) / steps;

  // Scroll to start of Scene 2
  await page.evaluate((y) => {
    if (window.__lenis) {
      window.__lenis.scrollTo(y, { immediate: true });
    } else {
      window.scrollTo(0, y);
    }
  }, startY);
  await page.waitForTimeout(400);

  // Animate through Scene 2
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

async function captureScene2Anchors(browser, width, height, fileName, isMobileDevice = false) {
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
  await page.waitForTimeout(1500); // Allow 3D scene & Draco to initialize

  // Scroll to Scene 2 where annotations are active (progress 0.285 of 1400svh stage)
  await page.evaluate(() => {
    const stage = document.querySelector('section[aria-label*="ortodoncia"]');
    const stageHeight = stage ? stage.offsetHeight : window.innerHeight * 14;
    const scrollRange = stageHeight - window.innerHeight;
    const targetScroll = scrollRange * 0.285;
    if (window.__lenis) {
      window.__lenis.scrollTo(targetScroll, { immediate: true });
    } else {
      window.scrollTo(0, targetScroll);
    }
  });

  await page.waitForTimeout(1500); // Wait for GSAP scrub and 3D positioning to settle

  const savePath = path.join(ARTIFACT_DIR, fileName);
  await page.screenshot({ path: savePath, fullPage: false });
  console.log(`Saved Scene 2 Anchors capture (${width}x${height}): ${savePath}`);

  await context.close();
  return savePath;
}

async function testRaycastDebug(browser) {
  console.log('\n--- Probando herramienta de raycast ?debug ---');
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
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
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('http://localhost:3000/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Invoke raycast at tooth coordinates
  const anchorData = await page.evaluate(() => {
    if (typeof window.__raycastAtScreen === 'function') {
      return window.__raycastAtScreen(720, 360) || window.__raycastAtScreen(720, 480);
    }
    return null;
  });
  console.log('Raycast anchor computed:', JSON.stringify(anchorData));

  await page.waitForTimeout(400);
  const toast = page.locator('text=/Anclaje (UPPER|LOWER) copiado/');
  const toastCount = await toast.count();
  console.log(`Raycast ?debug click executed. Toast detected: ${toastCount > 0}`);

  await context.close();
}

async function main() {
  console.log('=== BENCHMARK & EVIDENCE CAPTURE — FASE 6 BLOQUE B (ANCLAJES & CARTELES) ===');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  // 1. Performance benchmarks
  console.log('\n[1/4] Running Desktop Performance Benchmark (Scene 2)...');
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
  console.log('Desktop Perf Result (Scene 2):', JSON.stringify(desktopPerf, null, 2));

  console.log('\n[2/4] Running Mobile 4x Throttle Performance Benchmark (Scene 2)...');
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
  console.log('Mobile 4x Perf Result (Scene 2):', JSON.stringify(mobilePerf, null, 2));

  // 2. Test Raycast Debug Tool
  await testRaycastDebug(browser);

  // 3. Captures across 4 required responsive viewports
  console.log('\n[3/4] Capturing Responsive Evidence across Viewports...');
  // 1920 px (Ultra-wide Desktop)
  await captureScene2Anchors(browser, 1920, 1080, 'evidence_bloqueB_anchors_1920px.png', false);
  // 1440 px (Standard Desktop)
  await captureScene2Anchors(browser, 1440, 900, 'evidence_bloqueB_anchors_1440px.png', false);
  // 768 px (Tablet Viewport)
  await captureScene2Anchors(browser, 768, 1024, 'evidence_bloqueB_anchors_768px.png', false);
  // 375 px (Mobile Viewport)
  await captureScene2Anchors(browser, 375, 812, 'evidence_bloqueB_anchors_375px.png', true);

  await browser.close();

  console.log('\n✅ Bloque B (Anclajes y Carteles) benchmarking and captures completed successfully!');
}

main().catch((err) => {
  console.error('Fatal error during Bloque B execution:', err);
  process.exit(1);
});
