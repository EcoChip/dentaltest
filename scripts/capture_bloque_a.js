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

  // Scroll through the hero scrollytelling scenes
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const steps = 40;
  const stepDistance = (totalHeight * 0.70) / steps;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((dist) => {
      if (window.__lenis) {
        window.__lenis.scrollTo(window.scrollY + dist, { immediate: false });
      } else {
        window.scrollBy(0, dist);
      }
    }, stepDistance);
    await page.waitForTimeout(50);
  }

  await page.waitForTimeout(500);

  // Extract metrics
  const perfResult = await page.evaluate(() => {
    const data = window.__perfData;
    const samples = data.frameTimes.slice(15);
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

    let glInfo = null;
    if (typeof window.__getGlInfo === 'function') {
      glInfo = window.__getGlInfo();
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
      glInfo,
    };
  });

  return perfResult;
}

async function captureViewportScreenshot(browser, width, height, isMobile, fileName) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: isMobile,
    hasTouch: isMobile,
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

  // Scroll to Paso 3 (Fabricación e inserción de férulas SmartTrack)
  // Timeline label 's3_process' is at 5.0 / 14 = 0.357.
  // Paso 3 (SmartTrack reveal) is at 7.05 to 7.95 / 14 = 0.503 to 0.567.
  // We capture at 0.545 where the aligner is beautifully revealed over the arch.
  const targetScroll = await page.evaluate(() => {
    const stage = document.querySelector('section');
    return stage ? stage.clientHeight * 0.545 : 4500;
  });

  await page.evaluate((scrollPos) => {
    if (window.__lenis) {
      window.__lenis.scrollTo(scrollPos, { immediate: true });
    } else {
      window.scrollTo(0, scrollPos);
    }
  }, targetScroll);

  await page.waitForTimeout(1000);

  const savePath = path.join(ARTIFACT_DIR, fileName);
  await page.screenshot({ path: savePath, fullPage: false });
  console.log(`Saved screenshot (${width}x${height}): ${savePath}`);

  await context.close();
  return savePath;
}

async function captureSequenceFrames(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
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
  await page.waitForTimeout(1200);

  // Progression of the translucent aligner reveal:
  // 1: Natural teeth before aligner (0.50)
  // 2: Laser boundary emerging across molars (0.525)
  // 3: Aligner advancing over premolars & incisors (0.545)
  // 4: Aligner fully seated with volumetric translucent SmartTrack polymer (0.565)
  const stageHeight = await page.evaluate(() => {
    const stage = document.querySelector('section');
    return stage ? stage.clientHeight : 10000;
  });

  const progressionPoints = [
    { name: 'evidence_bloqueA_progression_1_teeth_baseline', progress: 0.50 },
    { name: 'evidence_bloqueA_progression_2_reveal_front', progress: 0.528 },
    { name: 'evidence_bloqueA_progression_3_translucent_seated', progress: 0.550 },
    { name: 'evidence_bloqueA_progression_4_full_polyurethane_depth', progress: 0.565 },
  ];

  for (const pt of progressionPoints) {
    const scrollPos = stageHeight * pt.progress;
    await page.evaluate((pos) => {
      if (window.__lenis) {
        window.__lenis.scrollTo(pos, { immediate: true });
      } else {
        window.scrollBy(0, pos);
      }
    }, scrollPos);

    await page.waitForTimeout(600);
    const framePath = path.join(ARTIFACT_DIR, `${pt.name}.png`);
    await page.screenshot({ path: framePath });
    console.log(`Saved sequence frame: ${framePath}`);
  }

  await context.close();
}

async function main() {
  console.log('=== BENCHMARK & EVIDENCE CAPTURE — FASE 6 BLOQUE A ===');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  // 1. Performance Benchmark: Desktop Native (1440x900)
  console.log('\n[1/4] Running Desktop Performance Benchmark...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
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
  console.log('Desktop Perf Result:', JSON.stringify(desktopPerf, null, 2));

  // 2. Performance Benchmark: Mobile 4x Throttle (375x812)
  console.log('\n[2/4] Running Mobile 4x Throttle Performance Benchmark...');
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
  console.log('Mobile 4x Perf Result:', JSON.stringify(mobilePerf, null, 2));

  // 3. Capture Screenshots across all required viewports (375, 768, 1440, 1920)
  console.log('\n[3/4] Capturing responsive viewports at Scene 2/3 (Translucent Aligner)...');
  await captureViewportScreenshot(browser, 375, 812, true, 'evidence_bloqueA_viewport_375px.png');
  await captureViewportScreenshot(browser, 768, 1024, false, 'evidence_bloqueA_viewport_768px.png');
  await captureViewportScreenshot(browser, 1440, 900, false, 'evidence_bloqueA_viewport_1440px.png');
  await captureViewportScreenshot(browser, 1920, 1080, false, 'evidence_bloqueA_viewport_1920px.png');

  // 4. Capture Progression sequence
  console.log('\n[4/4] Capturing 3D aligner reveal progression sequence...');
  await captureSequenceFrames(browser);

  await browser.close();

  // Save perf report to JSON
  const report = {
    timestamp: new Date().toISOString(),
    desktopNative: desktopPerf,
    mobile4xThrottle: mobilePerf,
  };
  fs.writeFileSync(
    path.join(__dirname, '../docs/perf-transparency.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  console.log('\n✅ All benchmarks and captures completed successfully!');
}

main().catch((err) => {
  console.error('Fatal error during benchmark/capture:', err);
  process.exit(1);
});
