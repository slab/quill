import { Page } from '@playwright/test';

class QuillPage {
  constructor(private page: Page) {}

  get root() {
    return this.page.locator('.ql-editor');
  }

  editorHTML() {
    return this.root.innerHTML();
  }
}

export default QuillPage;
