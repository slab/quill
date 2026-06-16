import { ContainerBlot, LeafBlot, Scope, ScrollBlot } from 'parchment';
import Delta, { AttributeMap, Op } from 'quill-delta';
import Emitter from '../core/emitter.js';
import Block, { BlockEmbed, bubbleFormats } from './block.js';
import Break from './break.js';
import Container from './container.js';
function isLine(blot) {
  return blot instanceof Block || blot instanceof BlockEmbed;
}
function isUpdatable(blot) {
  return typeof blot.updateContent === 'function';
}
class Scroll extends ScrollBlot {
  static blotName = 'scroll';
  static className = 'ql-editor';
  static tagName = 'DIV';
  static defaultChild = Block;
  static allowedChildren = [Block, BlockEmbed, Container];
  constructor(registry, domNode, _ref) {
    let {
      emitter
    } = _ref;
    super(registry, domNode);
    this.emitter = emitter;
    this.batch = false;
    this.optimize();
    this.enable();
    this.domNode.addEventListener('dragstart', e => this.handleDragStart(e));
  }
  batchStart() {
    if (!Array.isArray(this.batch)) {
      this.batch = [];
    }
  }
  batchEnd() {
    if (!this.batch) return;
    const mutations = this.batch;
    this.batch = false;
    this.update(mutations);
  }
  emitMount(blot) {
    this.emitter.emit(Emitter.events.SCROLL_BLOT_MOUNT, blot);
  }
  emitUnmount(blot) {
    this.emitter.emit(Emitter.events.SCROLL_BLOT_UNMOUNT, blot);
  }
  emitEmbedUpdate(blot, change) {
    this.emitter.emit(Emitter.events.SCROLL_EMBED_UPDATE, blot, change);
  }
  deleteAt(index, length) {
    const [first, offset] = this.line(index);
    const [last] = this.line(index + length);
    super.deleteAt(index, length);
    if (last != null && first !== last && offset > 0) {
      if (first instanceof BlockEmbed || last instanceof BlockEmbed) {
        this.optimize();
        return;
      }
      const ref = last.children.head instanceof Break ? null : last.children.head;
      // @ts-expect-error
      first.moveChildren(last, ref);
      // @ts-expect-error
      first.remove();
    }
    this.optimize();
  }
  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.domNode.setAttribute('contenteditable', enabled ? 'true' : 'false');
  }
  formatAt(index, length, format, value) {
    super.formatAt(index, length, format, value);
    this.optimize();
  }
  insertAt(index, value, def) {
    if (index >= this.length()) {
      if (def == null || this.scroll.query(value, Scope.BLOCK) == null) {
        const blot = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(blot);
        if (def == null && value.endsWith('\n')) {
          blot.insertAt(0, value.slice(0, -1), def);
        } else {
          blot.insertAt(0, value, def);
        }
      } else {
        const embed = this.scroll.create(value, def);
        this.appendChild(embed);
      }
    } else {
      super.insertAt(index, value, def);
    }
    this.optimize();
  }
  insertBefore(blot, ref) {
    if (blot.statics.scope === Scope.INLINE_BLOT) {
      const wrapper = this.scroll.create(this.statics.defaultChild.blotName);
      wrapper.appendChild(blot);
      super.insertBefore(wrapper, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }
  insertContents(index, delta) {
    const renderBlocks = this.deltaToRenderBlocks(delta.concat(new Delta().insert('\n')));
    const last = renderBlocks.pop();
    if (last == null) return;
    this.batchStart();
    const first = renderBlocks.shift();
    if (first) {
      const shouldInsertNewlineChar = first.type === 'block' && (first.delta.length() === 0 || !this.descendant(BlockEmbed, index)[0] && index < this.length());
      const delta = first.type === 'block' ? first.delta : new Delta().insert({
        [first.key]: first.value
      });
      insertInlineContents(this, index, delta);
      const newlineCharLength = first.type === 'block' ? 1 : 0;
      const lineEndIndex = index + delta.length() + newlineCharLength;
      if (shouldInsertNewlineChar) {
        this.insertAt(lineEndIndex - 1, '\n');
      }
      const formats = bubbleFormats(this.line(index)[0]);
      const attributes = AttributeMap.diff(formats, first.attributes) || {};
      Object.keys(attributes).forEach(name => {
        this.formatAt(lineEndIndex - 1, 1, name, attributes[name]);
      });
      index = lineEndIndex;
    }
    let [refBlot, refBlotOffset] = this.children.find(index);
    if (renderBlocks.length) {
      if (refBlot) {
        refBlot = refBlot.split(refBlotOffset);
        refBlotOffset = 0;
      }
      renderBlocks.forEach(renderBlock => {
        if (renderBlock.type === 'block') {
          const block = this.createBlock(renderBlock.attributes, refBlot || undefined);
          insertInlineContents(block, 0, renderBlock.delta);
        } else {
          const blockEmbed = this.create(renderBlock.key, renderBlock.value);
          this.insertBefore(blockEmbed, refBlot || undefined);
          Object.keys(renderBlock.attributes).forEach(name => {
            blockEmbed.format(name, renderBlock.attributes[name]);
          });
        }
      });
    }
    if (last.type === 'block' && last.delta.length()) {
      const offset = refBlot ? refBlot.offset(refBlot.scroll) + refBlotOffset : this.length();
      insertInlineContents(this, offset, last.delta);
    }
    this.batchEnd();
    this.optimize();
  }
  isEnabled() {
    return this.domNode.getAttribute('contenteditable') === 'true';
  }
  leaf(index) {
    const last = this.path(index).pop();
    if (!last) {
      return [null, -1];
    }
    const [blot, offset] = last;
    return blot instanceof LeafBlot ? [blot, offset] : [null, -1];
  }
  line(index) {
    if (index === this.length()) {
      return this.line(index - 1);
    }
    // @ts-expect-error TODO: make descendant() generic
    return this.descendant(isLine, index);
  }
  lines() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;
    const getLines = (blot, blotIndex, blotLength) => {
      let lines = [];
      let lengthLeft = blotLength;
      blot.children.forEachAt(blotIndex, blotLength, (child, childIndex, childLength) => {
        if (isLine(child)) {
          lines.push(child);
        } else if (child instanceof ContainerBlot) {
          lines = lines.concat(getLines(child, childIndex, lengthLeft));
        }
        lengthLeft -= childLength;
      });
      return lines;
    };
    return getLines(this, index, length);
  }
  optimize() {
    let mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (this.batch) return;
    super.optimize(mutations, context);
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_OPTIMIZE, mutations, context);
    }
  }
  path(index) {
    return super.path(index).slice(1); // Exclude self
  }
  remove() {
    // Never remove self
  }
  update(mutations) {
    if (this.batch) {
      if (Array.isArray(mutations)) {
        this.batch = this.batch.concat(mutations);
      }
      return;
    }
    let source = Emitter.sources.USER;
    if (typeof mutations === 'string') {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    mutations = mutations.filter(_ref2 => {
      let {
        target
      } = _ref2;
      const blot = this.find(target, true);
      return blot && !isUpdatable(blot);
    });
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_BEFORE_UPDATE, source, mutations);
    }
    super.update(mutations.concat([])); // pass copy
    if (mutations.length > 0) {
      this.emitter.emit(Emitter.events.SCROLL_UPDATE, source, mutations);
    }
  }
  updateEmbedAt(index, key, change) {
    // Currently it only supports top-level embeds (BlockEmbed).
    // We can update `ParentBlot` in parchment to support inline embeds.
    const [blot] = this.descendant(b => b instanceof BlockEmbed, index);
    if (blot && blot.statics.blotName === key && isUpdatable(blot)) {
      blot.updateContent(change);
    }
  }
  handleDragStart(event) {
    event.preventDefault();
  }
  deltaToRenderBlocks(delta) {
    const renderBlocks = [];
    let currentBlockDelta = new Delta();
    delta.forEach(op => {
      const insert = op?.insert;
      if (!insert) return;
      if (typeof insert === 'string') {
        const splitted = insert.split('\n');
        splitted.slice(0, -1).forEach(text => {
          currentBlockDelta.insert(text, op.attributes);
          renderBlocks.push({
            type: 'block',
            delta: currentBlockDelta,
            attributes: op.attributes ?? {}
          });
          currentBlockDelta = new Delta();
        });
        const last = splitted[splitted.length - 1];
        if (last) {
          currentBlockDelta.insert(last, op.attributes);
        }
      } else {
        const key = Object.keys(insert)[0];
        if (!key) return;
        if (this.query(key, Scope.INLINE)) {
          currentBlockDelta.push(op);
        } else {
          if (currentBlockDelta.length()) {
            renderBlocks.push({
              type: 'block',
              delta: currentBlockDelta,
              attributes: {}
            });
          }
          currentBlockDelta = new Delta();
          renderBlocks.push({
            type: 'blockEmbed',
            key,
            value: insert[key],
            attributes: op.attributes ?? {}
          });
        }
      }
    });
    if (currentBlockDelta.length()) {
      renderBlocks.push({
        type: 'block',
        delta: currentBlockDelta,
        attributes: {}
      });
    }
    return renderBlocks;
  }
  createBlock(attributes, refBlot) {
    let blotName;
    const formats = {};
    Object.entries(attributes).forEach(_ref3 => {
      let [key, value] = _ref3;
      const isBlockBlot = this.query(key, Scope.BLOCK & Scope.BLOT) != null;
      if (isBlockBlot) {
        blotName = key;
      } else {
        formats[key] = value;
      }
    });
    const block = this.create(blotName || this.statics.defaultChild.blotName, blotName ? attributes[blotName] : undefined);
    this.insertBefore(block, refBlot || undefined);
    const length = block.length();
    Object.entries(formats).forEach(_ref4 => {
      let [key, value] = _ref4;
      block.formatAt(0, length, key, value);
    });
    return block;
  }
}
function insertInlineContents(parent, index, inlineContents) {
  inlineContents.reduce((index, op) => {
    const length = Op.length(op);
    let attributes = op.attributes || {};
    if (op.insert != null) {
      if (typeof op.insert === 'string') {
        const text = op.insert;
        parent.insertAt(index, text);
        const [leaf] = parent.descendant(LeafBlot, index);
        const formats = bubbleFormats(leaf);
        attributes = AttributeMap.diff(formats, attributes) || {};
      } else if (typeof op.insert === 'object') {
        const key = Object.keys(op.insert)[0]; // There should only be one key
        if (key == null) return index;
        parent.insertAt(index, key, op.insert[key]);
        const isInlineEmbed = parent.scroll.query(key, Scope.INLINE) != null;
        if (isInlineEmbed) {
          const [leaf] = parent.descendant(LeafBlot, index);
          const formats = bubbleFormats(leaf);
          attributes = AttributeMap.diff(formats, attributes) || {};
        }
      }
    }
    Object.keys(attributes).forEach(key => {
      parent.formatAt(index, length, key, attributes[key]);
    });
    return index + length;
  }, index);
}
export default Scroll;
//# sourceMappingURL=scroll.js.map