var DOM, Document, Editor, Line, Renderer, Selection, Tandem, _;

_ = require('lodash');

DOM = require('./dom');

Document = require('./document');

Line = require('./line');

Renderer = require('./renderer');

Selection = require('./selection');

Tandem = require('tandem-core');

Editor = (function() {
  function Editor(iframeContainer, quill, options) {
    this.iframeContainer = iframeContainer;
    this.quill = quill;
    this.options = options != null ? options : {};
    this.renderer = new Renderer(this.iframeContainer, this.options);
    this.root = this.renderer.root;
    this.doc = new Document(this.root, this.options);
    this.delta = this.doc.toDelta();
    this.selection = new Selection(this.doc, this.renderer.iframe, this.quill);
    this.timer = setInterval(_.bind(this.checkUpdate, this), this.options.pollInterval);
    this.quill.on(this.quill.constructor.events.SELECTION_CHANGE, (function(_this) {
      return function(range) {
        return _this.savedRange = range;
      };
    })(this));
    if (!this.options.readOnly) {
      this.enable();
    }
  }

  Editor.prototype.disable = function() {
    return this.enable(false);
  };

  Editor.prototype.enable = function(enabled) {
    if (enabled == null) {
      enabled = true;
    }
    return this.root.setAttribute('contenteditable', enabled);
  };

  Editor.prototype.applyDelta = function(delta, source) {
    var localDelta, tempDelta;
    localDelta = this._update();
    if (localDelta) {
      tempDelta = localDelta;
      localDelta = localDelta.transform(delta, true);
      delta = delta.transform(tempDelta, false);
      this.delta = this.doc.toDelta();
    }
    if (!delta.isIdentity()) {
      if (delta.startLength !== this.delta.endLength) {
        console.warn("Trying to apply delta to incorrect doc length", delta, this.delta);
      }
      delta = this._trackDelta((function(_this) {
        return function() {
          delta.apply(_this._insertAt, _this._deleteAt, _this._formatAt, _this);
          return _this.selection.shiftAfter(0, 0, _.bind(_this.doc.optimizeLines, _this.doc));
        };
      })(this));
      this.delta = this.doc.toDelta();
      this.innerHTML = this.root.innerHTML;
      if (delta && source !== 'silent') {
        this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, delta, source);
      }
    }
    if (localDelta && !localDelta.isIdentity() && source !== 'silent') {
      return this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, localDelta, 'user');
    }
  };

  Editor.prototype.checkUpdate = function(source) {
    var delta, oldDelta;
    if (source == null) {
      source = 'user';
    }
    if ((this.renderer.iframe.parentNode == null) || (this.root.parentNode == null)) {
      return clearInterval(this.timer);
    }
    delta = this._update();
    if (delta) {
      oldDelta = this.delta;
      this.delta = oldDelta.compose(delta);
      this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, delta, source);
    }
    if (delta) {
      source = 'silent';
    }
    return this.selection.update(source);
  };

  Editor.prototype.getDelta = function() {
    return this.delta;
  };

  Editor.prototype._deleteAt = function(index, length) {
    if (length <= 0) {
      return;
    }
    return this.selection.shiftAfter(index, -1 * length, (function(_this) {
      return function() {
        var curLine, deleteLength, firstLine, mergeFirstLine, nextLine, offset, _ref;
        _ref = _this.doc.findLineAt(index), firstLine = _ref[0], offset = _ref[1];
        curLine = firstLine;
        mergeFirstLine = firstLine.length - offset <= length && offset > 0;
        while ((curLine != null) && length > 0) {
          nextLine = curLine.next;
          deleteLength = Math.min(curLine.length - offset, length);
          if (offset === 0 && length >= curLine.length) {
            _this.doc.removeLine(curLine);
          } else {
            curLine.deleteText(offset, deleteLength);
          }
          length -= deleteLength;
          curLine = nextLine;
          offset = 0;
        }
        if (mergeFirstLine && firstLine.next) {
          return _this.doc.mergeLines(firstLine, firstLine.next);
        }
      };
    })(this));
  };

  Editor.prototype._formatAt = function(index, length, name, value) {
    return this.selection.shiftAfter(index, 0, (function(_this) {
      return function() {
        var formatLength, line, offset, _ref, _results;
        _ref = _this.doc.findLineAt(index), line = _ref[0], offset = _ref[1];
        _results = [];
        while ((line != null) && length > 0) {
          formatLength = Math.min(length, line.length - offset - 1);
          line.formatText(offset, formatLength, name, value);
          length -= formatLength;
          if (length > 0) {
            line.format(name, value);
          }
          length -= 1;
          offset = 0;
          _results.push(line = line.next);
        }
        return _results;
      };
    })(this));
  };

  Editor.prototype._insertAt = function(index, text, formatting) {
    if (formatting == null) {
      formatting = {};
    }
    return this.selection.shiftAfter(index, text.length, (function(_this) {
      return function() {
        var line, lineTexts, offset, _ref;
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        lineTexts = text.split('\n');
        _ref = _this.doc.findLineAt(index), line = _ref[0], offset = _ref[1];
        return _.each(lineTexts, function(lineText, i) {
          var nextLine;
          if ((line == null) || line.length <= offset) {
            if (i < lineTexts.length - 1 || lineText.length > 0) {
              line = _this.doc.appendLine(_this.root.ownerDocument.createElement(DOM.DEFAULT_BLOCK_TAG));
              offset = 0;
              line.insertText(offset, lineText, formatting);
              line.format(formatting);
              nextLine = null;
            }
          } else {
            line.insertText(offset, lineText, formatting);
            if (i < lineTexts.length - 1) {
              nextLine = _this.doc.splitLine(line, offset + lineText.length);
              _.each(_.defaults({}, formatting, line.formats), function(value, format) {
                return line.format(format, formatting[format]);
              });
              offset = 0;
            }
          }
          return line = nextLine;
        });
      };
    })(this));
  };

  Editor.prototype._trackDelta = function(fn) {
    var decompose, decomposeA, decomposeB, decomposeLeft, decomposeRight, ignored, lengthA, lengthB, newDelta, newIndex, newLeftDelta, newRightDelta, oldIndex, oldLeftDelta, oldRightDelta, _ref, _ref1, _ref2, _ref3, _ref4;
    oldIndex = (_ref = this.savedRange) != null ? _ref.start : void 0;
    fn();
    newDelta = this.doc.toDelta();
    try {
      newIndex = (_ref1 = this.selection.getRange()) != null ? _ref1.start : void 0;
      if ((oldIndex != null) && (newIndex != null) && oldIndex <= this.delta.endLength && newIndex <= newDelta.endLength) {
        _ref2 = this.delta.split(oldIndex), oldLeftDelta = _ref2[0], oldRightDelta = _ref2[1];
        _ref3 = newDelta.split(newIndex), newLeftDelta = _ref3[0], newRightDelta = _ref3[1];
        decomposeLeft = newLeftDelta.decompose(oldLeftDelta);
        decomposeRight = newRightDelta.decompose(oldRightDelta);
        decomposeA = decomposeLeft.merge(decomposeRight);
      }
    } catch (_error) {
      ignored = _error;
    }
    decomposeB = newDelta.decompose(this.delta);
    if (decomposeA && decomposeB) {
      _ref4 = _.map([decomposeA, decomposeB], function(delta) {
        return _.reduce(delta.ops, function(count, op) {
          if (op.value != null) {
            count += op.value.length;
          }
          return count;
        }, 0);
      }), lengthA = _ref4[0], lengthB = _ref4[1];
      decompose = lengthA < lengthA ? decomposeA : decomposeB;
    } else {
      decompose = decomposeA || decomposeB;
    }
    return decompose;
  };

  Editor.prototype._update = function() {
    var delta;
    if (this.innerHTML === this.root.innerHTML) {
      return false;
    }
    delta = this._trackDelta((function(_this) {
      return function() {
        _this.selection.preserve(_.bind(_this.doc.rebuild, _this.doc));
        return _this.selection.shiftAfter(0, 0, _.bind(_this.doc.optimizeLines, _this.doc));
      };
    })(this));
    this.innerHTML = this.root.innerHTML;
    if (delta.isIdentity()) {
      return false;
    } else {
      return delta;
    }
  };

  return Editor;

})();

module.exports = Editor;
