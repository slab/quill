import Block from './blots/block';
import Emitter from './emitter';
import Parchment from 'parchment';


class Scroll extends Parchment.Container {
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

  ensureChild() {
    if (this.children.length === 0) {
      this.appendChild(Parchment.create('block'));
    }
  }

  findLine(index, inclusive = false) {
    let path = this.findPath(index, inclusive);
    for (let i = 0; i < path.length; i++) {
      if (path[i].blot instanceof Block) return path[i];
    }
    return null;
  }

  findPath(index, inclusive = false) {
    if (index >= this.getLength()) {
      return [];
    } else {
      return super.findPath(index, inclusive).slice(1);  // Exclude self
    }
  }

  getLines(index = 0, length = this.getLength()) {
    return this.getDescendants(index, length, Block);
  }

  remove() {
    this.children.forEach(function(child) {
      child.remove();
    });
    this.optimize();
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
