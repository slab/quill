import './polyfill';
import Delta from 'rich-text/lib/delta';
import Editor from './editor';
import Emitter from './emitter';
import Module from './module';
import Parchment from 'parchment';
import Selection, { Range } from './selection';
import extend from 'extend';
import logger from './logger';
import Theme from './theme';

let debug = logger('quill');


class Quill {
  static debug(limit) {
    logger.level(limit);
  }

  static import(name) {
    if (this.imports[name] == null) {
      debug.error(`Cannot import ${name}. Are you sure it was registered?`);
    }
    return this.imports[name];
  }

  static register(path, target, overwrite = false) {
    if (typeof path !== 'string') {
      let name = path.attrName || path.blotName;
      if (typeof name === 'string') {
        // register(Blot | Attributor, overwrite)
        this.register('formats/' + name, path, target);
      } else {
        Object.keys(path).forEach((key) => {
          this.register(key, path[key], target);
        });
      }
    } else {
      if (this.imports[path] != null && !overwrite) {
        debug.warn(`Overwriting ${path} with`, target);
      }
      this.imports[path] = target;
      if ((path.startsWith('blots/') || path.startsWith('formats/')) &&
          target.blotName !== 'abstract') {
        Parchment.register(target);
      }
    }
  }

  constructor(container, options = {}) {
    options = expandConfig(container, options);
    this.container = options.container;
    if (this.container == null) {
      return debug.error('Invalid Quill container', container);
    }
    if (options.debug) {
      Quill.debug(options.debug);
    }
    let html = this.container.innerHTML.trim();
    this.container.classList.add('ql-container');
    this.container.innerHTML = '';
    this.root = this.addContainer('ql-editor');
    this.emitter = new Emitter();
    this.scroll = Parchment.create(this.root, {
      emitter: this.emitter,
      whitelist: options.formats
    });
    this.editor = new Editor(this.scroll, this.emitter);
    this.selection = new Selection(this.scroll, this.emitter);
    this.theme = new options.theme(this, options);
    this.keyboard = this.theme.addModule('keyboard');
    this.clipboard = this.theme.addModule('clipboard');
    this.history = this.theme.addModule('history');
    this.theme.init();
    this.pasteHTML(`<div class='ql-editor' style="white-space: normal;">${html}<p><br></p></div>`);
    this.history.clear();
    if (options.readOnly) {
      this.disable();
    }
    if (options.placeholder) {
      this.root.setAttribute('data-placeholder', options.placeholder);
    }
    this.root.classList.toggle('ql-blank', this.editor.isBlank());
    this.emitter.on(Emitter.events.TEXT_CHANGE, (delta) => {
      this.root.classList.toggle('ql-blank', this.editor.isBlank());
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

  blur() {
    this.selection.setRange(null);
  }

  deleteText(index, length, source) {
    [index, length, , source] = overload(index, length, source);
    let range = this.getSelection();
    let change = this.editor.deleteText(index, length, source);
    range = shiftRange(range, index, -1*length, source);
    this.setSelection(range, Emitter.sources.SILENT);
    return change;
  }

  disable() {
    this.enable(false);
  }

  enable(enabled = true) {
    this.editor.enable(enabled);
    if (!enabled) {
      this.blur();
    }
  }

  focus() {
    this.selection.focus();
    this.selection.scrollIntoView();
  }

  format(name, value, source = Emitter.sources.API) {
    let range = this.getSelection(true);
    let change = new Delta();
    if (range == null) return change;
    if (Parchment.query(name, Parchment.Scope.BLOCK)) {
      change = this.formatLine(range, name, value, source);
    } else if (range.length === 0) {
      this.selection.format(name, value);
      return change;
    } else {
      change = this.formatText(range, name, value, source);
    }
    this.setSelection(range, Emitter.sources.SILENT);
    return change;
  }

  formatLine(index, length, name, value, source) {
    let formats;
    [index, length, formats, source] = overload(index, length, name, value, source);
    let range = this.getSelection();
    let change = this.editor.formatLine(index, length, formats, source);
    this.selection.setRange(range, true, Emitter.sources.SILENT);
    this.selection.scrollIntoView();
    return change;
  }

  formatText(index, length, name, value, source) {
    let formats;
    [index, length, formats, source] = overload(index, length, name, value, source);
    let range = this.getSelection();
    let change = this.editor.formatText(index, length, formats, source);
    this.selection.setRange(range, true, Emitter.sources.SILENT);
    this.selection.scrollIntoView();
    return change;
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

  insertEmbed(index, embed, value, source = Quill.sources.API) {
    let range = this.getSelection();
    let change = this.editor.insertEmbed(index, embed, value, source);
    range = shiftRange(range, change, source);
    this.setSelection(range, Emitter.sources.SILENT);
    return change;
  }

  insertText(index, text, name, value, source) {
    let formats, range = this.getSelection();
    [index, , formats, source] = overload(index, 0, name, value, source);
    let change = this.editor.insertText(index, text, formats, source);
    range = shiftRange(range, index, text.length, source);
    this.setSelection(range, Emitter.sources.SILENT);
    return change;
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

  pasteHTML(index, html, source = Emitter.sources.API) {
    if (typeof index === 'string') {
      return this.setContents(this.clipboard.convert(index), html);
    } else {
      let paste = this.clipboard.convert(html);
      return this.updateContents(new Delta().retain(index).concat(paste), source);
    }
  }

  removeFormat(index, length, source) {
    let range = this.getSelection();
    [index, length, , source] = overload(index, length, source);
    let change = this.editor.removeFormat(index, length, source);
    range = shiftRange(range, change, source);
    this.setSelection(range, Emitter.sources.SILENT);
    return change;
  }

  setContents(delta, source = Emitter.sources.API) {
    delta = new Delta(delta).slice();
    let lastOp = delta.ops[delta.ops.length - 1];
    // Quill contents must always end with newline
    if (lastOp == null || lastOp.insert[lastOp.insert.length-1] !== '\n') {
      delta.insert('\n');
    }
    delta.delete(this.getLength());
    return this.editor.applyDelta(delta, source);
  }

  setSelection(index, length, source) {
    if (index == null) {
      this.selection.setRange(null, length || Quill.sources.API);
    } else {
      [index, length, , source] = overload(index, length, source);
      this.selection.setRange(new Range(index, length), source);
    }
    this.selection.scrollIntoView();
  }

  setText(text, source = Emitter.sources.API) {
    let delta = new Delta().insert(text);
    return this.setContents(delta, source);
  }

  update(source = Emitter.sources.USER) {
    let change = this.scroll.update(source);   // Will update selection before selection.update() does if text changes
    this.selection.update(source);
    return change;
  }

  updateContents(delta, source = Emitter.sources.API) {
    let range = this.getSelection();
    if (Array.isArray(delta)) {
      delta = new Delta(delta.slice());
    }
    let change = this.editor.applyDelta(delta, source);
    if (range != null) {
      range = shiftRange(range, change, source);
      this.setSelection(range, Emitter.sources.SILENT);
    }
    return change;
  }
}
Quill.DEFAULTS = {
  bounds: document.body,
  formats: null,
  modules: {},
  placeholder: '',
  readOnly: false,
  theme: 'default'
};
Quill.events = Emitter.events;
Quill.sources = Emitter.sources;
Quill.version = typeof(QUILL_VERSION) === 'undefined' ? 'dev' : QUILL_VERSION;

Quill.imports = {
  'delta'       : Delta,
  'parchment'   : Parchment,
  'core/module' : Module,
  'core/theme'  : Theme
};


function expandConfig(container, userConfig) {
  userConfig = extend(true, {
    container: container,
    modules: {
      clipboard: true,
      keyboard: true,
      history: true
    }
  }, userConfig);
  if (userConfig.theme == null || userConfig.theme === Quill.DEFAULTS.theme) {
    userConfig.theme = Theme;
  } else {
    userConfig.theme = Quill.import(`themes/${userConfig.theme}`);
    if (userConfig.theme == null) {
      throw new Error(`Invalid theme ${userConfig.theme}. Did you register it?`);
    }
  }
  let themeConfig = extend(true, {}, userConfig.theme.DEFAULTS);
  [themeConfig, userConfig].forEach(function(config) {
    config.modules = config.modules || {};
    Object.keys(config.modules).forEach(function(module) {
      if (config.modules[module] === true) {
        config.modules[module] = {};
      }
    });
  });
  let moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
  let moduleConfig = moduleNames.reduce(function(config, name) {
    let moduleClass = Quill.import(`modules/${name}`);
    if (moduleClass == null) {
      debug.error(`Cannot load ${name} module. Are you sure you registered it?`);
    } else {
      config[name] = moduleClass.DEFAULTS || {};
    }
    return config;
  }, {});
  // Special case toolbar shorthand
  if (userConfig.modules != null && userConfig.modules.toolbar != null &&
      userConfig.modules.toolbar.constructor !== Object) {
    userConfig.modules.toolbar = {
      container: userConfig.modules.toolbar
    };
  }
  userConfig = extend(true, {}, Quill.DEFAULTS, { modules: moduleConfig }, themeConfig, userConfig);
  ['bounds', 'container'].forEach(function(key) {
    if (typeof userConfig[key] === 'string') {
      userConfig[key] = document.querySelector(userConfig[key]);
    }
  });
  return userConfig;
}

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

function shiftRange(range, index, length, source) {
  if (range == null) return null;
  let start, end;
  if (index instanceof Delta) {
    [start, end] = [range.index, range.index + range.length].map(function(pos) {
      return index.transformPosition(pos, source === Emitter.sources.USER);
    });
  } else {
    [start, end] = [range.index, range.index + range.length].map(function(pos) {
      if (pos < index || (pos === index && source !== Emitter.sources.USER)) return pos;
      if (length >= 0) {
        return pos + length;
      } else {
        return Math.max(index, pos + length);
      }
    });
  }
  return new Range(start, end - start);
}


export { expandConfig, overload, Quill as default };
