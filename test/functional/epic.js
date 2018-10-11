const puppeteer = require('puppeteer');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const SHORTKEY = process.platform === 'darwin' ? 'Meta' : 'Control';

const CHAPTER = 'Chapter 1. Loomings.';
const P1 =
  'Call me Ishmael. Some years ago—never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.';
const P2 =
  'There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.';

describe('quill', function() {
  it('compose an epic', async function() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto('http://localhost:9000/standalone/full/');
    await page.waitForSelector('.ql-editor', { timeout: 10000 });
    const title = await page.title();
    expect(title).toEqual('Full Editor - Quill Rich Text Editor');

    await page.type('.ql-editor', 'The Whale');
    let html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual('<p>The Whale</p>');

    await page.keyboard.press('Enter');
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual('<p>The Whale</p><p><br></p>');

    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.type('.ql-editor', P1);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.type('.ql-editor', P2);
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
      Array(20)
        .fill(0)
        .map(() => page.keyboard.press('ArrowUp')),
    );
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.type('.ql-editor', CHAPTER);
    await page.keyboard.press('Enter');
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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

    await page.type('.ql-editor', 'Moby Dick');
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
    html = await page.$eval('.ql-editor', e => e.innerHTML);
    expect(html).toEqual(
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
    await page.type('.ql-editor', 'AA');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.down(SHORTKEY);
    await page.keyboard.press('b');
    await page.keyboard.press('b');
    await page.keyboard.up(SHORTKEY);
    await page.type('.ql-editor', 'B');
    html = await page.$$eval('.ql-editor p', paras => paras[2].innerHTML);
    expect(html).toBe('ABA');
    await page.keyboard.down(SHORTKEY);
    await page.keyboard.press('b');
    await page.keyboard.up(SHORTKEY);
    await page.type('.ql-editor', 'C');
    await page.keyboard.down(SHORTKEY);
    await page.keyboard.press('b');
    await page.keyboard.up(SHORTKEY);
    await page.type('.ql-editor', 'D');
    html = await page.$$eval('.ql-editor p', paras => paras[2].innerHTML);
    expect(html).toBe('AB<strong>C</strong>DA');
    const selection = await page.evaluate(getSelectionInTextNode);
    expect(selection).toBe('["DA",1,"DA",1]');

    // await page.waitFor(1000000);
    await browser.close();
  });
});

function getSelectionInTextNode() {
  const {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  } = document.getSelection();
  return JSON.stringify([
    anchorNode.data,
    anchorOffset,
    focusNode.data,
    focusOffset,
  ]);
}
