import clone from 'clone';
import equal from 'deep-equal';
import extend from 'extend';
import Delta from 'quill-delta';
import DeltaOp from 'quill-delta/lib/op';
import Parchment from 'parchment';
import Embed from '../blots/embed';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';

let debug = logger('quill:keyboard');

const SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';


class Keyboard extends Module {
  static match(evt, binding) {
    binding = normalize(binding);
    if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function(key) {
      return (!!binding[key] !== evt[key] && binding[key] !== null);
    })) {
      return false;
    }
    return binding.key === (evt.which || evt.keyCode);
  }

  constructor(quill, options) {
    super(quill, options);
    this.bindings = {};
    Object.keys(this.options.bindings).forEach((name) => {
      if (name === 'list autofill' &&
          quill.scroll.whitelist != null &&
          !quill.scroll.whitelist['list']) {
        return;
      }
      if (this.options.bindings[name]) {
        this.addBinding(this.options.bindings[name]);
      }
    });
    this.addBinding({ key: Keyboard.keys.ENTER, shiftKey: null }, handleEnter);
    this.addBinding({ key: Keyboard.keys.ENTER, metaKey: null, ctrlKey: null, altKey: null }, function() {});
    if (/Firefox/i.test(navigator.userAgent)) {
      // Need to handle delete and backspace for Firefox in the general case #1171
      this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true }, handleBackspace);
      this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true }, handleDelete);
    } else {
      this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: true, prefix: /^.?$/ }, handleBackspace);
      this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: true, suffix: /^.?$/ }, handleDelete);
    }
    this.addBinding({ key: Keyboard.keys.BACKSPACE }, { collapsed: false }, handleDeleteRange);
    this.addBinding({ key: Keyboard.keys.DELETE }, { collapsed: false }, handleDeleteRange);
    this.addBinding({ key: Keyboard.keys.BACKSPACE, altKey: null, ctrlKey: null, metaKey: null, shiftKey: null },
                    { collapsed: true, offset: 0 },
                    handleBackspace);
    this.listen();
  }

  addBinding(key, context = {}, handler = {}) {
    let binding = normalize(key);
    if (binding == null || binding.key == null) {
      return debug.warn('Attempted to add invalid keyboard binding', binding);
    }
    if (typeof context === 'function') {
      context = { handler: context };
    }
    if (typeof handler === 'function') {
      handler = { handler: handler };
    }
    binding = extend(binding, context, handler);
    this.bindings[binding.key] = this.bindings[binding.key] || [];
    this.bindings[binding.key].push(binding);
  }

  listen() {
    this.quill.root.addEventListener('keydown', (evt) => {
      if (evt.defaultPrevented) return;
      let which = evt.which || evt.keyCode;
      let bindings = (this.bindings[which] || []).filter(function(binding) {
        return Keyboard.match(evt, binding);
      });
      if (bindings.length === 0) return;
      let range = this.quill.getSelection();
      if (range == null || !this.quill.hasFocus()) return;
      let [line, offset] = this.quill.getLine(range.index);
      let [leafStart, offsetStart] = this.quill.getLeaf(range.index);
      let [leafEnd, offsetEnd] = range.length === 0 ? [leafStart, offsetStart] : this.quill.getLeaf(range.index + range.length);
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
      let prevented = bindings.some((binding) => {
        if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) return false;
        if (binding.empty != null && binding.empty !== curContext.empty) return false;
        if (binding.offset != null && binding.offset !== curContext.offset) return false;
        if (Array.isArray(binding.format)) {
          // any format is present
          if (binding.format.every(function(name) {
            return curContext.format[name] == null;
          })) {
            return false;
          }
        } else if (typeof binding.format === 'object') {
          // all formats must match
          if (!Object.keys(binding.format).every(function(name) {
            if (binding.format[name] === true) return curContext.format[name] != null;
            if (binding.format[name] === false) return curContext.format[name] == null;
            return equal(binding.format[name], curContext.format[name]);
          })) {
            return false;
          }
        }
        if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) return false;
        if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) return false;
        return binding.handler.call(this, range, curContext) !== true;
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
    'italic'    : makeFormatHandler('italic'),
    'underline' : makeFormatHandler('underline'),
    'indent': {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: Keyboard.keys.TAB,
      format: ['blockquote', 'indent', 'list'],
      handler: function(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '+1', Quill.sources.USER);
      }
    },
    'outdent': {
      key: Keyboard.keys.TAB,
      shiftKey: true,
      format: ['blockquote', 'indent', 'list'],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler: function(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '-1', Quill.sources.USER);
      }
    },
    'outdent backspace': {
      key: Keyboard.keys.BACKSPACE,
      collapsed: true,
      shiftKey: null,
      metaKey: null,
      ctrlKey: null,
      altKey: null,
      format: ['indent', 'list'],
      offset: 0,
      handler: function(range, context) {
        if (context.format.indent != null) {
          this.quill.format('indent', '-1', Quill.sources.USER);
        } else if (context.format.list != null) {
          this.quill.format('list', false, Quill.sources.USER);
        }
      }
    },
    'indent code-block': makeCodeBlockHandler(true),
    'outdent code-block': makeCodeBlockHandler(false),
    'remove tab': {
      key: Keyboard.keys.TAB,
      shiftKey: true,
      collapsed: true,
      prefix: /\t$/,
      handler: function(range) {
        this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
      }
    },
    'tab': {
      key: Keyboard.keys.TAB,
      handler: function(range) {
        this.quill.history.cutoff();
        let delta = new Delta().retain(range.index)
                               .delete(range.length)
                               .insert('\t');
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
      }
    },
    'list empty enter': {
      key: Keyboard.keys.ENTER,
      collapsed: true,
      format: ['list'],
      empty: true,
      handler: function(range, context) {
        this.quill.format('list', false, Quill.sources.USER);
        if (context.format.indent) {
          this.quill.format('indent', false, Quill.sources.USER);
        }
      }
    },
    'checklist enter': {
      key: Keyboard.keys.ENTER,
      collapsed: true,
      format: { list: 'checked' },
      handler: function(range) {
        let [line, offset] = this.quill.getLine(range.index);
        let delta = new Delta().retain(range.index)
                               .insert('\n', { list: 'checked' })
                               .retain(line.length() - offset - 1)
                               .retain(1, { list: 'unchecked' });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollIntoView();
      }
    },
    'header enter': {
      key: Keyboard.keys.ENTER,
      collapsed: true,
      format: ['header'],
      suffix: /^$/,
      handler: function(range, context) {
        let [line, offset] = this.quill.getLine(range.index);
        let delta = new Delta().retain(range.index)
                               .insert('\n', context.format)
                               .retain(line.length() - offset - 1)
                               .retain(1, { header: null });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollIntoView();
      }
    },
    'list autofill': {
      key: ' ',
      collapsed: true,
      format: { list: false },
      prefix: /^\s*?(1\.|-|\[ ?\]|\[x\])$/,
      handler: function(range, context) {
        let length = context.prefix.length;
        let value;
        switch (context.prefix.trim()) {
          case '[]': case '[ ]':
            value = 'unchecked';
            break;
          case '[x]':
            value = 'checked';
            break;
          case '-':
            value = 'bullet';
            break;
          default:
            value = 'ordered';
        }
        this.quill.insertText(range.index, ' ', Quill.sources.USER);
        this.quill.history.cutoff();
        let [line, offset] = this.quill.getLine(range.index + 1);
        let delta = new Delta().retain(range.index + 1 - offset)
                               .delete(length + 1)
                               .retain(line.length() - 1 - offset)
                               .retain(1, { list: value });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index - length, Quill.sources.SILENT);
      }
    },
    'code exit': {
      key: Keyboard.keys.ENTER,
      collapsed: true,
      format: ['code-block'],
      prefix: /\n\n$/,
      suffix: /^\s+$/,
      handler: function(range) {
        const [line, offset] = this.quill.getLine(range.index);
        const delta = new Delta()
          .retain(range.index + line.length() - offset - 2)
          .retain(1, { 'code-block': null })
          .delete(1);
        this.quill.updateContents(delta, Quill.sources.USER);
      }
    },
    'embed left': makeEmbedArrowHandler(Keyboard.keys.LEFT, false),
    'embed left shift': makeEmbedArrowHandler(Keyboard.keys.LEFT, true),
    'embed right': makeEmbedArrowHandler(Keyboard.keys.RIGHT, false),
    'embed right shift': makeEmbedArrowHandler(Keyboard.keys.RIGHT, true)
  }
};

