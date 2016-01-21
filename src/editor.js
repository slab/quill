import Delta from 'rich-text/lib/delta';
import Emitter from './emitter';
import Parchment from 'parchment';
import extend from 'extend';


/**

Leaf/Line Iterator

leafFormats = function(leaf) {}

===

let it = new Iterator(start, end);
let delta = new Delta();
while (line = it.nextLine()) {
  while (leaf = it.nextLeaf()) {
    if (leaf.length() > 0) {
      delta.insert(leaf.value(), leafFormats(leaf));
    }
  }
  delta.insert('\n', line.formats());
}

===

let it = new Iterator(start, end);
let blockFormats = {}, inlineFormats = {};
while (line = it.nextLine() && (Object.keys(blockFormats).length > 0 || Object.keys(inlineFormats).length > 0)) {
  while (leaf = it.nextLeaf() && Object.keys(inlineFormats).length > 0) {
    combine(inlineFormats, leafFormats(leaf));
  }
  combine(blockFormats, line.formats());
}
return extend(blockFormats, inlineFormats);

**/


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
      line.descendants(Parchment.Leaf).forEach((blot) => {
        if (blot.length() === 0) return delta;
        let attributes, value;
        if (blot instanceof Parchment.Text) {
          attributes = {};
          value = blot.value();
        } else {
          value = {};
          value[blot.statics.blotName] = blot.value();
          attributes = blot.formats();
        }
        while (blot.parent != line) {
          attributes = extend(attributes, blot.parent.formats());
          blot = blot.parent;
        }
        delta.insert(value, attributes);
      });
      return delta.insert('\n', line.formats());
    }, new Delta());
  }

  getFormat(start, end) {
    let combine = function(formats1, formats2) {
      return Object.keys(formats2).reduce(function(formats1, name) {
        if (formats1[name] != null && formats1[name] !== formats2[name]) {
          if (Array.isArray(formats1[name])) {
            if (formats1[name].indexOf(formats2[name]) < 0) {
              formats1[name].push(formats2[name]);
            }
          } else {
            formats1[name] = [formats2[name], formats1[name]];
          }
        }
        return formats1;
      }, formats1);
    }
    let getLeafFormats = function(blot) {
      let formats = {};
      while (blot.parent instanceof Parchment.Inline) {
        formats = extend(formats, blot.parent.formats());
        blot = blot.parent;
      }
      return formats;
    }
    let lines = this.scroll.getLines(start, end);
    let leaves = this.scroll.getLeaves(start, end);
    let firstLine = lines.shift() || this.scroll.findLine(start).blot;
    let firstLeaf = leaves.shift() || this.scroll.path(start).pop();
    let blockFormats = firstLine.formats();
    let inlineFormats = getLeafFormats(firstLeaf);
    console.log(firstLeaf, leaves)
    lines.every(function(line, i) {
      blockFormats = combine(line.formats(), blockFormats);
      return Object.keys(blockFormats).length > 0;
    });
    leaves.every(function(leaf, i) {
      inlineFormats = combine(getLeafFormats(leaf), inlineFormats);
      return Object.keys(inlineFormats).length > 0;
    });
    return extend(blockFormats, inlineFormats);
  }

  getHTML() {
    return this.delta.toHTML();
  }

  getText(start, end) {
    // TODO optimize
    let values = [].concat.apply([], this.scroll.getLeaves());
    return values.map(function(value) {
      return typeof value === 'string' ? value : '';   // Exclude embeds
    }).join('').slice(start, end);
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


export { Editor as default };
