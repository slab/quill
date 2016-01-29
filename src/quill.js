import Delta from './lib/delta';
import Editor from './editor';
import Emitter from './emitter';
import Keyboard from './keyboard';
import Parchment from 'parchment';
import Scroll from './scroll';
import Selection, { Range } from './selection';
import extend from 'extend';
import logger from './lib/logger';

import BaseTheme from './themes/base';
import SnowTheme from './themes/snow';

import CodeBlock from './formats/code-block';
import Equation from './formats/equation';
import Mention from './formats/mention';
import Header from './formats/header';
import Image from './formats/image';
import List, { ListItem } from './formats/list';
import Table, { TableSection, TableRow, TableCell } from './formats/table';
import { Bold, Italic, Strike, Underline, Link, Code, Script } from './formats/inline';
import { Align, Direction, Indent, Background, Color, Font, Size } from './formats/attributor';

import Cursor from './blots/cursor';
import Block from './blots/block';
import Inline from './blots/inline';
import Break from './blots/break';


[ CodeBlock, Header,
  Image, Equation, Mention,
  List, ListItem, Table, TableSection, TableRow, TableCell,
  Bold, Italic, Strike, Underline, Link, Code, Script,
  Align, Direction, Indent, Background, Color, Font, Size,
  Cursor,
  Scroll, Block, Inline, Break, Parchment.Text
].forEach(Parchment.register);

let debug = logger('quill');


class Quill {
  static debug(limit) {
    logger.level(limit);
  }

  static import(name) {
    switch (name) {
      case 'delta'      : return Delta;
      case 'parchment'  : return Parchment;
      case 'range'      : return Range;
      default           : return null;
    }
  }

  static registerFormat(format) {
    let name = format.blotName || format.attrName;
    if (Parchment.query(name)) {
      debug.warn(`Overwriting ${name} format`);
    }
    Parchment.register(format);
  }

  static registerModule(name, module) {
    if (Quill.modules[name] != null) {
      debug.warn(`Overwriting ${name} module`);
    }
    Quill.modules[name] = module;
  }

  static registerTheme(name, theme) {
    if (Quill.themes[name] != null) {
      debug.warn(`Overwriting ${name} theme`);
    }
    Quill.themes[name] = theme;
  }

  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (this.container == null) {
      return debug.error('Invalid Quill container', container);
    }
    let moduleOptions = extend({}, Quill.DEFAULTS.modules, options.modules);
    let html = this.container.innerHTML;
    this.container.innerHTML = '';
    this.options = extend({}, Quill.DEFAULTS, options);
    this.options.modules = moduleOptions;
    this.modules = {};
    // TODO scroll will reset innerHTML as well, do not do twice
    this.root = this.addContainer('ql-editor');
    this.root.innerHTML = html.trim();
    this.emitter = new Emitter();
    this.scroll = Parchment.create(this.root, this.emitter);
    this.editor = new Editor(this.scroll, this.emitter);
    this.selection = new Selection(this.scroll, this.emitter);
    this.keyboard = new Keyboard(this);
    let themeClass = Quill.themes[this.options.theme || 'base'];
    if (themeClass == null) {
      debug.error(`Cannot load ${this.options.theme} theme. It may not be registered. Loading default theme.`);
      themeClass = Quill.themes['base'];
    }
    this.theme = new themeClass(this, this.options);
    Object.keys(this.options.modules).forEach((name) => {
      this.addModule(name, this.options.modules[name]);
    });
    if (this.options.readOnly) {
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

  addListener() {
    return this.emitter.addListener.apply(this.emitter, arguments);
  }

  addModule(name, options = {}) {
    let moduleClass = Quill.modules[name];
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
    this.emitter.emit(Emitter.events.MODULE_INIT, name, this.modules[name]);
    return this.modules[name];
  }

  deleteText(start, end, source = Quill.sources.API) {
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

  onModuleLoad(name, callback) {
    if (this.modules[name]) {   // Module already loaded
      callback(this.modules[name]);
    }
    this.on(Emitter.events.MODULE_INIT, function(moduleName, module) {
      if (moduleName === name) {
        return callback(module);
      }
    });
  }

  removeAllListeners() {
    return this.emitter.removeAllListeners.apply(this.emitter, arguments);
  }

  removeListener() {
    return this.emitter.removeListener.apply(this.emitter, arguments);
  }

  setContents(delta, source = Quill.sources.API) {
    if (Array.isArray(delta)) {
      delta = new Delta(delta.slice());
    } else {
      delta = delta.slice();
    }
    delta.delete(this.getLength());
    this.editor.applyDelta(delta);
  }

  setSelection(start, end = start, source = Quill.sources.API) {
    [start, end, , source] = this._buildParams(start, end, source);
    this.selection.setRange(new Range(start, end), source);
  }

  setText(text, source = Quill.sources.API) {
    let delta = new Delta().insert(text);
    this.setContents(delta, source);
  }

  update(source = Quill.sources.USER) {
    this.scroll.update(source);       // Will update selection before selection.update() does if text changes
    this.selection.update(source);
  }

  updateContents(delta, source = Quill.sources.API) {
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
    source = source || Quill.sources.API;
    return [start, end, formats, source];
  }
}


Quill.version = QUILL_VERSION;
Quill.modules = {};
Quill.themes = {};

Quill.DEFAULTS = {
  formats: [
    'align', 'direction',
    'code-block', 'header', 'list',
    'bold', 'code', 'italic', 'script', 'strike', 'underline',
    'link',
    'background', 'color', 'font', 'size',
    'image', 'equation'
  ],
  modules: {
    'paste-manager': true,
    'undo-manager': true
  },
  readOnly: false,
  theme: 'base'
};
Quill.events = Emitter.events;
Quill.sources = Emitter.sources;


Quill.registerTheme('base', BaseTheme);
Quill.registerTheme('snow', SnowTheme);


export default Quill;
