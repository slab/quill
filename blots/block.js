import Delta from 'quill-delta';
import {
  AttributorStore,
  BlockBlot,
  EmbedBlot,
  LeafBlot,
  Scope,
} from 'parchment';
import Break from './break';
import Inline from './inline';
import TextBlot from './text';
import Cursort from './cursor';

const NEWLINE_LENGTH = 1;
const TEXT_FORMAT_NODES = [
  'SPAN',
  'STRONG',
  'B',
  'EM',
  'I',
  'SUB',
  'SUP',
  'S',
  'STRIKE',
  'U',
];

class Block extends BlockBlot {
  constructor(scroll, domNode) {
    super(scroll, domNode);
    this.cache = {};
  }

  delta() {
    if (this.cache.delta == null) {
      this.cache.delta = blockDelta(this);
    }
    return this.cache.delta;
  }

  deleteAt(index, length) {
    super.deleteAt(index, length);
    this.cache = {};
  }

  formatAt(index, length, name, value) {
    if (length <= 0) return;
    if (this.scroll.query(name, Scope.BLOCK)) {
      if (index + length === this.length()) {
        this.format(name, value);
      }
    } else {
      super.formatAt(
        index,
        Math.min(length, this.length() - index - 1),
        name,
        value,
      );
    }
    this.cache = {};
  }

  insertAt(index, value, def) {
    if (def != null) {
      super.insertAt(index, value, def);
      this.cache = {};
      return;
    }
    if (value.length === 0) return;
    const lines = value.split('\n');
    const text = lines.shift();
    if (text.length > 0) {
      if (index < this.length() - 1 || this.children.tail == null) {
        super.insertAt(Math.min(index, this.length() - 1), text);
      } else {
        this.children.tail.insertAt(this.children.tail.length(), text);
      }
      this.cache = {};
    }
    let block = this;
    lines.reduce((lineIndex, line) => {
      block = block.split(lineIndex, true);
      block.insertAt(0, line);
      return line.length;
    }, index + text.length);
  }

  insertBefore(blot, ref) {
    const { head } = this.children;
    super.insertBefore(blot, ref);
    if (head instanceof Break) {
      head.remove();
    }
    this.cache = {};
  }

  length() {
    if (this.cache.length == null) {
      this.cache.length = super.length() + NEWLINE_LENGTH;
    }
    return this.cache.length;
  }

  moveChildren(target, ref) {
    super.moveChildren(target, ref);
    this.cache = {};
  }

  optimize(context) {
    super.optimize(context);
    this.cache = {};
  }

  path(index) {
    return super.path(index, true);
  }

  removeChild(child) {
    super.removeChild(child);
    this.cache = {};
  }

  split(index, force = false) {
    if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
      const clone = this.clone();
      /**
       * This part was added to retain the active format for the empty lines.
       */
      if (
        this.domNode.tagName === 'P' &&
        this.children &&
        this.children.head &&
        this.children.head.domNode.nodeType === Node.ELEMENT_NODE
      ) {
        const node = this.children.head.domNode.cloneNode(true);
        this.retainFormats(node);
        const cursor = node.querySelector(`.${Cursort.className}`);
        if (cursor) {
          const br = document.createElement('br');
          cursor.parentNode.replaceChild(br, cursor);
          const formatBlot = this.scroll.create(node);
          clone.insertBefore(formatBlot, null);
        }
      }
      if (index === 0) {
        this.parent.insertBefore(clone, this);
        return this;
      }
      this.parent.insertBefore(clone, this.next);
      return clone;
    }
    const next = super.split(index, force);
    this.cache = {};
    return next;
  }

  /**
   * Retains the style nodes specified in TEXT_FORMAT_NODES
   * and removes all other nodes for the given element
   */
  retainFormats(element) {
    const nodes = element.childNodes;
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (
        node.nodeType === Node.TEXT_NODE &&
        !TEXT_FORMAT_NODES.includes(node.nodeName)
      ) {
        node.parentNode.removeChild(node);
        i -= 1;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        this.retainFormats(node);
      }
    }
  }
}
Block.blotName = 'block';
Block.tagName = 'P';
Block.defaultChild = Break;
Block.allowedChildren = [Break, Inline, EmbedBlot, TextBlot];

class BlockEmbed extends EmbedBlot {
  attach() {
    super.attach();
    this.attributes = new AttributorStore(this.domNode);
  }

  delta() {
    return new Delta().insert(this.value(), {
      ...this.formats(),
      ...this.attributes.values(),
    });
  }

  format(name, value) {
    const attribute = this.scroll.query(name, Scope.BLOCK_ATTRIBUTE);
    if (attribute != null) {
      this.attributes.attribute(attribute, value);
    }
  }

  formatAt(index, length, name, value) {
    this.format(name, value);
  }

  insertAt(index, value, def) {
    if (typeof value === 'string' && value.endsWith('\n')) {
      const block = this.scroll.create(Block.blotName);
      this.parent.insertBefore(block, index === 0 ? this : this.next);
      block.insertAt(0, value.slice(0, -1));
    } else {
      super.insertAt(index, value, def);
    }
  }
}
BlockEmbed.scope = Scope.BLOCK_BLOT;
// It is important for cursor behavior BlockEmbeds use tags that are block level elements

function blockDelta(blot, filter = true) {
  return blot
    .descendants(LeafBlot)
    .reduce((delta, leaf) => {
      if (leaf.length() === 0) {
        return delta;
      }
      return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
    }, new Delta())
    .insert('\n', bubbleFormats(blot));
}

function bubbleFormats(blot, formats = {}, filter = true) {
  if (blot == null) return formats;
  if (typeof blot.formats === 'function') {
    formats = {
      ...formats,
      ...blot.formats(),
    };
    if (filter) {
      // exclude syntax highlighting from deltas and getFormat()
      delete formats['code-token'];
    }
  }
  if (
    blot.parent == null ||
    blot.parent.statics.blotName === 'scroll' ||
    blot.parent.statics.scope !== blot.statics.scope
  ) {
    return formats;
  }
  return bubbleFormats(blot.parent, formats, filter);
}

export { blockDelta, bubbleFormats, BlockEmbed, Block as default };
