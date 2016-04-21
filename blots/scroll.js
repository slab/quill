import Parchment from 'parchment';
import Emitter from '../core/emitter';
import logger from '../core/logger';
import Block, { BlockEmbed } from './block';
import Container from './container';


let debug = logger('quill:scroll');


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
    this.optimize();
  }

  deleteAt(index, length) {
    let [first, firstOffset] = this.line(index);
    let [last, lastOffset] = this.line(index + length);
    super.deleteAt(index, length);
    if (last != null && first !== last && firstOffset > 0) {
      let lastChild = first.children.tail;
      last.moveChildren(first);
      last.remove();
    }
    this.optimize();
  }

  formatAt(index, length, format, value) {
    if (this.whitelist != null && !this.whitelist[format]) return;
    super.formatAt(index, length, format, value);
  }

  insertAt(index, value, def) {
    if (def != null && this.whitelist != null && !this.whitelist[value]) return;
    if (index >= this.length()) {
      let blot = Parchment.create(this.statics.defaultChild);
      this.appendChild(blot);
      if (def == null && value.endsWith('\n')) {
        value = value.slice(0, -1);
      }
      blot.insertAt(0, value, def);
    } else {
      super.insertAt(index, value, def);
    }
  }

  line(index) {
    return this.descendant(isLine, index);
  }

  lines(index, length) {
    return this.descendants(isLine, index, length);
  }

  optimize(mutations = []) {
    super.optimize(mutations);
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_OPTIMIZE, mutations);
    }
  }

  path(index) {
    return super.path(index).slice(1);  // Exclude self
  }

  update(mutations) {
    let source = Emitter.sources.USER;
    if (typeof mutations === 'string') {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
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
