import Parchment from 'parchment';
import CursorBlot from './blots/cursor';
import equal from 'deep-equal';
import extend from 'extend';
import * as platform from './lib/platform';


class Range {
  constructor(start, end = start) {
    this.start = start;
    this.end = end;
  }

  isCollapsed() {
    return this.start === this.end;
  }

  shift(index, length) {
    [this.start, this.end] = [this.start, this.end].map(function(pos) {
      if (index > pos) return pos;
      if (length >= 0) {
        return pos + length;
      } else {
        return Math.max(index, pos + length);
      }
    });
  }
}


class Selection {
  constructor(doc) {
    this.doc = doc;
    this.root = this.doc.domNode;
    this.lastRange = this.savedRange = new Range(0, 0);
    ['keyup', 'mouseup', 'mouseleave', 'touchend', 'touchleave'].forEach((eventName) => {
      this.root.addEventListener(eventName, () => {
        this.update();  // Do not pass event handler params
      });
    });
    this.update();
  }

  checkFocus() {
    return document.activeElement === this.root;
  }

  focus() {
    if (this.checkFocus()) return;
    this.root.focus();
    this.setRange(this.savedRange);
  }

  getBounds(index) {
    let pos = this.doc.findPath(index).pop();
    if (pos == null) return null;
    let containerBounds = this.root.parentNode.getBoundingClientRect();
    let side = 'left';
    let bounds;
    if (pos.blot.getLength() === 0) {
      bounds = pos.blot.parent.domNode.getBoundingClientRect();
    } else if (pos.blot instanceof Parchment.Embed) {
      bounds = pos.blot.domNode.getBoundingClientRect();
      if (pos.offset > 0) {
        side = 'right';
      }
    } else {
      let range = document.createRange();
      if (pos.offset < pos.blot.getLength()) {
        range.setStart(pos.blot.domNode, pos.offset);
        range.setEnd(pos.blot.domNode, pos.offset + 1);
        side = 'left';
      } else {
        range.setStart(pos.blot.domNode, pos.offset - 1);
        range.setEnd(pos.blot.domNode, pos.offset);
        side = 'right';
      }
      bounds = range.getBoundingClientRect();
    }
    return {
      height: bounds.height,
      left: bounds[side] - containerBounds.left,
      top: bounds.top - containerBounds.top
    };
  }

  getFormat(range) {
    if (range.isCollapsed()) {
      let path = this.doc.findPath(range.start, true);
      return path.reduce(function(formats, pos) {
        return extend(formats, pos.blot.getFormat());
      }, {});
    } else {
      let delta = this.doc.getDelta().slice(range.start, range.end);
      return delta.ops.reduce(function(formats, op) {
        let attributes = op.attributes || {};
        Object.keys(attributes).forEach(function(name) {
          let value = attributes[name];
          if (formats[name] != null && formats[name] !== value) {
            if (!Array.isArray(formats[name])) {
              formats[name] = [formats[name]];
            }
            if (formats[name].indexOf(value) < 0) {
              formats[name].push(value);
            }
          } else {
            formats[name] = value;
          }
        });
        return formats;
      }, {});
    }
  }

  getNativeRange() {
    let selection = document.getSelection();
    if (selection == null || selection.rangeCount <= 0) return null;
    let nativeRange = selection.getRangeAt(0);
    if (nativeRange.startContainer !== this.root &&
        !(nativeRange.startContainer.compareDocumentPosition(this.root) & Node.DOCUMENT_POSITION_CONTAINS)) {
      return null;
    }
    if (!nativeRange.collapsed &&   // save a call to compareDocumentPosition
        nativeRange.endContainer !== this.root &&
        !(nativeRange.endContainer.compareDocumentPosition(this.root) & Node.DOCUMENT_POSITION_CONTAINS)) {
      return null;
    }
    return nativeRange;
  }

  getRange() {
    if (!this.checkFocus()) return null;
    let nativeRange = this.getNativeRange();
    if (nativeRange == null) return null;
    let positions = [[nativeRange.startContainer, nativeRange.startOffset]];
    if (!nativeRange.collapsed) {
      positions.push([nativeRange.endContainer, nativeRange.endOffset]);
    }
    let indexes = positions.map((position) => {
      let [container, offset] = position;
      let blot = Parchment.findBlot(container, true);
      return blot.offset(this.doc) + blot.findOffset(container) + offset;
    });
    return new Range(Math.min(...indexes), Math.max(...indexes));
  }

