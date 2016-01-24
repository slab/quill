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
    // TODO more efficient...
    let path = this.path(index);
    for (let i = 0; i < path.length; i++) {
      if (path[i][0] instanceof Block) return path[i];
    }
    return [null, -1];
  }

  getLines(index = 0, length = Number.MAX_SAFE_INTEGER) {
    return this.descendants(Block, index, length);
  }

  length() {
    return this.getLines().reduce(function(length, line) {
      return length + line.length();
    }, 0);
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
  }
}
Scroll.blotName = 'scroll';
Scroll.child = 'block';
Scroll.tagName = 'DIV';


Parchment.register(Scroll);

export default Scroll;
