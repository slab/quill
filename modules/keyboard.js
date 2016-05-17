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

const SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';


class Keyboard extends Module {
  static match(evt, binding) {
    binding = normalize(binding);
    if (!!binding.shortKey !== evt[SHORTKEY] && binding.shortKey !== null) return false;
    if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function(key) {
      return (key != SHORTKEY && !!binding[key] !== evt[key] && binding[key] !== null);
    })) {
      return false;
    }
    return binding.key === (evt.which || evt.keyCode);
  }

  constructor(quill, options) {
    super(quill, options);
    this.options.bindings = extend({}, Keyboard.DEFAULTS.bindings, options.bindings);
    this.bindings = {};
    Object.keys(this.options.bindings).forEach((name) => {
      if (this.options.bindings[name]) {
        let [key, context, handler] = this.options.bindings[name];
        this.addBinding(key, context, handler);
      }
    });
    this.addBinding({ key: Keyboard.keys.ENTER, shiftKey: null }, handleEnter);
    this.addBinding({ key: Keyboard.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function() {});
    this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true, prefix: /^$/ }, function(range) {
      if (range.index === 0) return;
      this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
      this.quill.setSelection(range.index - 1, Quill.sources.SILENT);
      this.quill.selection.scrollIntoView();
    });
    this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true, suffix: /^$/ }, function(range) {
      if (range.index >= this.quill.getLength() - 1) return;
      this.quill.deleteText(range.index, 1, Quill.sources.USER);
      this.quill.setSelection(range.index, Quill.sources.SILENT);
    });
    this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: false }, handleDelete);
    this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: false }, handleDelete);
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
      let [line, offset] = this.quill.scroll.line(range.index);
      let [leafStart, offsetStart] = this.quill.scroll.leaf(range.index);
      let [leafEnd, offsetEnd] = range.length === 0 ? [leafStart, offsetStart] : this.quill.scroll.leaf(range.index + range.length);
      let prefixText = leafStart instanceof Parchment.Text ? leafStart.value().slice(0, offsetStart) : '';
      let suffixText = leafEnd instanceof Parchment.Text ? leafEnd.value().slice(offsetEnd) : '';
      let curContext = {
        collapsed: range.length === 0,
        empty: range.length === 0 && line.length() <= 1,
        format: this.quill.getFormat(range),
        offset: offset,
        prefix: prefixText,
        suffix: suffixText
      };
      let prevented = bindings.some((tuple) => {
        let [key, context, handler] = tuple;
        if (context.collapsed != null && context.collapsed !== curContext.collapsed) return false;
        if (context.empty != null && context.empty !== curContext.empty) return false;
        if (context.offset != null && context.offset !== curContext.offset) return false;
        if (Array.isArray(context.format)) {
          // any format is present
          if (context.format.every(function(name) {
            return curContext.format[name] == null;
          })) {
            return false;
          }
        } else if (typeof context.format === 'object') {
          // all formats must match
          if (!Object.keys(context.format).every(function(name) {
            if (context.format[name] === true) return curContext.format[name] != null;
            if (context.format[name] === false) return curContext.format[name] == null;
            return equal(context.format[name], curContext.format[name]);
          })) {
            return false;
          }
        }
        if (context.prefix != null && !context.prefix.test(curContext.prefix)) return false;
        if (context.suffix != null && !context.suffix.test(curContext.suffix)) return false;
        return handler.call(this, range, curContext) !== true;
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
    'bold'      : makeFormatHandler('bold'),
    'italic'    : makeFormatHandler('italic', true),
    'underline' : makeFormatHandler('underline', true),
    'indent': [
      // highlight tab or tab at beginning of list, indent or blockquote
      { key: Keyboard.keys.TAB },
      { format: ['blockquote', 'indent', 'list'] },
      function(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '+1', Quill.sources.USER);
      }
    ],
    'outdent': [
      { key: Keyboard.keys.TAB, shiftKey: true },
      { format: ['blockquote', 'indent', 'list'] },
      // highlight tab or tab at beginning of list, indent or blockquote
      function(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '-1', Quill.sources.USER);
      }
    ],
    'outdent backspace': [
      { key: Keyboard.keys.BACKSPACE },
      { collapsed: true, format: ['blockquote', 'indent', 'list'], offset: 0 },
      function(range, context) {
        if (context.format.indent != null) {
          this.quill.format('indent', '-1', Quill.sources.USER);
        } else if (context.format.blockquote != null) {
          this.quill.format('blockquote', false, Quill.sources.USER);
        } else if (context.format.list != null) {
          this.quill.format('list', false, Quill.sources.USER);
        }
      }
    ],
    'indent code-block': makeCodeBlockHandler(true),
    'outdent code-block': makeCodeBlockHandler(false),
    'tab': [
      { key: Keyboard.keys.TAB, shiftKey: null },
      {},
      function(range, context) {
        if (!context.collapsed) {
          this.quill.scroll.deleteAt(range.index, range.length);
        }
        this.quill.insertText(range.index, '\t', Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
      }
    ],
    'list empty enter': [
      { key: Keyboard.keys.ENTER },
      { collapsed: true, format: ['list'], empty: true },
      function(range) {
        this.quill.format('list', false);
      }
    ],
    'header enter': [
      { key: Keyboard.keys.ENTER },
      { collapsed: true, format: ['header'], suffix: /^$/ },
      function(range) {
        this.quill.scroll.insertAt(range.index, '\n');
        this.quill.formatText(range.index + 1, 1, 'header', false, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.selection.scrollIntoView();
      }
    ],
    'list autofill': [
      { key: ' ' },
      { collapsed: true, format: { list: false }, prefix: /^(1\.|-)$/ },
      function(range, context) {
        let length = context.prefix.length;
        this.quill.scroll.deleteAt(range.index - length, length);
        this.quill.formatLine(range.index - length, 1, 'list', length === 1 ? 'bullet' : 'ordered', Quill.sources.USER);
        this.quill.setSelection(range.index - length, Quill.sources.SILENT);
      }
    ]
  }
};


