import Parchment from 'parchment';
import Emitter from './emitter';
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
  constructor(scroll, emitter) {
    this.emitter = emitter;
    this.scroll = scroll;
    this.root = this.scroll.domNode;
    this.cursor = Parchment.create('cursor');
    this.lastRange = this.savedRange = new Range(0, 0);
    ['keyup', 'mouseup', 'mouseleave', 'touchend', 'touchleave'].forEach((eventName) => {
      this.root.addEventListener(eventName, this.update.bind(this, Emitter.sources.USER));
    });
    this.emitter.on(Emitter.events.TEXT_CHANGE, (delta) => {
      if (delta.length > 0) this.update(Emitter.sources.SILENT);
    });
    this.update(Emitter.sources.SILENT);
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
    let pos = this.scroll.findPath(index).pop();
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
    let nativeRange = this.getNativeRange();
    if (nativeRange == null) return null;
    let positions = [[nativeRange.startContainer, nativeRange.startOffset]];
    if (!nativeRange.collapsed) {
      positions.push([nativeRange.endContainer, nativeRange.endOffset]);
    }
    let indexes = positions.map((position) => {
      let [container, offset] = position;
      let blot = Parchment.findBlot(container, true);
      return blot.offset(this.scroll) + blot.findOffset(container) + offset;
    });
    return new Range(Math.min(...indexes), Math.max(...indexes));
  }

  prepare(format, value) {
    this.scroll.update();
    let nativeRange = this.getNativeRange();
    if (!nativeRange.collapsed) return;
    if (nativeRange.startContainer != this.cursor.textNode) {
      let blot = Parchment.findBlot(nativeRange.startContainer, false);
      if (blot == null) return;
      let after = blot.split(nativeRange.startOffset);
      blot.parent.insertBefore(this.cursor, after);
    }
    this.cursor.format(format, value);
    this.setNativeRange(this.cursor.textNode, 1);
    this.update();
  }

  scrollIntoView() {
    if (this.lastRange == null) return;
    let startBounds = this.getBounds(this.lastRange.start);
    let endBounds = this.lastRange.isCollapsed() ? startBounds : this.getBounds(this.lastRange.end);
    let containerBounds = this.root.parentNode.getBoundingClientRect();
    let containerHeight = containerBounds.bottom - containerBounds.top;
    if (containerHeight < endBounds.top + endBounds.height) {
      let [line, offset] = this.scroll.findLine(this.lastRange.end);
      return line.node.scrollIntoView(false);
    } else if (startBounds.top < 0) {
      let [line, offset] = this.scroll.findLine(this.lastRange.start);
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

  setRange(range, source = Emitter.sources.API) {
    if (range != null) {
      let indexes = range.isCollapsed() ? [range.start] : [range.start, range.end];
      let args = [];
      indexes.map((index) => {
        let [node, offset] = this.scroll.findNode(index);
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
    this.update(source);
  }

  update(source = Emitter.sources.USER) {
    let oldRange = this.lastRange;
    this.lastRange = this.getRange();
    if (this.lastRange != null) {
      this.savedRange = this.lastRange;
    }
    if (!equal(oldRange, this.lastRange)) {
      this.emitter.emit(Emitter.events.SELECTION_CHANGE, this.lastRange, source);
    }
  }
}


export { Range, Selection as default };
