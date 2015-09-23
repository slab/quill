import baseStyles from './base.styl';
import * as platform from '../../lib/platform';


class BaseTheme {
  constructor(quill, styles = true) {
    this.quill = quill;
    this.quill.container.classList.add('ql-container');
    if (styles) {
      this.addStyles(baseStyles);
    }
    if (platform.isIE(10)) {
      this.quill.root.classList.add('ql-ie-10');
    }
  }

  addStyles(css) {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
}
BaseTheme.OPTIONS = {};


export { BaseTheme as default };
