var DOM, Leaf, Normalizer, Range, Selection, Utils, _;

_ = require('lodash');

DOM = require('./dom');

Leaf = require('./leaf');

Normalizer = require('./normalizer');

Range = require('./lib/range');

Utils = require('./utils');

Selection = (function() {
  function Selection(doc, iframe, emitter) {
    this.doc = doc;
    this.iframe = iframe;
    this.emitter = emitter;
    this.document = this.doc.root.ownerDocument;
    this.range = this.getRange();
    this.nullDelay = false;
  }

  Selection.prototype.checkFocus = function() {
    if (this.document.activeElement !== this.doc.root) {
      return false;
    }
    if ((document.activeElement != null) && document.activeElement.tagName === 'IFRAME') {
      return document.activeElement === this.iframe;
    }
    return true;
  };

  Selection.prototype.getRange = function() {
    var end, nativeRange, start;
    if (!this.checkFocus()) {
      return null;
    }
    nativeRange = this._getNativeRange();
    if (nativeRange == null) {
      return null;
    }
    start = this._positionToIndex(nativeRange.startContainer, nativeRange.startOffset);
    if (nativeRange.startContainer === nativeRange.endContainer && nativeRange.startOffset === nativeRange.endOffset) {
      end = start;
    } else {
      end = this._positionToIndex(nativeRange.endContainer, nativeRange.endOffset);
    }
    return new Range(Math.min(start, end), Math.max(start, end));
  };

  Selection.prototype.preserve = function(fn) {
    var endNode, endOffset, nativeRange, startNode, startOffset, _ref, _ref1, _ref2, _ref3;
    nativeRange = this._getNativeRange();
    if ((nativeRange != null) && this.checkFocus()) {
      _ref = this._encodePosition(nativeRange.startContainer, nativeRange.startOffset), startNode = _ref[0], startOffset = _ref[1];
      _ref1 = this._encodePosition(nativeRange.endContainer, nativeRange.endOffset), endNode = _ref1[0], endOffset = _ref1[1];
      fn();
      _ref2 = this._decodePosition(startNode, startOffset), startNode = _ref2[0], startOffset = _ref2[1];
      _ref3 = this._decodePosition(endNode, endOffset), endNode = _ref3[0], endOffset = _ref3[1];
      return this._setNativeRange(startNode, startOffset, endNode, endOffset);
    } else {
      return fn();
    }
  };

  Selection.prototype.setRange = function(range, source) {
    var endNode, endOffset, startNode, startOffset, _ref, _ref1, _ref2;
    if (range != null) {
      _ref = this._indexToPosition(range.start), startNode = _ref[0], startOffset = _ref[1];
      if (range.isCollapsed()) {
        _ref1 = [startNode, startOffset], endNode = _ref1[0], endOffset = _ref1[1];
      } else {
        _ref2 = this._indexToPosition(range.end), endNode = _ref2[0], endOffset = _ref2[1];
      }
      this._setNativeRange(startNode, startOffset, endNode, endOffset);
    } else {
      this._setNativeRange(null);
    }
    return this.update(source);
  };

  Selection.prototype.shiftAfter = function(index, length, fn) {
    var range;
    range = this.getRange();
    fn();
    if (range != null) {
      range.shift(index, length);
      return this.setRange(range, 'silent');
    }
  };

  Selection.prototype.update = function(source) {
    var emit, range;
    range = this.getRange();
    emit = source !== 'silent' && !Range.compare(range, this.range);
    if (range === null && source === 'user' && !this.nullDelay) {
      return this.nullDelay = true;
    } else {
      this.nullDelay = false;
      this.range = range;
      if (emit) {
        return this.emitter.emit(this.emitter.constructor.events.SELECTION_CHANGE, range, source);
      }
    }
  };

  Selection.prototype._decodePosition = function(node, offset) {
    var childIndex;
    if (DOM.isElement(node)) {
      childIndex = _.indexOf(DOM.getChildNodes(node.parentNode), node);
      offset += childIndex;
      node = node.parentNode;
    }
    return [node, offset];
  };

  Selection.prototype._encodePosition = function(node, offset) {
    var text;
    while (true) {
      if (DOM.isTextNode(node) || node.tagName === DOM.DEFAULT_BREAK_TAG || (DOM.EMBED_TAGS[node.tagName] != null)) {
        return [node, offset];
      } else if (offset < node.childNodes.length) {
        node = node.childNodes[offset];
        offset = 0;
      } else if (node.childNodes.length === 0) {
        if (Normalizer.TAGS[node.tagName] == null) {
          text = node.ownerDocument.createTextNode('');
          node.appendChild(text);
          node = text;
        }
        return [node, 0];
      } else {
        node = node.lastChild;
        if (DOM.isElement(node)) {
          if (node.tagName === DOM.DEFAULT_BREAK_TAG || (DOM.EMBED_TAGS[node.tagName] != null)) {
            return [node, 1];
          } else {
            offset = node.childNodes.length;
          }
        } else {
          return [node, Utils.getNodeLength(node)];
        }
      }
    }
  };

  Selection.prototype._getNativeSelection = function() {
    if (this.document.getSelection != null) {
      return this.document.getSelection();
    } else {
      return null;
    }
  };

  Selection.prototype._getNativeRange = function() {
    var selection;
    selection = this._getNativeSelection();
    if ((selection != null ? selection.rangeCount : void 0) > 0) {
      return selection.getRangeAt(0);
    } else {
      return null;
    }
  };

  Selection.prototype._indexToPosition = function(index) {
    var leaf, offset, _ref;
    if (this.doc.lines.length === 0) {
      return [this.doc.root, 0];
    }
    _ref = this.doc.findLeafAt(index, true), leaf = _ref[0], offset = _ref[1];
    return this._decodePosition(leaf.node, offset);
  };

  Selection.prototype._positionToIndex = function(node, offset) {
    var leaf, leafNode, leafOffset, line, lineOffset, _ref;
    _ref = this._encodePosition(node, offset), leafNode = _ref[0], offset = _ref[1];
    line = this.doc.findLine(leafNode);
    if (line == null) {
      return 0;
    }
    leaf = line.findLeaf(leafNode);
    lineOffset = 0;
    while (line.prev != null) {
      line = line.prev;
      lineOffset += line.length;
    }
    if (leaf == null) {
      return lineOffset;
    }
    leafOffset = 0;
    while (leaf.prev != null) {
      leaf = leaf.prev;
      leafOffset += leaf.length;
    }
    return lineOffset + leafOffset + offset;
  };

  Selection.prototype._setNativeRange = function(startNode, startOffset, endNode, endOffset) {
    var nativeRange, selection;
    selection = this._getNativeSelection();
    if (!selection) {
      return;
    }
    if (startNode != null) {
      this.doc.root.focus();
      nativeRange = this._getNativeRange();
      if ((nativeRange == null) || startNode !== nativeRange.startContainer || startOffset !== nativeRange.startOffset || endNode !== nativeRange.endContainer || endOffset !== nativeRange.endOffset) {
        if (nativeRange != null) {
          selection.removeAllRanges();
        }
        selection.removeAllRanges();
        nativeRange = this.document.createRange();
        nativeRange.setStart(startNode, startOffset);
        nativeRange.setEnd(endNode, endOffset);
        selection.addRange(nativeRange);
        return this.doc.root.focus();
      }
    } else {
      selection.removeAllRanges();
      return this.doc.root.blur();
    }
  };

  return Selection;

})();

module.exports = Selection;
