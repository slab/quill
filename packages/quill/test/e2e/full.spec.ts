import { expect } from '@playwright/test';
import { getSelectionInTextNode, SHORTKEY } from './utils/index.js';
import { CHAPTER, P1, P2, testWithMode } from './fixtures/index.js';

function epicTest(mode: 'regular' | 'iframe' = 'regular') {
  testWithMode(mode)(
    `compose an epic (${mode})`,
    async ({ page, editorPage }) => {
      await editorPage.open();
      await editorPage.root.pressSequentially('The Whale');
      expect(await editorPage.root.innerHTML()).toEqual('<p>The Whale</p>');

      await page.keyboard.press('Enter');
      expect(await editorPage.root.innerHTML()).toEqual(
        '<p>The Whale</p><p><br></p>',
      );

      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await page.keyboard.type(P1);
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await editorPage.root.pressSequentially(P2);
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p>The Whale</p>',
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );

      // More than enough to get to top
      await Promise.all(
        Array(40)
          .fill(0)
          .map(() => page.keyboard.press('ArrowUp')),
      );
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await editorPage.root.pressSequentially(CHAPTER);
      await page.keyboard.press('Enter');
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p>The Whale</p>',
          '<p><br></p>',
          `<p>${CHAPTER}</p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );

      // More than enough to get to top
      await Promise.all(
        Array(20)
          .fill(0)
          .map(() => page.keyboard.press('ArrowUp')),
      );
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p>Whale</p>',
          '<p><br></p>',
          `<p>${CHAPTER}</p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );

      await page.keyboard.press('Delete');
      await page.keyboard.press('Delete');
      await page.keyboard.press('Delete');
      await page.keyboard.press('Delete');
      await page.keyboard.press('Delete');
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p><br></p>',
          '<p><br></p>',
          `<p>${CHAPTER}</p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );

      await page.keyboard.press('Delete');
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p><br></p>',
          `<p>${CHAPTER}</p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );

      await editorPage.toolbar.locator('.ql-bold').click();
      await editorPage.toolbar.locator('.ql-italic').click();
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p><strong><em><span class="ql-cursor">\uFEFF</span></em></strong></p>',
          `<p>${CHAPTER}</p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );
      let bold = editorPage.toolbar.locator('.ql-bold');
      let italic = editorPage.toolbar.locator('.ql-italic');
      expect(bold).toHaveClass(/ql-active/);
      expect(italic).toHaveClass(/ql-active/);

      await editorPage.root.pressSequentially('Moby Dick');
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p><strong><em>Moby Dick</em></strong></p>',
          `<p>${CHAPTER}</p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );
      bold = editorPage.toolbar.locator('.ql-bold');
      italic = editorPage.toolbar.locator('.ql-italic');
      expect(bold).toHaveClass(/ql-active/);
      expect(italic).toHaveClass(/ql-active/);

      await page.keyboard.press('ArrowRight');
      await page.keyboard.down('Shift');
      await Promise.all(
        Array(CHAPTER.length)
          .fill(0)
          .map(() => page.keyboard.press('ArrowRight')),
      );
      await page.keyboard.up('Shift');
      bold = editorPage.toolbar.locator('.ql-bold');
      italic = editorPage.toolbar.locator('.ql-italic');
      expect(bold).not.toHaveClass(/ql-active/);
      expect(italic).not.toHaveClass(/ql-active/);

      await page.keyboard.down(SHORTKEY);
      await page.keyboard.press('b');
      await page.keyboard.up(SHORTKEY);
      bold = editorPage.toolbar.locator('.ql-bold');
      expect(bold).toHaveClass(/ql-active/);
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<p><strong><em>Moby Dick</em></strong></p>',
          `<p><strong>${CHAPTER}</strong></p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowUp');
      await editorPage.toolbar.locator('.ql-header[value="1"]').click();
      expect(await editorPage.root.innerHTML()).toEqual(
        [
          '<h1><strong><em>Moby Dick</em></strong></h1>',
          `<p><strong>${CHAPTER}</strong></p>`,
          '<p><br></p>',
          `<p>\t${P1}</p>`,
          '<p><br></p>',
          `<p>${P2}</p>`,
        ].join(''),
      );
      const header = editorPage.toolbar.locator('.ql-header[value="1"]');
      expect(header).toHaveClass(/ql-active/);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowUp');
      await editorPage.root.pressSequentially('AA');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.down(SHORTKEY);
      await page.keyboard.press('b');
      await page.keyboard.press('b');
      await page.keyboard.up(SHORTKEY);
      await editorPage.root.pressSequentially('B');
      expect(await editorPage.root.locator('p').nth(2).innerHTML()).toBe('ABA');
      await page.keyboard.down(SHORTKEY);
      await page.keyboard.press('b');
      await page.keyboard.up(SHORTKEY);
      await editorPage.root.pressSequentially('C');
      await page.keyboard.down(SHORTKEY);
      await page.keyboard.press('b');
      await page.keyboard.up(SHORTKEY);
      await editorPage.root.pressSequentially('D');
      expect(await editorPage.root.locator('p').nth(2).innerHTML()).toBe(
        'AB<strong>C</strong>DA',
      );
      const selection = await page.evaluate(getSelectionInTextNode);
      expect(selection).toBe('["DA",1,"DA",1]');
    },
  );
}

epicTest();
epicTest('iframe');
