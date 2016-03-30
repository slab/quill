import Parchment from 'parchment';
import Emitter from 'quill/emitter';
import BreakBlot from 'quill/blots/break';
import Block, { EmbedBlock } from 'quill/blots/block';
import CursorBlot from 'quill/blots/cursor';


function isLine(blot) {
  return (blot instanceof Block || blot instanceof EmbedBlock);
}


const REQUIRED_TYPES = [
  BreakBlot.blotName,
  CursorBlot.blotName
];


class Scroll extends Parchment.Scroll {
  constructor(domNode, config) {
    super(domNode);
    this.emitter = config.emitter;
    if (Array.isArray(config.whitelist)) {
      this.whitelist = {};
      config.whitelist.concat(REQUIRED_TYPES).forEach((name) => {
        this.whitelist[name] = true;
      });
    }
    this.optimize();
  }

  deleteAt(index, length) {
    let [first, firstOffset] = this.children.find(index);
    let [last, lastOffset] = this.children.find(index + length);
    super.deleteAt(index, length);
    if (last != null && first !== last && firstOffset > 0) {
      let lastChild = first.children.tail;
      last.moveChildren(first);
      last.remove();
    }
    this.optimize();
  }

  formatAt(index, length, format, value) {
    if (this.whitelist != null && !this.whitelist[format]) return;
    super.formatAt(index, length, format, value);
  }

  insertAt(index, value, def) {
    if (def != null && this.whitelist != null && !this.whitelist[value]) return;
    super.insertAt(index, value, def);
  }

  insertBefore(childBlot, refBlot) {
    if (childBlot.scope & Parchment.Scope.INLINE) {
      let block = Parchment.create(Parchment.Scope.BLOCK);
      block.insertBefore(childBlot);
      childBlot = block;
    }
    super.insertBefore(childBlot, refBlot);
  }

  line(index) {
    return this.descendant(isLine, index);
  }

  lines(index, length) {
    return this.descendants(isLine, index, length);
  }

  optimize(mutations) {
    super.optimize(mutations);
    this.emitter.emit(Emitter.events.SCROLL_CHANGE);
  }

  path(index) {
    return super.path(index).slice(1);  // Exclude self
  }
}
Scroll.blotName = 'scroll';
Scroll.className = 'ql-editor';
Scroll.childless = 'block';
Scroll.tagName = 'DIV';


export default Scroll;
