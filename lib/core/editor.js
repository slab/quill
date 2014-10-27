var Document, Editor, Line, Renderer, Selection, dom, _;

_ = require('lodash');

dom = require('../lib/dom');

Document = require('./document');

Line = require('./line');

Renderer = require('./renderer');

Selection = require('./selection');

Editor = (function() {
  Editor.sources = {
    API: 'api',
    SILENT: 'silent',
    USER: 'user'
  };

  function Editor(iframeContainer, quill, options) {
    this.iframeContainer = iframeContainer;
    this.quill = quill;
    this.options = options != null ? options : {};
    this.renderer = new Renderer(this.iframeContainer, this.options);
    dom(this.iframeContainer).on('focus', this.focus.bind(this));
    this.root = this.renderer.root;
    this.doc = new Document(this.root, this.options);
    this.delta = this.doc.toDelta();
    this.selection = new Selection(this.doc, this.renderer.iframe, this.quill);
    this.timer = setInterval(_.bind(this.checkUpdate, this), this.options.pollInterval);
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
    var localDelta;
    localDelta = this._update();
    if (localDelta) {
      delta = localDelta.transform(delta, true);
      localDelta = delta.transform(localDelta, false);
    }
    if (delta.ops.length > 0) {
      delta = this._trackDelta((function(_this) {
        return function() {
          var index;
          index = 0;
          _.each(delta.ops, function(op) {
            if (_.isString(op.insert)) {
              _this._insertAt(index, op.insert, op.attributes);
              return index += op.insert.length;
            } else if (_.isNumber(op.insert)) {
              _this._insertAt(index, dom.EMBED_TEXT, op.attributes);
              return index += 1;
            } else if (_.isNumber(op["delete"])) {
              return _this._deleteAt(index, op["delete"]);
            } else if (_.isNumber(op.retain)) {
              _.each(op.attributes, function(value, name) {
                return _this._formatAt(index, op.retain, name, value);
              });
              return index += op.retain;
            }
          });
          return _this.selection.shiftAfter(0, 0, _.bind(_this.doc.optimizeLines, _this.doc));
        };
      })(this));
      this.delta = this.doc.toDelta();
      this.innerHTML = this.root.innerHTML;
      if (delta && source !== Editor.sources.SILENT) {
        this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, delta, source);
      }
    }
    if (localDelta && localDelta.ops.length > 0 && source !== Editor.sources.SILENT) {
      return this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, localDelta, Editor.sources.USER);
    }
  };

  Editor.prototype.checkUpdate = function(source) {
    var delta;
    if (source == null) {
      source = 'user';
    }
    if ((this.renderer.iframe.parentNode == null) || (this.root.parentNode == null)) {
      return clearInterval(this.timer);
    }
    delta = this._update();
    if (delta) {
      this.delta.compose(delta);
      this.quill.emit(this.quill.constructor.events.TEXT_CHANGE, delta, source);
    }
    if (delta) {
      source = Editor.sources.SILENT;
    }
    return this.selection.update(source);
  };

  Editor.prototype.focus = function() {
    if (dom.isIE(11)) {
      this.selection.setRange(this.selection.range);
    }
    if (dom.isIOS()) {
      this.renderer.iframe.focus();
    }
    return this.root.focus();
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
              line = _this.doc.appendLine(_this.root.ownerDocument.createElement(dom.DEFAULT_BLOCK_TAG));
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
    var delta, newDelta;
    fn();
    newDelta = this.doc.toDelta();
    delta = this.delta.diff(newDelta);
    return delta;
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
    if (delta.ops.length > 0) {
      return delta;
    } else {
      return false;
    }
  };

  return Editor;

})();

module.exports = Editor;
