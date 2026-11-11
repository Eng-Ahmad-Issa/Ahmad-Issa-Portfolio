// Requires Playwright and Chrome. Start the static site, then run:
// node tests/portfolio-smoke.cjs [http://127.0.0.1:4173]
// Optional: PORTFOLIO_QA_DIR saves visual review screenshots outside the source tree.
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  const base = process.argv[2] || 'http://127.0.0.1:4173';
  const check = async (name, test) => { await test(); console.log(`PASS ${name}`); };
  const screenshot = async name => {
    if (process.env.PORTFOLIO_QA_DIR) {
      await page.screenshot({ path: path.join(process.env.PORTFOLIO_QA_DIR, `${name}.png`), animations: 'disabled' });
    }
  };

  try {
    await page.goto(base);
    await check('native cursor and project-first structure', async () => {
      assert.equal(await page.locator('canvas:not([data-studio-canvas]), [data-cursor-ring]').count(), 0);
      assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).cursor), 'none');
      assert.deepEqual(await page.locator('main > section').evaluateAll(els => els.map(el => el.id)), ['home', 'portfolio', 'about', 'experience', 'skills', 'contact']);
    });
    await screenshot('desktop-home');

    await check('terrain renders one static frame for reduced motion, then animates, reacts, and pauses off screen', async () => {
      const studio = page.locator('[data-pattern-studio]');
      const field = page.locator('[data-studio-art]');
      const canvas = field.locator('canvas');
      const pixels = () => canvas.evaluate(el => el.toDataURL());
      const state = name => studio.getAttribute(`data-${name}`);
      const waitForState = (name, value) => page.waitForFunction(([name, value]) => document.querySelector('[data-pattern-studio]').dataset[name] === value, [name, value]);
      assert.equal(await field.getAttribute('aria-hidden'), 'true');
      assert.equal(await field.locator('button, a, [tabindex]').count(), 0);
      assert.equal(await state('pattern'), 'terrain');
      assert.equal(await state('lines'), '26');
      assert.ok(await field.evaluate(el => el.clientHeight) >= 352);
      assert.ok(await field.evaluate(el => el.clientWidth) > (await page.locator('.hero-copy').evaluate(el => el.clientWidth)) * 1.8);

      // The context starts with reduced motion: a drawn frame, no loop, and no pointer response.
      assert.equal(await state('reactive'), 'false');
      assert.equal(await state('running'), 'false');
      assert.equal(await canvas.evaluate(el => {
        const blank = document.createElement('canvas');
        blank.width = el.width;
        blank.height = el.height;
        return el.toDataURL() !== blank.toDataURL();
      }), true, 'The static frame is drawn');
      const rest = await pixels();
      await field.hover({ position: { x: 300, y: 160 } });
      await page.waitForTimeout(250);
      assert.equal(await pixels(), rest);
      assert.equal(await state('interacting'), 'false');
      assert.match(await page.locator('[data-studio-readout]').textContent(), /^Static view/);
      await screenshot('studio-rest');

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await waitForState('running', 'true');
      assert.equal(await state('reactive'), 'true');
      const moving = await pixels();
      await page.waitForTimeout(400);
      assert.notEqual(await pixels(), moving, 'The terrain drifts while it is visible');
      await field.hover({ position: { x: 420, y: 200 } });
      await waitForState('interacting', 'true');
      await page.waitForFunction(() => /^Elevation \d+/.test(document.querySelector('[data-studio-readout]').textContent));
      await screenshot('studio-hover');
      await field.click({ position: { x: 520, y: 220 } });
      await waitForState('interacting', 'true');
      await screenshot('studio-ripple');

      await page.locator('#contact').scrollIntoViewIfNeeded();
      await waitForState('running', 'false');
      assert.equal(await state('interacting'), 'false', 'The loop stops and settles off screen');
      await field.scrollIntoViewIfNeeded();
      await waitForState('running', 'true');

      await page.locator('[data-motion-toggle]').click();
      await waitForState('running', 'false');
      assert.equal(await state('reactive'), 'false');
      await field.hover({ position: { x: 360, y: 180 } });
      assert.equal(await state('interacting'), 'false');
      const paused = await pixels();
      await page.waitForTimeout(250);
      assert.equal(await pixels(), paused, 'No frames are drawn while motion is off');
      await page.locator('[data-motion-toggle]').click();
      await field.hover({ position: { x: 380, y: 190 } });
      await waitForState('running', 'true');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await waitForState('reactive', 'false');
      assert.equal(await state('running'), 'false');
      assert.equal(await state('interacting'), 'false');
    });

    await check('pattern controls support keyboard, all presets, live ranges, shuffle, and reset', async () => {
      const studio = page.locator('[data-pattern-studio]');
      const toggle = page.locator('[data-studio-toggle]');
      const pixels = () => page.locator('[data-studio-canvas]').evaluate(el => el.toDataURL());
      const state = name => studio.getAttribute(`data-${name}`);
      await toggle.focus();
      await page.keyboard.press('Enter');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('[data-studio-close]').evaluate(el => el === document.activeElement), true);
      // Reduced motion keeps the canvas static, so each control must change the pixels by itself.
      for (const [pattern, label] of [['waves', 'Curve strength'], ['orbits', 'Curve strength'], ['terrain', 'Relief']]) {
        const before = await pixels();
        await page.locator(`[data-studio-pattern="${pattern}"]`).focus();
        await page.keyboard.press('Space');
        assert.notEqual(await pixels(), before);
        assert.equal(await state('pattern'), pattern);
        assert.equal(await page.locator('[data-studio-curve-label]').textContent(), label);
        assert.equal(await page.locator('[data-studio-pattern][aria-pressed="true"]').count(), 1);
      }
      for (const palette of ['aurora', 'sunset', 'ember', 'prism']) {
        const before = await pixels();
        await page.locator(`[data-studio-palette="${palette}"]`).click();
        assert.notEqual(await pixels(), before);
        assert.equal(await state('palette'), palette);
        assert.equal(await page.locator('[data-studio-palette][aria-pressed="true"]').count(), 1);
      }
      await page.locator('#studio-density').focus();
      await page.keyboard.press('End');
      assert.equal(await state('lines'), '40');
      assert.equal(await page.locator('#studio-density').getAttribute('aria-valuetext'), '40 lines');
      const dense = await pixels();
      await page.keyboard.press('Home');
      assert.equal(await state('lines'), '12');
      assert.notEqual(await pixels(), dense);
      const beforeCurve = await pixels();
      await page.locator('#studio-curve').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#studio-curve').inputValue(), '70');
      assert.notEqual(await pixels(), beforeCurve);
      for (const style of ['segments', 'dots', 'continuous']) {
        const before = await pixels();
        await page.locator('#studio-line-style').selectOption(style);
        assert.equal(await state('line-style'), style);
        assert.notEqual(await pixels(), before);
      }
      await page.locator('[data-studio-random]').click();
      assert.equal(await page.locator('[data-studio-palette="prism"]').getAttribute('aria-pressed'), 'false');
      assert.match(await page.locator('[data-studio-status]').textContent(), /New pattern/);
      assert.equal(await page.locator('[data-studio-ripple]').isDisabled(), true, 'Ripples need motion');
      await page.locator('[data-studio-reset]').click();
      assert.equal(await state('lines'), '26');
      assert.equal(await state('seed'), '7');
      assert.equal(await page.locator('#studio-curve').inputValue(), '65');
      assert.equal(await page.locator('#studio-line-style').inputValue(), 'continuous');
      assert.equal(await page.locator('[data-studio-pattern="terrain"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-studio-palette="prism"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-pattern-studio]').scrollIntoViewIfNeeded();
      await screenshot('studio-controls');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#studio-controls').isVisible(), false);
      assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
      // The motion control is disabled while the OS requests reduced motion.
      await page.locator('#panel-app [data-project-modal]').focus();
      await page.keyboard.press('Tab');
      assert.equal(await toggle.evaluate(el => el === document.activeElement), true, 'Focus follows the visible section order');
      await toggle.click();
      await page.locator('[data-studio-close]').click();
      assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
      await toggle.click();
      await page.locator('[data-studio-art]').click({ position: { x: 80, y: 80 } });
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      await page.locator('[data-studio-pattern="orbits"]').click();
      await page.locator('[data-studio-palette="aurora"]').click();
      await page.keyboard.press('Escape');
      await screenshot('studio-orbits');
      await toggle.click();
      await page.locator('[data-studio-reset]').click();
      await page.keyboard.press('Escape');
      await toggle.click();
      await page.locator('[data-studio-reset]').focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.hero-scroll').evaluate(el => el === document.activeElement), true);
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false', 'Leaving the panel closes the disclosure');

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await toggle.click();
      await page.locator('[data-studio-ripple]').click();
      await page.waitForFunction(() => document.querySelector('[data-pattern-studio]').dataset.interacting === 'true');
      assert.match(await page.locator('[data-studio-status]').textContent(), /Ripple sent/);
      await page.keyboard.press('Escape');
      await page.emulateMedia({ reducedMotion: 'reduce' });
    });

    await check('inventory filter updates products, request, and summary', async () => {
      for (const [filter, count, stock] of [['desk', 2, 18], ['travel', 1, 8], ['all', 3, 26]]) {
        await page.locator(`[data-demo-filter="${filter}"]`).click();
        assert.equal(await page.locator('[data-demo-product]:visible').count(), count);
        assert.match(await page.locator('[data-demo-result]').textContent(), new RegExp(`${stock} units`));
        assert.equal(await page.locator('[data-demo-request]').textContent(), `/api/products${filter === 'all' ? '' : `?category=${filter}`}`);
        assert.equal(await page.locator('[data-demo-filter][aria-pressed="true"]').count(), 1);
      }
      assert.equal(requests.some(url => url.includes('/api/products')), false, 'Demo must not call a real API');
    });

    await check('tabs support arrows, Home, End, and roving focus', async () => {
      await page.locator('#tab-app').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#tab-gis').getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('#panel-app').isVisible(), false);
      assert.equal(await page.locator('#panel-gis').isVisible(), true);
      await page.keyboard.press('End');
      assert.equal(await page.locator('#tab-ai').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#tab-app').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.locator('#tab-ai').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Home');
      assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
    });

    await check('all map markers expose the matching record', async () => {
      await page.locator('#tab-gis').click();
      for (const [site, name, id] of [['central', 'Central site', 'FT-002'], ['south', 'South site', 'FT-003'], ['north', 'North site', 'FT-001']]) {
        await page.locator(`[data-demo-site="${site}"]`).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('[data-site-name]').textContent(), name);
        assert.equal(await page.locator('[data-site-id]').textContent(), id);
        assert.equal(await page.locator('[data-demo-site][aria-pressed="true"]').count(), 1);
      }
      await screenshot('desktop-gis');
    });

    await check('AI workflow stages update their explanation', async () => {
      await page.locator('#tab-ai').click();
      for (const [step, title] of [['build', 'Focused tasks. Shared context.'], ['verify', 'Evidence before delivery.'], ['scope', 'Context before code.']]) {
        await page.locator(`[data-demo-step="${step}"]`).click();
        assert.equal(await page.locator('[data-step-title]').textContent(), title);
        assert.equal(await page.locator('[data-demo-step][aria-pressed="true"]').count(), 1);
      }
      await screenshot('desktop-ai');
    });

    await check('workbench links open the correct dialogs and restore focus', async () => {
      for (const [tab, title] of [['app', 'Retail and Inventory Application'], ['gis', 'ArcGIS Experience Builder Workflows'], ['ai', 'AI Agent Workflows and Automation']]) {
        await page.locator(`#tab-${tab}`).click();
        const trigger = page.locator(`#panel-${tab} [data-project-modal]`);
        await trigger.click();
        assert.equal(await page.locator('#project-modal-title').textContent(), title);
        assert.equal(await page.locator('#project-modal').evaluate(el => el.open), true);
        await page.keyboard.press('Escape');
        assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
      }
    });

    await check('all nine project filters match their category counts', async () => {
      const expected = { all: 13, software: 2, web: 7, gis: 6, desktop: 1, ai: 2, testing: 1, support: 1, research: 3 };
      for (const [filter, count] of Object.entries(expected)) {
        await page.locator(`[data-filter="${filter}"]`).click();
        assert.equal(await page.locator('.portfolio-box:visible').count(), count, filter);
        assert.match(await page.locator('#project-filter-status').textContent(), new RegExp(String(count)));
      }
      await page.locator('[data-filter="all"]').click();
      await page.locator('#portfolio').scrollIntoViewIfNeeded();
      await screenshot('desktop-projects');
    });

    await check('all thirteen project dialogs open', async () => {
      for (const card of await page.locator('.portfolio-box').all()) {
        const title = await card.locator('h3').textContent();
        await card.locator('[data-project-modal]').click();
        assert.equal(await page.locator('#project-modal-title').textContent(), title);
        await page.keyboard.press('Escape');
      }
    });

    await check('responsive layouts have no horizontal clipping', async () => {
      for (const theme of ['dark', 'light']) {
        await page.evaluate(theme => { localStorage.setItem('ahmad-issa-theme', theme); }, theme);
        await page.reload();
        for (const width of [320, 390, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          await page.waitForFunction(() => {
            const field = document.querySelector('[data-studio-art]');
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            return field.querySelector('canvas').width === Math.round(field.clientWidth * ratio);
          });
          for (const tab of ['app', 'gis', 'ai']) {
            await page.locator(`#tab-${tab}`).click();
            const bounds = await page.evaluate(() => ({
              overflow: document.documentElement.scrollWidth > innerWidth,
              clipped: [...document.querySelectorAll('main button, main h1, main h2, main h3, main p')]
                .filter(el => el.getClientRects().length && !el.closest('dialog'))
                .filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; })
                .map(el => el.textContent.trim().slice(0, 50)),
            }));
            assert.equal(bounds.overflow, false, `${theme} ${width}px ${tab}`);
            assert.deepEqual(bounds.clipped, [], `${theme} ${width}px ${tab}`);
          }
          await page.locator('[data-studio-toggle]').click();
          assert.equal(await page.locator('#studio-controls').isVisible(), true);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          const controlsBounds = await page.locator('#studio-controls').boundingBox();
          assert.ok(controlsBounds.x >= 0 && controlsBounds.x + controlsBounds.width <= width);
          const studioBounds = await page.locator('[data-pattern-studio]').boundingBox();
          assert.ok(controlsBounds.y + controlsBounds.height <= studioBounds.y + studioBounds.height);
          if (width === 390) await screenshot(`studio-mobile-${theme}`);
          await page.keyboard.press('Escape');
        }
      }
    });

    await check('motion preference persists and respects live system changes', async () => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.locator('[data-motion-toggle]').click();
      assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
      await page.locator('[data-motion-toggle]').click();
      assert.equal(await page.locator('html').getAttribute('data-motion'), 'on');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => document.documentElement.dataset.motion === 'off');
      assert.equal(await page.locator('[data-motion-toggle]').isDisabled(), true);
      assert.equal(await page.locator('.workbench-panel:visible').evaluate(el => getComputedStyle(el).animationName), 'none');
    });

    await check('mobile menu and theme switch', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('.menu-icon').click();
      assert.equal(await page.locator('main').evaluate(el => el.inert), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('main').evaluate(el => el.inert), false);
      assert.equal(await page.locator('.menu-icon').evaluate(el => el === document.activeElement), true);
      await page.locator('#tab-app').click();
      await page.evaluate(() => window.scrollTo(0, 0));
      await screenshot('mobile-light-home');
      await page.locator('[data-theme-toggle]').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      await screenshot('mobile-dark-home');
      await page.locator('.workbench').scrollIntoViewIfNeeded();
      await screenshot('mobile-workbench');
      await page.locator('[data-demo-filter="travel"]').click();
      assert.equal(await page.locator('[data-demo-product]:visible').count(), 1);
      await page.locator('#panel-app [data-project-modal]').click();
      assert.equal(await page.locator('#project-modal').isVisible(), true);
      await page.keyboard.press('Escape');
    });

    await check('touch input operates each demo', async () => {
      const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      const touchPage = await touchContext.newPage();
      await touchPage.goto(base);
      await touchPage.emulateMedia({ reducedMotion: 'no-preference' });
      await touchPage.waitForFunction(() => document.querySelector('[data-pattern-studio]').dataset.reactive === 'true');
      await touchPage.locator('[data-studio-art]').tap();
      await touchPage.waitForFunction(() => document.querySelector('[data-pattern-studio]').dataset.interacting === 'true', null, { timeout: 5000 });
      assert.match(await touchPage.locator('[data-studio-readout]').textContent(), /^Tap the terrain/);
      await touchPage.locator('[data-studio-toggle]').tap();
      await touchPage.locator('[data-studio-pattern="orbits"]').tap();
      assert.equal(await touchPage.locator('[data-pattern-studio]').getAttribute('data-pattern'), 'orbits');
      await touchPage.locator('[data-studio-palette="sunset"]').tap();
      assert.equal(await touchPage.locator('[data-studio-palette="sunset"]').getAttribute('aria-pressed'), 'true');
      await touchPage.locator('[data-studio-close]').tap();
      await touchPage.locator('[data-demo-filter="desk"]').tap();
      assert.equal(await touchPage.locator('[data-demo-product]:visible').count(), 2);
      await touchPage.locator('#tab-gis').tap();
      await touchPage.locator('[data-demo-site="south"]').tap();
      assert.equal(await touchPage.locator('[data-site-name]').textContent(), 'South site');
      await touchPage.locator('#tab-ai').tap();
      await touchPage.locator('[data-demo-step="verify"]').tap();
      assert.equal(await touchPage.locator('[data-step-title]').textContent(), 'Evidence before delivery.');
      await touchContext.close();
    });

    await check('200% equivalent layout, storage fallback, and clean runtime', async () => {
      // A 1440px desktop viewport at 200% provides a 720 CSS-pixel layout viewport.
      await page.setViewportSize({ width: 720, height: 450 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const restricted = await context.newPage();
      await restricted.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Unavailable', 'SecurityError'); } });
      });
      await restricted.goto(base);
      await restricted.locator('#tab-gis').click();
      await restricted.locator('[data-demo-site="south"]').click();
      assert.equal(await restricted.locator('[data-site-name]').textContent(), 'South site');
      await restricted.close();
      assert.deepEqual(errors, []);
    });
    console.log('All portfolio smoke checks passed.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
