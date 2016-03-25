import Emitter from '../core/emitter';
import BreakBlot from '../blots/break';
import CursorBlot from '../blots/cursor';
import Block, { EmbedBlock } from './block';
import Parchment from 'parchment';


// TODO move
function clean(container) {
  let walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  let node, textNodes = [];
  while(node = walker.nextNode()) {
    textNodes.push(node);
  }
  textNodes.forEach(function(textNode) {
    if (Parchment.query(textNode.previousSibling, Parchment.Scope.BLOCK) ||
        Parchment.query(textNode.nextSibling, Parchment.Scope.BLOCK)) {
      textNode.parentNode.removeChild(textNode);
    }
  });
  return container;
}

function isLine(blot) {
  return (blot instanceof Block || blot instanceof EmbedBlock);
}


const REQUIRED_TYPES = [
  BreakBlot.blotName,
  CursorBlot.blotName
];


class Scroll extends Parchment.Scroll {
  constructor(domNode, config) {
    super(clean(domNode));
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
    this.emitter.emit(Emitter.events.SCROLL_OPTIMIZE);
  }

  path(index) {
    return super.path(index).slice(1);  // Exclude self
  }

  update(mutations) {
    let source = Emitter.sources.USER;
    if (typeof mutations === 'string') {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    super.update(mutations);
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_UPDATE, source);
    }
  }
}
Scroll.blotName = 'scroll';
Scroll.className = 'ql-editor';
Scroll.childless = 'block';
Scroll.tagName = 'DIV';


export default Scroll;
