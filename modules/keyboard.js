import clone from 'clone';
import equal from 'deep-equal';
import extend from 'extend';
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
    this.options.bindings = extend({}, Keyboard.DEFAULTS.bindings, options.bindings);
    this.bindings = {};
    Object.keys(this.options.bindings).forEach((name) => {
      let [key, context, handler] = this.options.bindings[name];
      this.addBinding(key, context, handler);
    });
    this.addBinding({ key: Keyboard.keys.ENTER, shiftKey: null }, handleEnter);
    this.addBinding({ key: Keyboard.keys.BACKSPACE }, makeDeleteHanlder(true));
    this.addBinding({ key: Keyboard.keys.DELETE }, makeDeleteHanlder(false));
    this.listen();
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

  listen() {
    this.quill.root.addEventListener('keydown', (evt) => {
      if (evt.defaultPrevented) return;
      let which = evt.which || evt.keyCode;
      let bindings = (this.bindings[which] || []).filter(function(tuple) {
        return Keyboard.match(evt, tuple[0]);
      });
      if (bindings.length === 0) return;
      let range = this.quill.getSelection();
      if (range == null) return;    // implies we do not have focus
      let format = null;
      let prevented = !bindings.every((tuple) => {
        let [key, context, handler] = tuple;
        if (context.collapsed === true && range.length > 0) return true;
        if (context.collapsed === false && range.length === 0) return true;
        if (context.format) {
          format = format || this.quill.getFormat(range);
          let formatsMatch = Object.keys(context.format).every(function(name) {
            return (context.format[name] === true && format[name] != null) ||
                   (context.format[name] === false && format[name] == null) ||
                   (equal(context.format[name], format[name]));
          });
          if (!formatsMatch) return true;
        }
        return handler.call(this, range);
      });
      if (prevented) {
        evt.preventDefault();
      }
    });
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
};

Keyboard.DEFAULTS = {
  bindings: {
    'add bold'          : makeFormatHandler('bold', true),
    'add italic'        : makeFormatHandler('italic', true),
    'add underline'     : makeFormatHandler('underline', true),
    'remove bold'       : makeFormatHandler('bold', false),
    'remove italic'     : makeFormatHandler('italic', false),
    'remove underline'  : makeFormatHandler('underline', false),
    'indent'            : makeIndentHanlder(true),
    'outdent'           : makeIndentHanlder(false),
    'tab'               : [
      { key: Keyboard.keys.TAB, shiftKey: null },
      { collapsed: true },
      function(range) {
        this.quill.insertText(range.index, '\t', Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        return false;
      }
    ]
  }
};

function handleEnter(range) {
  let formats = this.quill.getFormat(range);
  let lineFormats = Object.keys(formats).reduce(function(lineFormats, format) {
    if (Parchment.query(format, Parchment.Scope.BLOCK)) {
      lineFormats[format] = formats[format];
    }
    return lineFormats;
  }, {});
  let added = 1;
  let delta = new Delta()
    .retain(range.index)
    .insert('\n', lineFormats);
  delta.delete(range.length);
  this.quill.updateContents(delta, Quill.sources.USER);
  this.quill.setSelection(range.index + added, Quill.sources.SILENT);
  Object.keys(formats).forEach((name) => {
    if (lineFormats[name] == null) {
      this.quill.format(name, formats[name]);
    }
  });
  this.quill.selection.scrollIntoView();
  return false;
}

function makeDeleteHanlder(isBackspace) {
  return function(range) {
    if (range.length > 0) {
      this.quill.deleteText(range, Quill.sources.USER);
    } else if (!isBackspace) {
      this.quill.deleteText(range.index, 1, Quill.sources.USER);
    } else {
      let [line, offset] = this.quill.scroll.descendant(Block, range.index);
      let formats = this.quill.getFormat(range);
      if (line != null && offset === 0 && (formats['indent'] || formats['list'])) {
        if (formats['indent'] != null) {
          line.format('indent', parseInt(formats['indent']) - 1, Quill.sources.USER);
        } else {
          line.format('list', false);
        }
      } else {
        this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
        range = new Range(Math.max(0, range.index - 1));
      }
    }
    this.quill.setSelection(range.index, Quill.sources.SILENT);
  }
}

function makeFormatHandler(format, value) {
  let key = { key: format[0].toUpperCase(), metaKey: true };
  let context = {
    format: { [format]: !value }
  };
  let handler = function(range) {
    this.quill.format(format, value, Quill.sources.USER);
    return false;
  };
  return [key, context, handler];
}

function makeIndentHanlder(indent) {
  let handler = function(range) {
    let modifier = indent ? 1 : -1;
    this.quill.scroll.descendants(Block, range.index, range.length).forEach(function(line) {
      let format = line.formats();
      let level = parseInt(format['indent'] || 0);
      line.format('indent', Math.max(0, level + modifier));
    });
    this.quill.update(Quill.sources.USER);
    this.quill.setSelection(range, Quill.sources.SILENT);
    return false;
  };
  return [{ key: Keyboard.keys.TAB, shiftKey: !indent }, { collapsed: false }, handler];
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
