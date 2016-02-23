import Delta from 'rich-text/lib/delta';
import Editor from './editor';
import Emitter from './emitter';
import Parchment from 'parchment';
import Selection, { Range } from './selection';
import extend from 'extend';
import logger from './logger';
import Theme from './theme';

let debug = logger('[quill]');
let _modules = {};
let _themes = { base: Theme };
const REQUIRED_MODULES = ['keyboard', 'clipboard', 'undo-manager'];

class Quill {
  static debug(limit) {
    logger.level(limit);
  }

  static register(name, target) {
    if (typeof name === 'string') {
      if (target.prototype instanceof Theme) {
        if (_themes[name] != null) debug.warn(`overwriting ${name} theme`);
        _themes[name] = target;
      } else {
        if (_modules[name] != null) debug.warn(`overwriting ${name} module`);
        _modules[name] = target;
      }
    } else {
      let format = name;
      name = format.attrName || format.blotName;
      if (Parchment.query(name)) debug.warn(`Overwriting ${name} format`);
      Parchment.register(format);
    }
  }

  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (this.container == null) {
      return debug.error('Invalid Quill container', container);
    }
    let moduleOptions = extend({}, Quill.DEFAULTS.modules, options.modules);
    options = extend({}, Quill.DEFAULTS, options);
    options.modules = moduleOptions;
    let html = this.container.innerHTML;
    this.container.classList.add('ql-container');
    this.container.innerHTML = '';
    this.modules = {};
    // TODO scroll will reset innerHTML as well, do not do twice
    this.root = this.addContainer('ql-editor');
    this.root.innerHTML = html.trim();
    this.emitter = new Emitter();
    this.scroll = Parchment.create(this.root, this.emitter);
    this.editor = new Editor(this.scroll, this.emitter);
    this.selection = new Selection(this.scroll, this.emitter);
    let themeClass = _themes[options.theme];
    if (themeClass == null) {
      return debug.error(`Cannot load ${options.theme} theme. It may not be registered. Loading default theme.`);
    }
    this.theme = new themeClass(this, options);
    REQUIRED_MODULES.forEach((name) => {    // Required modules
      let camelCase = name.replace(/[-](\w|$)/g, function(_, next) {
        return next.toUpperCase();
      });
      this[camelCase] = this.addModule(name, options.modules[name]);
    });
    Object.keys(options.modules).forEach((name) => {
      if (REQUIRED_MODULES.indexOf(name) > -1) return;
      this.addModule(name, options.modules[name]);
    });
    if (options.readOnly) {
      this.disable();
    }
  }

  addContainer(className, refNode = null) {
    let container = document.createElement('div');
    container.classList.add(className);
    this.container.insertBefore(container, refNode);
    return container;
  }

  addModule(name, options = {}) {
    let moduleClass = _modules[name];
    if (moduleClass == null) {
      return debug.error(`Cannot load ${name} module. Are you sure you registered it?`);
    }
    if (options === true) {  // Allow addModule('module', true)
      options = {};
    } else if (typeof options === 'string' || options instanceof HTMLElement) {
      // Allow addModule('toolbar', '#toolbar');
      options = { container: options };
    }
    this.modules[name] = new moduleClass(this, options);
    this.emitter.emit(Emitter.events.MODULE_LOAD, name, this.modules[name]);
    return this.modules[name];
  }

  deleteText(index, length, source = Emitter.sources.API) {
    [index, length, , source] = overload(index, length, source);
    this.editor.deleteText(index, length);
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

  formatCursor(name, value, source = Emitter.sources.API) {
    let range = this.getSelection();
    if (range == null) return;
    if (Parchment.query(name, Parchment.Scope.BLOCK)) {
      this.formatLine(range, name, value, source);
    } else if (range.length === 0) {
      this.selection.format(name, value);
    } else {
      this.formatText(range, name, value, source);
    }
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

  getBounds(index) {
    return this.selection.getBounds(index);
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
    return this.modules[name];
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

  setContents(delta, source = Emitter.sources.API) {
    if (Array.isArray(delta)) {
      delta = new Delta(delta.slice());
    } else {
      delta = delta.slice();
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
    this.scroll.update(source);       // Will update selection before selection.update() does if text changes
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
  formats: [],
  modules: {},
  readOnly: false,
  theme: 'base'
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
