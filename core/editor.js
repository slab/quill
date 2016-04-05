import Delta from 'rich-text/lib/delta';
import DeltaOp from 'rich-text/lib/op';
import Emitter from './emitter';
import Parchment from 'parchment';
import Block, { bubbleFormats } from '../blots/block';
import clone from 'clone';
import extend from 'extend';


class Editor {
  constructor(scroll, emitter) {
    this.scroll = scroll;
    this.emitter = emitter;
    this.emitter.on(Emitter.events.SCROLL_UPDATE, this.update, this);
    this.delta = this.getDelta();
    this.enable();
  }

  applyDelta(delta, source = Emitter.sources.API) {
    delta.ops.reduce((index, op) => {
      if (typeof op.delete === 'number') {
        this.scroll.deleteAt(index, op.delete);
        return index;
      }
      let length = op.retain || op.insert.length || 1;
      let attributes = op.attributes || {};
      if (op.insert != null) {
        if (typeof op.insert === 'string') {
          this.scroll.insertAt(index, op.insert);
          let leaf, [line, offset] = this.scroll.line(index);
          if (line instanceof Parchment.Leaf) {
            leaf = line;
          } else {
            [leaf, offset] = line.descendant(Parchment.Leaf, offset);
          }
          let formats = extend({}, line.formats(), bubbleFormats(leaf));
          attributes = DeltaOp.attributes.diff(formats, attributes) || {};
        } else if (typeof op.insert === 'object') {
          let key = Object.keys(op.insert)[0];
          this.scroll.insertAt(index, key, op.insert[key]);
          attributes = clone(attributes);
          delete attributes[key];
        }
      }
      Object.keys(attributes).forEach((name) => {
        this.scroll.formatAt(index, length, name, attributes[name]);
      });
      return index + length;
    }, 0);
    this.update(source);
  }

  deleteText(index, length, source = Emitter.sources.API) {
    this.scroll.deleteAt(index, length);
    this.update(source);
  }

  enable(enabled = true) {
    this.scroll.domNode.setAttribute('contenteditable', enabled);
  }

  formatLine(index, length, formats = {}, source = Emitter.sources.API) {
    this.scroll.update();
    Object.keys(formats).forEach((format) => {
      this.scroll.lines(index, Math.max(length, 1)).forEach(function(line) {
        line.format(format, formats[format]);
      });
    });
    this.scroll.optimize();
    this.update(source);
  }

  formatText(index, length, formats = {}, source = Emitter.sources.API) {
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index, length, format, formats[format]);
    });
    this.update(source);
  }

  getContents(index, length) {
    return this.delta.slice(index, index + length);
  }

  getDelta() {
    return this.scroll.lines().reduce((delta, line) => {
      return delta.concat(line.delta());
    }, new Delta());
  }

  getFormat(index, length = 0) {
    let lines = [], leaves = [];
    if (length === 0) {
      this.scroll.path(index).forEach(function(path) {
        let [blot, offset] = path;
        if (blot instanceof Block) {
          lines.push(blot);
        } else if (blot instanceof Parchment.Leaf) {
          leaves.push(blot);
        }
      });
    } else {
      lines = this.scroll.lines(index, length);
      leaves = this.scroll.descendants(Parchment.Leaf, index, length);
    }
    let formatsArr = [lines, leaves].map(function(blots) {
      if (blots.length === 0) return {};
      let formats = bubbleFormats(blots.shift());
      while (Object.keys(formats).length > 0) {
        let blot = blots.shift();
        if (blot == null) return formats;
        formats = combineFormats(bubbleFormats(blot), formats);
      }
    });
    return extend.apply(extend, formatsArr);
  }

  getText(index, length) {
    return this.getContents(index, length).ops.map(function(op) {
      return (typeof op.insert === 'string') ? op.insert : '';
    }).join('');
  }

  insertEmbed(index, embed, value, source = Emitter.sources.API) {
    this.scroll.insertAt(index, embed, value);
    this.update(source);
  }

  insertText(index, text, formats = {}, source = Emitter.sources.API) {
    this.scroll.insertAt(index, text);
    this.formatText(index, text.length, formats, source);
  }

  removeFormat(index, length) {
    let text = this.getText(index, length);
    let delta = new Delta().retain(index).insert(text).delete(length);
    let [line, offset] = this.scroll.line(index + length);
    delta.retain(line.length() - offset - 1).delete(1).insert('\n');
    this.applyDelta(delta);
  }

  update(source = Emitter.sources.USER) {
    let oldDelta = this.delta;
    this.delta = this.getDelta();
    let change = oldDelta.diff(this.delta);
    if (change.length() > 0) {
      this.emitter.emit(Emitter.events.TEXT_CHANGE, change, oldDelta, source);
    }
  }
}


function combineFormats(formats, combined) {
  return Object.keys(combined).reduce(function(merged, name) {
    if (formats[name] == null) return merged;
    if (combined[name] === formats[name]) {
      merged[name] = combined[name];
    } else if (Array.isArray(combined[name])) {
      if (combined[name].indexOf(formats[name]) < 0) {
        merged[name] = combined[name].concat([formats[name]]);
      }
    } else {
      merged[name] = [combined[name], formats[name]];
    }
    return merged;
  }, {});
}


export default Editor;
