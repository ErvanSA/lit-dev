import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/all.html');
  await page.waitForFunction(() => customElements.get('wec-badge') !== undefined);
});

test('badge merender slot dan merespons tema gelap', async ({ page }) => {
  const badge = page.locator('#badge-brand');
  await expect(badge).toHaveText('Baru');

  const light = await page.evaluate(
    () =>
      getComputedStyle(document.querySelector('#badge-brand')!.shadowRoot!.querySelector('span')!)
        .backgroundColor,
  );
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
  });
  const dark = await page.evaluate(
    () =>
      getComputedStyle(document.querySelector('#badge-brand')!.shadowRoot!.querySelector('span')!)
        .backgroundColor,
  );
  expect(light).not.toBe(dark);
});

test('icon merender markup svg dari registry', async ({ page }) => {
  await page.waitForFunction(() => customElements.get('wec-icon') !== undefined);
  const hasSvg = await page.evaluate(() => {
    const span = document.querySelector('#icon-check')!.shadowRoot!.querySelector('span')!;
    return span.querySelector('svg') !== null && span.getAttribute('aria-hidden') === 'true';
  });
  expect(hasSvg).toBe(true);
});

test('card merender slot header, body, dan footer', async ({ page }) => {
  await page.waitForFunction(() => customElements.get('wec-card') !== undefined);
  await expect(page.locator('#card-basic [slot="header"]')).toHaveText('Judul');
  await expect(page.locator('#card-basic p')).toHaveText('Isi kartu');
  await expect(page.locator('#card-basic [slot="footer"]')).toHaveText('Kaki kartu');
});
