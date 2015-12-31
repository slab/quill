import Quill from '../quill';
import extend from 'extend';
import * as platform from '../lib/platform';

let Parchment = Quill.import('parchment');


class Toolbar {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = extend({}, Toolbar.DEFAULTS, options);
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
    this.formats = this.quill.options.formats.reduce((formats, name) => {
      formats[name] = this.options.formats[name] || Toolbar.DEFAULTS.formats[name] || false;
      return formats;
    }, {});
    this._initFormats();
    this.quill.on(Quill.events.SELECTION_CHANGE, (range, formats) => {
      Object.keys(this.formats).forEach((name) => {
        this.setActive(name, formats[name]);
      });
    });
  }

  setActive(format, value) {
    // TODO make sure we are not triggering picker from setting to existing value
    let inputs = this.container.querySelectorAll(`.ql-${format}`);
    [].forEach.call(inputs, function(input) {
      if (input.tagName !== 'SELECT') {
        let toggle = value === true || value === input.getAttribute('data-value');
        input.classList.toggle('ql-active', toggle);
      } else if (value) {
        input.value = value;
      } else {
        input.querySelector('option[selected]').selected = true;
      }
    });
  }

  _initFormats() {
    Object.keys(this.formats).forEach((format) => {
      let inputs = this.container.querySelectorAll(`.ql-${format}`);
      [].forEach.call(inputs, (input) => {
        let eventName = input.tagName === 'SELECT' ? 'change' : 'click';
        input.addEventListener(eventName, () => {
          let range = this.quill.getSelection(true);
          if (range == null) return false;
          let handler = this.formats[format] || function(input, range, callback) {
            if (input.tagName === 'SELECT') {
              callback(input.options[input.selectedIndex].value);
            } else {
              if (input.classList.contains('ql-active')) {
                callback(false);
              } else {
                callback(input.getAttribute('data-value') || true);
              }
            }
          };
          handler.call(this, input, range, (value) => {
            if (Parchment.match(format, Parchment.Block)) {
              let formatObj = {};
              formatObj[format] = value;
              if (format === 'list' && value) {
                formatObj['indent'] = '1';
              }
              this.quill.formatLine(range.start, range.end + 1, formatObj, Quill.sources.USER);
              this.quill.setSelection(range, Quill.sources.USER);
            } else if (range.isCollapsed()) {
              this.quill.prepareFormat(format, value);
            } else {
              this.quill.formatText(range, format, value, Quill.sources.USER);
              this.quill.setSelection(range, Quill.sources.USER);
            }
          });
          return false;
        });
      });
    });
  }
}
Toolbar.DEFAULTS = {
  container: null,
  formats: {
    equation: function(input, range, callback) {
      let value = prompt('Enter equation:');
      if (!value) return;
      this.quill.insertEmbed(range.start, 'equation', value, Quill.sources.USER);
      this.quill.insertText(range.start + 1, ' ', Quill.sources.USER);  // TODO bug if we do not insert a space after
      if (!range.isCollapsed()) {
        this.quill.deleteText(range, Quill.sources.USER);
      }
      this.quill.setSelection(range.start + 2, range.start + 2, Quill.sources.SILENT);
    },
    image: function(input, range, callback) {
      let value = prompt('Enter image url:', 'http://');
      if (!value) return;
      this.quill.insertEmbed(range.start, 'image', { url: value });
      if (!range.isCollapsed()) {
        this.quill.deleteText(range, Quill.sources.USER);
      }
      this.quill.setSelection(range.start + 1, range.start + 1, Quill.sources.SILENT);
    },
    link: function(input, range, callback) {
      let value = prompt('Enter link url:', 'http://');
      if (!value) return;
      if (range.isCollapsed()) {
        this.quill.insertText(range.start, value, { link: value }, Quill.sources.USER);
        this.quill.setSelection(range.start + value.length, range.start + value.length, Quill.sources.USER);
      } else {
        callback(value);
      }
    }
  }
};


Quill.registerModule('toolbar', Toolbar);

export { Toolbar as default };
