import { expect } from '@playwright/test';
import { getSelectionInTextNode, SHORTKEY } from './utils';
import { test, CHAPTER, P1, P2 } from './fixtures';

test('compose an epic', async ({ page, editorPage }) => {
  await editorPage.open();
  await editorPage.root.pressSequentially('The Whale');
  expect(await editorPage.root.innerHTML()).toEqual('<p>The Whale</p>');

  await page.keyboard.press('Enter');
  expect(await editorPage.root.innerHTML()).toEqual(
    '<p>The Whale</p><p><br></p>',
  );

  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await editorPage.root.pressSequentially(P1);
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
  await page.type('.ql-editor', CHAPTER);
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

  await page.click('.ql-toolbar .ql-bold');
  await page.click('.ql-toolbar .ql-italic');
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
  let bold = await page.$('.ql-toolbar .ql-bold.ql-active');
  let italic = await page.$('.ql-toolbar .ql-italic.ql-active');
  expect(bold).not.toBe(null);
  expect(italic).not.toBe(null);

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
  bold = await page.$('.ql-toolbar .ql-bold.ql-active');
  italic = await page.$('.ql-toolbar .ql-italic.ql-active');
  expect(bold).not.toBe(null);
  expect(italic).not.toBe(null);

  await page.keyboard.press('ArrowRight');
  await page.keyboard.down('Shift');
  await Promise.all(
    Array(CHAPTER.length)
      .fill(0)
      .map(() => page.keyboard.press('ArrowRight')),
  );
  await page.keyboard.up('Shift');
  bold = await page.$('.ql-toolbar .ql-bold.ql-active');
  italic = await page.$('.ql-toolbar .ql-italic.ql-active');
  expect(bold).toBe(null);
  expect(italic).toBe(null);

  await page.keyboard.down(SHORTKEY);
  await page.keyboard.press('b');
  await page.keyboard.up(SHORTKEY);
  bold = await page.$('.ql-toolbar .ql-bold.ql-active');
  expect(bold).not.toBe(null);
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
  await page.click('.ql-toolbar .ql-header[value="1"]');
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
  const header = await page.$('.ql-toolbar .ql-header.ql-active[value="1"]');
  expect(header).not.toBe(null);

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
});