function makeEmbedArrowHandler(key, shiftKey) {
  const where = key === Keyboard.keys.LEFT ? 'prefix' : 'suffix';
  return {
    key,
    shiftKey,
    [where]: /^$/,
    handler: function(range) {
      let index = range.index;
      if (key === Keyboard.keys.RIGHT) {
        index += (range.length + 1);
      }
      const [leaf, ] = this.quill.getLeaf(index);
      if (!(leaf instanceof Embed)) return true;
      if (key === Keyboard.keys.LEFT) {
        if (shiftKey) {
          this.quill.setSelection(range.index - 1, range.length + 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(range.index - 1, Quill.sources.USER);
        }
      } else {
        if (shiftKey) {
          this.quill.setSelection(range.index, range.length + 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(range.index + range.length + 1, Quill.sources.USER);
        }
      }
      return false;
    }
  };
}


function handleBackspace(range, context) {
  if (range.index === 0 || this.quill.getLength() <= 1) return;
  let [line, ] = this.quill.getLine(range.index);
  let formats = {};
  if (context.offset === 0) {
    let [prev, ] = this.quill.getLine(range.index - 1);
    if (prev != null && prev.length() > 1) {
      let curFormats = line.formats();
      let prevFormats = this.quill.getFormat(range.index-1, 1);
      formats = DeltaOp.attributes.diff(curFormats, prevFormats) || {};
    }
  }
  // Check for astral symbols
  let length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
  this.quill.deleteText(range.index-length, length, Quill.sources.USER);
  if (Object.keys(formats).length > 0) {
    this.quill.formatLine(range.index-length, length, formats, Quill.sources.USER);
  }
  this.quill.focus();
}

function handleDelete(range, context) {
  // Check for astral symbols
  let length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
  if (range.index >= this.quill.getLength() - length) return;
  let formats = {}, nextLength = 0;
  let [line, ] = this.quill.getLine(range.index);
  if (context.offset >= line.length() - 1) {
    let [next, ] = this.quill.getLine(range.index + 1);
    if (next) {
      let curFormats = line.formats();
      let nextFormats = this.quill.getFormat(range.index, 1);
      formats = DeltaOp.attributes.diff(curFormats, nextFormats) || {};
      nextLength = next.length();
    }
  }
  this.quill.deleteText(range.index, length, Quill.sources.USER);
  if (Object.keys(formats).length > 0) {
    this.quill.formatLine(range.index + nextLength - 1, length, formats, Quill.sources.USER);
  }
}

function handleDeleteRange(range) {
  let lines = this.quill.getLines(range);
  let formats = {};
  if (lines.length > 1) {
    let firstFormats = lines[0].formats();
    let lastFormats = lines[lines.length - 1].formats();
    formats = DeltaOp.attributes.diff(lastFormats, firstFormats) || {};
  }
  this.quill.deleteText(range, Quill.sources.USER);
  if (Object.keys(formats).length > 0) {
    this.quill.formatLine(range.index, 1, formats, Quill.sources.USER);
  }
  this.quill.setSelection(range.index, Quill.sources.SILENT);
  this.quill.focus();
}

function handleEnter(range, context) {
  if (range.length > 0) {
    this.quill.scroll.deleteAt(range.index, range.length);  // So we do not trigger text-change
  }
  let lineFormats = Object.keys(context.format).reduce(function(lineFormats, format) {
    if (Parchment.query(format, Parchment.Scope.BLOCK) && !Array.isArray(context.format[format])) {
      lineFormats[format] = context.format[format];
    }
    return lineFormats;
  }, {});
  this.quill.insertText(range.index, '\n', lineFormats, Quill.sources.USER);
  // Earlier scroll.deleteAt might have messed up our selection,
  // so insertText's built in selection preservation is not reliable
  this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
  this.quill.focus();
  Object.keys(context.format).forEach((name) => {
    if (lineFormats[name] != null) return;
    if (Array.isArray(context.format[name])) return;
    if (name === 'link') return;
    this.quill.format(name, context.format[name], Quill.sources.USER);
  });
}

function makeCodeBlockHandler(indent) {
  return {
    key: Keyboard.keys.TAB,
    shiftKey: !indent,
    format: {'code-block': true },
    handler: function(range) {
      let CodeBlock = Parchment.query('code-block');
      let index = range.index, length = range.length;
      let [block, offset] = this.quill.scroll.descendant(CodeBlock, index);
      if (block == null) return;
      let scrollIndex = this.quill.getIndex(block);
      let start = block.newlineIndex(offset, true) + 1;
      let end = block.newlineIndex(scrollIndex + offset + length);
      let lines = block.domNode.textContent.slice(start, end).split('\n');
      offset = 0;
      lines.forEach((line, i) => {
        if (indent) {
          block.insertAt(start + offset, CodeBlock.TAB);
          offset += CodeBlock.TAB.length;
          if (i === 0) {
            index += CodeBlock.TAB.length;
          } else {
            length += CodeBlock.TAB.length;
          }
        } else if (line.startsWith(CodeBlock.TAB)) {
          block.deleteAt(start + offset, CodeBlock.TAB.length);
          offset -= CodeBlock.TAB.length;
          if (i === 0) {
            index -= CodeBlock.TAB.length;
          } else {
            length -= CodeBlock.TAB.length;
          }
        }
        offset += line.length + 1;
      });
      this.quill.update(Quill.sources.USER);
      this.quill.setSelection(index, length, Quill.sources.SILENT);
    }
  };
}

function makeFormatHandler(format) {
  return {
    key: format[0].toUpperCase(),
    shortKey: true,
    handler: function(range, context) {
      this.quill.format(format, !context.format[format], Quill.sources.USER);
    }
  };
}

function normalize(binding) {
  if (typeof binding === 'string' || typeof binding === 'number') {
    return normalize({ key: binding });
  }
  if (typeof binding === 'object') {
    binding = clone(binding, false);
  }
  if (typeof binding.key === 'string') {
    if (Keyboard.keys[binding.key.toUpperCase()] != null) {
      binding.key = Keyboard.keys[binding.key.toUpperCase()];
    } else if (binding.key.length === 1) {
      binding.key = binding.key.toUpperCase().charCodeAt(0);
    } else {
      return null;
    }
  }
  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }
  return binding;
}


export { Keyboard as default, SHORTKEY };
