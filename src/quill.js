import Delta from './lib/delta';
import Editor from './editor';
import EventEmitter from 'eventemitter3';
import Parchment from 'parchment';
import Selection from './selection';
import extend from 'extend';

import BaseTheme from './themes/base';
import SnowTheme from './themes/snow';

import BlockBlot from './blots/block';
import BreakBlot from './blots/break';
import CursorBlot from './blots/cursor';

import CodeBlockFormat from './formats/code-block';
import EquationFormat from './formats/equation';
import HeaderFormat from './formats/header';
import ImageFormat from './formats/image';
import InlineFormat from './formats/inline';


let sharedEmitter = new EventEmitter();

class Quill extends EventEmitter {
  static registerFormat(format) {
    let name = format.blotName || format.attrName;
    if (Parchment.match(name)) {
      sharedEmitter.emit(Quill.events.DEBUG, 'warning', "Overwriting " + name + " format");
    }
    Parchment.register(format);
  }

  static registerModule(name, module) {
    if (Quill.modules[name] != null) {
      sharedEmitter.emit(Quill.events.DEBUG, 'warning', "Overwriting " + name + " module");
    }
    Quill.modules[name] = module;
  }

  static registerTheme(name, theme) {
    if (Quill.themes[name] != null) {
      sharedEmitter.emit(Quill.events.DEBUG, 'warning', "Overwriting " + name + " theme");
    }
    Quill.themes[name] = theme;
  }

  static import(name) {
    switch (name) {
      case 'delta':
        return Delta;
      case 'parchment':
        return Parchment;
      case 'range':
        return Selection.Range;
      default:
        return null;
    }
  }

