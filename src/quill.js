import Delta from 'rich-text/lib/delta';
import Editor from './editor';
import EventEmitter from 'eventemitter3';
import Parchment from 'parchment';
import Selection from './selection';
import extend from 'extend';
import pkg from '../package.json';

import BaseTheme from './themes/base';
import SnowTheme from './themes/snow';

import BlockBlot from './blots/block';
import BreakBlot from './blots/break';
import CursorBlot from './blots/cursor';

import InlineFormat from './formats/inline';
import BlockFormat from './formats/block';
import ImageFormat from './formats/image';
import HeaderFormat from './formats/header';
import ListFormat from './formats/list';


class Quill extends EventEmitter {
  static registerFormat(format) {
    let name = format.blotName || formatAttrName;
    // TODO this is static cannot emit
    if (Parchment.match(name)) {
      this.emit(Quill.events.DEBUG, 'warning', "Overwriting " + name + " format");
    }
    Parchment.register(format);
  }

  static registerModule(name, module) {
    if (Quill.modules[name] != null) {
      this.emit(Quill.events.DEBUG, 'warning', "Overwriting " + name + " module");
    }
    Quill.modules[name] = module;
  }

  static registerTheme(name, theme) {
    if (Quill.themes[name] != null) {
      this.emit(Quill.events.DEBUG, 'warning', "Overwriting " + name + " theme");
    }
    Quill.themes[name] = theme;
  }

  static require(name) {
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
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (this.container == null) {
      throw new Error('Invalid Quill container');
    }
    moduleOptions = extend({}, Quill.DEFAULTS.modules || {}, options.modules);
    html = this.container.innerHTML;
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
    };
    this.selection.onUpdate = (range, source = Quill.sources.USER) => {
      this.emit(Quill.events.SELECTION_CHANGE, range, source);
    };
    if (this.options.theme === false) {
      this.theme = new Quill.themes.base(this, false);
    } else {
      let themeClass = Quill.themes[this.options.theme]
      if (themeClass != null) {
        this.theme = new themeClass(this, this.options);
      } else {
        throw new Error("Cannot load " + this.options.theme + " theme. Are you sure you registered it?");
      }
    }
    Object.keys(this.options.modules).forEach((name) => {
      this.addModule(name, this.options[name]);
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
    track.call(this, source, () => {
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

  formatLine(start, end, name, value, source = Quill.sources.API) {
    let formats;
    [start, end, formats, source] = buildParams(start, end, name, value, source);
    track.call(this, source, () => {
      Object.keys(formats).forEach((format) => {
        this.editor.getLines(start, end-start).forEach(function(lines) {
          line.format(format, formats[format]);
        });
      });
    });
  }

  formatText(start, end, name, value, source) {
    let formats;
    [start, end, formats, source] = buildParams(start, end, name, value, source);
    track.call(this, source, () => {
      Object.keys(formats).forEach(function(format) {
        this.editor.formatAt(start, end-start, format, formats[format]);
      });
    });
  }

  getBounds(index) {
    return this.selection.getBounds(index);
  }

  getContents(start = 0, end = null) {
    [start, end] = buildParams(start, end);
    return this.editor.getDelta().slice(start, end);
  }

  getHTML() {
    // TODO fix
    return this.root.innerHTML;
  }

  getLength() {
    return this.editor.getLength();
  }

  getModule() {
    return this.modules[name];
  }

  getSelection(focus = false) {
    if (focus) this.focus();
    this.update()   // Make sure we access getRange with editor in consistent state
    return this.selection.getRange();
  }

  getText(start = 0, end = null) {
    [start, end] = buildParams(start, end);
    let values = [].concat.apply([], this.editor.getValue());
    return values.map(function(value) {
      return typeof value === 'string' ? value : '';
    }).join('').slice(start, end);
  }

  insertEmbed(index, embed, value, source) {
    let formats;
    [index, , formats, source] = buildParams(index, 0, embed, value, source);
    track.call(this, source, () => {
      this.editor.insertEmbed(index, embed, value, source);
    });
  }

  insertText(index, text, name, value, source) {
    let formats;
    [index, , formats, source] = buildParams(index, 0, name, value, source);
    track.call(this, source, () => {
      this.editor.insertAt(index, text);
      Object.keys(formats).forEach(function(format) {
        this.editor.formatAt(start, text.length, format, formats[format]);
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
    track.call(this, source, () => {
      this.editor.deleteText(0, this.editor.getLength());
      this.editor.applyDelta(delta);
    });
  }

  setSelection(start, end, source = Quill.sources.API) {
    if (typeof start === 'number' && typeof end === 'number') {
      range = new Selection.Range(start, end);
    } else {
      range = start;
      source = end || source;
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
    track.call(this, source, () => {
      this.editor.applyDelta(delta);
    });
  }
}

Quill.version = pkg.version;
Quill.modules = {};
Quill.themes = {};

Quill.DEFAULTS = {
  formats: [
    'align', 'direction',
    'bullet', 'header', 'list',
    'bold', 'code', 'italic', 'script', 'strike', 'underline',
    'link',
    'background', 'color', 'font', 'size',
    'image'
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


// TODO fix
function buildParams() {
  let formats, params;
  params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  if (typeof params[0] === 'object') {
    params.splice(0, 1, params[0].start, params[0].end);
  }
  if (typeof params[2] === 'string') {
    formats = {};
    formats[params[2]] = params[3];
    params.splice(2, 2, formats);
  }
  if (params[3] == null) {
    params[3] = Quill.sources.API;
  }
  return params;
}

function track(source, callback) {
  this.update();
  callback.call(this);
  this.update(source);
}

function uniqueId(prefix) {
  this.counter = this.counter || 1;
  return prefix + (this.counter++);
}


Quill.registerTheme('base', BaseTheme);
Quill.registerTheme('snow', SnowTheme);


export { Quill as default };
