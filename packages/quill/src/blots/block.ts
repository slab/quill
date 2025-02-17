import {
  AttributorStore,
  BlockBlot,
  EmbedBlot,
  LeafBlot,
  ParentBlot,
  Scope,
} from 'parchment';
import type { Blot, Parent } from 'parchment';
import Delta from 'quill-delta';
import Break from './break.js';
import Inline from './inline.js';
import TextBlot from './text.js';
import type Scroll from './scroll.js';
import SoftBreak, { SOFT_BREAK_CHARACTER } from './soft-break.js';

const NEWLINE_LENGTH = 1;
const softBreakRegex = new RegExp(`(${SOFT_BREAK_CHARACTER})`, 'g');

class Block extends BlockBlot {
  scroll: Scroll;
  cache: { delta?: Delta | null; length?: number } = {};

  delta(): Delta {
    if (this.cache.delta == null) {
      this.cache.delta = blockDelta(this);
    }
    return this.cache.delta;
  }

  deleteAt(index: number, length: number) {
    super.deleteAt(index, length);
    this.optimizeChildren();
    this.cache = {};
  }

  formatAt(index: number, length: number, name: string, value: unknown) {
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
    this.optimizeChildren();
    this.cache = {};
  }

  insertAt(index: number, value: string, def?: unknown) {
    if (def != null) {
      super.insertAt(index, value, def);
      this.cache = {};
      return;
    }
    if (value.length === 0) return;
    const lines = value.split('\n');
    const text = lines.shift() as string;
    if (text.length > 0) {
      const softLines = text.split(softBreakRegex);
      let i = index;
      softLines.forEach((str) => {
        if (str === SOFT_BREAK_CHARACTER) {
          super.insertAt(i, SoftBreak.blotName, SOFT_BREAK_CHARACTER);
        } else {
          super.insertAt(Math.min(i, this.length() - 1), str);
        }
        i += str.length;
      });

      this.cache = {};
    }
    // TODO: Fix this next time the file is edited.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let block: Blot | this = this;
    lines.reduce((lineIndex, line) => {
      // @ts-expect-error Fix me later
      block = block.split(lineIndex, true);
      block.insertAt(0, line);
      return line.length;
    }, index + text.length);
  }

  insertBefore(blot: Blot, ref?: Blot | null) {
    super.insertBefore(blot, ref);
    this.optimizeChildren();
    this.cache = {};
  }

  length() {
    if (this.cache.length == null) {
      this.cache.length = super.length() + NEWLINE_LENGTH;
    }
    return this.cache.length;
  }

  moveChildren(target: Parent, ref?: Blot | null) {
    super.moveChildren(target, ref);
    this.cache = {};
  }

  optimize(context: { [key: string]: any }) {
    super.optimize(context);
    const lastLeafInBlock = getLastLeafInParent(this);

    // in order for an end-of-block soft break to be rendered properly by the browser, we need a trailing break
    if (
      lastLeafInBlock != null
      && lastLeafInBlock.statics.blotName === SoftBreak.blotName
      && this.children.tail?.statics.blotName !== Break.blotName
    ) {
      const breakBlot = this.scroll.create(Break.blotName);
      super.insertBefore(breakBlot, null);
    }
    this.cache = {};
  }

  path(index: number) {
    return super.path(index, true);
  }

  removeChild(child: Blot) {
    super.removeChild(child);
    this.cache = {};
  }

  split(index: number, force: boolean | undefined = false): Blot | null {
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

  private optimizeChildren() {
    this.children.forEach((child) => {
      if (child instanceof Break) {
        child.optimize();
      }
    });
  }
}
Block.blotName = 'block';
Block.tagName = 'P';
Block.defaultChild = Break;
Block.allowedChildren = [Break, Inline, EmbedBlot, TextBlot];

class BlockEmbed extends EmbedBlot {
  scroll: Scroll;
  attributes: AttributorStore;
  domNode: HTMLElement;

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

  format(name: string, value: unknown) {
    const attribute = this.scroll.query(name, Scope.BLOCK_ATTRIBUTE);
    if (attribute != null) {
      // @ts-expect-error TODO: Scroll#query() should return Attributor when scope is attribute
      this.attributes.attribute(attribute, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: unknown) {
    this.format(name, value);
  }

  insertAt(index: number, value: string, def?: unknown) {
    if (def != null) {
      super.insertAt(index, value, def);
      return;
    }
    const lines = value.split('\n');
    const text = lines.pop();
    const blocks = lines.map((line) => {
      const block = this.scroll.create(Block.blotName);
      block.insertAt(0, line);
      return block;
    });
    const ref = this.split(index);
    blocks.forEach((block) => {
      this.parent.insertBefore(block, ref);
    });
    if (text) {
      this.parent.insertBefore(this.scroll.create('text', text), ref);
    }
  }
}
BlockEmbed.scope = Scope.BLOCK_BLOT;
// It is important for cursor behavior BlockEmbeds use tags that are block level elements

export function getLastLeafInParent(blot: ParentBlot): Blot | null {
  let current = blot.children.tail;
  const MAX_ITERATIONS = 1000;
  for (let i = 0; current != null && i < MAX_ITERATIONS; i++) {
    if (current instanceof ParentBlot) {
      current = current.children.tail;
    } else {
      return current
    }
  }
  return null
}

function blockDelta(blot: BlockBlot, filter = true) {
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

function bubbleFormats(
  blot: Blot | null,
  formats: Record<string, unknown> = {},
  filter = true,
): Record<string, unknown> {
  if (blot == null) return formats;
  if ('formats' in blot && typeof blot.formats === 'function') {
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
