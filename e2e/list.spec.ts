import { expect } from '@playwright/test';
import { test } from './fixtures';
import { isMac } from './utils';

const listTypes = ['bullet', 'checked'];

test.describe('list', () => {
  test.beforeEach(async ({ editorPage }) => {
    await editorPage.open();
  });

  for (const list of listTypes) {
    test(`jump to line start (${list})`, async ({ page, editorPage }) => {
      await editorPage.setContents([
        { insert: 'item 1' },
        { insert: '\n', attributes: { list } },
      ]);

      await editorPage.moveCursorAfterText('item 1');
      await page.keyboard.press(isMac ? `Meta+ArrowLeft` : 'Home');
      expect(await editorPage.getSelection()).toEqual({ index: 0, length: 0 });

      await page.keyboard.type('start ');
      expect(await editorPage.getContents()).toEqual([
        { insert: 'start item 1' },
        { insert: '\n', attributes: { list } },
      ]);
    });

    test.describe('navigation with left/right arrow keys', () => {
      test(`move to previous/next line (${list})`, async ({
        page,
        editorPage,
      }) => {
        await editorPage.setContents([
          { insert: 'first line' },
          { insert: '\n', attributes: { list } },
          { insert: 'second line' },
          { insert: '\n', attributes: { list } },
        ]);

        await editorPage.moveCursorTo('s_econd');
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
        expect(await editorPage.getSelection()).toEqual({
          index: 'first line'.length,
          length: 0,
        });
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        expect(await editorPage.getSelection()).toEqual({
          index: 'first line\ns'.length,
          length: 0,
        });
      });

      test(`extend selection to previous/next line (${list})`, async ({
        page,
        editorPage,
      }) => {
        await editorPage.setContents([
          { insert: 'first line' },
          { insert: '\n', attributes: { list } },
          { insert: 'second line' },
          { insert: '\n', attributes: { list } },
        ]);

        await editorPage.moveCursorTo('s_econd');
        await page.keyboard.press('Shift+ArrowLeft');
        await page.keyboard.press('Shift+ArrowLeft');
        await page.keyboard.type('a');
        expect(await editorPage.getContents()).toEqual([
          { insert: 'first lineaecond line' },
          { insert: '\n', attributes: { list } },
        ]);
      });
    });

    // https://github.com/quilljs/quill/issues/3837
    test(`typing at beginning with IME (${list})`, async ({
      editorPage,
      composition,
    }) => {
      await editorPage.setContents([
        { insert: 'item 1' },
        { insert: '\n', attributes: { list } },
        { insert: '' },
        { insert: '\n', attributes: { list } },
      ]);

      await editorPage.setSelection(7, 0);
      await editorPage.typeWordWithIME(composition, '我');
      expect(await editorPage.getContents()).toEqual([
        { insert: 'item 1' },
        { insert: '\n', attributes: { list } },
        { insert: '我' },
        { insert: '\n', attributes: { list } },
      ]);
    });
  }
});
