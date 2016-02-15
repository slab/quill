import Parchment from 'parchment';
import Emitter from './emitter';
import BlockBlot from '../blots/block';
import CursorBlot from '../blots/cursor';
import EmbedBlot from '../blots/embed';
import equal from 'deep-equal';


class Range {
  constructor(index, length = 0) {
    this.index = index;
    this.length = length;
  }
}


class Selection {
  constructor(scroll, emitter) {
    this.emitter = emitter;
    this.scroll = scroll;
    this.root = this.scroll.domNode;
    this.cursor = Parchment.create('cursor', this);
    this.lastRange = this.savedRange = new Range(0, 0);
    ['keyup', 'mouseup', 'mouseleave', 'touchend', 'touchleave'].forEach((eventName) => {
      this.root.addEventListener(eventName, this.update.bind(this, Emitter.sources.USER));
    });
    this.emitter.on(Emitter.events.TEXT_CHANGE, (delta) => {
      if (delta.length() > 0) {
        this.update(Emitter.sources.SILENT);
      }
    });
    // this.emitter.on(Emitter.events.SCROLL_OPTIMIZE, () => {
    //   this.setRange(this.savedRange);
    // });
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

  format(format, value) {
    this.scroll.update();
    let nativeRange = this.getNativeRange();
    if (nativeRange == null || !nativeRange.native.collapsed || Parchment.query(format, Parchment.Scope.BLOCK)) return;
    if (nativeRange.start.node !== this.cursor.textNode) {
      let blot = Parchment.find(nativeRange.start.node, false);
      if (blot == null) return;
      // TODO Give blot ability to not split
      if (blot instanceof Parchment.Leaf) {
        let after = blot.split(nativeRange.start.offset);
        blot.parent.insertBefore(this.cursor, after);
      } else {
        blot.insertBefore(this.cursor, nativeRange.start.node);  // Should never happen
      }
    }
    this.cursor.format(format, value);
    this.scroll.optimize();
    this.setNativeRange(this.cursor.textNode, 1);
    this.update();
  }

  getBounds(index) {
    let pos = this.scroll.path(index).pop();
    if (pos == null) return null;
    let containerBounds = this.root.parentNode.getBoundingClientRect();
    let side = 'left';
    let bounds, blot = pos[0], offset = pos[1];
    if (blot.length() === 0) {
      bounds = blot.parent.domNode.getBoundingClientRect();
    } else if (blot instanceof EmbedBlot) {
      bounds = blot.domNode.getBoundingClientRect();
      if (offset > 0) {
        side = 'right';
      }
    } else {
      let range = document.createRange();
      if (offset < blot.length()) {
        range.setStart(blot.domNode, offset);
        range.setEnd(blot.domNode, offset + 1);
        side = 'left';
      } else {
        range.setStart(blot.domNode, offset - 1);
        range.setEnd(blot.domNode, offset);
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
    if (nativeRange == null) return null;
    let range = {
      start: { node: nativeRange.startContainer, offset: nativeRange.startOffset },
      end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
      native: nativeRange
    };
    [range.start, range.end].forEach(function(position) {
      let node = position.node, offset = position.offset;
      while (!(node instanceof Text) && node.childNodes.length > 0) {
        if (node.childNodes.length > offset) {
          node = node.childNodes[offset];
          offset = 0;
        } else if (node.childNodes.length === offset) {
          node = node.lastChild;
          offset = node instanceof Text ? node.data.length : node.childNodes.length;
        } else {
          break;
        }
      }
      position.node = node, position.offset = offset;
    });
    return range;
  }

  getRange() {
    if (!this.checkFocus()) return [null, null];
    let range = this.getNativeRange();
    if (range == null) return [null, null];
    let positions = [[range.start.node, range.start.offset]];
    if (!range.native.collapsed) {
      positions.push([range.end.node, range.end.offset]);
    }
    let indexes = positions.map((position) => {
      let [node, offset] = position;
      let blot = Parchment.find(node, true);
      let index = blot.offset(this.scroll);
      if (offset === 0) {
        return index;
      } else if (blot instanceof Parchment.Container) {
        return index + blot.length();
      } else {
        return index + blot.index(node, offset);
      }
    });
    let start = Math.min(...indexes), end = Math.max(...indexes);
    return [new Range(start, end-start), range];
  }

  scrollIntoView() {
    if (this.lastRange == null) return;
    let startBounds = this.getBounds(this.lastRange.start);
    let endBounds = this.lastRange.collapsed ? startBounds : this.getBounds(this.lastRange.end);
    let containerBounds = this.root.parentNode.getBoundingClientRect();
    let containerHeight = containerBounds.bottom - containerBounds.top;
    if (containerHeight < endBounds.top + endBounds.height) {
      let [line, offset] = this.scroll.descendant(Block, this.lastRange.end);
      return line.node.scrollIntoView(false);
    } else if (startBounds.top < 0) {
      let [line, offset] = this.scroll.descendant(Block, this.lastRange.start);
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
          startNode !== nativeRange.start.node || startOffset !== nativeRange.start.offset ||
          endNode !== nativeRange.end.node || endOffset !== nativeRange.end.offset) {
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
      let indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
      let args = [];
      indexes.map((index, i) => {
        let leaf, [line, offset] = this.scroll.descendant(BlockBlot, index);
        [leaf, offset] = line.descendant(Parchment.Leaf, offset, true);
        args.push.apply(args, leaf.position(offset, i !== 0));
      });
      this.setNativeRange(...args);
    } else {
      this.setNativeRange(null);
    }
    this.update(source);
  }

  update(source = Emitter.sources.USER) {
    let nativeRange, oldRange = this.lastRange;
    [this.lastRange, nativeRange] = this.getRange();
    if (this.lastRange != null) {
      this.savedRange = this.lastRange;
    }
    if (!equal(oldRange, this.lastRange)) {
      if (nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
        this.cursor.detach();
      }
      if (source === Emitter.sources.SILENT) return;
      this.emitter.emit(Emitter.events.SELECTION_CHANGE, this.lastRange, source);
    }
  }
}


export { Range, Selection as default };
