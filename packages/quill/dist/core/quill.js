import { merge } from 'lodash-es';
import * as Parchment from 'parchment';
import Delta from 'quill-delta';
import Editor from './editor.js';
import Emitter from './emitter.js';
import instances from './instances.js';
import logger from './logger.js';
import Module from './module.js';
import Selection, { Range } from './selection.js';
import Composition from './composition.js';
import Theme from './theme.js';
import scrollRectIntoView from './utils/scrollRectIntoView.js';
import createRegistryWithFormats from './utils/createRegistryWithFormats.js';
const debug = logger('quill');
console.log("#4565 LOADED) test");
const globalRegistry = new Parchment.Registry();
Parchment.ParentBlot.uiClass = 'ql-ui';

/**
 * Options for initializing a Quill instance
 */

/**
 * Similar to QuillOptions, but with all properties expanded to their default values,
 * and all selectors resolved to HTMLElements.
 */

class Quill {
  static DEFAULTS = {
    bounds: null,
    modules: {
      clipboard: true,
      keyboard: true,
      history: true,
      uploader: true
    },
    placeholder: '',
    readOnly: false,
    registry: globalRegistry,
    theme: 'default'
  };
  static events = Emitter.events;
  static sources = Emitter.sources;
  static version = typeof "2.0.3" === 'undefined' ? 'dev' : "2.0.3";
  static imports = {
    delta: Delta,
    parchment: Parchment,
    'core/module': Module,
    'core/theme': Theme
  };
  static debug(limit) {
    if (limit === true) {
      limit = 'log';
    }
    logger.level(limit);
  }
  static find(node) {
    let bubble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return instances.get(node) || globalRegistry.find(node, bubble);
  }
  static import(name) {
    if (this.imports[name] == null) {
      debug.error(`Cannot import ${name}. Are you sure it was registered?`);
    }
    return this.imports[name];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? undefined : arguments[0]) !== 'string') {
      const target = arguments.length <= 0 ? undefined : arguments[0];
      const overwrite = !!(arguments.length <= 1 ? undefined : arguments[1]);
      const name = 'attrName' in target ? target.attrName : target.blotName;
      if (typeof name === 'string') {
        // Shortcut for formats:
        // register(Blot | Attributor, overwrite)
        this.register(`formats/${name}`, target, overwrite);
      } else {
        Object.keys(target).forEach(key => {
          this.register(key, target[key], overwrite);
        });
      }
    } else {
      const path = arguments.length <= 0 ? undefined : arguments[0];
      const target = arguments.length <= 1 ? undefined : arguments[1];
      const overwrite = !!(arguments.length <= 2 ? undefined : arguments[2]);
      if (this.imports[path] != null && !overwrite) {
        debug.warn(`Overwriting ${path} with`, target);
      }
      this.imports[path] = target;
      if ((path.startsWith('blots/') || path.startsWith('formats/')) && target && typeof target !== 'boolean' && target.blotName !== 'abstract') {
        globalRegistry.register(target);
      }
      if (typeof target.register === 'function') {
        target.register(globalRegistry);
      }
    }
  }
  constructor(container) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.options = expandConfig(container, options);
    this.container = this.options.container;
    if (this.container == null) {
      debug.error('Invalid Quill container', container);
      return;
    }
    if (this.options.debug) {
      Quill.debug(this.options.debug);
    }
    const html = this.container.innerHTML.trim();
    this.container.classList.add('ql-container');
    this.container.innerHTML = '';
    instances.set(this.container, this);
    this.root = this.addContainer('ql-editor');
    this.root.classList.add('ql-blank');
    this.emitter = new Emitter();
    const scrollBlotName = Parchment.ScrollBlot.blotName;
    const ScrollBlot = this.options.registry.query(scrollBlotName);
    if (!ScrollBlot || !('blotName' in ScrollBlot)) {
      throw new Error(`Cannot initialize Quill without "${scrollBlotName}" blot`);
    }
    this.scroll = new ScrollBlot(this.options.registry, this.root, {
      emitter: this.emitter
    });
    this.editor = new Editor(this.scroll);
    this.selection = new Selection(this.scroll, this.emitter);
    this.composition = new Composition(this.scroll, this.emitter);
    this.theme = new this.options.theme(this, this.options); // eslint-disable-line new-cap
    this.keyboard = this.theme.addModule('keyboard');
    this.clipboard = this.theme.addModule('clipboard');
    this.history = this.theme.addModule('history');
    this.uploader = this.theme.addModule('uploader');
    this.theme.addModule('input');
    this.theme.addModule('uiNode');
    this.theme.init();
    this.emitter.on(Emitter.events.EDITOR_CHANGE, type => {
      if (type === Emitter.events.TEXT_CHANGE) {
        this.root.classList.toggle('ql-blank', this.editor.isBlank());
      }
    });
    this.emitter.on(Emitter.events.SCROLL_UPDATE, (source, mutations) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? {
        oldRange,
        newRange
      } : undefined;
      modify.call(this, () => this.editor.update(null, mutations, selectionInfo), source);
    });
    this.emitter.on(Emitter.events.SCROLL_EMBED_UPDATE, (blot, delta) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? {
        oldRange,
        newRange
      } : undefined;
      modify.call(this, () => {
        const change = new Delta().retain(blot.offset(this)).retain({
          [blot.statics.blotName]: delta
        });
        return this.editor.update(change, [], selectionInfo);
      }, Quill.sources.USER);
    });
    if (html) {
      const contents = this.clipboard.convert({
        html: `${html}<p><br></p>`,
        text: '\n'
      });
      this.setContents(contents);
    }
    this.history.clear();
    if (this.options.placeholder) {
      this.root.setAttribute('data-placeholder', this.options.placeholder);
    }
    if (this.options.readOnly) {
      this.disable();
    }
    this.allowReadOnlyEdits = false;
  }
  addContainer(container) {
    let refNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (typeof container === 'string') {
      const className = container;
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
    // @ts-expect-error
    [index, length,, source] = overload(index, length, source);
    return modify.call(this, () => {
      return this.editor.deleteText(index, length);
    }, source, index, -1 * length);
  }
  disable() {
    this.enable(false);
  }
  editReadOnly(modifier) {
    this.allowReadOnlyEdits = true;
    const value = modifier();
    this.allowReadOnlyEdits = false;
    return value;
  }
  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.scroll.enable(enabled);
    this.container.classList.toggle('ql-disabled', !enabled);
  }
  focus() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.selection.focus();
    if (!options.preventScroll) {
      this.scrollSelectionIntoView();
    }
  }
  format(name, value) {
    let source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Emitter.sources.API;
    return modify.call(this, () => {
      const range = this.getSelection(true);
      let change = new Delta();
      if (range == null) return change;
      if (this.scroll.query(name, Parchment.Scope.BLOCK)) {
        change = this.editor.formatLine(range.index, range.length, {
          [name]: value
        });
      } else if (range.length === 0) {
        this.selection.format(name, value);
        return change;
      } else {
        change = this.editor.formatText(range.index, range.length, {
          [name]: value
        });
      }
      this.setSelection(range, Emitter.sources.SILENT);
      return change;
    }, source);
  }
  formatLine(index, length, name, value, source) {
    let formats;
    // eslint-disable-next-line prefer-const
    [index, length, formats, source] = overload(index, length,
    // @ts-expect-error
    name, value, source);
    return modify.call(this, () => {
      return this.editor.formatLine(index, length, formats);
    }, source, index, 0);
  }
  formatText(index, length, name, value, source) {
    let formats;
    // eslint-disable-next-line prefer-const
    [index, length, formats, source] = overload(
    // @ts-expect-error
    index, length, name, value, source);
    return modify.call(this, () => {
      return this.editor.formatText(index, length, formats);
    }, source, index, 0);
  }
  getBounds(index) {
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let bounds = null;
    if (typeof index === 'number') {
      bounds = this.selection.getBounds(index, length);
    } else {
      bounds = this.selection.getBounds(index.index, index.length);
    }
    if (!bounds) return null;
    const containerBounds = this.container.getBoundingClientRect();
    return {
      bottom: bounds.bottom - containerBounds.top,
      height: bounds.height,
      left: bounds.left - containerBounds.left,
      right: bounds.right - containerBounds.left,
      top: bounds.top - containerBounds.top,
      width: bounds.width
    };
  }
  getContents() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;
    [index, length] = overload(index, length);
    return this.editor.getContents(index, length);
  }
  getFormat() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSelection(true);
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (typeof index === 'number') {
      return this.editor.getFormat(index, length);
    }
    return this.editor.getFormat(index.index, index.length);
  }
  getIndex(blot) {
    return blot.offset(this.scroll);
  }
  getLength() {
    return this.scroll.length();
  }
  getLeaf(index) {
    return this.scroll.leaf(index);
  }
  getLine(index) {
    return this.scroll.line(index);
  }
  getLines() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;
    if (typeof index !== 'number') {
      return this.scroll.lines(index.index, index.length);
    }
    return this.scroll.lines(index, length);
  }
  getModule(name) {
    return this.theme.modules[name];
  }
  getSelection() {
    let focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (focus) this.focus();
    this.update(); // Make sure we access getRange with editor in consistent state
    return this.selection.getRange()[0];
  }
  getSemanticHTML() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let length = arguments.length > 1 ? arguments[1] : undefined;
    if (typeof index === 'number') {
      length = length ?? this.getLength() - index;
    }
    // @ts-expect-error
    [index, length] = overload(index, length);
    return this.editor.getHTML(index, length);
  }
  getText() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let length = arguments.length > 1 ? arguments[1] : undefined;
    if (typeof index === 'number') {
      length = length ?? this.getLength() - index;
    }
    // @ts-expect-error
    [index, length] = overload(index, length);
    return this.editor.getText(index, length);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(index, embed, value) {
    let source = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Quill.sources.API;
    return modify.call(this, () => {
      return this.editor.insertEmbed(index, embed, value);
    }, source, index);
  }
  insertText(index, text, name, value, source) {
    let formats;
    // eslint-disable-next-line prefer-const
    // @ts-expect-error
    [index,, formats, source] = overload(index, 0, name, value, source);
    return modify.call(this, () => {
      return this.editor.insertText(index, text, formats);
    }, source, index, text.length);
  }
  isEnabled() {
    return this.scroll.isEnabled();
  }
  off() {
    return this.emitter.off(...arguments);
  }
  on() {
    return this.emitter.on(...arguments);
  }
  once() {
    return this.emitter.once(...arguments);
  }
  removeFormat(index, length, source) {
    [index, length,, source] = overload(index, length, source);
    return modify.call(this, () => {
      return this.editor.removeFormat(index, length);
    }, source, index);
  }
  scrollRectIntoView(rect) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    scrollRectIntoView(this.root, rect, options);
  }

  /**
   * @deprecated Use Quill#scrollSelectionIntoView() instead.
   */
  scrollIntoView() {
    console.warn('Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead.');
    this.scrollSelectionIntoView();
  }

  /**
   * Scroll the current selection into the visible area.
   * If the selection is already visible, no scrolling will occur.
   */
  scrollSelectionIntoView() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const range = this.selection.lastRange;
    const bounds = range && this.selection.getBounds(range.index, range.length);
    if (bounds) {
      this.scrollRectIntoView(bounds, options);
    }
  }
  setContents(delta) {
    let source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Emitter.sources.API;
    return modify.call(this, () => {
      delta = new Delta(delta);
      const length = this.getLength();
      // Quill will set empty editor to \n
      const delete1 = this.editor.deleteText(0, length);
      const applied = this.editor.insertContents(0, delta);
      // Remove extra \n from empty editor initialization
      const delete2 = this.editor.deleteText(this.getLength() - 1, 1);
      return delete1.compose(applied).compose(delete2);
    }, source);
  }
  setSelection(index, length, source) {
    if (index == null) {
      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/22609
      this.selection.setRange(null, length || Quill.sources.API);
    } else {
      // @ts-expect-error
      [index, length,, source] = overload(index, length, source);
      this.selection.setRange(new Range(Math.max(0, index), length), source);
      if (source !== Emitter.sources.SILENT) {
        this.scrollSelectionIntoView();
      }
    }
  }
  setText(text) {
    let source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Emitter.sources.API;
    const delta = new Delta().insert(text);
    return this.setContents(delta, source);
  }
  update() {
    let source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Emitter.sources.USER;
    const change = this.scroll.update(source); // Will update selection before selection.update() does if text changes
    this.selection.update(source);
    // TODO this is usually undefined
    return change;
  }
  updateContents(delta) {
    let source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Emitter.sources.API;
    return modify.call(this, () => {
      delta = new Delta(delta);
      return this.editor.applyDelta(delta);
    }, source, true);
  }
}
function resolveSelector(selector) {
  return typeof selector === 'string' ? document.querySelector(selector) : selector;
}
function expandModuleConfig(config) {
  return Object.entries(config ?? {}).reduce((expanded, _ref) => {
    let [key, value] = _ref;
    return {
      ...expanded,
      [key]: value === true ? {} : value
    };
  }, {});
}
function omitUndefinedValuesFromOptions(obj) {
  return Object.fromEntries(Object.entries(obj).filter(entry => entry[1] !== undefined));
}
function expandConfig(containerOrSelector, options) {
  const container = resolveSelector(containerOrSelector);
  if (!container) {
    throw new Error('Invalid Quill container');
  }
  const shouldUseDefaultTheme = !options.theme || options.theme === Quill.DEFAULTS.theme;
  const theme = shouldUseDefaultTheme ? Theme : Quill.import(`themes/${options.theme}`);
  if (!theme) {
    throw new Error(`Invalid theme ${options.theme}. Did you register it?`);
  }
  const {
    modules: quillModuleDefaults,
    ...quillDefaults
  } = Quill.DEFAULTS;
  const {
    modules: themeModuleDefaults,
    ...themeDefaults
  } = theme.DEFAULTS;
  let userModuleOptions = expandModuleConfig(options.modules);
  // Special case toolbar shorthand
  if (userModuleOptions != null && userModuleOptions.toolbar && userModuleOptions.toolbar.constructor !== Object) {
    userModuleOptions = {
      ...userModuleOptions,
      toolbar: {
        container: userModuleOptions.toolbar
      }
    };
  }
  const modules = merge({}, expandModuleConfig(quillModuleDefaults), expandModuleConfig(themeModuleDefaults), userModuleOptions);
  const config = {
    ...quillDefaults,
    ...omitUndefinedValuesFromOptions(themeDefaults),
    ...omitUndefinedValuesFromOptions(options)
  };
  let registry = options.registry;
  if (registry) {
    if (options.formats) {
      debug.warn('Ignoring "formats" option because "registry" is specified');
    }
  } else {
    registry = options.formats ? createRegistryWithFormats(options.formats, config.registry, debug) : config.registry;
  }
  return {
    ...config,
    registry,
    container,
    theme,
    modules: Object.entries(modules).reduce((modulesWithDefaults, _ref2) => {
      let [name, value] = _ref2;
      if (!value) return modulesWithDefaults;
      const moduleClass = Quill.import(`modules/${name}`);
      if (moduleClass == null) {
        debug.error(`Cannot load ${name} module. Are you sure you registered it?`);
        return modulesWithDefaults;
      }
      return {
        ...modulesWithDefaults,
        // @ts-expect-error
        [name]: merge({}, moduleClass.DEFAULTS || {}, value)
      };
    }, {}),
    bounds: resolveSelector(config.bounds)
  };
}

