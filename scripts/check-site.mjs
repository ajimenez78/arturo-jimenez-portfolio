import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const origin = process.env.SITE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE_PATH || ['/opt/google/chrome/chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync),
  headless: true,
  args: ['--no-sandbox'],
});
const defects = [];
let checks = 0;
const check = async (label, action) => {
  try { await action(); checks++; console.log(`PASS ${label}`); }
  catch (error) { defects.push({ label, error: error.message }); console.error(`FAIL ${label}: ${error.message}`); }
};
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const runtimeErrors = [];
page.on('pageerror', error => runtimeErrors.push(error.message));

for (const lang of ['en', 'es']) {
  for (const suffix of ['', '/cv']) {
    const route = `/${lang}${suffix}`;
    await check(`${route}: renders with correct document language`, async () => {
      const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('h1').count(), 1);
      await page.locator('h1').waitFor();
    });
    await check(`${route}: WCAG 2 AA / 2.1 AA`, async () => {
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), []);
    });
    for (const width of [320, 390, 768, 1440]) {
      await check(`${route}: ${width}px has no horizontal overflow`, async () => {
        await page.setViewportSize({ width, height: 1000 });
        await page.waitForTimeout(150);
        const bounds = await page.evaluate(() => ({ viewport: innerWidth, body: document.body.scrollWidth, document: document.documentElement.scrollWidth }));
        assert.ok(bounds.body <= bounds.viewport + 1 && bounds.document <= bounds.viewport + 1, JSON.stringify(bounds));
      });
      if (width === 390) await check(`${route}: mobile WCAG 2 AA / 2.1 AA`, async () => {
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        assert.equal(results.violations.length, 0, JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))));
      });
    }
  }
}

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${origin}/en`, { waitUntil: 'networkidle' });
for (const anchor of ['about', 'work', 'journey', 'beyond']) {
  await check(`Desktop navigation: #${anchor}`, async () => {
    await page.locator(`.main-nav a[href="/en#${anchor}"]`).click();
    await page.waitForTimeout(700);
    assert.equal(new URL(page.url()).hash, `#${anchor}`);
    const top = await page.locator(`#${anchor}`).evaluate(el => el.getBoundingClientRect().top);
    assert.ok(top >= 0 && top < 150, `anchor top=${top}`);
  });
}
await check('Career timeline expands and collapses', async () => {
  const role = page.locator('.career-role').nth(1);
  assert.equal(await role.getAttribute('open'), null);
  await role.locator('summary').click();
  assert.notEqual(await role.getAttribute('open'), null);
  await role.locator('summary').click();
  assert.equal(await role.getAttribute('open'), null);
});
await check('Language switch preserves homepage hash', async () => {
  await page.goto(`${origin}/en#journey`, { waitUntil: 'networkidle' });
  await page.locator('.language-switch a[lang="es"]').click();
  await page.waitForURL('**/es#journey');
  assert.equal(new URL(page.url()).pathname, '/es');
  assert.equal(new URL(page.url()).hash, '#journey');
});
await check('Language switch preserves CV route', async () => {
  await page.goto(`${origin}/en/cv`, { waitUntil: 'networkidle' });
  await page.locator('.language-switch a[lang="es"]').click();
  await page.waitForURL('**/es/cv');
  assert.equal(new URL(page.url()).pathname, '/es/cv');
});
await check('Virtual Twin opens with an accessible English interface', async () => {
  await page.goto(`${origin}/en`, { waitUntil: 'networkidle' });
  const trigger = page.locator('.twin-trigger');
  await trigger.click();
  const panel = page.locator('#digital-twin-panel');
  await panel.waitFor();
  await page.waitForTimeout(300);
  assert.equal(await panel.getAttribute('role'), 'dialog');
  assert.match(await panel.locator('h2').innerText(), /Virtual Twin/i);
  assert.equal(await panel.locator('.twin-suggestions button').count(), 3);
  assert.match(await panel.locator('.twin-disclosure').innerText(), /GPT-6 Luna/);
  assert.match(await panel.locator('textarea').getAttribute('placeholder'), /career/i);
  const results = await new AxeBuilder({ page }).include('#digital-twin-panel').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
  await page.keyboard.press('Escape');
  assert.ok(await panel.isHidden());
  assert.ok(await trigger.evaluate(el => el === document.activeElement));
});
await check('Virtual Twin interface is localized as Gemelo Virtual in Spanish', async () => {
  await page.goto(`${origin}/es`, { waitUntil: 'networkidle' });
  await page.locator('.twin-trigger').click();
  const panel = page.locator('#digital-twin-panel');
  assert.match(await panel.locator('textarea').getAttribute('placeholder'), /carrera/i);
  assert.match(await panel.locator('.twin-disclosure').innerText(), /generadas por IA/i);
  assert.match(await panel.locator('h2').innerText(), /Gemelo Virtual/i);
  await panel.getByRole('button', { name: 'Cerrar Gemelo Virtual' }).click();
  assert.ok(await panel.isHidden());
});
await page.setViewportSize({ width: 390, height: 844 });
for (const lang of ['en', 'es']) {
  await page.goto(`${origin}/${lang}`, { waitUntil: 'networkidle' });
  await check(`${lang}: mobile menu opens, Escape closes and restores focus`, async () => {
    const button = page.locator('.menu-toggle');
    await button.click();
    assert.equal(await button.getAttribute('aria-expanded'), 'true');
    assert.ok(await page.locator('.main-nav').isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await button.getAttribute('aria-expanded'), 'false');
    assert.ok(await button.evaluate(el => el === document.activeElement));
  });
  await check(`${lang}: mobile menu closes after selecting anchor`, async () => {
    await page.locator('.menu-toggle').click();
    await page.locator(`.main-nav a[href="/${lang}#work"]`).click();
    await page.waitForURL(`**/${lang}#work`);
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(new URL(page.url()).hash, '#work');
  });
}
await check('Personal photography loads after scrolling', async () => {
  await page.goto(`${origin}/en`, { waitUntil: 'networkidle' });
  await page.locator('#beyond').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('#beyond img')].every(image => image.complete && image.naturalWidth > 0));
  assert.equal(await page.locator('#beyond img').count(), 2);
});
await check('External portfolio, profile, and email links are valid', async () => {
  await page.goto(`${origin}/en`, { waitUntil: 'networkidle' });
  assert.ok(!(await page.content()).includes('arturo-jimenez.es'));
  const external = await page.locator('a[target="_blank"]').evaluateAll(links => links.map(a => ({ href: a.href, rel: a.rel })));
  assert.ok(external.length >= 10);
  assert.ok(external.every(a => a.href.startsWith('https://') && a.rel.includes('noopener')));
  const projects = await page.locator('.project-card').evaluateAll(links => links.map(a => a.href));
  assert.equal(projects.length, 3);
  for (const href of projects) assert.ok(href.startsWith('https://github.com/ajimenez78/'));
  const emails = await page.locator('a[href^="mailto:"]').evaluateAll(links => links.map(a => a.href));
  assert.ok(emails.length >= 2);
  assert.ok(emails.every(href => href === 'mailto:ajimenez78@gmail.com'));
});
for (const filename of ['Arturo-Jimenez-CV.pdf', 'Arturo-Jimenez-CV-ES.pdf']) {
  await check(`Download PDF: ${filename}`, async () => {
    const response = await context.request.get(`${origin}/documents/${filename}`);
    assert.equal(response.status(), 200);
    assert.ok(response.headers()['content-type'].includes('application/pdf'));
    const body = await response.body();
    assert.equal(body.subarray(0, 4).toString(), '%PDF');
    assert.ok(body.length > 10000, 'PDF must contain a complete CV');
  });
}
await check('No browser runtime errors', async () => assert.deepEqual(runtimeErrors, []));
await browser.close();
console.log(`\n${checks} checks passed; ${defects.length} defects.`);
if (defects.length) {
  console.error(JSON.stringify(defects, null, 2));
  process.exitCode = 1;
}
