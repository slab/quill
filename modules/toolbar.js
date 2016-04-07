import Parchment from 'parchment';
import Quill from 'quill/core';
import logger from 'quill/core/logger';
import Module from 'quill/core/module';

let debug = logger('quill:toolbar');


class Toolbar extends Module {
  constructor(quill, options) {
    super(quill, options);
    if (typeof this.options === 'string') {
      this.options = {
        container: document.querySelector(this.options)
      }
    } else if (typeof this.options.container === 'string') {
      this.options.container = document.querySelector(this.options.container);
    } else if (Array.isArray(this.options.container)) {
      let container = document.createElement('div');
      addControls(container, options.container);
      quill.container.parentNode.insertBefore(container, quill.container);
      this.options.container = container;
    }
    if (!(this.options.container instanceof HTMLElement)) {
      return debug.error('Container required for toolbar', this.options);
    }
    this.container = this.options.container;
    this.container.classList.add('ql-toolbar');
    this.container.classList.toggle('ios', /iPhone|iPad/i.test(navigator.userAgent));
    this.controls = [];
    this.handlers = {
      'clean': () => {
        let range = this.quill.getSelection();
        if (range != null) {
          this.quill.removeFormat(range);
          this.quill.setSelection(range);
        }
        return true;
      }
    };
    [].forEach.call(this.container.querySelectorAll('a, button, input[type=button], select'), (input) => {
      this.attach(input);
    });
    this.quill.on(Quill.events.SELECTION_CHANGE, this.update, this);
    this.quill.on(Quill.events.SCROLL_CHANGE, () => {
      let [range, ] = this.quill.selection.getRange();  // quill.getSelection triggers update
      this.update(range);
    });
  }

  attach(input) {
    let format = [].find.call(input.classList, (className) => {
      return className.indexOf('ql-') === 0;
    });
    if (!format) return;
    format = format.slice('ql-'.length);
    let eventName = input.tagName === 'SELECT' ? 'change' : 'click';
    input.addEventListener(eventName, () => {
      this.quill.focus();
      let value;
      if (input.tagName === 'SELECT') {
        if (input.selectedIndex < 0) return;
        value = input.options[input.selectedIndex].value || false;
      } else {
        value = input.classList.contains('ql-active') ? false : input.getAttribute('data-value') || true;
      }
      if (this.handlers[format]) {
        if (this.handlers[format](value)) return;
      }
      this.quill.format(format, value, Quill.sources.USER);
    });
    // TODO use weakmap
    this.controls.push([format, input]);
  }

  update(range) {
    if (range == null) return;
    let formats = this.quill.getFormat(range);
    this.controls.forEach(function(pair) {
      let [format, input] = pair;
      if (input.tagName === 'SELECT') {
        let option;
        if (formats[format] == null) {
          option = input.querySelector('option[selected]');
        } else if (!Array.isArray(formats[format])) {
          option = input.querySelector(`option[value="${formats[format]}"]`);
        }
        if (option == null) {
          input.value = '';   // TODO make configurable?
          input.selectedIndex = -1;
        } else {
          option.selected = true;
        }
        let event = document.createEvent('Event');
        event.initEvent('change');
        input.dispatchEvent(event);
      } if (input.hasAttribute('data-value')) {
        input.classList.toggle('ql-active', input.getAttribute('data-value') == formats[format]);  // Intentional ==
      } else {
        input.classList.toggle('ql-active', formats[format] || false);
      }
    });
  }
}
Toolbar.DEFAULTS = {
  container: null
};


function addButton(container, format, value) {
  let input = document.createElement('button');
  input.classList.add('ql-' + format);
  if (value != null) {
    input.setAttribute('data-value', value);
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


export { Toolbar as default, addControls };
