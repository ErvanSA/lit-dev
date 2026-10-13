import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/all.html');
  await page.waitForFunction(() => customElements.get('wec-button') !== undefined);
});

test('merender slot dan meneruskan klik', async ({ page }) => {
  const host = page.locator('#btn-primary');
  await expect(host).toHaveText('Klik saya');

  await page.evaluate(() => {
    (window as any).__clicks = 0;
    document.addEventListener('click', (event) => {
      const passesInnerButton = event
        .composedPath()
        .some((node) => (node as HTMLElement).tagName === 'BUTTON');
      if (passesInnerButton) (window as any).__clicks += 1;
    });
  });

  await host.click();
  await expect.poll(() => page.evaluate(() => (window as any).__clicks)).toBe(1);
});

test('disabled menahan klik', async ({ page }) => {
  await page.evaluate(() => {
    (window as any).__clicks = 0;
    document.addEventListener('click', (event) => {
      const passesInnerButton = event
        .composedPath()
        .some((node) => (node as HTMLElement).tagName === 'BUTTON');
      if (passesInnerButton) (window as any).__clicks += 1;
    });
  });

  await page.locator('#btn-disabled').click({ force: true });
  await expect.poll(() => page.evaluate(() => (window as any).__clicks)).toBe(0);
});

test('loading memunculkan spinner + aria-busy dan menahan klik', async ({ page }) => {
  const inner = await page.evaluate(() => {
    const btn = document.querySelector('#btn-loading')!.shadowRoot!.querySelector('button')!;
    let clicks = 0;
    btn.addEventListener('click', () => (clicks += 1));
    btn.click();
    return { ariaBusy: btn.getAttribute('aria-busy'), disabled: btn.disabled, clicks };
  });
  expect(inner.ariaBusy).toBe('true');
  expect(inner.disabled).toBe(true);
  expect(inner.clicks).toBe(0);
  await expect(page.locator('#btn-loading .spinner')).toBeVisible();
});

test('fokus keyboard menghasilkan focus-visible ring', async ({ page }) => {
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const btn = document.querySelector('#btn-primary')!.shadowRoot!.querySelector('button')!;
    return getComputedStyle(btn).outlineStyle;
  });
  expect(outline).toBe('solid');
});
