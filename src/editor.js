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
      if (typeof op.delete === 'number') {
        this.scroll.deleteAt(index, op.delete);
        return index;
      }
      let length = op.retain || op.insert.length || 1;
      if (typeof op.insert === 'string') {
        this.scroll.insertAt(index, op.insert);
      } else if (typeof op.insert === 'object') {
        let key = Object.keys(op.insert)[0];
        this.scroll.insertAt(index, key, op.insert[key]);
      }
      Object.keys(op.attributes || {}).forEach((name) => {
        this.scroll.formatAt(index, op.retain, name, op.attributes[name]);
      });
      return index + length;
    }, 0);
    this.update(source);
  }

  deleteText(start, end, source) {
    this.scroll.deleteAt(index, length);
    this.update(source);
  }

  enable(enabled = true) {
    this.scroll.domNode.setAttribute('contenteditable', enabled);
  }

  formatLine(start, end, formats, source) {
    Object.keys(formats).forEach((format) => {
      this.scroll.getLines(start, end - start).forEach(function(line) {
        line.format(format, formats[format]);
      });
    });
    this.update(source);
  }

  formatText(start, end, formats, source) {
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(start, end - start, format, formats[format]);
    });
    this.update(source);
  }

  getContents(start, end) {
    return this.delta.slice(start, end);
  }

  getDelta() {
    return this.scroll.getLines().reduce((delta, child) => {
      // TODO implement without block knowing about deltas
      return delta.concat(child.getDelta());
    }, new Delta());
  }

  getHTML() {
    return this.delta.toHTML();
  }

  getText(start, end) {
    // TODO optimize
    let values = [].concat.apply([], this.scroll.getValue());
    return values.map(function(value) {
      return typeof value === 'string' ? value : '';   // Exclude embeds
    }).join('').slice(start, end);
  }

  insertEmbed(index, embed, value, formats, source) {
    this.scroll.insertAt(index, embed, value);
    this.formatText(index, index + 1, formats, source);
  }

  insertText(index, text, formats, source) {
    this.scroll.insertAt(index, text);
    this.formatText(index, index + text.length, formats, source);
  }

  update(source) {
    let oldDelta = this.delta;
    this.delta = this.getDelta();
    let change = oldDelta.diff(this.delta);
    if (change.length() > 0) {
      this.emitter.emit('text-change', change, source);
    }
  }
}


export { Editor as default };
