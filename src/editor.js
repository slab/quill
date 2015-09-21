import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Editor extends Parchment.Container {
  constructor(domNode) {
    // TODO fix?
    if (domNode.innerHTML.indexOf('\n') > -1) {
      domNode.innerHTML = domNode.innerHTML.replace(/\n\s*/g, '');
    }
    super(domNode);
    this.ensureChild();
    this.enable();
    this.delta = this.getDelta();
    this.observer = new MutationObserver((mutations) => {
      this.update(mutations);   // Do not pass additional params from MutationObserver handler
    });
    this.observer.observe(this.domNode, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  applyDelta(delta) {
    delta.ops.reduce((index, op) => {
      if (op.insert != null) {
        if (typeof op.insert === 'string') {
          this.insertAt(index, op.insert);
          return index + op.insert.length;
        } else {
          this.insertAt(index, op.attributes);
          return index + 1;
        }
      } else if (typeof op.delete === 'number') {
        this.deleteAt(index, op.delete);
        return index;
      } else if (typeof op.retain === 'number') {
        Object.keys(op.attributes || {}).forEach((name) => {
          this.formatAt(index, op.retain, name, op.attributes[name]);
        });
        return index + op.retain;
      }
    }, 0);
  }

  deleteAt(index, length) {
    let [first, firstOffset] = this.children.find(index);
    let [last, lastOffset] = this.children.find(index + length);
    super.deleteAt(index, length);
    if (last != null && first !== last && firstOffset > 0) {
      let lastChild = first.children.tail;
      last.moveChildren(first);
      last.remove();
      if (lastChild != null) {
        lastChild.merge();
      }
    }
    this.ensureChild();
  }

  enable(enabled = true) {
    this.domNode.setAttribute('contenteditable', enabled);
  }

  ensureChild() {
    if (this.children.length === 0) {
      this.appendChild(Parchment.create('block'));
    }
  }

  findPath(index) {
    if (index >= this.getLength()) {
      return [];
    } else {
      return super.findPath(index).slice(1);  // Exclude self
    }
  }

  getDelta() {
    return this.getLines().reduce((delta, child) => {
      return delta.concat(child.getDelta());
    }, new Delta());
  }

  getLines(index = 0, length = this.getLength()) {
    return this.getDescendants(index, length, Parchment.Block);
  }

  onUpdate(delta) { }

  remove() {
    this.children.forEach(function(child) {
      child.remove();
    });
  }

  update(...args) {
    let mutations;
    if (Array.isArray(args[0])) {
      mutations = args[0];
      args = args.slice(1);
    } else {
      mutations = this.observer.takeRecords();
    }
    if (mutations.length === 0) return new Delta();
    let oldDelta = this.delta;
    // TODO optimize
    this.build();
    this.delta = this.getDelta();
    let change = oldDelta.diff(this.delta);
    if (change.length() > 0) {
      this.onUpdate(change, ...args);
    }
    this.observer.takeRecords();  // Prevent changes from rebuilds
    return change;
  }
}


export { Editor as default };
