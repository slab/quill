var Delta, Keyboard, Quill, dom, _;

Quill = require('../quill');

_ = Quill.require('lodash');

dom = Quill.require('dom');

Delta = Quill.require('delta');

Keyboard = (function() {
  Keyboard.hotkeys = {
    BOLD: {
      key: 'B',
      metaKey: true
    },
    INDENT: {
      key: dom.KEYS.TAB
    },
    ITALIC: {
      key: 'I',
      metaKey: true
    },
    OUTDENT: {
      key: dom.KEYS.TAB,
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

  Keyboard.prototype.addHotkey = function(hotkeys, callback) {
    if (!_.isArray(hotkeys)) {
      hotkeys = [hotkeys];
    }
    return _.each(hotkeys, (function(_this) {
      return function(hotkey) {
        var which, _base;
        hotkey = _.isObject(hotkey) ? _.clone(hotkey) : {
          key: hotkey
        };
        hotkey.callback = callback;
        which = _.isNumber(hotkey.key) ? hotkey.key : hotkey.key.toUpperCase().charCodeAt(0);
        if ((_base = _this.hotkeys)[which] == null) {
          _base[which] = [];
        }
        return _this.hotkeys[which].push(hotkey);
      };
    })(this));
  };

  Keyboard.prototype.toggleFormat = function(range, format) {
    var delta, toolbar, value;
    if (range.isCollapsed()) {
      delta = this.quill.getContents(Math.max(0, range.start - 1), range.end);
    } else {
      delta = this.quill.getContents(range);
    }
    value = delta.ops.length === 0 || !_.all(delta.ops, function(op) {
      var _ref;
      return (_ref = op.attributes) != null ? _ref[format] : void 0;
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
    return this.addHotkey([dom.KEYS.DELETE, dom.KEYS.BACKSPACE], (function(_this) {
      return function() {
        return _this.quill.getLength() > 1;
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
    return dom(this.quill.root).on('keydown', (function(_this) {
      return function(event) {
        var prevent;
        prevent = false;
        _.each(_this.hotkeys[event.which], function(hotkey) {
          var metaKey;
          metaKey = dom.isMac() ? event.metaKey : event.metaKey || event.ctrlKey;
          if (!!hotkey.metaKey !== !!metaKey) {
            return;
          }
          if (!!hotkey.shiftKey !== !!event.shiftKey) {
            return;
          }
          if (!!hotkey.altKey !== !!event.altKey) {
            return;
          }
          prevent = hotkey.callback(_this.quill.getSelection()) === false || prevent;
          return true;
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
    delta = new Delta().retain(range.start).insert("\t")["delete"](range.end - range.start).retain(this.quill.getLength() - range.end);
    this.quill.updateContents(delta);
    return this.quill.setSelection(range.start + 1, range.start + 1);
  };

  return Keyboard;

})();

Quill.registerModule('keyboard', Keyboard);

module.exports = Keyboard;
