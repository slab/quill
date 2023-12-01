import { expect } from '@playwright/test';
import { test } from './fixtures';

test.describe('replace selection', () => {
  test.beforeEach(async ({ editorPage }) => {
    await editorPage.open();
  });

  test.describe('replace a colored text', () => {
    test('after a normal text', async ({ page, editorPage }) => {
      await editorPage.setContents([
        { insert: '1' },
        { insert: '2', attributes: { color: 'red' } },
        { insert: '3\n' },
      ]);
      await editorPage.selectText('2', '3');
      await page.keyboard.type('a');
      expect(await editorPage.root.innerHTML()).toEqual(
        '<p>1<span style="color: red;">a</span></p>',
      );
      expect(await editorPage.getContents()).toEqual([
        { insert: '1' },
        { insert: 'a', attributes: { color: 'red' } },
        { insert: '\n' },
      ]);
    });

    test('with Enter key', async ({ page, editorPage }) => {
      await editorPage.setContents([
        { insert: '1' },
        { insert: '2', attributes: { color: 'red' } },
        { insert: '3\n' },
      ]);
      await editorPage.selectText('2', '3');
      await page.keyboard.press('Enter');
      expect(await editorPage.root.innerHTML()).toEqual('<p>1</p><p><br></p>');
      expect(await editorPage.getContents()).toEqual([{ insert: '1\n\n' }]);
    });

    test('with IME', async ({ editorPage, composition }) => {
      await editorPage.setContents([
        { insert: '1' },
        { insert: '2', attributes: { color: 'red' } },
        { insert: '3\n' },
      ]);
      await editorPage.selectText('2', '3');
      await editorPage.typeWordWithIME(composition, '我');
      expect(await editorPage.root.innerHTML()).toEqual('<p>1我</p>');
      expect(await editorPage.getContents()).toEqual([{ insert: '1我\n' }]);
    });

    test('after a bold text', async ({ page, editorPage }) => {
      await editorPage.setContents([
        { insert: '1', attributes: { bold: true } },
        { insert: '2', attributes: { color: 'red' } },
        { insert: '3\n' },
      ]);
      await editorPage.selectText('2', '3');
      await page.keyboard.type('a');
      expect(await editorPage.root.innerHTML()).toEqual(
        '<p><strong>1</strong><span style="color: red;">a</span></p>',
      );
      expect(await editorPage.getContents()).toEqual([
        { insert: '1', attributes: { bold: true } },
        { insert: 'a', attributes: { color: 'red' } },
        { insert: '\n' },
      ]);
    });

    test('across lines', async ({ page, editorPage }) => {
      await editorPage.setContents([
        { insert: 'header', attributes: { color: 'red' } },
        { insert: '\n', attributes: { header: 1 } },
        { insert: 'text\n' },
      ]);
      await editorPage.selectText('header', 'text');
      await page.keyboard.type('a');
      expect(await editorPage.root.innerHTML()).toEqual(
        '<h1><span style="color: red;">a</span></h1>',
      );
      expect(await editorPage.getContents()).toEqual([
        { insert: 'a', attributes: { color: 'red' } },
        { insert: '\n', attributes: { header: 1 } },
      ]);
    });
  });
});
