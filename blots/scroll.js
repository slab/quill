import Parchment from 'parchment';
import Emitter from '../core/emitter';
import Block, { BlockEmbed } from './block';
import Break from './break';
import CodeBlock from '../formats/code';
import Container from './container';


function isLine(blot) {
  return (blot instanceof Block || blot instanceof BlockEmbed);
}


class Scroll extends Parchment.Scroll {
  constructor(domNode, config) {
    super(domNode);
    this.emitter = config.emitter;
    if (Array.isArray(config.whitelist)) {
      this.whitelist = config.whitelist.reduce(function(whitelist, format) {
        whitelist[format] = true;
        return whitelist;
      }, {});
    }
    // Some reason fixes composition issues with character languages in Windows/Chrome, Safari
    this.domNode.addEventListener('DOMNodeInserted', function() {});
    this.optimize();
    this.enable();
  }

  batchStart() {
    this.batch = true;
  }

  batchEnd() {
    this.batch = false;
    this.optimize();
  }

  deleteAt(index, length) {
    let [first, offset] = this.line(index);
    let [last, ] = this.line(index + length);
    super.deleteAt(index, length);
    if (last != null && first !== last && offset > 0) {
      if (first instanceof BlockEmbed || last instanceof BlockEmbed) {
        this.optimize();
        return;
      }
      if (first instanceof CodeBlock) {
        let newlineIndex = first.newlineIndex(first.length(), true);
        if (newlineIndex > -1) {
          first = first.split(newlineIndex + 1);
          if (first === last) {
            this.optimize();
            return;
          }
        }
      } else if (last instanceof CodeBlock) {
        let newlineIndex = last.newlineIndex(0);
        if (newlineIndex > -1) {
          last.split(newlineIndex + 1);
        }
      }
      let ref = last.children.head instanceof Break ? null : last.children.head;
      first.moveChildren(last, ref);
      first.remove();
    }
    this.optimize();
  }

  enable(enabled = true) {
    this.domNode.setAttribute('contenteditable', enabled);
  }

  formatAt(index, length, format, value) {
    if (this.whitelist != null && !this.whitelist[format]) return;
    super.formatAt(index, length, format, value);
    this.optimize();
  }

  insertAt(index, value, def) {
    if (def != null && this.whitelist != null && !this.whitelist[value]) return;
    if (index >= this.length()) {
      if (def == null || Parchment.query(value, Parchment.Scope.BLOCK) == null) {
        let blot = Parchment.create(this.statics.defaultChild);
        this.appendChild(blot);
        if (def == null && value.endsWith('\n')) {
          value = value.slice(0, -1);
        }
        blot.insertAt(0, value, def);
      } else {
        let embed = Parchment.create(value, def);
        this.appendChild(embed);
      }
    } else {
      super.insertAt(index, value, def);
    }
    this.optimize();
  }

  insertBefore(blot, ref) {
    if (blot.statics.scope === Parchment.Scope.INLINE_BLOT) {
      let wrapper = Parchment.create(this.statics.defaultChild);
      wrapper.appendChild(blot);
      blot = wrapper;
    }
    super.insertBefore(blot, ref);
  }

  leaf(index) {
    return this.path(index).pop() || [null, -1];
  }

  line(index) {
    if (index === this.length()) {
      return this.line(index - 1);
    }
    return this.descendant(isLine, index);
  }

  lines(index = 0, length = Number.MAX_VALUE) {
    let getLines = (blot, index, length) => {
      let lines = [], lengthLeft = length;
      blot.children.forEachAt(index, length, function(child, index, length) {
        if (isLine(child)) {
          lines.push(child);
        } else if (child instanceof Parchment.Container) {
          lines = lines.concat(getLines(child, index, lengthLeft));
        }
        lengthLeft -= length;
      });
      return lines;
    };
    return getLines(this, index, length);
  }

  optimize(mutations = [], context = {}) {
    if (this.batch === true) return;
    super.optimize(mutations, context);
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_OPTIMIZE, mutations, context);
    }
  }

  path(index) {
    return super.path(index).slice(1);  // Exclude self
  }

  update(mutations) {
    if (this.batch === true) return;
    let source = Emitter.sources.USER;
    if (typeof mutations === 'string') {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_BEFORE_UPDATE, source, mutations);
    }
    super.update(mutations.concat([]));   // pass copy
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_UPDATE, source, mutations);
    }
  }
}
Scroll.blotName = 'scroll';
Scroll.className = 'ql-editor';
Scroll.tagName = 'DIV';
Scroll.defaultChild = 'block';
Scroll.allowedChildren = [Block, BlockEmbed, Container];


export default Scroll;
