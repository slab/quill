import Parchment from 'parchment';
import equal from 'deep-equal';
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
    let convert = (node, offset) => {
      let blot;
      if (!(node instanceof Text)) {
        if (offset >= node.childNodes.length) {
          blot = Parchment.findBlot(node);
          return blot.offset(this.doc) + blot.getLength();
        } else {
          node = node.childNodes[offset];
          offset = 0;
        }
      }
      blot = Parchment.findBlot(node);
      return blot.offset(this.doc) + offset;
    }
    let nativeRange = this.getNativeRange();
    if (nativeRange == null) return null;
    let start = convert(nativeRange.startContainer, nativeRange.startOffset);
    let end = (nativeRange.collapsed) ? start : convert(nativeRange.endContainer, nativeRange.endOffset);
    return new Range(Math.min(start, end), Math.max(start, end));
  }

  onUpdate(range) { }

  prepare(format, value) {
    this.update();
    let range = this.getRange();
    let pos = this.doc.findPath(range.start).pop();
    let target = pos.blot.split(pos.offset);
    let cursor = Parchment.create('cursor');
    target.parent.insertBefore(cursor, target);
    cursor.format(format, value);
    // Cursor will not blink if we make selection
    this.setNativeRange(cursor.domNode.firstChild, 1);
  }

  scrollIntoView() {
    if (this.range == null) return;
    let startBounds = this.getBounds(this.range.start);
    let endBounds = this.range.isCollapsed() ? startBounds : this.getBounds(this.range.end);
    let containerBounds = this.root.parentNode.getBoundingClientRect();
    let containerHeight = containerBounds.bottom - containerBounds.top;
    if (containerHeight < endBounds.top + endBounds.height) {
      let [line, offset] = this.doc.findLineAt(this.range.end);
      return line.node.scrollIntoView(false);
    } else if (startBounds.top < 0) {
      let [line, offset] = this.doc.findLineAt(this.range.start);
      return line.node.scrollIntoView();
    }
  }

  setNativeRange(startNode, startOffset, endNode = startNode, endOffset = startOffset) {
    let selection = document.getSelection();
    if (selection == null) return;
    if (startNode != null) {
      // Need to focus before setting or else in IE9/10 later focus will cause a set on
      // 0th index on line div to be set at 1st index
      if (!this.checkFocus()) {
        this.root.focus();
      }
      let nativeRange = this.getNativeRange();
      // TODO do we need to avoid setting on same range?
      if (nativeRange == null ||
          startNode !== nativeRange.startContainer || startOffset !== nativeRange.startOffset ||
          endNode !== nativeRange.endContainer || endOffset !== nativeRange.endOffset) {
        // TODO no longer need this consideration for IE9
        // IE9 requires removeAllRanges() regardless of value of
        // nativeRange or else formatting from toolbar does not work
        selection.removeAllRanges();
        let range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.addRange(range);
      }
    } else {
      selection.removeAllRanges();
      this.root.blur();
      // setRange(null) will fail to blur in IE10/11 on Travis+SauceLabs (but not local VMs)
      if (platform.isIE()) {
        document.body.focus();
      }
    }
  }

  setRange(range) {
    let convert = (index) => {
      let pos = this.doc.findPath(index).pop();
      if (pos.blot instanceof Parchment.Embed) {
        let node = pos.blot.domNode.parentNode;
        return [node, [].indexOf.call(node.childNodes, pos.blot.domNode) + pos.offset];
      } else {
        return [pos.blot.domNode, pos.offset];
      }
    }
    if (range != null) {
      let [startNode, startOffset] = convert(range.start);
      if (range.isCollapsed()) {
        this.setNativeRange(startNode, startOffset);
      } else {
        let [endNode, endOffset] = convert(range.end);
        this.setNativeRange(startNode, startOffset, endNode, endOffset);
      }
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
      this.onUpdate(this.lastRange, ...args);
    }
  }
}
Selection.Range = Range;


export { Range, Selection as default };
