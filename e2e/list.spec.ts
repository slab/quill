import { expect } from '@playwright/test';
import { test } from './fixtures';
import { isMac } from './utils';

test.describe('list', () => {
  test.beforeEach(async ({ editorPage }) => {
    await editorPage.open();
  });

  test('navigating with shortcuts', async ({ page, editorPage }) => {
    await editorPage.setContents([
      { insert: 'item 1' },
      { insert: '\n', attributes: { list: 'bullet' } },
    ]);

    await editorPage.moveCursorAfterText('item 1');
    await page.keyboard.press(isMac ? `Meta+ArrowLeft` : 'Home');
    expect(await editorPage.getSelection()).toEqual({ index: 0, length: 0 });

    await page.keyboard.press(isMac ? `Meta+ArrowRight` : 'End');
    expect(await editorPage.getSelection()).toEqual({ index: 6, length: 0 });
  });
});
