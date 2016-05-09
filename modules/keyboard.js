import clone from 'clone';
import equal from 'deep-equal';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';
import { Range } from '../core/selection';
import Block from '../blots/block';

let debug = logger('quill:keyboard');


class Keyboard extends Module {
  static match(evt, binding) {
    binding = normalize(binding);
    let metaKey = /Mac/i.test(navigator.platform) ? evt.metaKey : evt.metaKey || evt.ctrlKey;
    if (!!binding.metaKey !== metaKey && binding.metaKey !== null) return false;
    if (!!binding.shiftKey !== evt.shiftKey && binding.shiftKey !== null) return false;
    if (!!binding.altKey !== evt.altKey && binding.altKey !== null) return false;
    return binding.key === (evt.which || evt.keyCode);
  }

  constructor(quill, options) {
    super(quill, options);
    this.bindings = {};
    this.quill.root.addEventListener('keydown', (evt) => {
      if (evt.defaultPrevented) return;
      let which = evt.which || evt.keyCode;
      let bindings = (this.bindings[which] || []).filter(function(tuple) {
        return Keyboard.match(evt, tuple[0]);
      });
      if (bindings.length === 0) return;
      let range = this.quill.getSelection();
      let prevented = !bindings.every((tuple) => {
        let [key, context, handler] = tuple;
        return handler.call(this, range);
      });
      if (prevented) {
        evt.preventDefault();
      }
    });
  }

  addBinding(binding, context, handler) {
    binding = normalize(binding);
    if (binding == null) {
      return debug.warn('Attempted to add invalid keyboard binding', binding);
    }
    if (typeof context === 'function') {
      handler = context;
      context = {};
    }
    this.bindings[binding.key] = this.bindings[binding.key] || [];
    this.bindings[binding.key].push([binding, context, handler]);
  }

  removeAllBindings(binding, handler = null) {
    binding = normalize(binding);
    if (binding == null || this.bindings[binding.key] == null) return [];
    let removed = [];
    this.bindings[binding.key] = this.bindings[binding.key].filter(function(tuple) {
      let [key, context, callback] = tuple;
      if (equal(key, binding) && (handler == null || callback === handler)) {
        removed.push(handler);
        return false;
      }
      return true;
    });
    return removed;
  }

  removeBinding(binding, handler) {
    this.removeAllBindings(binding, handler);
  }
}

Keyboard.keys = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46
}

function normalize(binding) {
  switch (typeof binding) {
    case 'string':
      if (Keyboard.keys[binding.toUpperCase()] != null) {
        binding = { key: Keyboard.keys[binding.toUpperCase()] };
      } else if (binding.length === 1) {
        binding = { key: binding.toUpperCase().charCodeAt(0) };
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


export default Keyboard;
