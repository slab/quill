import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from './fixtures/index.js';

test.describe('shadow DOM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const host = document.createElement('div');
      host.id = 'shadow-host';
      document.body.prepend(host);
      const container = document.createElement('div');
      host.attachShadow({ mode: 'open' }).appendChild(container);
      // @ts-expect-error
      window.shadowQuill = new Quill(container);
    });
  });

  const getContents = (page: Page) =>
    page.evaluate(() => {
      // @ts-expect-error
      return window.shadowQuill.getContents().ops;
    });

  const getSelection = (page: Page) =>
    page.evaluate(() => {
      // @ts-expect-error
      return window.shadowQuill.getSelection();
    });

  test('typing on a new line keeps the character order', async ({ page }) => {
    const editor = page.locator('#shadow-host .ql-editor');
    await editor.click();
    await editor.press('Enter');
    await editor.pressSequentially('abc');

    expect(await getContents(page)).toEqual([{ insert: '\nabc\n' }]);
  });

  test('arrow keys update the selection', async ({ page }) => {
    const editor = page.locator('#shadow-host .ql-editor');
    await editor.click();
    await editor.pressSequentially('hello');
    await editor.press('ArrowLeft');
    await editor.press('Shift+ArrowLeft');

    await expect
      .poll(() => getSelection(page))
      .toEqual({ index: 3, length: 1 });
  });

  test('formats the selection with a keyboard shortcut', async ({ page }) => {
    const editor = page.locator('#shadow-host .ql-editor');
    await editor.click();
    await editor.pressSequentially('hello');
    await editor.press('Shift+Home');
    await editor.press('ControlOrMeta+b');
    await editor.pressSequentially('!');

    expect(await getContents(page)).toEqual([
      { insert: '!', attributes: { bold: true } },
      { insert: '\n' },
    ]);
  });
});