// Handle selection preservation and TEXT_CHANGE emission
// common to modification APIs
function modify(modifier, source, index, shift) {
  if (!this.isEnabled() && source === Emitter.sources.USER && !this.allowReadOnlyEdits) {
    return new Delta();
  }
  let range = index == null ? null : this.getSelection();
  const oldDelta = this.editor.delta;
  const change = modifier();
  if (range != null) {
    if (index === true) {
      index = range.index; // eslint-disable-line prefer-destructuring
    }
    if (shift == null) {
      range = shiftRange(range, change, source);
    } else if (shift !== 0) {
      // @ts-expect-error index should always be number
      range = shiftRange(range, index, shift, source);
    }
    this.setSelection(range, Emitter.sources.SILENT);
  }
  if (change.length() > 0) {
    const args = [Emitter.events.TEXT_CHANGE, change, oldDelta, source];
    this.emitter.emit(Emitter.events.EDITOR_CHANGE, ...args);
    if (source !== Emitter.sources.SILENT) {
      this.emitter.emit(...args);
    }
  }
  return change;
}
function overload(index, length, name, value, source) {
  let formats = {};
  // @ts-expect-error
  if (typeof index.index === 'number' && typeof index.length === 'number') {
    // Allow for throwaway end (used by insertText/insertEmbed)
    if (typeof length !== 'number') {
      // @ts-expect-error
      source = value;
      value = name;
      name = length;
      // @ts-expect-error
      length = index.length; // eslint-disable-line prefer-destructuring
      // @ts-expect-error
      index = index.index; // eslint-disable-line prefer-destructuring
    } else {
      // @ts-expect-error
      length = index.length; // eslint-disable-line prefer-destructuring
      // @ts-expect-error
      index = index.index; // eslint-disable-line prefer-destructuring
    }
  } else if (typeof length !== 'number') {
    // @ts-expect-error
    source = value;
    value = name;
    name = length;
    length = 0;
  }
  // Handle format being object, two format name/value strings or excluded
  if (typeof name === 'object') {
    // @ts-expect-error Fix me later
    formats = name;
    // @ts-expect-error
    source = value;
  } else if (typeof name === 'string') {
    if (value != null) {
      formats[name] = value;
    } else {
      // @ts-expect-error
      source = name;
    }
  }
  // Handle optional source
  source = source || Emitter.sources.API;
  // @ts-expect-error
  return [index, length, formats, source];
}
function shiftRange(range, index, lengthOrSource, source) {
  const length = typeof lengthOrSource === 'number' ? lengthOrSource : 0;
  if (range == null) return null;
  let start;
  let end;
  // @ts-expect-error -- TODO: add a better type guard around `index`
  if (index && typeof index.transformPosition === 'function') {
    [start, end] = [range.index, range.index + range.length].map(pos =>
    // @ts-expect-error -- TODO: add a better type guard around `index`
    index.transformPosition(pos, source !== Emitter.sources.USER));
  } else {
    [start, end] = [range.index, range.index + range.length].map(pos => {
      // @ts-expect-error -- TODO: add a better type guard around `index`
      if (pos < index || pos === index && source === Emitter.sources.USER) return pos;
      if (length >= 0) {
        return pos + length;
      }
      // @ts-expect-error -- TODO: add a better type guard around `index`
      return Math.max(index, pos + length);
    });
  }
  return new Range(start, end - start);
}
export { Parchment, Range };
export { globalRegistry, expandConfig, overload, Quill as default };
//# sourceMappingURL=quill.js.map