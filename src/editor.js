import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Editor {
  constructor(scroll, emitter) {
    this.scroll = scroll;
    this.emitter = emitter;
    this.emitter.on('scroll-update', this.update, this);
    this.delta = this.getDelta();
  }

  applyDelta(delta, source) {
    delta.ops.reduce((index, op) => {
      if (op.insert != null) {
        // TODO handle insert with attributes
        if (typeof op.insert === 'string') {
          this.insertAt(index, op.insert);
          return index + op.insert.length;
        } else {
          let key = Object.keys(op.insert)[0];
          this.insertAt(index, key, op.insert[key]);
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
    this.update(source);
  }

  deleteAt(index, length, source) {
    this.scroll.deleteAt(index, length);
  }

  insertAt(index, value, source) {
    this.scroll.insertAt(index, value);
    this.update(source);
  }

  formatAt(index, length, format, value) {
    this.scroll.formatAt(index, length, format, value);
  }

  getText(start, end) {
    // TODO optimize
    let values = [].concat.apply([], this.scroll.getValue());
    return values.map(function(value) {
      return typeof value === 'string' ? value : '';   // Exclude embeds
    }).join('').slice(start, end);
  }

  update(source) {
    let oldDelta = this.delta;
    this.delta = this.getDelta();
    let change = oldDelta.diff(this.delta);
    if (change.length() > 0) {
      this.emitter.emit('text-change', change, source);
    }
  }

  enable(enabled = true) {
    this.scroll.domNode.setAttribute('contenteditable', enabled);
  }

  getDelta() {
    return this.scroll.getLines().reduce((delta, child) => {
      return delta.concat(child.getDelta());
    }, new Delta());
  }

  optimize(mutations) {
    this.ensureChild();
    super.optimize(mutations);
  }
}


export { Editor as default };
