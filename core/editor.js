import Delta from 'rich-text/lib/delta';
import DeltaOp from 'rich-text/lib/op';
import Emitter from './emitter';
import Parchment from 'parchment';
import CodeBlock from '../formats/code';
import CursorBlot from '../blots/cursor';
import Block, { bubbleFormats } from '../blots/block';
import clone from 'clone';
import equal from 'deep-equal';
import extend from 'extend';


class Editor {
  constructor(scroll, emitter) {
    this.scroll = scroll;
    this.emitter = emitter;
    this.emitter.on(Emitter.events.SCROLL_UPDATE, this.update.bind(this, null));
    this.delta = this.getDelta();
    this.enable();
  }

  applyDelta(delta, source = Emitter.sources.API) {
    let consumeNextNewline = false;
    this.scroll.update();
    let scrollLength = this.scroll.length();
    this.scroll.batch = true;
    delta = normalizeDelta(delta);
    delta.ops.reduce((index, op) => {
      let length = op.retain || op.delete || op.insert.length || 1;
      let attributes = op.attributes || {};
      if (op.insert != null) {
        if (typeof op.insert === 'string') {
          let text = op.insert;
          if (text.endsWith('\n') && consumeNextNewline) {
            consumeNextNewline = false;
            text = text.slice(0, -1);
          }
          if (index >= scrollLength && !text.endsWith('\n')) {
            consumeNextNewline = true;
          }
          this.scroll.insertAt(index, text);
          let [line, offset] = this.scroll.line(index);
          let formats = extend({}, bubbleFormats(line));
          if (line instanceof Block) {
            let [leaf, ] = line.descendant(Parchment.Leaf, offset);
            formats = extend(formats, bubbleFormats(leaf));
          }
          attributes = DeltaOp.attributes.diff(formats, attributes) || {};
        } else if (typeof op.insert === 'object') {
          let key = Object.keys(op.insert)[0];  // There should only be one key
          if (key == null) return index;
          this.scroll.insertAt(index, key, op.insert[key]);
        }
        scrollLength += length;
      }
      Object.keys(attributes).forEach((name) => {
        this.scroll.formatAt(index, length, name, attributes[name]);
      });
      return index + length;
    }, 0);
    delta.ops.reduce((index, op) => {
      if (typeof op.delete === 'number') {
        this.scroll.deleteAt(index, op.delete);
        return index;
      }
      return index + (op.retain || op.insert.length || 1);
    }, 0);
    this.scroll.batch = false;
    this.scroll.optimize();
    return this.update(delta, source);
  }

  deleteText(index, length, source = Emitter.sources.API) {
    this.scroll.deleteAt(index, length);
    return this.update(new Delta().retain(index).delete(length), source);
  }

  enable(enabled = true) {
    this.scroll.domNode.setAttribute('contenteditable', enabled);
  }

  formatLine(index, length, formats = {}, source = Emitter.sources.API) {
    this.scroll.update();
    Object.keys(formats).forEach((format) => {
      let lines = this.scroll.lines(index, Math.max(length, 1));
      let lengthRemaining = length;
      lines.forEach((line, i) => {
        let lineLength = line.length();
        if (!(line instanceof CodeBlock)) {
          line.format(format, formats[format]);
        } else {
          let codeIndex = index - line.offset(this.scroll);
          let codeLength = line.newlineIndex(codeIndex + lengthRemaining) - codeIndex + 1;
          line.formatAt(codeIndex, codeLength, format, formats[format]);
        }
        lengthRemaining -= lineLength;
      });
    });
    this.scroll.optimize();
    return this.update(new Delta().retain(index).retain(length, clone(formats)), source);
  }

  formatText(index, length, formats = {}, source = Emitter.sources.API) {
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index, length, format, formats[format]);
    });
    return this.update(new Delta().retain(index).retain(length, clone(formats)), source);
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
        let [blot, ] = path;
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
      return formats;
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
    return this.update(new Delta().retain(index).insert({ [embed]: value }), source);
  }

  insertText(index, text, formats = {}, source = Emitter.sources.API) {
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    this.scroll.insertAt(index, text);
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index, text.length, format, formats[format]);
    });
    return this.update(new Delta().retain(index).insert(text, clone(formats)), source)
  }

  isBlank() {
    if (this.scroll.children.length == 0) return true;
    if (this.scroll.children.length > 1) return false;
    let child = this.scroll.children.head;
    return child.length() <= 1 && Object.keys(child.formats()).length == 0;
  }

  removeFormat(index, length, source) {
    let text = this.getText(index, length);
    let [line, offset] = this.scroll.line(index + length);
    let suffixLength = 0, suffix = new Delta();
    if (line != null) {
      if (!(line instanceof CodeBlock)) {
        suffixLength = line.length() - offset;
      } else {
        suffixLength = line.newlineIndex(offset) - offset + 1;
      }
      suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
    }
    let contents = this.getContents(index, length + suffixLength);
    let diff = contents.diff(new Delta().insert(text).concat(suffix));
    let delta = new Delta().retain(index).concat(diff);
    return this.applyDelta(delta, source);
  }

  update(change, source = Emitter.sources.USER, mutations = []) {
    let oldDelta = this.delta;
    if (mutations.length === 1 &&
        mutations[0].type === 'characterData' &&
        Parchment.find(mutations[0].target)) {
      // Optimization for character changes
      let textBlot = Parchment.find(mutations[0].target);
      let formats = bubbleFormats(textBlot);
      let index = textBlot.offset(this.scroll);
      let oldValue = mutations[0].oldValue.replace(CursorBlot.CONTENTS, '');
      let oldText = new Delta().insert(oldValue);
      let newText = new Delta().insert(textBlot.value());
      let diffDelta = new Delta().retain(index).concat(oldText.diff(newText));
      change = diffDelta.ops.reduce(function(delta, op) {
        if (op.insert) {
          return delta.insert(op.insert, formats);
        } else {
          return delta.push(op);
        }
      }, new Delta());
      this.delta = oldDelta.compose(change);
    } else {
      this.delta = this.getDelta();
      if (!change || !equal(oldDelta.compose(change), this.delta)) {
        change = oldDelta.diff(this.delta);
      }
    }
    if (change.length() > 0) {
      let args = [Emitter.events.TEXT_CHANGE, change, oldDelta, source];
      this.emitter.emit(Emitter.events.EDITOR_CHANGE, ...args);
      if (source !== Emitter.sources.SILENT) {
        this.emitter.emit(...args);
      }
    }
    return change;
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

function normalizeDelta(delta) {
  return delta.ops.reduce(function(delta, op) {
    if (op.insert === 1) {
      let attributes = clone(op.attributes);
      delete attributes['image'];
      return delta.insert({ image: op.attributes.image }, attributes);
    }
    if (op.attributes != null && (op.attributes.list === true || op.attributes.bullet === true)) {
      op = clone(op);
      if (op.attributes.list) {
        op.attributes.list = 'ordered';
      } else {
        op.attributes.list = 'bullet';
        delete op.attributes.bullet;
      }
    }
    if (typeof op.insert === 'string') {
      let text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      return delta.insert(text, op.attributes);
    }
    return delta.push(op);
  }, new Delta());
}


export default Editor;