function handleDelete(range) {
  this.quill.deleteText(range, Quill.sources.USER);
  this.quill.setSelection(range.index, Quill.sources.SILENT);
  this.quill.selection.scrollIntoView();
}

function handleEnter(range, context) {
  if (range.length > 0) {
    this.quill.scroll.deleteAt(range.index, range.length);  // So we do not trigger text-change
  }
  let lineFormats = Object.keys(context.format).reduce(function(lineFormats, format) {
    if (Parchment.query(format, Parchment.Scope.BLOCK) && !Array.isArray(format.context[format])) {
      lineFormats[format] = format.context[format];
    }
    return lineFormats;
  }, {});
  this.quill.insertText(range.index, '\n', lineFormats, Quill.sources.USER);
  this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
  this.quill.selection.scrollIntoView();
  Object.keys(context.format).forEach((name) => {
    if (lineFormats[name] == null && !Array.isArray(context.format[name])) {
      this.quill.format(name, context.format[name], Quill.sources.USER);
    }
  });
}

function makeCodeBlockHandler(indent) {
  let handler = function(range) {
    let tab = Parchment.query('code-block').TAB;
    let lines = this.quill.scroll.lines(range.index, range.length);
    let index = range.index, length = range.length;
    lines.forEach(function(line, i) {
      if (indent) {
        line.insertAt(0, tab);
        if (i === 0) {
          index += tab.length;
        } else {
          length += tab.length;
        }
      } else if (line.domNode.textContent.startsWith(tab)) {
        line.deleteAt(0, tab.length);
        if (i === 0) {
          index -= tab.length;
        } else {
          length -= tab.length;
        }
      }
    });
    this.quill.update(Quill.sources.USER);
    this.quill.setSelection(index, length, Quill.sources.SILENT);
  }
  return [{ key: Keyboard.keys.TAB, shiftKey: !indent }, { format: {'code-block': true } }, handler];
}

function makeFormatHandler(format) {
  let key = { key: format[0].toUpperCase(), shortKey: true };
  let handler = function(range, context) {
    this.quill.format(format, !context.format[format], Quill.sources.USER);
  };
  return [key, {}, handler];
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
