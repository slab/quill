import type {
  CDPSession,
  Page,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from '@playwright/test';

abstract class CompositionSession {
  abstract update(key: string): Promise<void>;
  abstract commit(committedText: string): Promise<void>;

  protected composingData = '';

  constructor(protected page: Page) {}

  protected async withKeyboardEvents(
    key: string,
    callback: () => Promise<void>,
  ) {
    const activeElement = this.page.locator('*:focus');

    await activeElement.dispatchEvent('keydown', { key });
    await callback();
    await activeElement.dispatchEvent('keyup', { key });
  }
}

class ChromiumCompositionSession extends CompositionSession {
  constructor(
    page: Page,
    private session: CDPSession,
  ) {
    super(page);
  }

  async update(key: string) {
    await this.withKeyboardEvents(key, async () => {
      this.composingData += key;

      await this.session.send('Input.imeSetComposition', {
        selectionStart: this.composingData.length,
        selectionEnd: this.composingData.length,
        text: this.composingData,
      });
    });
  }

  async commit(committedText: string) {
    await this.withKeyboardEvents('Space', async () => {
      await this.session.send('Input.insertText', {
        text: committedText,
      });
    });
  }
}

class WebkitCompositionSession extends CompositionSession {
  constructor(
    page: Page,
    private session: any,
  ) {
    super(page);
  }

  async update(key: string) {
    await this.withKeyboardEvents(key, async () => {
      this.composingData += key;

      await this.session.send('Page.setComposition', {
        selectionStart: this.composingData.length,
        selectionLength: 0,
        text: this.composingData,
      });
    });
  }

  async commit(committedText: string) {
    await this.withKeyboardEvents('Space', async () => {
      await this.page.keyboard.insertText(committedText);
    });
  }
}

class Composition {
  constructor(
    private page: Page,
    private browserName: PlaywrightWorkerOptions['browserName'],
    private playwright: PlaywrightWorkerArgs['playwright'],
  ) {}

  async start() {
    switch (this.browserName) {
      case 'chromium': {
        const session = await this.page.context().newCDPSession(this.page);
        return new ChromiumCompositionSession(this.page, session);
      }
      case 'webkit': {
        const session = (await (this.playwright as any)._toImpl(this.page))
          ._delegate._session;
        return new WebkitCompositionSession(this.page, session);
      }
      default:
        throw new Error(`Unsupported browser: ${this.browserName}`);
    }
  }
}

export default Composition;
