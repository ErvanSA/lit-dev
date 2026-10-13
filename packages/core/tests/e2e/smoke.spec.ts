import { expect, test } from '@playwright/test';

test('wec-button merender slot, meneruskan klik, dan menahan klik saat disabled', async ({
  page,
}) => {
  await page.goto('/tests/e2e/fixtures/smoke.html');

  const primary = page.locator('#primary');
  await expect(primary).toBeVisible();
  await expect(primary).toHaveText('Klik saya');

  const disabled = page.locator('#disabled');
  await expect(disabled).toHaveAttribute('disabled', '');

  await page.evaluate(() => {
    (window as any).__clicks = 0;
    document.addEventListener('click', (event) => {
      // Klik mendarat di slot/teks di dalam shadow DOM — cek apakah path
      // melewati <button> internal (event composed, ter-reatarget).
      const passesInnerButton = event
        .composedPath()
        .some((node) => (node as HTMLElement).tagName === 'BUTTON');
      if (passesInnerButton) {
        (window as any).__clicks += 1;
      }
    });
  });

  // Klik pada host menembus ke <button> internal (event composed, di-reatarget).
  await primary.click();
  await expect.poll(() => page.evaluate(() => (window as any).__clicks)).toBe(1);

  // Saat disabled, <button> internal pointer-events: none → klik tidak sampai.
  await disabled.click({ force: true });
  await expect.poll(() => page.evaluate(() => (window as any).__clicks)).toBe(1);
});
