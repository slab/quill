import { expect } from '@playwright/test';
import { test } from './fixtures/index.js';

for (const modal of [false, true]) {
  test(`toolbar preserves a selected range in a ${modal ? 'modal' : 'non-modal'} dialog`, async ({
    page,
    editorPage,
  }) => {
    await editorPage.open();
    await page.evaluate((isModal) => {
      const dialog = document.createElement('dialog');
      dialog.appendChild(document.querySelector('#standalone-container')!);
      document.body.appendChild(dialog);
      if (isModal) dialog.showModal();
      else dialog.show();
    }, modal);
    await editorPage.root.fill('Hello world');
    await editorPage.selectText('Hello');

    const bold = page.locator('.ql-bold');
    for (const formatted of [true, false]) {
      await bold.hover();
      await page.mouse.down();
      // Hold the button as in a slow click, allowing selectionchange to run.
      await page.waitForTimeout(150);
      expect(
        await page.evaluate(() => document.getSelection()?.toString()),
      ).toBe('Hello');
      await page.mouse.up();

      await expect(editorPage.root).toHaveJSProperty(
        'innerHTML',
        formatted
          ? '<p><strong>Hello</strong> world</p>'
          : '<p>Hello world</p>',
      );
      expect(await editorPage.getSelection()).toEqual({ index: 0, length: 5 });
    }

    await bold.focus();
    await page.keyboard.press('Enter');
    await expect(editorPage.root).toHaveJSProperty(
      'innerHTML',
      '<p><strong>Hello</strong> world</p>',
    );
    await expect(editorPage.root).toBeFocused();
    expect(await editorPage.getSelection()).toEqual({ index: 0, length: 5 });
  });
}
