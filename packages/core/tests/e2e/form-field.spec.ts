import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/all.html');
  await page.waitForFunction(() => customElements.get('wec-form-field') !== undefined);
});

test('label terhubung ke kontrol via aria-labelledby', async ({ page }) => {
  const wired = await page.evaluate(() => {
    const field = document.querySelector('#field-email')!;
    const labelId = field.shadowRoot!.querySelector('label')!.id;
    const input = document.querySelector('#field-email-input')! as unknown as {
      describedBy: string;
      labelledBy: string;
    };
    return { labelId, describedBy: input.describedBy, labelledBy: input.labelledBy };
  });
  expect(wired.labelledBy).toBe(wired.labelId);
  expect(wired.describedBy).not.toBe('');
});

test('klik label memfokuskan kontrol', async ({ page }) => {
  await page.evaluate(() =>
    document.querySelector('#field-email')!.shadowRoot!.querySelector('label')!.click(),
  );
  const focused = await page.evaluate(() => {
    const input = document.querySelector('#field-email-input')! as HTMLElement & {
      shadowRoot: ShadowRoot;
    };
    return input.shadowRoot.activeElement?.tagName;
  });
  expect(focused).toBe('INPUT');
});

test('error tampil dengan role=alert dan menggantikan hint', async ({ page }) => {
  const error = await page.evaluate(() => {
    const field = document.querySelector('#field-error')!;
    const el = field.shadowRoot!.querySelector('.error')!;
    return { role: el.getAttribute('role'), text: el.textContent!.trim() };
  });
  expect(error).toMatchObject({ role: 'alert', text: 'Nama wajib diisi' });
  await expect(page.locator('#field-email .hint')).toBeVisible();
});
