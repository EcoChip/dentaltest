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
  const steps = 30;
  const stepDistance = (totalHeight * 0.50) / steps;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((dist) => {
      if (window.__lenis) {
        window.__lenis.scrollTo(window.scrollY + dist, { immediate: false });
      } else {
        window.scrollBy(0, dist);
      }
    }, stepDistance);
    await page.waitForTimeout(40);
  }

  await page.waitForTimeout(300);

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

async function captureDesktopMegaMenu(browser, width, height, fileName) {
  const context = await browser.newContext({
    viewport: { width, height },
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
  await page.waitForTimeout(1000);

  // Hover and click on "Tratamientos" trigger
  const treatmentsTrigger = page.locator('button:has-text("Tratamientos")').first();
  await treatmentsTrigger.hover();
  await page.waitForTimeout(200);

  // Ensure mega menu is visible
  const megaMenu = page.locator('#treatments-mega-menu');
  await megaMenu.waitFor({ state: 'visible', timeout: 3000 });
  await page.waitForTimeout(400);

  const savePath = path.join(ARTIFACT_DIR, fileName);
  await page.screenshot({ path: savePath, fullPage: false });
  console.log(`Saved Desktop Mega Menu capture (${width}x${height}): ${savePath}`);

  await context.close();
  return savePath;
}

async function captureMobileAccordion(browser, width, height, fileName) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: true,
    hasTouch: true,
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
  await page.waitForTimeout(1000);

  // Click on hamburger toggle button
  const hamburgerBtn = page.locator('button[aria-label="Abrir menú de navegación"]');
  await hamburgerBtn.click();
  await page.waitForTimeout(500);

  // Expand "Tratamientos" accordion
  const accordionToggleBtn = page.locator('button[aria-controls="mobile-treatments-accordion"]');
  await accordionToggleBtn.click();
  await page.waitForTimeout(500);

  const savePath = path.join(ARTIFACT_DIR, fileName);
  await page.screenshot({ path: savePath, fullPage: false });
  console.log(`Saved Mobile Accordion capture (${width}x${height}): ${savePath}`);

  await context.close();
  return savePath;
}

async function testAccessibilityAndGraceDelay(browser) {
  console.log('\n--- Verificando Accesibilidad y Delay de Gracia (150ms) ---');
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
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const treatmentsTrigger = page.locator('button:has-text("Tratamientos")').first();

  // Test 1: Check initial aria attributes
  const initialExpanded = await treatmentsTrigger.getAttribute('aria-expanded');
  const hasPopup = await treatmentsTrigger.getAttribute('aria-haspopup');
  console.log(`[A11Y] Initial aria-expanded: ${initialExpanded}, aria-haspopup: ${hasPopup}`);

  // Test 2: Hover opens with grace
  await treatmentsTrigger.hover();
  await page.waitForTimeout(100);
  const isMenuVisibleHover = await page.locator('#treatments-mega-menu').isVisible();
  console.log(`[Hover] Mega menu visible on hover: ${isMenuVisibleHover}`);

  // Test 3: Grace delay on mouseleave (150ms)
  await page.mouse.move(0, 0); // Move mouse away
  await page.waitForTimeout(50); // Inside 150ms window
  const isStillVisibleAt50ms = await page.locator('#treatments-mega-menu').isVisible();
  console.log(`[Grace Delay] Mega menu still open at 50ms: ${isStillVisibleAt50ms}`);

  await page.waitForTimeout(200); // Past 150ms window
  const isClosedAt250ms = !(await page.locator('#treatments-mega-menu').isVisible());
  console.log(`[Grace Delay] Mega menu closed at 250ms: ${isClosedAt250ms}`);

  // Test 4: Keyboard accessibility (Escape closes and restores focus)
  await treatmentsTrigger.focus();
  await treatmentsTrigger.press('Enter');
  await page.waitForTimeout(200);
  const isOpenAfterKeyboard = await page.locator('#treatments-mega-menu').isVisible();
  console.log(`[A11Y Keyboard] Mega menu opened with Enter: ${isOpenAfterKeyboard}`);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const isClosedAfterEscape = !(await page.locator('#treatments-mega-menu').isVisible());
  const isTriggerFocused = await treatmentsTrigger.evaluate((el) => document.activeElement === el);
  console.log(`[A11Y Keyboard] Mega menu closed with Escape: ${isClosedAfterEscape}`);
  console.log(`[A11Y Keyboard] Focus returned to trigger button: ${isTriggerFocused}`);

  await context.close();
}

async function main() {
  console.log('=== BENCHMARK & EVIDENCE CAPTURE — FASE 6 BLOQUE B (NAVBAR DROPDOWN) ===');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  // 1. Performance benchmarks
  console.log('\n[1/4] Running Desktop Performance Benchmark...');
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
  const desktopPerf = await runBenchmark(desktopPage, { isMobile: false, cpuThrottle: 1 });
  await desktopContext.close();
  console.log('Desktop Perf Result:', JSON.stringify(desktopPerf, null, 2));

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
  const mobilePerf = await runBenchmark(mobilePage, { isMobile: true, cpuThrottle: 4 });
  await mobileContext.close();
  console.log('Mobile 4x Perf Result:', JSON.stringify(mobilePerf, null, 2));

  // 2. Test Accessibility and Grace Delay
  await testAccessibilityAndGraceDelay(browser);

  // 3. Capture screenshots at all required viewports (375, 768, 1440, 1920)
  console.log('\n[3/4] Capturing Responsive Evidence across Viewports...');
  // 1920 px (Ultra-wide Desktop)
  await captureDesktopMegaMenu(browser, 1920, 1080, 'evidence_bloqueB_viewport_1920px.png');
  // 1440 px (Standard Desktop)
  await captureDesktopMegaMenu(browser, 1440, 900, 'evidence_bloqueB_viewport_1440px.png');
  // 768 px (Tablet Viewport - Hamburger & Accordion)
  await captureMobileAccordion(browser, 768, 1024, 'evidence_bloqueB_viewport_768px.png');
  // 375 px (Mobile Viewport with accordion open)
  await captureMobileAccordion(browser, 375, 812, 'evidence_bloqueB_viewport_375px.png');

  await browser.close();

  console.log('\n✅ Bloque B benchmarking and captures completed successfully!');
}

main().catch((err) => {
  console.error('Fatal error during Bloque B execution:', err);
  process.exit(1);
});
