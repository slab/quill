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
    let input = this.container.querySelector(`.ql-${format}`);
    if (input == null) return;
    if (input.tagName !== 'SELECT') {
      input.classList.toggle('ql-active', !!value);
    } else if (value) {
      input.value = value;
    } else {
      input.querySelector('option[selected]').selected = true;
    }
  }

  _initFormats() {
    Object.keys(this.formats).forEach((format) => {
      let input = this.container.querySelector(`.ql-${format}`);
      if (input == null) return;
      let eventName = input.tagName === 'SELECT' ? 'change' : 'click';
      input.addEventListener(eventName, () => {
        let range = this.quill.getSelection(true);
        if (range == null) return false;
        let handler = this.formats[format] || function(input, range, callback) {
          if (input.tagName === 'SELECT') {
            callback(input.options[input.selectedIndex].value);
          } else {
            callback(!input.classList.contains('ql-active'));
          }
        };
        handler.call(this, input, range, (value) => {
          let match = Parchment.match(format);
          if ((match.prototype instanceof Parchment.Block) ||
              (match.options.scope === Parchment.Block)) {  // TODO easier way to determine block
            this.quill.formatLine(range.start, range.end + 1, format, value, Quill.sources.USER);
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
  }
}
Toolbar.DEFAULTS = {
  container: null,
  formats: {
    image: function(input, range, callback) {
      let value = prompt('Enter image url:', 'http://');
      this.quill.insertEmbed(range.start, 'image', value);
      if (!range.isCollapsed()) {
        this.quill.deleteText(range, Quill.sources.USER);
      }
      this.quill.setSelection(range.start + 1, range.start + 1, Quill.sources.USER);
    },
    link: function(input, range, callback) {
      let value = prompt('Enter link url:', 'http://');
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
