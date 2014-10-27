var Delta, Editor, EventEmitter2, Format, Quill, Range, dom, pkg, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

_ = require('lodash');

pkg = require('../package.json');

Delta = require('rich-text').Delta;

EventEmitter2 = require('eventemitter2').EventEmitter2;

dom = require('./lib/dom');

Editor = require('./core/editor');

Format = require('./core/format');

Range = require('./lib/range');

Quill = (function(_super) {
  __extends(Quill, _super);

  Quill.version = pkg.version;

  Quill.editors = [];

  Quill.modules = [];

  Quill.themes = [];

  Quill.DEFAULTS = {
    formats: ['firstheader', 'secondheader', 'thirdheader', 'align', 'bold', 'italic', 'strike', 'underline', 'color', 'background', 'font', 'size', 'link', 'image', 'bullet', 'list'],
    modules: {
      'keyboard': true,
      'paste-manager': true,
      'undo-manager': true
    },
    pollInterval: 100,
    readOnly: false,
    theme: 'default'
  };

  Quill.events = {
    MODULE_INIT: 'module-init',
    POST_EVENT: 'post-event',
    PRE_EVENT: 'pre-event',
    SELECTION_CHANGE: 'selection-change',
    TEXT_CHANGE: 'text-change'
  };

  Quill.sources = Editor.sources;

  Quill.registerModule = function(name, module) {
    if (Quill.modules[name] != null) {
      console.warn("Overwriting " + name + " module");
    }
    return Quill.modules[name] = module;
  };

  Quill.registerTheme = function(name, theme) {
    if (Quill.themes[name] != null) {
      console.warn("Overwriting " + name + " theme");
    }
    return Quill.themes[name] = theme;
  };

  Quill.require = function(name) {
    switch (name) {
      case 'lodash':
        return _;
      case 'delta':
        return Delta;
      case 'dom':
        return dom;
      default:
        return null;
    }
  };

  function Quill(container, options) {
    var html, moduleOptions, themeClass;
    if (options == null) {
      options = {};
    }
    if (_.isString(container)) {
      container = document.querySelector(container);
    }
    if (container == null) {
      throw new Error('Invalid Quill container');
    }
    moduleOptions = _.defaults(options.modules || {}, Quill.DEFAULTS.modules);
    html = container.innerHTML;
    this.options = _.defaults(options, Quill.DEFAULTS);
    this.options.modules = moduleOptions;
    this.options.id = this.id = "quill-" + (Quill.editors.length + 1);
    this.options.emitter = this;
    this.modules = {};
    this.editor = new Editor(container, this, this.options);
    this.root = this.editor.doc.root;
    Quill.editors.push(this);
    this.setHTML(html, Quill.sources.SILENT);
    themeClass = Quill.themes[this.options.theme];
    if (themeClass == null) {
      throw new Error("Cannot load " + this.options.theme + " theme. Are you sure you registered it?");
    }
    this.theme = new themeClass(this, this.options);
    _.each(this.options.modules, (function(_this) {
      return function(option, name) {
        return _this.addModule(name, option);
      };
    })(this));
  }

  Quill.prototype.addContainer = function(className, before) {
    if (before == null) {
      before = false;
    }
    return this.editor.renderer.addContainer(className, before);
  };

  Quill.prototype.addFormat = function(name, format) {
    return this.editor.doc.addFormat(name, format);
  };

  Quill.prototype.addModule = function(name, options) {
    var moduleClass;
    moduleClass = Quill.modules[name];
    if (moduleClass == null) {
      throw new Error("Cannot load " + name + " module. Are you sure you registered it?");
    }
    if (!_.isObject(options)) {
      options = {};
    }
    options = _.defaults(options, this.theme.constructor.OPTIONS[name] || {}, moduleClass.DEFAULTS || {});
    this.modules[name] = new moduleClass(this, options);
    this.emit(Quill.events.MODULE_INIT, name, this.modules[name]);
    return this.modules[name];
  };

  Quill.prototype.addStyles = function(styles) {
    return this.editor.renderer.addStyles(styles);
  };

  Quill.prototype.deleteText = function(start, end, source) {
    var delta, formats, _ref;
    if (source == null) {
      source = Quill.sources.API;
    }
    _ref = this._buildParams(start, end, {}, source), start = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    if (!(end > start)) {
      return;
    }
    delta = new Delta().retain(start)["delete"](end - start);
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype.emit = function() {
    var args, eventName;
    eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    Quill.__super__.emit.apply(this, [Quill.events.PRE_EVENT, eventName].concat(__slice.call(args)));
    Quill.__super__.emit.apply(this, [eventName].concat(__slice.call(args)));
    return Quill.__super__.emit.apply(this, [Quill.events.POST_EVENT, eventName].concat(__slice.call(args)));
  };

  Quill.prototype.focus = function() {
    return this.editor.focus();
  };

  Quill.prototype.formatLine = function(start, end, name, value, source) {
    var formats, line, offset, _ref, _ref1;
    _ref = this._buildParams(start, end, name, value, source), start = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    _ref1 = this.editor.doc.findLineAt(end), line = _ref1[0], offset = _ref1[1];
    if (line != null) {
      end += line.length - offset;
    }
    return this.formatText(start, end, formats, source);
  };

  Quill.prototype.formatText = function(start, end, name, value, source) {
    var delta, formats, _ref;
    _ref = this._buildParams(start, end, name, value, source), start = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    formats = _.reduce(formats, (function(_this) {
      return function(formats, value, name) {
        var format;
        format = _this.editor.doc.formats[name];
        if (!(value && value !== format.config["default"])) {
          formats[name] = null;
        }
        return formats;
      };
    })(this), formats);
    delta = new Delta().retain(start).retain(end - start, formats);
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype.getContents = function(start, end) {
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = null;
    }
    if (_.isObject(start)) {
      end = start.end;
      start = start.start;
    }
    return this.editor.getDelta().slice(start, end);
  };

  Quill.prototype.getHTML = function() {
    return this.root.innerHTML;
  };

  Quill.prototype.getLength = function() {
    return this.editor.getDelta().length();
  };

  Quill.prototype.getModule = function(name) {
    return this.modules[name];
  };

  Quill.prototype.getSelection = function() {
    this.editor.checkUpdate();
    return this.editor.selection.getRange();
  };

  Quill.prototype.getText = function(start, end) {
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = null;
    }
    return _.map(this.getContents(start, end).ops, function(op) {
      if (_.isString(op.insert)) {
        return op.insert;
      } else {
        return '';
      }
    }).join('');
  };

  Quill.prototype.insertEmbed = function(index, type, url, source) {
    return this.insertText(index, dom.EMBED_TEXT, type, url, source);
  };

  Quill.prototype.insertText = function(index, text, name, value, source) {
    var delta, end, formats, _ref;
    _ref = this._buildParams(index, 0, name, value, source), index = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
    if (!(text.length > 0)) {
      return;
    }
    delta = new Delta().retain(index).insert(text, formats);
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype.onModuleLoad = function(name, callback) {
    if (this.modules[name]) {
      return callback(this.modules[name]);
    }
    return this.on(Quill.events.MODULE_INIT, function(moduleName, module) {
      if (moduleName === name) {
        return callback(module);
      }
    });
  };

  Quill.prototype.prepareFormat = function(name, value) {
    var format, range;
    format = this.editor.doc.formats[name];
    if (format == null) {
      return;
    }
    range = this.getSelection();
    if (!(range != null ? range.isCollapsed() : void 0)) {
      return;
    }
    if (format.isType(Format.types.LINE)) {
      return this.formatLine(range, name, value, Quill.sources.USER);
    } else {
      return format.prepare(value);
    }
  };

  Quill.prototype.setContents = function(delta, source) {
    if (source == null) {
      source = Quill.sources.API;
    }
    if (_.isArray(delta)) {
      delta = {
        ops: delta
      };
    }
    delta.ops.unshift({
      "delete": this.getLength()
    });
    return this.updateContents(delta, source);
  };

  Quill.prototype.setHTML = function(html, source) {
    if (source == null) {
      source = Quill.sources.API;
    }
    if (!html) {
      html = "<" + dom.DEFAULT_BLOCK_TAG + "><" + dom.DEFAULT_BREAK_TAG + "></" + dom.DEFAULT_BLOCK_TAG + ">";
    }
    this.editor.doc.setHTML(html);
    return this.editor.checkUpdate(source);
  };

  Quill.prototype.setSelection = function(start, end, source) {
    var range;
    if (source == null) {
      source = Quill.sources.API;
    }
    if (_.isNumber(start) && _.isNumber(end)) {
      range = new Range(start, end);
    } else {
      range = start;
      source = end || source;
    }
    return this.editor.selection.setRange(range, source);
  };

  Quill.prototype.updateContents = function(delta, source) {
    if (source == null) {
      source = Quill.sources.API;
    }
    return this.editor.applyDelta(delta, source);
  };

  Quill.prototype._buildParams = function() {
    var formats, params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (_.isObject(params[0])) {
      params.splice(0, 1, params[0].start, params[0].end);
    }
    if (_.isString(params[2])) {
      formats = {};
      formats[params[2]] = params[3];
      params.splice(2, 2, formats);
    }
    if (params[3] == null) {
      params[3] = Quill.sources.API;
    }
    return params;
  };

  return Quill;

})(EventEmitter2);

Quill.registerTheme('default', require('./themes/default'));

Quill.registerTheme('snow', require('./themes/snow'));

module.exports = Quill;
