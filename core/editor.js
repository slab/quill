import clone from 'clone';
import equal from 'deep-equal';
import extend from 'extend';
import Delta from 'quill-delta';
import DeltaOp from 'quill-delta/lib/op';
import Parchment from 'parchment';
import CursorBlot from '../blots/cursor';
import Block, { bubbleFormats } from '../blots/block';
import Break from '../blots/break';

const ASCII = /^[ -~]*$/;

class Editor {
  constructor(scroll) {
    this.scroll = scroll;
    this.delta = this.getDelta();
  }

  applyDelta(delta) {
    let consumeNextNewline = false;
    this.scroll.update();
    let scrollLength = this.scroll.length();
    this.scroll.batchStart();
    const normalizedDelta = normalizeDelta(delta);
    normalizedDelta.reduce((index, op) => {
      const length = op.retain || op.delete || op.insert.length || 1;
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
          const [line, offset] = this.scroll.line(index);
          let formats = extend({}, bubbleFormats(line));
          if (line instanceof Block) {
            const [leaf] = line.descendant(Parchment.Leaf, offset);
            formats = extend(formats, bubbleFormats(leaf));
          }
          attributes = DeltaOp.attributes.diff(formats, attributes) || {};
        } else if (typeof op.insert === 'object') {
          const key = Object.keys(op.insert)[0]; // There should only be one key
          if (key == null) return index;
          this.scroll.insertAt(index, key, op.insert[key]);
        }
        scrollLength += length;
      }
      Object.keys(attributes).forEach(name => {
        this.scroll.formatAt(index, length, name, attributes[name]);
      });
      return index + length;
    }, 0);
    normalizedDelta.reduce((index, op) => {
      if (typeof op.delete === 'number') {
        this.scroll.deleteAt(index, op.delete);
        return index;
      }
      return index + (op.retain || op.insert.length || 1);
    }, 0);
    this.scroll.batchEnd();
    this.scroll.optimize();
    return this.update(normalizedDelta);
  }

  deleteText(index, length) {
    this.scroll.deleteAt(index, length);
    return this.update(new Delta().retain(index).delete(length));
  }

  formatLine(index, length, formats = {}) {
    this.scroll.update();
    Object.keys(formats).forEach(format => {
      if (this.scroll.whitelist != null && !this.scroll.whitelist[format])
        return;
      this.scroll.lines(index, Math.max(length, 1)).forEach(line => {
        line.format(format, formats[format]);
      });
    });
    this.scroll.optimize();
    const delta = new Delta().retain(index).retain(length, clone(formats));
    return this.update(delta);
  }

  formatText(index, length, formats = {}) {
    Object.keys(formats).forEach(format => {
      this.scroll.formatAt(index, length, format, formats[format]);
    });
    const delta = new Delta().retain(index).retain(length, clone(formats));
    return this.update(delta);
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
    let lines = [];
    let leaves = [];
    if (length === 0) {
      this.scroll.path(index).forEach(path => {
        const [blot] = path;
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
    const formatsArr = [lines, leaves].map(blots => {
      if (blots.length === 0) return {};
      let formats = bubbleFormats(blots.shift());
      while (Object.keys(formats).length > 0) {
        const blot = blots.shift();
        if (blot == null) return formats;
        formats = combineFormats(bubbleFormats(blot), formats);
      }
      return formats;
    });
    return extend.apply(extend, formatsArr);
  }

  getText(index, length) {
    return this.getContents(index, length)
      .filter(op => typeof op.insert === 'string')
      .map(op => op.insert)
      .join('');
  }

  insertEmbed(index, embed, value) {
    this.scroll.insertAt(index, embed, value);
    return this.update(new Delta().retain(index).insert({ [embed]: value }));
  }

  insertText(index, text, formats = {}) {
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    this.scroll.insertAt(index, text);
    Object.keys(formats).forEach(format => {
      this.scroll.formatAt(index, text.length, format, formats[format]);
    });
    return this.update(new Delta().retain(index).insert(text, clone(formats)));
  }

  isBlank() {
    if (this.scroll.children.length === 0) return true;
    if (this.scroll.children.length > 1) return false;
    const block = this.scroll.children.head;
    if (block.statics.blotName !== Block.blotName) return false;
    if (block.children.length > 1) return false;
    return block.children.head instanceof Break;
  }

  removeFormat(index, length) {
    const text = this.getText(index, length);
    const [line, offset] = this.scroll.line(index + length);
    let suffixLength = 0;
    let suffix = new Delta();
    if (line != null) {
      suffixLength = line.length() - offset;
      suffix = line
        .delta()
        .slice(offset, offset + suffixLength - 1)
        .insert('\n');
    }
    const contents = this.getContents(index, length + suffixLength);
    const diff = contents.diff(new Delta().insert(text).concat(suffix));
    const delta = new Delta().retain(index).concat(diff);
    return this.applyDelta(delta);
  }

  update(change, mutations = [], cursorIndex = undefined) {
    const oldDelta = this.delta;
    if (
      mutations.length === 1 &&
      mutations[0].type === 'characterData' &&
      mutations[0].target.data.match(ASCII) &&
      Parchment.find(mutations[0].target)
    ) {
      // Optimization for character changes
      const textBlot = Parchment.find(mutations[0].target);
      const formats = bubbleFormats(textBlot);
      const index = textBlot.offset(this.scroll);
      const oldValue = mutations[0].oldValue.replace(CursorBlot.CONTENTS, '');
      const oldText = new Delta().insert(oldValue);
      const newText = new Delta().insert(textBlot.value());
      const diffDelta = new Delta()
        .retain(index)
        .concat(oldText.diff(newText, cursorIndex));
      change = diffDelta.reduce((delta, op) => {
        if (op.insert) {
          return delta.insert(op.insert, formats);
        }
        return delta.push(op);
      }, new Delta());
      this.delta = oldDelta.compose(change);
    } else {
      this.delta = this.getDelta();
      if (!change || !equal(oldDelta.compose(change), this.delta)) {
        change = oldDelta.diff(this.delta, cursorIndex);
      }
    }
    return change;
  }
}

function combineFormats(formats, combined) {
  return Object.keys(combined).reduce((merged, name) => {
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
  return delta.reduce((normalizedDelta, op) => {
    if (typeof op.insert === 'string') {
      const text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      return normalizedDelta.insert(text, op.attributes);
    }
    return normalizedDelta.push(op);
  }, new Delta());
}

export default Editor;
