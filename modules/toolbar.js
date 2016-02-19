import extend from 'extend';
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
        let value = input.classList.contains('ql-active') ? false : input.getAttribute('data-value') || true;
        handler.call(this, range, format, value);
      }
      this.update();
    });
    // TODO use weakmap
    this.controls.push([format, input]);
  }

  handle(range, format, value) {
    if (Parchment.query(format, Parchment.Scope.BLOCK)) {
      this.quill.formatLine(range, format, value, Quill.sources.USER);
    } else if (range.length === 0) {
      this.quill.formatCursor(format, value, Quill.sources.USER);
      return;
    } else {
      this.quill.formatText(range, format, value, Quill.sources.USER);
    }
    this.quill.setSelection(range, Quill.sources.SILENT);
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
        if (typeof value === 'string') {
          addButton(group, format, value);
        } else {
          addSelect(group, format, value);
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