  onUpdate(range) { }

  prepare(format, value) {
    this.update();
    let range = this.getRange();
    let cursor, index = range.start;
    let pos = this.doc.findPath(index).pop();
    if (pos.blot instanceof CursorBlot) {
      index -= 1;
    } else {
      pos.blot.insertAt(pos.offset, 'cursor', {});
      pos = this.doc.findPath(index + 1).pop();
      // pos can be null if insertAt was a noop
      if (pos == null || !(pos.blot instanceof CursorBlot)) return;
    }
    this.doc.formatAt(index, 1, format, value);
    this.setNativeRange(pos.blot.textNode, 1);  // Cursor will not blink if we select cursor.textNode
    this.update();
  }

  scrollIntoView() {
    if (this.lastRange == null) return;
    let startBounds = this.getBounds(this.lastRange.start);
    let endBounds = this.lastRange.isCollapsed() ? startBounds : this.getBounds(this.lastRange.end);
    let containerBounds = this.root.parentNode.getBoundingClientRect();
    let containerHeight = containerBounds.bottom - containerBounds.top;
    if (containerHeight < endBounds.top + endBounds.height) {
      let [line, offset] = this.doc.findLineAt(this.lastRange.end);
      return line.node.scrollIntoView(false);
    } else if (startBounds.top < 0) {
      let [line, offset] = this.doc.findLineAt(this.lastRange.start);
      return line.node.scrollIntoView();
    }
  }

  setNativeRange(startNode, startOffset, endNode = startNode, endOffset = startOffset) {
    let selection = document.getSelection();
    if (selection == null) return;
    if (startNode != null) {
      if (!this.checkFocus()) this.root.focus();
      let nativeRange = this.getNativeRange();
      if (nativeRange == null ||
          startNode !== nativeRange.startContainer || startOffset !== nativeRange.startOffset ||
          endNode !== nativeRange.endContainer || endOffset !== nativeRange.endOffset) {
        let range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      selection.removeAllRanges();
      this.root.blur();
      document.body.focus();  // root.blur() not enough on IE11+Travis+SauceLabs (but not local VMs)
    }
  }

  setRange(range) {
    if (range != null) {
      let indexes = range.isCollapsed() ? [range.start] : [range.start, range.end];
      let args = [];
      indexes.map((index) => {
        let [node, offset] = this.doc.findNode(index);
        if (node instanceof Text) {
          args.push(node, offset);
        } else {
          args.push(node.parentNode, [].indexOf.call(node.parentNode.childNodes, node) + offset);
        }
      });
      this.setNativeRange(...args);
    } else {
      this.setNativeRange(null);
    }
    this.update();
  }

  update(...args) {
    let oldRange = this.lastRange;
    this.lastRange = this.getRange();
    if (this.lastRange != null) {
      this.savedRange = this.lastRange;
    }
    if (!equal(oldRange, this.lastRange)) {
      if (this.lastRange != null) {
        this._cleanCursors(this.lastRange);
      }
      this.onUpdate(this.lastRange, ...args);
    }
  }

  _cleanCursors(range) {
    let cursor = Parchment.findBlot(this.root.querySelector(`.${Parchment.PREFIX}cursor`));
    if (cursor == null || cursor.domNode.innerHTML === CursorBlot.CONTENTS) return;
    let start = this.doc.findPath(range.start).pop();
    let end = range.isCollapsed() ? start : this.doc.findPath(range.end).pop();
    let args = [];
    [start, end].forEach(function(pos) {
      args.push(cursor.textNode, (pos.blot === cursor ? pos.offset - 1 : pos.offset));
    });
    cursor.textNode.data = cursor.getValue();
    cursor.parent.insertBefore(Parchment.create(cursor.textNode), cursor);
    cursor.remove();
    this.setNativeRange(...args);
  }
}
Selection.Range = Range;


export { Range, Selection as default };
