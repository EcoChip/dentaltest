const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function measureRun(options = {}) {
  const { isMobile = false, cpuThrottle = 1, width = 1440, height = 900, url = 'http://localhost:3000' } = options;

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });

  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: isMobile,
    hasTouch: isMobile
  });

  // Bypass cookie banner
  await context.addInitScript(() => {
    localStorage.setItem('cala_cookie_consent_v1', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
  });

  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  if (cpuThrottle > 1) {
    await client.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottle });
  }

  // Instrument frame times, CLS and long tasks
  await page.addInitScript(() => {
    window.__perfData = {
      frameTimes: [],
      lastTime: null,
      longTasks: 0,
      longTaskTotalDuration: 0,
      maxLongTask: 0,
      cls: 0,
    };

    // CLS observer
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__perfData.cls += entry.value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}

      // Long tasks observer
      try {
        const ltObserver = new PerformanceObserver((list) => {
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
        ltObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {}
    }

    // Frame timer
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

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Smooth scroll through key sections
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const steps = 30;
  const stepDistance = (totalHeight * 0.7) / steps;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((dist) => {
      if (window.__lenis) {
        window.__lenis.scrollTo(window.scrollY + dist, { immediate: false });
      } else {
        window.scrollBy(0, dist);
      }
    }, stepDistance);
    await page.waitForTimeout(60);
  }

  await page.waitForTimeout(800);

  // Extract metrics
  const results = await page.evaluate(() => {
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

    return {
      sampleCount: samples.length,
      avgFps: Math.round(avgFps * 10) / 10,
      minFps: Math.round(minFps * 10) / 10,
      avgFrameTimeMs: Math.round(avgDelta * 100) / 100,
      maxFrameTimeMs: Math.round(maxDelta * 100) / 100,
      longTasks: data.longTasks,
      maxLongTaskMs: Math.round(data.maxLongTask),
      totalLongTaskMs: Math.round(data.longTaskTotalDuration),
      cls: Math.round(data.cls * 1000) / 1000,
    };
  });

  await browser.close();
  return results;
}

async function main() {
  console.log('--- Medición de Rendimiento Final: Capa Global de Animaciones ---');

  console.log('\n[1] Escritorio Nativo (1440x900, CPU 1x)...');
  const desktop = await measureRun({ width: 1440, height: 900, cpuThrottle: 1 });
  console.log('Desktop:', JSON.stringify(desktop, null, 2));

  console.log('\n[2] Escritorio con ?motion=off (1440x900)...');
  const desktopMotionOff = await measureRun({ width: 1440, height: 900, cpuThrottle: 1, url: 'http://localhost:3000/?motion=off' });
  console.log('Desktop Motion Off:', JSON.stringify(desktopMotionOff, null, 2));

  console.log('\n[3] Móvil Medio (375x812, CPU 4x Throttle)...');
  const mobile4x = await measureRun({ width: 375, height: 812, isMobile: true, cpuThrottle: 4 });
  console.log('Mobile 4x:', JSON.stringify(mobile4x, null, 2));

  const report = {
    timestamp: new Date().toISOString(),
    desktop,
    desktopMotionOff,
    mobile4x
  };

  fs.writeFileSync('docs/perf-motion-report.json', JSON.stringify(report, null, 2));
  console.log('\nResultados exportados a docs/perf-motion-report.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
