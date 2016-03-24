import Emitter from '../core/emitter';
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


class Scroll extends Parchment.Scroll {
  constructor(domNode, emitter) {
    super(clean(domNode));
    this.emitter = emitter;
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

  insertBefore(childBlot, refBlot) {
    if (!isLine(childBlot)) {
      let block = Parchment.create(this.statics.childless);
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
