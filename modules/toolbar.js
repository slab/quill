import extend from 'extend';
import Emitter from '../core/emitter';
import Parchment from 'parchment';
import Module from '../core/module';
import logger from '../core/logger';

let debug = logger('quill:toolbar');


class Toolbar extends Module {
  constructor(quill, options) {
    if (Array.isArray(options)) {
      let container = document.createElement('div');
      addControls(container, options);
      quill.container.parentNode.insertBefore(container, quill.container);
      options = { container: container };
    }
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
    this.handlers = {};
    [].forEach.call(this.container.querySelectorAll('a, button, input[type=button], select'), (input) => {
      this.attach(input);
    });
    this.quill.on(Quill.events.SELECTION_CHANGE, this.update, this)
              .on(Quill.events.TEXT_CHANGE, this.update, this);
  }

  attach(input) {
    let format = [].find.call(input.classList, (className) => {
      return className.indexOf('ql-') === 0;
    });
    if (!format) return;
    format = format.slice('ql-'.length);
    // if (this.quill.options.formats.indexOf(format) < 0) return;  // TODO enable
    let eventName = input.tagName === 'SELECT' ? 'change' : 'click';
    input.addEventListener(eventName, () => {
      this.quill.focus();
      let value;
      if (input.tagName === 'SELECT') {
        value = input.options[input.selectedIndex].value || false;
      } else {
        value = input.classList.contains('ql-active') ? false : input.getAttribute('data-value') || true;
      }
      if (this.handlers[format]) {
        if (this.handlers[format](value)) return;
      }
      this.quill.format(format, value, Emitter.sources.USER);
    });
    // TODO use weakmap
    this.controls.push([format, input]);
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
          // TODO never reports array
          input.value = Array.isArray(formats[format]) ? '' : formats[format];
        }
      } else {
        input.classList.toggle('ql-active', formats[format]);
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
