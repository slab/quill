import {
  AttributorStore,
  BlockBlot,
  EmbedBlot,
  LeafBlot,
  Scope,
} from 'parchment';
import type { Blot, Parent } from 'parchment';
import Delta from 'quill-delta';
import Break from './break';
import Inline from './inline';
import TextBlot from './text';

const NEWLINE_LENGTH = 1;

class Block extends BlockBlot {
  cache: { delta?: Delta | null; length?: number } = {};

  delta(): Delta {
    if (this.cache.delta == null) {
      this.cache.delta = blockDelta(this);
    }
    return this.cache.delta;
  }

  deleteAt(index: number, length: number) {
    super.deleteAt(index, length);
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
      if (index < this.length() - 1 || this.children.tail == null) {
        super.insertAt(Math.min(index, this.length() - 1), text);
      } else {
        this.children.tail.insertAt(this.children.tail.length(), text);
      }
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

  moveChildren(target: Parent, ref?: Blot | null) {
    // @ts-expect-error Parchment types are wrong
    super.moveChildren(target, ref);
    this.cache = {};
  }

  optimize(context: { [key: string]: any }) {
    super.optimize(context);
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
      // @ts-expect-error Fix me later
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
      // @ts-expect-error Fix me later
      this.parent.insertBefore(block, ref);
    });
    if (text) {
      // @ts-expect-error Fix me later
      this.parent.insertBefore(this.scroll.create('text', text), ref);
    }
  }
}
BlockEmbed.scope = Scope.BLOCK_BLOT;
// It is important for cursor behavior BlockEmbeds use tags that are block level elements

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
