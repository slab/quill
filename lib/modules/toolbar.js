var DOM, Toolbar, Utils, _;

_ = require('lodash');

DOM = require('../dom');

Utils = require('../utils');

Toolbar = (function() {
  Toolbar.DEFAULTS = {
    container: null
  };

  Toolbar.formats = {
    LINE: {
      'align': 'align',
      'bullet': 'bullet',
      'list': 'list'
    },
    SELECT: {
      'align': 'align',
      'background': 'background',
      'color': 'color',
      'font': 'font',
      'size': 'size'
    },
    TOGGLE: {
      'bold': 'bold',
      'bullet': 'bullet',
      'image': 'image',
      'italic': 'italic',
      'link': 'link',
      'list': 'list',
      'strike': 'strike',
      'underline': 'underline'
    },
    TOOLTIP: {
      'image': 'image',
      'link': 'link'
    }
  };

  function Toolbar(quill, options) {
    this.quill = quill;
    this.options = options;
    if (this.options.container == null) {
      throw new Error('container required for toolbar', this.options);
    }
    this.container = _.isString(this.options.container) ? document.querySelector(this.options.container) : this.options.container;
    this.inputs = {};
    this.preventUpdate = false;
    this.triggering = false;
    _.each(this.quill.options.formats, (function(_this) {
      return function(format) {
        if (Toolbar.formats.TOOLTIP[format] != null) {
          return;
        }
        return _this.initFormat(format, function(range, value) {
          if (_this.triggering) {
            return;
          }
          if (range.isCollapsed()) {
            _this.quill.prepareFormat(format, value);
          } else if (Toolbar.formats.LINE[format] != null) {
            _this.quill.formatLine(range, format, value, 'user');
          } else {
            _this.quill.formatText(range, format, value, 'user');
          }
          return _.defer(function() {
            _this.updateActive(range);
            return _this.setActive(format, value);
          });
        });
      };
    })(this));
    this.quill.on(this.quill.constructor.events.SELECTION_CHANGE, _.bind(this.updateActive, this));
    DOM.addClass(this.container, 'ql-toolbar-container');
    if (DOM.isIOS()) {
      DOM.addClass(this.container, 'ios');
    }
    if (DOM.isIE(11) || DOM.isIOS()) {
      DOM.addEventListener(this.container, 'mousedown', (function(_this) {
        return function() {
          return false;
        };
      })(this));
    }
  }

  Toolbar.prototype.initFormat = function(format, callback) {
    var eventName, input, selector;
    selector = ".ql-" + format;
    if (Toolbar.formats.SELECT[format] != null) {
      selector = "select" + selector;
      eventName = 'change';
    } else {
      eventName = 'click';
    }
    input = this.container.querySelector(selector);
    if (input == null) {
      return;
    }
    this.inputs[format] = input;
    return DOM.addEventListener(input, eventName, (function(_this) {
      return function() {
        var range, value;
        value = eventName === 'change' ? DOM.getSelectValue(input) : !DOM.hasClass(input, 'ql-active');
        _this.preventUpdate = true;
        _this.quill.focus();
        range = _this.quill.getSelection();
        if (range != null) {
          callback(range, value);
        }
        _this.preventUpdate = false;
        return true;
      };
    })(this));
  };

  Toolbar.prototype.setActive = function(format, value) {
    var input, selectValue;
    input = this.inputs[format];
    if (input == null) {
      return;
    }
    if (input.tagName === 'SELECT') {
      this.triggering = true;
      selectValue = DOM.getSelectValue(input);
      if (_.isArray(value)) {
        value = '';
      }
      if (value !== selectValue) {
        if (value != null) {
          DOM.selectOption(input, value);
        } else {
          DOM.resetSelect(input);
        }
      }
      return this.triggering = false;
    } else {
      return DOM.toggleClass(input, 'ql-active', value || false);
    }
  };

  Toolbar.prototype.updateActive = function(range) {
    var activeFormats;
    if (!((range != null) && !this.preventUpdate)) {
      return;
    }
    activeFormats = this._getActive(range);
    return _.each(this.inputs, (function(_this) {
      return function(input, format) {
        _this.setActive(format, activeFormats[format]);
        return true;
      };
    })(this));
  };

  Toolbar.prototype._getActive = function(range) {
    var leafFormats, lineFormats;
    leafFormats = this._getLeafActive(range);
    lineFormats = this._getLineActive(range);
    return _.defaults({}, leafFormats, lineFormats);
  };

  Toolbar.prototype._getLeafActive = function(range) {
    var contents, formatsArr, line, offset, _ref;
    if (range.isCollapsed()) {
      _ref = this.quill.editor.doc.findLineAt(range.start), line = _ref[0], offset = _ref[1];
      if (offset === 0) {
        contents = this.quill.getContents(range.start, range.end + 1);
      } else {
        contents = this.quill.getContents(range.start - 1, range.end);
      }
    } else {
      contents = this.quill.getContents(range);
    }
    formatsArr = _.map(contents.ops, 'attributes');
    return this._intersectFormats(formatsArr);
  };

  Toolbar.prototype._getLineActive = function(range) {
    var firstLine, formatsArr, lastLine, offset, _ref, _ref1;
    formatsArr = [];
    _ref = this.quill.editor.doc.findLineAt(range.start), firstLine = _ref[0], offset = _ref[1];
    _ref1 = this.quill.editor.doc.findLineAt(range.end), lastLine = _ref1[0], offset = _ref1[1];
    if ((lastLine != null) && lastLine === firstLine) {
      lastLine = lastLine.next;
    }
    while ((firstLine != null) && firstLine !== lastLine) {
      formatsArr.push(_.clone(firstLine.formats));
      firstLine = firstLine.next;
    }
    return this._intersectFormats(formatsArr);
  };

  Toolbar.prototype._intersectFormats = function(formatsArr) {
    return _.reduce(formatsArr.slice(1), function(activeFormats, formats) {
      var activeKeys, added, formatKeys, intersection, missing;
      activeKeys = _.keys(activeFormats);
      formatKeys = _.keys(formats);
      intersection = _.intersection(activeKeys, formatKeys);
      missing = _.difference(activeKeys, formatKeys);
      added = _.difference(formatKeys, activeKeys);
      _.each(intersection, function(name) {
        if (Toolbar.formats.SELECT[name] != null) {
          if (_.isArray(activeFormats[name])) {
            if (_.indexOf(activeFormats[name], formats[name]) < 0) {
              return activeFormats[name].push(formats[name]);
            }
          } else if (activeFormats[name] !== formats[name]) {
            return activeFormats[name] = [activeFormats[name], formats[name]];
          }
        }
      });
      _.each(missing, function(name) {
        if (Toolbar.formats.TOGGLE[name] != null) {
          return delete activeFormats[name];
        } else if ((Toolbar.formats.SELECT[name] != null) && !_.isArray(activeFormats[name])) {
          return activeFormats[name] = [activeFormats[name]];
        }
      });
      _.each(added, function(name) {
        if (Toolbar.formats.SELECT[name] != null) {
          return activeFormats[name] = [formats[name]];
        }
      });
      return activeFormats;
    }, formatsArr[0] || {});
  };

  return Toolbar;

})();

module.exports = Toolbar;
