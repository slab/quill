import { test as base } from '@playwright/test';
import EditorPage from '../pageobjects/EditorPage.js';
import Composition from './Composition.js';
import Locker from './utils/Locker.js';
import Clipboard from './Clipboard.js';

export const test = base.extend<{
  editorPage: EditorPage;
  clipboard: Clipboard;
  composition: Composition;
}>({
  editorPage: ({ page }, use) => {
    use(new EditorPage(page));
  },
  composition: ({ page, browserName }, use) => {
    test.fail(
      browserName !== 'chromium',
      'CDPSession is only available in Chromium',
    );

    use(new Composition(page, browserName));
  },
  clipboard: [
    async ({ page }, use) => {
      const locker = new Locker('clipboard');
      await locker.lock();
      await use(new Clipboard(page));
      await locker.release();
    },
    { timeout: 30000 },
  ],
});

export const CHAPTER = 'Chapter 1. Loomings.';
export const P1 =
  'Call me Ishmael. Some years ago—never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore.';
export const P2 =
  'There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf.';
