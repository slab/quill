import Quill from '../quill';
import clone from 'clone';
import equal from 'deep-equal';
import extend from 'extend';
import keys from '../lib/keys';
import * as platform from '../lib/platform';

let Delta = Quill.require('delta');


class Keyboard {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = extend({}, Keyboard.DEFAULTS, options);
    this.bindings = {};
    this.addBinding({ key: 'B', metaKey: true }, this._onFormat.bind(this, 'bold'));
    this.addBinding({ key: 'I', metaKey: true }, this._onFormat.bind(this, 'italic'));
    this.addBinding({ key: 'U', metaKey: true }, this._onFormat.bind(this, 'underline'));
    this.options.bindings.forEach((def) => {
      this.addBinding(def.binding, def.callback);
    });
    this.quill.root.addEventListener('keydown', (evt) => {
      let which = evt.which || evt.keyCode;
      let range = this.quill.getSelection();
      let prevent = (this.bindings[which] || []).reduce(function(prevent, binding) {
        let [key, callback] = binding;
        if (!match(evt, key)) return prevent;
        return !callback(range, key, evt) || prevent;
      }, false);
      if (prevent) {
        return evt.preventDefault();
      }
    });
  }

  addBinding(binding, callback) {
    binding = normalize(binding);
    if (binding == null) {
      return this.quill.emit(Quill.events.DEBUG, 'Attempted to add invalid keyboard binding', binding);
    }
    this.bindings[binding.key] = this.bindings[binding.key] || [];
    this.bindings[binding.key].push([binding, callback]);
  }

  removeBinding(binding, callback = null) {
    binding = normalize(binding);
    let removed = [];
    if ((binding != null) && (this.bindings[binding.key] != null)) {
      this.bindings[binding.key] = this.bindings[binding.key].filter(function(target) {
        if (equal(target[0], binding) && (callback == null || callback === target[1])) {
          removed.push(callback);
          return false;
        }
        return true;
      });
    }
    return removed;
  }

  _onFormat(format, range, key, evt) {
    if (this.quill.options.formats.indexOf(format) < 0) return false;
    let formats = this.quill.getFormats(range);
    if (range.isCollapsed()) {
      this.quill.prepareFormat(format, !formats[format]);
    } else {
      this.quill.formatText(range, format, !formats[format]);
    }
    return false;
  }
}

Keyboard.DEFAULTS = {
  bindings: []
};


function match(evt, binding) {
  let metaKey = platform.isMac() ? evt.metaKey : evt.metaKey || evt.ctrlKey;
  if (!!binding.metaKey !== metaKey && binding.metaKey !== null) return false;
  if (!!binding.shiftKey !== evt.shiftKey && binding.shiftKey !== null) return false;
  if (!!binding.altKey !== evt.altKey && binding.altKey !== null) return false;
  return true;
}

function normalize(binding) {
  switch (typeof binding) {
    case 'string':
      if (Keyboard.bindings[binding.toUpperCase()] != null) {
        binding = clone(Keyboard.bindings[binding.toUpperCase()], false);
      } else if (binding.length === 1) {
        binding = { key: binding };
      } else {
        return null;
      }
      break;
    case 'number':
      binding = { key: binding };
      break;
    case 'object':
      binding = clone(binding, false);
      break;
    default:
      return null;
  }
  if (typeof binding.key === 'string') {
    binding.key = binding.key.toUpperCase().charCodeAt(0);
  }
  return binding;
}


Quill.registerModule('keyboard', Keyboard);

export { Keyboard as default };