  constructor(container, options = {}) {
    super();
    sharedEmitter.on(Quill.events.DEBUG, this.emit.bind(this, Quill.events.DEBUG));
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (this.container == null) {
      throw new Error('Invalid Quill container');
    }
    let moduleOptions = extend({}, Quill.DEFAULTS.modules, options.modules);
    let html = this.container.innerHTML;
    this.container.innerHTML = '';
    this.options = extend({}, Quill.DEFAULTS, options);
    this.options.modules = moduleOptions;
    this.options.id = uniqueId('ql-editor-');
    this.modules = {};
    this.root = this.addContainer('ql-editor');
    this.root.innerHTML = html.trim();
    this.root.setAttribute('id', this.options.id);
    this.editor = new Editor(this.root);
    this.selection = new Selection(this.editor);
    this.editor.onUpdate = (delta, source = Quill.sources.USER) => {
      this.emit(Quill.events.TEXT_CHANGE, delta, source);
      if (delta.length() > 0) {
        this.selection.update(Quill.sources.SILENT);
      }
    };
    this.selection.onUpdate = (range, source = Quill.sources.USER) => {
      if (source !== Quill.sources.SILENT) {
        let formats = range != null ? this.getFormat(range) : {};
        this.emit(Quill.events.SELECTION_CHANGE, range, formats, source);
      }
    };
    if (this.options.theme === false) {
      this.theme = new Quill.themes.base(this, false);
    } else {
      let themeClass = Quill.themes[this.options.theme];
      if (themeClass != null) {
        this.theme = new themeClass(this, this.options);
      } else {
        throw new Error("Cannot load " + this.options.theme + " theme. Are you sure you registered it?");
      }
    }
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

  addModule(name, options = {}) {
    let moduleClass = Quill.modules[name];
    if (moduleClass == null) {
      throw new Error("Cannot load " + name + " module. Are you sure you registered it?");
    }
    if (options === true) {  // Allow addModule('module', true)
      options = {};
    } else if (typeof options === 'string' || options instanceof HTMLElement) {
      // Allow addModule('toolbar', '#toolbar');
      options = { container: options };
    }
    options = extend(moduleClass.DEFAULTS || {}, this.theme.constructor.OPTIONS[name], options);
    this.modules[name] = new moduleClass(this, options);
    this.emit(Quill.events.MODULE_INIT, name, this.modules[name]);
    return this.modules[name];
  }

  deleteText(start, end, source = Quill.sources.API) {
    let formats;
    [start, end, formats, source] = this._buildParams(start, end, source);
    this._track(source, () => {
      this.editor.deleteAt(start, end - start);
    });
  }

  disable() {
    this.editor.enable(false);
  }

  enable() {
    this.editor.enable();
  }

  emit(eventName, ...rest) {
    super.emit(Quill.events.PRE_EVENT, eventName, ...rest);
    super.emit(eventName, ...rest);
    super.emit(Quill.events.POST_EVENT, eventName, ...rest);
  }

  focus() {
    this.selection.focus();
  }

  formatLine(start, end, name, value, source) {
    let formats;
    [start, end, formats, source] = this._buildParams(start, end, name, value, source);
    this._track(source, () => {
      Object.keys(formats).forEach((format) => {
        this.editor.getLines(start, end-start).forEach(function(line) {
          line.format(format, formats[format]);
        });
      });
    });
  }

  formatText(start, end, name, value, source) {
    let formats;
    [start, end, formats, source] = this._buildParams(start, end, name, value, source);
    this._track(source, () => {
      Object.keys(formats).forEach((format) => {
        this.editor.formatAt(start, end-start, format, formats[format]);
      });
    });
  }

  getBounds(index) {
    return this.selection.getBounds(index);
  }

  getContents(start = 0, end = this.getLength()) {
    [start, end] = this._buildParams(start, end);
    return this.editor.getDelta().slice(start, end);
  }

  getFormat(start, end) {
    [start, end] = this._buildParams(start, end);
    return this.selection.getFormat(new Selection.Range(start, end));
  }

  getHTML() {
    return this.getContents().toHTML();
  }

  getLength() {
    return this.editor.getLength();
  }

  getModule(name) {
    return this.modules[name];
  }

  getSelection(focus = false) {
    if (focus) this.focus();
    this.update();  // Make sure we access getRange with editor in consistent state
    return this.selection.getRange();
  }

  getText(start = 0, end = this.getLength()) {
    [start, end] = this._buildParams(start, end);
    let values = [].concat.apply([], this.editor.getValue());
    return values.map(function(value) {
      return typeof value === 'string' ? value : '';
    }).join('').slice(start, end);
  }

  insertEmbed(index, embed, value, source) {
    let formats;
    [index, , formats, source] = this._buildParams(index, 0, source);
    this._track(source, () => {
      this.editor.insertAt(index, embed, value, source);
    });
  }

  insertText(index, text, name, value, source) {
    let formats;
    [index, , formats, source] = this._buildParams(index, 0, name, value, source);
    this._track(source, () => {
      this.editor.insertAt(index, text);
      Object.keys(formats).forEach((format) => {
        this.editor.formatAt(index, text.length, format, formats[format]);
      });
    });
  }

  onModuleLoad(name, callback) {
    if (this.modules[name]) {   // Module already loaded
      callback(this.modules[name]);
    }
    this.on(Quill.events.MODULE_INIT, function(moduleName, module) {
      if (moduleName === name) {
        return callback(module);
      }
    });
  }

  prepareFormat(name, value) {
    this.selection.prepare(name, value);
  }

  setContents(delta, source = Quill.sources.API) {
    if (Array.isArray(delta)) {
      delta = new Delta(delta.slice());
    } else {
      delta = delta.slice();
    }
    this._track(source, () => {
      delta.delete(this.editor.getLength());
      this.editor.applyDelta(delta);
    });
  }

  setSelection(start, end = start, source = Quill.sources.API) {
    let range;
    if (typeof end === 'string') {
      source = end, end = start;
    }
    if (typeof start === 'number' && typeof end === 'number') {
      range = new Selection.Range(start, end);
    } else {
      range = start;
    }
    this.selection.setRange(range, source);
  }

  setText(text, source = Quill.sources.API) {
    let delta = new Delta().insert(text);
    this.setContents(delta, source);
  }

  update(source = Quill.sources.USER) {
    let delta = this.editor.update(source);
    if (delta.length() > 0) {
      source = Quill.sources.SILENT;
    }
    this.selection.update(source);
  }

  updateContents(delta, source = Quill.sources.API) {
    if (Array.isArray(delta)) {
      delta = new Delta(delta.slice());
    }
    this._track(source, () => {
      this.editor.applyDelta(delta);
    });
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

  _track(source, callback) {
    this.update();
    callback.call(this);
    this.update(source);
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
    'keyboard': true,
    'paste-manager': true,
    'undo-manager': true
  },
  readOnly: false,
  theme: 'base'
};
Quill.events = {
  DEBUG             : 'debug',
  FORMAT_INIT       : 'format-init',
  MODULE_INIT       : 'module-init',
  POST_EVENT        : 'post-event',
  PRE_EVENT         : 'pre-event',
  SELECTION_CHANGE  : 'selection-change',
  TEXT_CHANGE       : 'text-change'
};
Quill.sources = {
  API    : 'api',
  SILENT : 'silent',
  USER   : 'user'
};


function uniqueId(prefix) {
  uniqueId.counter = uniqueId.counter || 1;
  return prefix + (uniqueId.counter++);
}


Quill.registerTheme('base', BaseTheme);
Quill.registerTheme('snow', SnowTheme);


export { Quill as default };
