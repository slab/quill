import Quill from '../quill';
import extend from 'extend';
import * as platform from '../lib/platform';


class Toolbar {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = extend({}, Toolbar.DEFAULTS, options)
    if (typeof this.options.container === 'string') {
      this.options.container = document.querySelector(this.options.container);
    }
    if (this.options.container == null) {
      throw new Error('container required for toolbar', this.options);
    }
    this.container = this.options.container;
    this.container.classList.add('ql-toolbar');
    if (platform.isIOS()) {
      this.container.classList.add('ios');
    }
    this.initFormats();
  }

  initFormats() {
    this.quill.options.formats.forEach((format) => {
      let input = this.container.querySelector('.ql-' + format);
      if (input == null) return;
      let eventName = input.tagName === 'SELECT' ? 'change' : 'click';
      input.addEventListener(eventName, () => {
        let value;
        if (input.tagName === 'SELECT') {
          value = input.selectedIndex > -1 ? input.options[input.selectedIndex].value : '';
        } else {
          value = !input.classList.contains('ql-active');
        }
        let range = this.quill.getSelection(true);
        if (range != null) {
          if (range.isCollapsed()) {
            this.quill.prepareFormat(format, value);
          } else {
            this.quill.formatText(range, format, value, Quill.sources.USER);
            this.quill.setSelection(range);
            if (platform.isIE(10)) {
              this.quill.selection.scrollIntoView();
            }
          }
          if (eventName === 'click') {
            input.classList.toggle('ql-active');
          }
        }
        return false;
      });
    });
  }
}
Toolbar.DEFAULTS = {
  container: null
};


Quill.registerModule('toolbar', Toolbar);

export { Toolbar as default };
