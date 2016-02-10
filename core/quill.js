import Delta from 'rich-text/lib/delta';
import Editor from './editor';
import Emitter from './emitter';
import Parchment from 'parchment';
import Scroll from '../blots/scroll';
import Selection, { Range } from './selection';
import extend from 'extend';
import logger from './logger';
import Keyboard from './keyboard';
import Clipboard from './clipboard';
import UndoManager from './undo-manager';
import Theme from './theme';

let debug = logger('[quill]');
let _modules = {};
let _themes = {
  base: Theme
};


class Quill {
  static debug(limit) {
    logger.level(limit);
  }

  static register(name, target) {
    if (typeof name === 'string') {
      if (target.constructor instanceof Theme) {
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
    this.keyboard = new Keyboard(this, options.modules['keyboard']);
    this.clipboard = new Clipboard(this, options.modules['clipboard']);
    this.undoManager = new UndoManager(this, options.modules['undo-manager']);
    Object.keys(options.modules).forEach((name) => {
      if (['clipboard', 'keybard', 'undo-manager'].indexOf(name) > -1) return;
      this.addModule(name, options.modules[name]);
    });
    if (options.readOnly) {
      this.disable();
    }
  }

  addContainer(className, before = false) {
    let refNode = before ? this.root : null;
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
    options = extend(moduleClass.DEFAULTS || {}, this.theme.constructor.OPTIONS[name], options);
    this.modules[name] = new moduleClass(this, options);
    this.emitter.emit(Emitter.events.MODULE_LOAD, name, this.modules[name]);
    return this.modules[name];
  }

  deleteText(start, end, source = Emitter.sources.API) {
    [start, end, , source] = this._buildParams(start, end, source);
    this.editor.deleteText(start, end);
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
    } else if (range.collapsed) {
      this.selection.format(name, value);
    } else {
      this.formatText(range, name, value, source);
    }
  }

  // TODO is this necessary given formatText
  formatLine(start, end, name, value, source) {
    let formats;
    [start, end, formats, source] = this._buildParams(start, end, name, value, source);
    this.editor.formatLine(start, end, formats, source);
  }

  formatText(start, end, name, value, source) {
    let formats;
    [start, end, formats, source] = this._buildParams(start, end, name, value, source);
    this.editor.formatText(start, end, formats, source);
  }

  getBounds(index) {
    return this.selection.getBounds(index);
  }

  getContents(start = 0, end = this.getLength()) {
    [start, end] = this._buildParams(start, end);
    return this.editor.getContents(start, end);
  }

  getFormat(start = this.getSelection(), end = start) {
    if (typeof start === 'number') {
      return this.editor.getFormat(start, end);
    } else {
      return this.editor.getFormat(start.start, start.end);
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

  getText(start = 0, end = this.getLength()) {
    [start, end] = this._buildParams(start, end);
    return this.editor.getText(start, end);
  }

  insertEmbed(index, embed, value, source) {
    let formats;
    [index, , formats, source] = this._buildParams(index, 0, source);
    this.editor.insertEmbed(index, embed, value, source);
  }

  insertText(index, text, name, value, source) {
    let formats;
    [index, , formats, source] = this._buildParams(index, 0, name, value, source);
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

  setSelection(start, end = start, source = Emitter.sources.API) {
    [start, end, , source] = this._buildParams(start, end, source);
    this.selection.setRange(new Range(start, end), source);
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


  _buildParams(start, end, name, value, source) {
    let formats = {};
    // Handle start/end being indexes, range or excluded (to get current selection)
    if (typeof start.start === 'number' && typeof start.end === 'number') {
      // Allow for throwaway end (used by insertText/insertEmbed)
      if (typeof end !== 'number') {
        source = value, value = name, name = end, end = start.end, start = start.start;
      } else {
        end = start.end, start = start.start;
      }
    } else if (typeof start !== 'number') {
      let range = this.getSelection(false) || new Range(0, 0);
      source = name, value = end, name = start, end = range.end, start = range.start;
    } else if (typeof end !== 'number') {
      source = value, value = name, name = end, end = start;
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
    return [start, end, formats, source];
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


export default Quill;
