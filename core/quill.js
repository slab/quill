import Delta from 'rich-text/lib/delta';
import Editor from './editor';
import Emitter from './emitter';
import Module from './module';
import Parchment from 'parchment';
import Selection, { Range } from './selection';
import extend from 'extend';
import logger from './logger';
import Theme from './theme';

let debug = logger('[quill]');


class Quill {
  static debug(limit) {
    logger.level(limit);
  }

  static getModule(name) {
    return Theme.modules[name];
  }

  static import(name) {
    switch(name) {
      case 'delta': return Delta;
      case 'module': return Module;
      case 'parchment': return Parchment;
      case 'theme': return Theme;
      default: return undefined;
    }
  }

  static register(...args) {
    if (typeof args[0] === 'string') {
      let [name, target] = args;
      if (target.prototype instanceof Theme) {
        if (Theme.themes[name] != null) debug.warn(`overwriting ${name} theme`);
        Theme.themes[name] = target;
      } else {
        if (Theme.modules[name] != null) debug.warn(`overwriting ${name} module`);
        Theme.modules[name] = target;
      }
    } else {
      args.forEach(function(format) {
        let name = format.attrName || format.blotName;
        if (Parchment.query(name)) debug.warn(`Overwriting ${name} format`);
        Parchment.register(format);
      });
    }
  }

  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (this.container == null) {
      return debug.error('Invalid Quill container', container);
    }
    let themeClass = Theme.themes[options.theme || Quill.DEFAULTS.theme];
    if (themeClass == null) {
      return debug.error(`Cannot load ${options.theme} theme. It may not be registered. Loading default theme.`);
    }
    options = extend(true, {}, Quill.DEFAULTS, themeClass.DEFAULTS, options);
    let html = this.container.innerHTML.trim();
    this.container.classList.add('ql-container');
    this.container.innerHTML = '';
    this.root = this.addContainer('ql-editor');
    if (options.placeholder) {
      this.root.setAttribute('data-placeholder', options.placeholder);
    }
    this.emitter = new Emitter();
    this.scroll = Parchment.create(this.root, {
      emitter: this.emitter,
      whitelist: options.formats
    });
    this.editor = new Editor(this.scroll, this.emitter);
    this.selection = new Selection(this.scroll, this.emitter);
    this.theme = new themeClass(this, options);
    this.keyboard = this.theme.addModule('keyboard');
    this.clipboard = this.theme.addModule('clipboard');
    this.undoManager = this.theme.addModule('undo-manager');
    let contents = this.clipboard.convert(`<div class='ql-editor'>${html}</div>`);
    this.setContents(contents);
    this.undoManager.clear();
    if (options.readOnly) {
      this.disable();
    }
    this.emitter.emit(Emitter.events.READY);
    this.root.classList.toggle('ql-empty', this.getLength() <= 1);
    this.emitter.on(Emitter.events.TEXT_CHANGE, (delta) => {
      this.root.classList.toggle('ql-empty', this.getLength() <= 1);
    });
  }

  addContainer(container, refNode = null) {
    if (typeof container === 'string') {
      let className = container;
      container = document.createElement('div');
      container.classList.add(className);
    }
    this.container.insertBefore(container, refNode);
    return container;
  }

  deleteText(index, length, source = Emitter.sources.API) {
    [index, length, , source] = overload(index, length, source);
    this.editor.deleteText(index, length, source);
  }

  disable() {
    this.editor.enable(false);
  }

  enable(enabled = true) {
    this.editor.enable(enabled);
  }

  focus() {
    this.selection.focus();
  }

  format(name, value, source = Emitter.sources.API) {
    let range = this.getSelection();
    if (range == null) return;
    if (Parchment.query(name, Parchment.Scope.BLOCK)) {
      this.formatLine(range, name, value, source);
    } else if (range.length === 0) {
      return this.selection.format(name, value);
    } else {
      this.formatText(range, name, value, source);
    }
    this.setSelection(range, Emitter.sources.SILENT);
  }

  formatLine(index, length, name, value, source) {
    let formats;
    [index, length, formats, source] = overload(index, length, name, value, source);
    this.editor.formatLine(index, length, formats, source);
  }

  formatText(index, length, name, value, source) {
    let formats;
    [index, length, formats, source] = overload(index, length, name, value, source);
    this.editor.formatText(index, length, formats, source);
  }

  getBounds(index, length = 0) {
    if (typeof index === 'number') {
      return this.selection.getBounds(index, length);
    } else {
      return this.selection.getBounds(index.index, index.length);
    }
  }

  getContents(index = 0, length = this.getLength() - index) {
    [index, length] = overload(index, length);
    return this.editor.getContents(index, length);
  }

  getFormat(index = this.getSelection(), length = 0) {
    if (typeof index === 'number') {
      return this.editor.getFormat(index, length);
    } else {
      return this.editor.getFormat(index.index, index.length);
    }
  }

  getLength() {
    return this.scroll.length();
  }

  getModule(name) {
    return this.theme.modules[name];
  }

  getSelection(focus = false) {
    if (focus) this.focus();
    this.update();  // Make sure we access getRange with editor in consistent state
    return this.selection.getRange()[0];
  }

  getText(index = 0, length = this.getLength() - index) {
    [index, length] = overload(index, length);
    return this.editor.getText(index, length);
  }

  hasFocus() {
    return this.selection.hasFocus();
  }

  insertEmbed(index, embed, value, source) {
    this.editor.insertEmbed(index, embed, value, source);
  }

  insertText(index, text, name, value, source) {
    let formats;
    [index, , formats, source] = overload(index, 0, name, value, source);
    this.editor.insertText(index, text, formats, source);
  }

  off() {
    return this.emitter.off.apply(this.emitter, arguments);
  }

  on() {
    return this.emitter.on.apply(this.emitter, arguments);
  }

  once() {
    return this.emitter.once.apply(this.emitter, arguments);
  }

  removeFormat(index, length, source) {
    [index, length, , source] = overload(index, length, source);
    this.editor.removeFormat(index, length, source);
  }

  setContents(delta, source = Emitter.sources.API) {
    delta = new Delta(delta).slice();
    let lastOp = delta.ops[delta.ops.length - 1];
    // Quill contents must always end with newline
    if (lastOp == null || lastOp.insert[lastOp.insert.length-1] !== '\n') {
      delta.insert('\n');
    }
    delta.delete(this.getLength());
    this.editor.applyDelta(delta);
  }

  setSelection(index, length = 0, source = Emitter.sources.API) {
    [index, length, , source] = overload(index, length, source);
    this.selection.setRange(new Range(index, length), source);
  }

  setText(text, source = Emitter.sources.API) {
    let delta = new Delta().insert(text);
    this.setContents(delta, source);
  }

  update(source = Emitter.sources.USER) {
    this.scroll.update();       // Will update selection before selection.update() does if text changes
    this.selection.update(source);
  }

  updateContents(delta, source = Emitter.sources.API) {
    if (Array.isArray(delta)) {
      delta = new Delta(delta.slice());
    }
    this.editor.applyDelta(delta, source);
  }
}
Quill.DEFAULTS = {
  formats: null,
  modules: {},
  readOnly: false,
  theme: 'default'
};
Quill.events = Emitter.events;
Quill.sources = Emitter.sources;
Quill.version = QUILL_VERSION;


function overload(index, length, name, value, source) {
  let formats = {};
  if (typeof index.index === 'number' && typeof index.length === 'number') {
    // Allow for throwaway end (used by insertText/insertEmbed)
    if (typeof length !== 'number') {
      source = value, value = name, name = length, length = index.length, index = index.index;
    } else {
      length = index.length, index = index.index;
    }
  } else if (typeof length !== 'number') {
    source = value, value = name, name = length, length = 0;
  }
  // Handle format being object, two format name/value strings or excluded
  if (typeof name === 'object') {
    formats = name;
    source = value;
  } else if (typeof name === 'string') {
    if (value != null) {
      formats[name] = value;
    } else {
      source = name;
    }
  }
  // Handle optional source
  source = source || Emitter.sources.API;
  return [index, length, formats, source];
}


export { overload, Quill as default };
