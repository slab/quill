import Block from './block';
import Emitter from '../core/emitter';
import Parchment from 'parchment';


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

  length() {
    return this.descendants(Block).reduce(function(length, line) {
      return length + line.length();
    }, 0);
  }

  optimize(mutations = []) {
    super.optimize(mutations);
    this.emitter.emit(Emitter.events.SCROLL_OPTIMIZE);
  }

  path(index, inclusive) {
    return super.path(index, inclusive).slice(1);  // Exclude self
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
    this.optimize(mutations, source);
  }
}
Scroll.blotName = 'scroll';
Scroll.className = 'ql-editor';
Scroll.child = 'block';
Scroll.tagName = 'DIV';


export default Scroll;
