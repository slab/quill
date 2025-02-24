import { expect } from '@playwright/test';
import { test } from './fixtures/index.js';

test.describe('CJK', () => {
  test.beforeEach(async ({ editorPage }) => {
    await editorPage.open();
  });

  test.describe(`typing in Korean`, () => {
    test('typing in empty line', async ({ editorPage, composition }) => {
      await editorPage.setContents([{ insert: '\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '안녕하세요');
      expect(await editorPage.getContents()).toEqual([
        { insert: '안녕하세요\n' },
      ]);
    });

    test('typing at beginning of existing line', async ({
      editorPage,
      composition,
    }) => {
      await editorPage.setContents([{ insert: 'test\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '안녕하세요');
      expect(await editorPage.getContents()).toEqual([
        { insert: '안녕하세요test\n' },
      ]);
    });

    test('Backspacing text', async ({ page, editorPage, composition }) => {
      await editorPage.setContents([{ insert: '\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '안');
      await page.keyboard.press('Backspace');
      expect(await editorPage.getContents()).toEqual([{ insert: '\n' }]);
    });

    test('Backspacing text with a suffix', async ({
      page,
      editorPage,
      composition,
    }) => {
      await editorPage.setContents([{ insert: 'test\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '안');
      await page.keyboard.press('Backspace');
      expect(await editorPage.getContents()).toEqual([{ insert: 'test\n' }]);
    });
  });

  test.describe(`typing in Japanese`, () => {
    test('typing in empty line', async ({ editorPage, composition }) => {
      await editorPage.setContents([{ insert: '\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, 'こんにちは');
      expect(await editorPage.getContents()).toEqual([
        { insert: 'こんにちは\n' },
      ]);
    });

    test('typing at beginning of existing line', async ({
      editorPage,
      composition,
    }) => {
      await editorPage.setContents([{ insert: 'test\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, 'こんにちは');
      expect(await editorPage.getContents()).toEqual([
        { insert: 'こんにちはtest\n' },
      ]);
    });

    test('Backspacing text', async ({ page, editorPage, composition }) => {
      await editorPage.setContents([{ insert: '\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, 'こ');
      await page.keyboard.press('Backspace');
      expect(await editorPage.getContents()).toEqual([{ insert: '\n' }]);
    });

    test('Backspacing text with a suffix', async ({
      page,
      editorPage,
      composition,
    }) => {
      await editorPage.setContents([{ insert: 'test\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, 'こ');
      await page.keyboard.press('Backspace');
      expect(await editorPage.getContents()).toEqual([{ insert: 'test\n' }]);
    });
  });

  test.describe(`typing in Chinese`, () => {
    test('typing in empty line', async ({ editorPage, composition }) => {
      await editorPage.setContents([{ insert: '\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '你好');
      expect(await editorPage.getContents()).toEqual([{ insert: '你好\n' }]);
    });

    test('typing at beginning of existing line', async ({
      editorPage,
      composition,
    }) => {
      await editorPage.setContents([{ insert: 'test\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '你好');
      expect(await editorPage.getContents()).toEqual([
        { insert: '你好test\n' },
      ]);
    });

    test('Backspacing text', async ({ page, editorPage, composition }) => {
      await editorPage.setContents([{ insert: '\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '你');
      await page.keyboard.press('Backspace');
      expect(await editorPage.getContents()).toEqual([{ insert: '\n' }]);
    });

    test('Backspacing text with a suffix', async ({
      page,
      editorPage,
      composition,
    }) => {
      await editorPage.setContents([{ insert: 'test\n' }]);

      await editorPage.setSelection(0, 0);
      await editorPage.typeWordWithIME(composition, '你');
      await page.keyboard.press('Backspace');
      expect(await editorPage.getContents()).toEqual([{ insert: 'test\n' }]);
    });
  });
});
