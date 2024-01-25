import { expect } from '@playwright/test';
import { test } from './fixtures';
import { isMac } from './utils';

const listTypes = ['bullet', 'checked'];

test.describe('list', () => {
  test.beforeEach(async ({ editorPage }) => {
    await editorPage.open();
  });

  for (const list of listTypes) {
    test.describe(`navigation with shortcuts ${list}`, () => {
      test('jump to line start', async ({ page, editorPage }) => {
        await editorPage.setContents([
          { insert: 'item 1' },
          { insert: '\n', attributes: { list } },
        ]);

        await editorPage.moveCursorAfterText('item 1');
        await page.keyboard.press(isMac ? `Meta+ArrowLeft` : 'Home');
        expect(await editorPage.getSelection()).toEqual({
          index: 0,
          length: 0,
        });

        await page.keyboard.type('start ');
        expect(await editorPage.getContents()).toEqual([
          { insert: 'start item 1' },
          { insert: '\n', attributes: { list } },
        ]);
      });

      test.describe('navigation with left/right arrow keys', () => {
        test('move to previous/next line', async ({ page, editorPage }) => {
          const firstLine = 'first line';
          await editorPage.setContents([
            { insert: firstLine },
            { insert: '\n', attributes: { list } },
            { insert: 'second line' },
            { insert: '\n', attributes: { list } },
          ]);

          await editorPage.setSelection(firstLine.length + 2, 0);
          await page.keyboard.press('ArrowLeft');
          await page.keyboard.press('ArrowLeft');
          expect(await editorPage.getSelection()).toEqual({
            index: firstLine.length,
            length: 0,
          });
          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('ArrowRight');
          expect(await editorPage.getSelection()).toEqual({
            index: firstLine.length + 2,
            length: 0,
          });
        });

        test('RTL support', async ({ page, editorPage }) => {
          const firstLine = 'اللغة العربية';
          await editorPage.setContents([
            { insert: firstLine },
            { insert: '\n', attributes: { list, direction: 'rtl' } },
            { insert: 'توحيد اللهجات العربية' },
            { insert: '\n', attributes: { list, direction: 'rtl' } },
          ]);

          await editorPage.setSelection(firstLine.length + 2, 0);
          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('ArrowRight');
          expect(await editorPage.getSelection()).toEqual({
            index: firstLine.length,
            length: 0,
          });
          await page.keyboard.press('ArrowLeft');
          await page.keyboard.press('ArrowLeft');
          expect(await editorPage.getSelection()).toEqual({
            index: firstLine.length + 2,
            length: 0,
          });
        });

        test('extend selection to previous/next line', async ({
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
      test('typing at beginning with IME', async ({
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

      test('typing in an empty editor with IME and press Backspace', async ({
        page,
        editorPage,
        composition,
      }) => {
        await editorPage.setContents([{ insert: '\n' }]);

        await editorPage.setSelection(9, 0);
        await editorPage.typeWordWithIME(composition, '我');
        await page.keyboard.press('Backspace');
        expect(await editorPage.getContents()).toEqual([{ insert: '\n' }]);
      });
    });
  }

  test('checklist is checkable', async ({ editorPage, page }) => {
    await editorPage.setContents([
      { insert: 'item 1' },
      { insert: '\n', attributes: { list: 'unchecked' } },
    ]);

    await editorPage.setSelection(7, 0);
    const rect = await editorPage.root.locator('li').evaluate((element) => {
      return element.getBoundingClientRect();
    });
    await page.mouse.click(rect.left + 5, rect.top + 5);
    expect(await editorPage.getContents()).toEqual([
      { insert: 'item 1' },
      { insert: '\n', attributes: { list: 'checked' } },
    ]);
    await page.mouse.click(rect.left + 5, rect.top + 5);
    expect(await editorPage.getContents()).toEqual([
      { insert: 'item 1' },
      { insert: '\n', attributes: { list: 'unchecked' } },
    ]);
  });
});
