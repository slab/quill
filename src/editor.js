import Delta from 'rich-text/lib/delta';
import Emitter from './emitter';
import Parchment from 'parchment';
import Block from './blots/block';
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

  deleteText(start, end, source = Emitter.sources.API) {
    this.scroll.deleteAt(start, end - start);
    this.update(source);
  }

  enable(enabled = true) {
    this.scroll.domNode.setAttribute('contenteditable', enabled);
  }

  formatLine(start, end, formats = {}, source = Emitter.sources.API) {
    Object.keys(formats).forEach((format) => {
      this.scroll.getLines(start, end - start).forEach(function(line) {
        line.format(format, formats[format]);
      });
    });
    this.update(source);
  }

  formatText(start, end, formats = {}, source = Emitter.sources.API) {
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(start, end - start, format, formats[format]);
    });
    this.update(source);
  }

  getContents(start, end) {
    return this.delta.slice(start, end);
  }

  getDelta() {
    return this.scroll.getLines().reduce((delta, line) => {
      line.getLeaves().forEach((blot) => {
        if (blot.length() === 0) return delta;
        if (blot instanceof Parchment.Text) {
          var value = blot.value();
        } else {
          var value = {};
          value[blot.statics.blotName] = blot.value();
        }
        delta.insert(value, bubbleFormats(blot));
      });
      return delta.insert('\n', line.formats());
    }, new Delta());
  }

  getFormat(start, end) {
    let lines, leaves;
    if (start === end) {
      let [line, offset] = this.scroll.findLine(start);
      let position = line.path(offset, true).pop();
      lines = [line];
      leaves = [position[0]];
    } else {
      lines = this.scroll.getLines(start, end-start);
      leaves = this.scroll.descendants(Parchment.Leaf, start, end-start);
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

  getHTML() {
    return this.delta.toHTML();
  }

  getText(start, end) {
    // TODO optimize
    return this.scroll.getLines().map(function(line) {
      return line.getLeaves().map(function(leaf) {
        let value = leaf.value();
        return typeof value === 'string' ? value : '';
      }).join('') + '\n';
    }).join('').slice(start, end-start);
  }

  insertEmbed(index, embed, value, formats = {}, source = Emitter.sources.API) {
    this.scroll.insertAt(index, embed, value);
    this.formatText(index, index + 1, formats, source);
  }

  insertText(index, text, formats = {}, source = Emitter.sources.API) {
    this.scroll.insertAt(index, text);
    this.formatText(index, index + text.length, formats, source);
  }

  update(source = Emitter.sources.USER) {
    let oldDelta = this.delta;
    this.delta = this.getDelta();
    let change = oldDelta.diff(this.delta);
    if (change.length() > 0) {
      this.emitter.emit(Emitter.events.TEXT_CHANGE, change, source);
    }
  }
}


function bubbleFormats(blot) {
  if (blot instanceof Block) return blot.formats();
  let formats = typeof blot.formats === 'function' ? blot.formats() : {};
  while (blot.parent != null && blot.parent.statics.scope === Parchment.Scope.INLINE_BLOT) {
    blot = blot.parent;
    if (typeof blot.formats === 'function') {
      formats = extend(formats, blot.formats());
    }
  }
  return formats;
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
