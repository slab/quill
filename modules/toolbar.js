import extend from 'extend';
import Module from '../core/module';
import logger from '../core/logger';

let debug = logger('quill:toolbar');


class Toolbar extends Module {
  constructor(quill, options) {
    super(quill, options);
    if (typeof this.options.container === 'string') {
      this.options.container = document.querySelector(this.options.container);
    }
    if (this.options.container == null) {
      return debug.error('Container required for toolbar', this.options);
    }
    this.container = this.options.container;
    this.container.classList.add('ql-toolbar');
    this.container.classList.toggle('ios', /iPhone|iPad/i.test(navigator.userAgent));
    this.controls = [];
    [].forEach.call(this.container.querySelectorAll('a, button, input[type=button], select'), (input) => {
      this.attach(input);
    });
    this.quill.on(Quill.events.SELECTION_CHANGE, this.update, this)
              .on(Quill.events.TEXT_CHANGE, this.update, this);
  }

  attach(input, handler = this.handle) {
    let format = [].find.call(input.classList, (className) => {
      return className.indexOf('ql-') === 0;
    });
    if (!format) return;
    format = format.slice('ql-'.length);
    let eventName = input.tagName === 'SELECT' ? 'change' : 'click';
    input.addEventListener(eventName, () => {
      let range = this.quill.getSelection(true);
      if (range == null) return false;
      if (input.tagName === 'SELECT') {
        handler.call(this, range, format, input.options[input.selectedIndex].value || false);
      } else {
        let value = input.classList.contains('.ql-active') ? false : input.getAttribute('data-value') || true;
        handler.call(this, range, format, value);
      }
      this.update();
      return false;
    });
    this.controls.push([format, input]);
  }

  handle(range, format, value) {
    if (range.length === 0) {
      this.quill.formatCursor(format, value, Quill.sources.USER);
    } else {
      this.quill.formatText(range, format, value, Quill.sources.USER);
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }

  update() {
    let range = this.quill.getSelection();
    if (range == null) return;
    let formats = this.quill.getFormat(range);
    this.controls.forEach(function(pair) {
      let [format, input] = pair;
      if (input.tagName === 'SELECT') {
        if (formats[format] == null) {
          input.querySelector('option[selected]').selected = true;
        } else {
          input.value = Array.isArray(formats[format]) ? '' : value;
        }
      } else {
        input.classList.toggle('ql-active', formats[format]);
      }
    });
  }
}
Toolbar.moduleName = 'toolbar';
Toolbar.DEFAULTS = {
  container: null
};


export { Toolbar as default };
