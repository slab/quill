import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from './fixtures';
import { SHORTKEY } from './utils';

const undo = (page: Page) => page.keyboard.press(`${SHORTKEY}+z`);
const redo = (page: Page) => page.keyboard.press(`${SHORTKEY}+Shift+z`);

const setUserOnly = (page: Page, value: boolean) =>
  page.evaluate(
    (value) => {
      // @ts-expect-error
      window.quill.history.options.userOnly = value;
    },
    [value],
  );

test.describe('history', () => {
  test.beforeEach(async ({ editorPage }) => {
    await editorPage.open();
    await editorPage.setContents([{ insert: '1234\n' }]);
    await editorPage.cutoffHistory();
  });

  test('skip changes reverted by api', async ({ page, editorPage }) => {
    await setUserOnly(page, true);
    await editorPage.moveCursorAfterText('12');
    await page.keyboard.type('a');
    await editorPage.cutoffHistory();
    await editorPage.selectText('34');
    await page.keyboard.press(`${SHORTKEY}+b`);
    await editorPage.cutoffHistory();
    await editorPage.updateContents([
      { retain: 3 },
      { retain: 2, attributes: { bold: null } },
    ]);
    await undo(page);
    expect(await editorPage.getContents()).toEqual([{ insert: '1234\n' }]);
  });

  test.describe('selection', () => {
    test('typing', async ({ page, editorPage }) => {
      await editorPage.moveCursorAfterText('2');
      await page.keyboard.type('a');
      await editorPage.cutoffHistory();
      await page.keyboard.type('b');
      await editorPage.cutoffHistory();
      await page.keyboard.press('Backspace');
      await editorPage.cutoffHistory();
      await page.keyboard.type('c');
      await editorPage.cutoffHistory();
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 3, length: 0 });
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 4, length: 0 });
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 3, length: 0 });
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 2, length: 0 });
    });

    test('delete forward', async ({ page, editorPage }) => {
      await editorPage.moveCursorAfterText('3');
      await page.keyboard.press('Backspace');
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 3, length: 0 });
      await redo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 2, length: 0 });
    });

    test('delete selection', async ({ page, editorPage }) => {
      await editorPage.selectText('23');
      await page.keyboard.press('Backspace');
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 1, length: 2 });
      await redo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 1, length: 0 });
    });

    test('format selection', async ({ page, editorPage }) => {
      await editorPage.selectText('23');
      await page.keyboard.press(`${SHORTKEY}+b`);
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 1, length: 2 });
      await redo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 1, length: 2 });
    });

    test('combine operations', async ({ page, editorPage }) => {
      await editorPage.selectText('23');
      await page.keyboard.type('a');
      await editorPage.cutoffHistory();
      await page.keyboard.type('bc');
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 2, length: 0 });
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 1, length: 2 });
      await redo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 2, length: 0 });
      await redo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 4, length: 0 });
    });

    test('api changes', async ({ page, editorPage }) => {
      await setUserOnly(page, true);
      await editorPage.selectText('23');
      await page.keyboard.press('Backspace');
      await editorPage.cutoffHistory();
      await page.keyboard.type('a');
      await editorPage.cutoffHistory();
      await editorPage.updateContents([{ insert: '0' }]);
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 2, length: 0 });
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 2, length: 2 });
    });

    test('programmatic user changes', async ({ page, editorPage }) => {
      await editorPage.moveCursorAfterText('12');
      await page.keyboard.type('a');
      await editorPage.cutoffHistory();
      await editorPage.updateContents([{ insert: '0' }], 'user');
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 3, length: 0 });
    });

    test('no user selection', async ({ page, editorPage }) => {
      await editorPage.updateContents([{ retain: 3 }, { insert: '0' }], 'user');
      await editorPage.root.click();
      await undo(page);
      expect(await editorPage.getSelection()).toEqual({ index: 3, length: 0 });
    });
  });
});
