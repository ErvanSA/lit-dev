import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/all.html');
  await page.waitForFunction(() => customElements.get('wec-input') !== undefined);
});

test('mengetik memperbarui value dan memancarkan wec-input + wec-change', async ({ page }) => {
  await page.evaluate(() => {
    (window as any).__events = [];
    for (const name of ['wec-input', 'wec-change'] as const) {
      document.addEventListener(name, (e) => {
        (window as any).__events.push({
          type: name,
          value: (e as CustomEvent).detail.value,
        });
      });
    }
  });

  await page.locator('#input-basic').click();
  await page.keyboard.type('halo');
  await page.keyboard.press('Enter');

  const events = await page.evaluate(() => (window as any).__events);
  expect(events.filter((e: any) => e.type === 'wec-input')).toHaveLength(4);
  expect(events.at(-1)).toMatchObject({ type: 'wec-change', value: 'halo' });

  const value = await page.evaluate(
    () =>
      (
        document
          .querySelector('#input-basic')!
          .shadowRoot!.querySelector('input') as HTMLInputElement
      ).value,
  );
  expect(value).toBe('halo');
});

test('disabled menahan pengetikan', async ({ page }) => {
  await page.locator('#input-disabled').click({ force: true });
  await page.keyboard.type('x');
  const value = await page.evaluate(
    () =>
      (
        document
          .querySelector('#input-disabled')!
          .shadowRoot!.querySelector('input') as HTMLInputElement
      ).value,
  );
  expect(value).toBe('');
});

test('invalid menghasilkan aria-invalid di input internal', async ({ page }) => {
  const aria = await page.evaluate(() =>
    document
      .querySelector('#input-invalid')!
      .shadowRoot!.querySelector('input')!
      .getAttribute('aria-invalid'),
  );
  expect(aria).toBe('true');
});

test('accessible-name menjadi aria-label', async ({ page }) => {
  const label = await page.evaluate(() => {
    const input = document.querySelector('#input-invalid')!.shadowRoot!.querySelector('input')!;
    return input.getAttribute('aria-label');
  });
  expect(label).toBe('Input invalid');
});
