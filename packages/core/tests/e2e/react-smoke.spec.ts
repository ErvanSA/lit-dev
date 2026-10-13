import { expect, test } from '@playwright/test';

test('wrapper React bekerja di browser asli (props + render)', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/react-smoke.html');
  await page.waitForFunction(() => customElements.get('wec-button') !== undefined);

  const state = await page.evaluate(() => {
    const el = document.querySelector('#manual-btn');
    return {
      found: el !== null,
      attr: el?.getAttribute('variant'),
      text: el?.textContent,
    };
  });

  expect(state.found).toBe(true);
  expect(state.attr).toBe('danger');
  expect(state.text).toBe('Klik');
});
