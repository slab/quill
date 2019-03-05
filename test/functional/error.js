const puppeteer = require('puppeteer');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const SHORTKEY = process.platform === 'darwin' ? 'Meta' : 'Control';

describe('quill', function() {
  it('add a list', async function() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto('http://localhost:9000/standalone/full/');
    await page.waitForSelector('.ql-editor', { timeout: 10000 });
    let title = await page.title();
    expect(title).toEqual('Full Editor - Quill Rich Text Editor');

    {
        await page.click('.ql-toolbar .ql-list');

        await page.type('.ql-editor', 'Backspace');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', ' ');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'starting on');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'items');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', ' ');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'two');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'and');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'five (four)');

        // get to the second line
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');

        // remove the space and the list item
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
    }

    let goodHtml = await page.$eval('.ql-editor', e => e.innerHTML);
    // this passes
    expect(goodHtml).toEqual('<ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Backspace</li></ol><p><br></p><ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>starting on</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>items</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span> </li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>two</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>and</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>five (four)</li></ol>');

    await page.waitFor(5000);

    await page.goto('http://localhost:9000/standalone/withkeys/');
    // pause so the error can be seen in the console
    await page.waitFor(20000);
    await page.waitForSelector('.ql-editor', { timeout: 10000 });
    title = await page.title();
    expect(title).toEqual('Full Editor - Quill Rich Text Editor');

    {
        await page.click('.ql-toolbar .ql-list');

        await page.type('.ql-editor', 'Backspace');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', ' ');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'starting on');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'items');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', ' ');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'two');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'and');
        await page.keyboard.press('Enter');
        await page.type('.ql-editor', 'five (four)');

        // get to the second line
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');

        // remove the space and the list item
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
    }

    let badHtml = await page.$eval('.ql-editor', e => e.innerHTML);
    // this fails
    expect(badHtml).toEqual('<ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Backspace</li></ol><p><br></p><ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>starting on</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>items</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span> </li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>two</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>and</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>five (four)</li></ol>');

    // the difference is the presence of 
    // keyboard: { bindings: [], }
    // in the config object

    await page.waitFor(5000);

    await browser.close();
  });
});
