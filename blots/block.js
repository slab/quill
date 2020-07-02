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
import Cursor from './cursor';

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

    /**
     * FIXME
     * This is a tempory change to fix following 
     * 1. Can't add multuple new lines without losing the format.
     * 2. When setting content, the new lines are always formatless.
     * 3. Deleting a line should not result in clearing it's formats.
     * 4. Cursor height / line height should be consistent unless user change formatting.
     * 
     * In super method default blot ("BR") is appended if this blot is empty.
     * Since this "Block" class is extended by some other classes
     * this.domNode.nodeName === "P" is checked here but 
     * a sperate child class should be added for "P" block and do this change
     */
    try {
      if( this.isFormatlessEmptyP( this.domNode )) {
        let formatNode;
        if ( this.prev && !this.isFormatlessEmptyP( this.prev.domNode )) {
          formatNode = this.prev.children.tail.domNode.cloneNode(true);
        } else if ( this.next && !this.isFormatlessEmptyP( this.next.domNode ) ) {
          formatNode = this.next.children.head.domNode.cloneNode(true);
        }
        if( formatNode && formatNode.nodeType === Node.ELEMENT_NODE ) {
          this.children.head.domNode.remove();
          this.removeChild( this.children.head );
          this.retainFormats(formatNode);
          const newBr = document.createElement('BR');
          const dn = this.getDeepestNode( formatNode );
          dn.appendChild( newBr );
          const formatBlot = this.scroll.create(formatNode);
          this.appendChild( formatBlot );
        }
      }
      if( !this.isFormatlessEmptyP( this.domNode ) && this.prev && this.isFormatlessEmptyP( this.prev.domNode )) {
        const formatNode = this.children.head.domNode.cloneNode(true);
        this.applyToAllEmptyPrevs( this.prev, formatNode );
      }
      
    } catch (error) {
    }
    this.cache = {};
  }

  isFormatlessEmptyP( node ) {
    return node.nodeName === "P" && node.innerHTML === `<br>`;
  }

  applyToAllEmptyPrevs( prev, formatNode ) {
    if ( prev && this.isFormatlessEmptyP( prev.domNode )) {
      if( formatNode.nodeType === Node.ELEMENT_NODE ) {
        prev.children.head.domNode.remove();
        prev.removeChild( prev.children.head );
        this.retainFormats(formatNode);
        const newBr = document.createElement('BR');
        const dn = prev.getDeepestNode( formatNode );
        dn.appendChild( newBr );
        const formatBlot = prev.scroll.create(formatNode);
        prev.appendChild( formatBlot );
      }
      this.applyToAllEmptyPrevs( prev.prev, formatNode );
    }

  }

  /**
   * Retains the style nodes specified in TEXT_FORMAT_NODES
   * and removes all other nodes for the given element
   */
  retainFormats(element) {
    const nodes = element.childNodes;
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const isCursorSpan = node.nodeName === "SPAN" && node.classList.contains( Cursor.className );
      if (
        isCursorSpan ||
        node.nodeType === Node.TEXT_NODE ||
        !TEXT_FORMAT_NODES.includes(node.nodeName)
      ) {
        node.parentNode.removeChild(node);
        i -= 1;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        this.retainFormats(node);
      }
    }
  }

  getDeepestNode(node) {
    if ( node.firstChild ) {
      return this.getDeepestNode(node.firstChild);
    }
    return node;
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
