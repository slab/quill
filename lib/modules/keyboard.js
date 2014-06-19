var DOM, Keyboard, Line, Tandem, _;

_ = require('lodash');

DOM = require('../dom');

Line = require('../line');

Tandem = require('tandem-core');

Keyboard = (function() {
  Keyboard.hotkeys = {
    BOLD: {
      key: 'B',
      metaKey: true
    },
    INDENT: {
      key: DOM.KEYS.TAB,
      shiftKey: false
    },
    ITALIC: {
      key: 'I',
      metaKey: true
    },
    OUTDENT: {
      key: DOM.KEYS.TAB,
      shiftKey: true
    },
    UNDERLINE: {
      key: 'U',
      metaKey: true
    }
  };

  function Keyboard(quill, options) {
    this.quill = quill;
    this.hotkeys = {};
    this._initListeners();
    this._initHotkeys();
    this._initDeletes();
  }

  Keyboard.prototype.addHotkey = function(hotkey, callback) {
    var which, _base;
    hotkey = _.isObject(hotkey) ? _.clone(hotkey) : {
      key: hotkey
    };
    hotkey.callback = callback;
    which = _.isNumber(hotkey.key) ? hotkey.key : hotkey.key.toUpperCase().charCodeAt(0);
    if ((_base = this.hotkeys)[which] == null) {
      _base[which] = [];
    }
    return this.hotkeys[which].push(hotkey);
  };

  Keyboard.prototype.toggleFormat = function(range, format) {
    var delta, toolbar, value;
    if (range.isCollapsed()) {
      delta = this.quill.getContents(Math.max(0, range.start - 1), range.end);
    } else {
      delta = this.quill.getContents(range);
    }
    value = delta.ops.length === 0 || !_.all(delta.ops, function(op) {
      return op.attributes[format];
    });
    if (range.isCollapsed()) {
      this.quill.prepareFormat(format, value);
    } else {
      this.quill.formatText(range, format, value, 'user');
    }
    toolbar = this.quill.getModule('toolbar');
    if (toolbar != null) {
      return toolbar.setActive(format, value);
    }
  };

  Keyboard.prototype._initDeletes = function() {
    return _.each([DOM.KEYS.DELETE, DOM.KEYS.BACKSPACE], (function(_this) {
      return function(key) {
        return _this.addHotkey(key, function() {
          return _this.quill.getLength() > 1;
        });
      };
    })(this));
  };

  Keyboard.prototype._initHotkeys = function() {
    this.addHotkey(Keyboard.hotkeys.INDENT, (function(_this) {
      return function(range) {
        _this._onTab(range, false);
        return false;
      };
    })(this));
    this.addHotkey(Keyboard.hotkeys.OUTDENT, (function(_this) {
      return function(range) {
        return false;
      };
    })(this));
    return _.each(['bold', 'italic', 'underline'], (function(_this) {
      return function(format) {
        return _this.addHotkey(Keyboard.hotkeys[format.toUpperCase()], function(range) {
          _this.toggleFormat(range, format);
          return false;
        });
      };
    })(this));
  };

  Keyboard.prototype._initListeners = function() {
    return DOM.addEventListener(this.quill.root, 'keydown', (function(_this) {
      return function(event) {
        var prevent, range;
        prevent = false;
        range = _this.quill.getSelection();
        _.each(_this.hotkeys[event.which], function(hotkey) {
          if ((hotkey.metaKey != null) && (event.metaKey !== hotkey.metaKey && event.ctrlKey !== hotkey.metaKey)) {
            return;
          }
          if ((hotkey.shiftKey != null) && event.shiftKey !== hotkey.shiftKey) {
            return;
          }
          return prevent = hotkey.callback(range) === false || prevent;
        });
        return !prevent;
      };
    })(this));
  };

  Keyboard.prototype._onTab = function(range, shift) {
    var delta;
    if (shift == null) {
      shift = false;
    }
    delta = Tandem.Delta.makeDelta({
      startLength: this.quill.getLength(),
      ops: [
        {
          start: 0,
          end: range.start
        }, {
          value: "\t"
        }, {
          start: range.end,
          end: this.quill.getLength()
        }
      ]
    });
    this.quill.updateContents(delta);
    return this.quill.setSelection(range.start + 1, range.start + 1);
  };

  return Keyboard;

})();

module.exports = Keyboard;
