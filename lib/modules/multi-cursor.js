var DOM, EventEmitter2, MultiCursor, Utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

EventEmitter2 = require('eventemitter2').EventEmitter2;

DOM = require('../dom');

Utils = require('../utils');

MultiCursor = (function(_super) {
  __extends(MultiCursor, _super);

  MultiCursor.DEFAULTS = {
    template: '<span class="cursor-flag"> <span class="cursor-name"></span> </span> <span class="cursor-caret"></span>',
    timeout: 2500
  };

  MultiCursor.events = {
    CURSOR_ADDED: 'cursor-addded',
    CURSOR_MOVED: 'cursor-moved',
    CURSOR_REMOVED: 'cursor-removed'
  };

  function MultiCursor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.cursors = {};
    this.container = this.quill.addContainer('cursor-container', true);
    this.quill.addStyles({
      '.cursor-container': {
        'position': 'absolute',
        'left': '0',
        'top': '0',
        'z-index': '1000'
      },
      '.cursor': {
        'margin-left': '-1px',
        'position': 'absolute'
      },
      '.cursor-flag': {
        'bottom': '100%',
        'position': 'absolute',
        'white-space': 'nowrap'
      },
      '.cursor-name': {
        'display': 'inline-block',
        'color': 'white',
        'padding': '2px 8px'
      },
      '.cursor-caret': {
        'height': '100%',
        'position': 'absolute',
        'width': '2px'
      },
      '.cursor.hidden .cursor-flag': {
        'display': 'none'
      },
      '.cursor.top > .cursor-flag': {
        'bottom': 'auto',
        'top': '100%'
      },
      '.cursor.right > .cursor-flag': {
        'right': '-2px'
      }
    });
    this.quill.on(this.quill.constructor.events.TEXT_CHANGE, _.bind(this._applyDelta, this));
  }

  MultiCursor.prototype.clearCursors = function() {
    _.each(_.keys(this.cursors), _.bind(this.removeCursor, this));
    return this.cursors = {};
  };

  MultiCursor.prototype.moveCursor = function(userId, index) {
    var cursor;
    cursor = this.cursors[userId];
    cursor.index = index;
    DOM.removeClass(cursor.elem, 'hidden');
    clearTimeout(cursor.timer);
    cursor.timer = setTimeout((function(_this) {
      return function() {
        DOM.addClass(cursor.elem, 'hidden');
        return cursor.timer = null;
      };
    })(this), this.options.timeout);
    this._updateCursor(cursor);
    return cursor;
  };

  MultiCursor.prototype.removeCursor = function(userId) {
    var cursor;
    cursor = this.cursors[userId];
    this.emit(MultiCursor.events.CURSOR_REMOVED, cursor);
    if (cursor != null) {
      cursor.elem.parentNode.removeChild(cursor.elem);
    }
    return delete this.cursors[userId];
  };

  MultiCursor.prototype.setCursor = function(userId, index, name, color) {
    var cursor;
    if (this.cursors[userId] == null) {
      this.cursors[userId] = cursor = {
        userId: userId,
        index: index,
        color: color,
        elem: this._buildCursor(name, color)
      };
      this.emit(MultiCursor.events.CURSOR_ADDED, cursor);
    }
    _.defer((function(_this) {
      return function() {
        return _this.moveCursor(userId, index);
      };
    })(this));
    return this.cursors[userId];
  };

  MultiCursor.prototype.shiftCursors = function(index, length, authorId) {
    if (authorId == null) {
      authorId = null;
    }
    return _.each(this.cursors, (function(_this) {
      return function(cursor, id) {
        if (!(cursor && (cursor.index > index || cursor.userId === authorId))) {
          return;
        }
        return cursor.index += Math.max(length, index - cursor.index);
      };
    })(this));
  };

  MultiCursor.prototype.update = function() {
    return _.each(this.cursors, (function(_this) {
      return function(cursor, id) {
        if (cursor == null) {
          return;
        }
        _this._updateCursor(cursor);
        return true;
      };
    })(this));
  };

  MultiCursor.prototype._applyDelta = function(delta) {
    delta.apply((function(_this) {
      return function(index, text, formatting) {
        return _this.shiftCursors(index, text.length, formatting['author']);
      };
    })(this), (function(_this) {
      return function(index, length) {
        return _this.shiftCursors(index, -1 * length, null);
      };
    })(this), (function(_this) {
      return function(index, length, name, value) {
        return _this.shiftCursors(index, 0, null);
      };
    })(this));
    return this.update();
  };

  MultiCursor.prototype._buildCursor = function(name, color) {
    var cursor, cursorCaret, cursorFlag, cursorName;
    cursor = this.container.ownerDocument.createElement('span');
    DOM.addClass(cursor, 'cursor');
    cursor.innerHTML = this.options.template;
    cursorFlag = cursor.querySelector('.cursor-flag');
    cursorName = cursor.querySelector('.cursor-name');
    DOM.setText(cursorName, name);
    cursorCaret = cursor.querySelector('.cursor-caret');
    cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color;
    this.container.appendChild(cursor);
    return cursor;
  };

  MultiCursor.prototype._moveCursor = function(cursor, reference, side) {
    var bounds, flag;
    if (side == null) {
      side = 'left';
    }
    bounds = reference.getBoundingClientRect();
    cursor.elem.style.top = bounds.top + 'px';
    cursor.elem.style.left = bounds[side] + 'px';
    cursor.elem.style.height = bounds.height + 'px';
    flag = cursor.elem.querySelector('.cursor-flag');
    DOM.toggleClass(cursor.elem, 'top', parseInt(cursor.elem.style.top) <= flag.offsetHeight);
    DOM.toggleClass(cursor.elem, 'left', parseInt(cursor.elem.style.left) <= flag.offsetWidth);
    DOM.toggleClass(cursor.elem, 'right', this.quill.root.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth);
    return this.emit(MultiCursor.events.CURSOR_MOVED, cursor);
  };

  MultiCursor.prototype._updateCursor = function(cursor) {
    var didSplit, guide, leaf, leftNode, offset, rightNode, _ref, _ref1;
    this.quill.editor.checkUpdate();
    _ref = this.quill.editor.doc.findLeafAt(cursor.index, true), leaf = _ref[0], offset = _ref[1];
    guide = this.container.ownerDocument.createElement('span');
    if (leaf != null) {
      _ref1 = Utils.splitNode(leaf.node, offset), leftNode = _ref1[0], rightNode = _ref1[1], didSplit = _ref1[2];
      DOM.setText(guide, DOM.ZERO_WIDTH_NOBREAK_SPACE);
      leaf.node.parentNode.insertBefore(guide, rightNode);
    } else {
      DOM.setText(guide, DOM.NOBREAK_SPACE);
      this.quill.root.appendChild(guide);
    }
    this._moveCursor(cursor, guide);
    DOM.removeNode(guide);
    if (didSplit) {
      DOM.normalize(leaf.node.parentNode);
    }
    return this.quill.editor.selection.update('silent');
  };

  return MultiCursor;

})(EventEmitter2);

module.exports = MultiCursor;
