import Delta from 'quill-delta';
import Parchment from 'parchment';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';

let debug = logger('quill:toolbar');


class Toolbar extends Module {
  constructor(quill, options) {
    super(quill, options);
    if (Array.isArray(this.options.container)) {
      let container = document.createElement('div');
      addControls(container, this.options.container);
      quill.container.parentNode.insertBefore(container, quill.container);
      this.container = container;
    } else if (typeof this.options.container === 'string') {
      this.container = document.querySelector(this.options.container);
    } else {
      this.container = this.options.container;
    }
    if (!(this.container instanceof HTMLElement)) {
      return debug.error('Container required for toolbar', this.options);
    }
    this.container.classList.add('ql-toolbar');
    this.controls = [];
    this.handlers = {};
    Object.keys(this.options.handlers).forEach((format) => {
      this.addHandler(format, this.options.handlers[format]);
    });
    [].forEach.call(this.container.querySelectorAll('button, select'), (input) => {
      this.attach(input);
    });
    this.quill.on(Quill.events.EDITOR_CHANGE, (type, range) => {
      if (type === Quill.events.SELECTION_CHANGE) {
        this.update(range);
      }
    });
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      let [range, ] = this.quill.selection.getRange();  // quill.getSelection triggers update
      this.update(range);
    });
  }

  addHandler(format, handler) {
    this.handlers[format] = handler;
  }

  attach(input) {
    let format = [].find.call(input.classList, (className) => {
      return className.indexOf('ql-') === 0;
    });
    if (!format) return;
    format = format.slice('ql-'.length);
    if (input.tagName === 'BUTTON') {
      input.setAttribute('type', 'button');
    }
    if (this.handlers[format] == null) {
      if (this.quill.scroll.whitelist != null && this.quill.scroll.whitelist[format] == null) {
        debug.warn('ignoring attaching to disabled format', format, input);
        return;
      }
      if (Parchment.query(format) == null) {
        debug.warn('ignoring attaching to nonexistent format', format, input);
        return;
      }
    }
    let eventName = input.tagName === 'SELECT' ? 'change' : 'click';
    input.addEventListener(eventName, (e) => {
      let value;
      if (input.tagName === 'SELECT') {
        if (input.selectedIndex < 0) return;
        let selected = input.options[input.selectedIndex];
        if (selected.hasAttribute('selected')) {
          value = false;
        } else {
          value = selected.value || false;
        }
      } else {
        if (input.classList.contains('ql-active')) {
          value = false;
        } else {
          value = input.value || !input.hasAttribute('value');
        }
        e.preventDefault();
      }
      this.quill.focus();
      let [range, ] = this.quill.selection.getRange();
      if (this.handlers[format] != null) {
        this.handlers[format].call(this, value);
      } else if (Parchment.query(format).prototype instanceof Parchment.Embed) {
        value = prompt(`Enter ${format}`);
        if (!value) return;
        this.quill.updateContents(new Delta()
          .retain(range.index)
          .delete(range.length)
          .insert({ [format]: value })
        , Quill.sources.USER);
      } else {
        this.quill.format(format, value, Quill.sources.USER);
      }
      this.update(range);
    });
    // TODO use weakmap
    this.controls.push([format, input]);
  }

  update(range) {
    let formats = range == null ? {} : this.quill.getFormat(range);
    this.controls.forEach(function(pair) {
      let [format, input] = pair;
      if (input.tagName === 'SELECT') {
        let option;
        if (range == null) {
          option = null;
        } else if (formats[format] == null) {
          option = input.querySelector('option[selected]');
        } else if (!Array.isArray(formats[format])) {
          let value = formats[format];
          if (typeof value === 'string') {
            value = value.replace(/\"/g, '\\"');
          }
          option = input.querySelector(`option[value="${value}"]`);
        }
        if (option == null) {
          input.value = '';   // TODO make configurable?
          input.selectedIndex = -1;
        } else {
          option.selected = true;
        }
      } else {
        if (range == null) {
          input.classList.remove('ql-active');
        } else if (input.hasAttribute('value')) {
          // both being null should match (default values)
          // '1' should match with 1 (headers)
          let isActive = formats[format] === input.getAttribute('value') ||
                         (formats[format] != null && formats[format].toString() === input.getAttribute('value')) ||
                         (formats[format] == null && !input.getAttribute('value'));
          input.classList.toggle('ql-active', isActive);
        } else {
          input.classList.toggle('ql-active', formats[format] != null);
        }
      }
    });
  }
}
Toolbar.DEFAULTS = {};


function addButton(container, format, value) {
  let input = document.createElement('button');
  input.setAttribute('type', 'button');
  input.classList.add('ql-' + format);
  if (value != null) {
    input.value = value;
  }
  container.appendChild(input);
}

function addControls(container, groups) {
  if (!Array.isArray(groups[0])) {
    groups = [groups];
  }
  groups.forEach(function(controls) {
    let group = document.createElement('span');
    group.classList.add('ql-formats');
    controls.forEach(function(control) {
      if (typeof control === 'string') {
        addButton(group, control);
      } else {
        let format = Object.keys(control)[0];
        let value = control[format];
        if (Array.isArray(value)) {
          addSelect(group, format, value);
        } else {
          addButton(group, format, value);
        }
      }
    });
    container.appendChild(group);
  });
}

function addSelect(container, format, values) {
  let input = document.createElement('select');
  input.classList.add('ql-' + format);
  values.forEach(function(value) {
    let option = document.createElement('option');
    if (value !== false) {
      option.setAttribute('value', value);
    } else {
      option.setAttribute('selected', 'selected');
    }
    input.appendChild(option);
  });
  container.appendChild(input);
}

Toolbar.DEFAULTS = {
  container: null,
  handlers: {
    clean: function() {
      let range = this.quill.getSelection();
      if (range == null) return;
      if (range.length == 0) {
        let formats = this.quill.getFormat();
        Object.keys(formats).forEach((name) => {
          // Clean functionality in existing apps only clean inline formats
          if (Parchment.query(name, Parchment.Scope.INLINE) != null) {
            this.quill.format(name, false);
          }
        });
      } else {
        this.quill.removeFormat(range, Quill.sources.USER);
      }
    },
    direction: function(value) {
      let align = this.quill.getFormat()['align'];
      if (value === 'rtl' && align == null) {
        this.quill.format('align', 'right', Quill.sources.USER);
      } else if (!value && align === 'right') {
        this.quill.format('align', false, Quill.sources.USER);
      }
      this.quill.format('direction', value, Quill.sources.USER);
    },
    indent: function(value) {
      let range = this.quill.getSelection();
      let formats = this.quill.getFormat(range);
      let indent = parseInt(formats.indent || 0);
      if (value === '+1' || value === '-1') {
        let modifier = (value === '+1') ? 1 : -1;
        if (formats.direction === 'rtl') modifier *= -1;
        this.quill.format('indent', indent + modifier, Quill.sources.USER);
      }
    },
    link: function(value) {
      if (value === true) {
        value = prompt('Enter link URL:');
      }
      this.quill.format('link', value, Quill.sources.USER);
    },
    list: function(value) {
      let range = this.quill.getSelection();
      let formats = this.quill.getFormat(range);
      if (value === 'check') {
        if (formats['list'] === 'checked' || formats['list'] === 'unchecked') {
          this.quill.format('list', false, Quill.sources.USER);
        } else {
          this.quill.format('list', 'unchecked', Quill.sources.USER);
        }
      } else {
        this.quill.format('list', value, Quill.sources.USER);
      }
    }
  }
}


export { Toolbar as default, addControls };
