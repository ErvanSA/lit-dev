import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/all.html');
  await page.waitForFunction(() => customElements.get('wec-checkbox') !== undefined);
});

test('klik toggle checked dan memancarkan wec-change', async ({ page }) => {
  await page.evaluate(() => {
    (window as any).__changes = [];
    document.addEventListener('wec-change', (e) => {
      (window as any).__changes.push((e as CustomEvent).detail);
    });
  });

  await page.locator('#check-basic').click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__changes.at(-1)))
    .toMatchObject({ checked: true, value: 'on' });
});

test('keyboard space toggle checkbox', async ({ page }) => {
  const host = page.locator('#check-basic');
  await host.click();
  const afterClick = await page.evaluate(
    () => document.querySelector('#check-basic')!.shadowRoot!.querySelector('input')!.checked,
  );
  expect(afterClick).toBe(true);

  await page.keyboard.press('Space');
  const afterSpace = await page.evaluate(
    () => document.querySelector('#check-basic')!.shadowRoot!.querySelector('input')!.checked,
  );
  expect(afterSpace).toBe(false);
});

test('disabled tidak bisa toggle', async ({ page }) => {
  await page.locator('#check-disabled').click({ force: true });
  const checked = await page.evaluate(
    () => document.querySelector('#check-disabled')!.shadowRoot!.querySelector('input')!.checked,
  );
  expect(checked).toBe(false);
});
