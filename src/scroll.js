import Block from './blots/block';
import Emitter from './emitter';
import Parchment from 'parchment';


class Scroll extends Parchment.Scroll {
  constructor(domNode, emitter) {
    super(domNode);
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

  findLine(index) {
    let path = this.path(index);
    for (let i = 0; i < path.length; i++) {
      if (path[i].blot instanceof Block) return path[i];
    }
    return null;
  }

  getLeaves(start = 0, end = this.length()) {
    return this.descendants(Parchment.Leaf, start, end - start);
  }

  getLines(start = 0, end = this.length()) {
    return this.descendants(Block, start, end - start);
  }

  path(index) {
    if (index >= this.length()) {
      return [];
    } else {
      return super.path(index).slice(1);  // Exclude self
    }
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
Scroll.child = 'block';
Scroll.tagName = 'DIV';


Parchment.register(Scroll);

export { Scroll as default };
