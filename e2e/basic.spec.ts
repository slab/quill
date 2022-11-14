import { test, expect } from '@playwright/test';

test('homepage has title and links to intro page', async ({ page }) => {
  await page.goto('http://localhost:9000/standalone/full/');

  await page.waitForSelector('.ql-editor', { timeout: 10000 });

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Full Editor - Quill Rich Text Editor');
});
