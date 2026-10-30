import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'node:fs';

const baseURL = process.env.SITE_URL || 'http://localhost:3000';
const executablePath = process.env.BROWSER_EXECUTABLE_PATH || ['/opt/google/chrome/chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  mkdirSync('public/documents', { recursive: true });
  for (const { locale, path } of [
    { locale: 'en', path: 'public/documents/Arturo-Jimenez-CV.pdf' },
    { locale: 'es', path: 'public/documents/Arturo-Jimenez-CV-ES.pdf' },
  ]) {
    const response = await page.goto(`${baseURL}/${locale}/cv`, { waitUntil: 'networkidle' });
    if (!response?.ok()) throw new Error(`${locale.toUpperCase()} CV page returned ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
    console.log(`${locale.toUpperCase()} CV generated: ${path}`);
  }
} finally {
  await browser.close();
}
