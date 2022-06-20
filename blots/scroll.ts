import {
  Scope,
  ScrollBlot,
  ContainerBlot,
  LeafBlot,
  ParentBlot,
  Registry,
} from 'parchment';
import { Blot, Parent } from 'parchment/dist/typings/blot/abstract/blot';
import Delta from 'quill-delta';
import Emitter, { EmitterSource } from '../core/emitter';
import Block, { BlockEmbed } from './block';
import Break from './break';
import Container from './container';

function isLine(blot: Blot): blot is Block | BlockEmbed {
  return blot instanceof Block || blot instanceof BlockEmbed;
}

interface UpdatableEmbed {
  updateContent(change: Delta): void;
}

function isUpdatable(blot: Blot): blot is Blot & UpdatableEmbed {
  return typeof ((blot as unknown) as any).updateContent === 'function';
}

class Scroll extends ScrollBlot {
  static blotName = 'scroll';
  static className = 'ql-editor';
  static tagName = 'DIV';
  static defaultChild = Block;
  static allowedChildren = [Block, BlockEmbed, Container];

  emitter: Emitter;
  batch: false | MutationRecord[];

  constructor(
    registry: Registry,
    domNode: HTMLDivElement,
    { emitter }: { emitter: Emitter },
  ) {
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
      const ref =
        last.children.head instanceof Break ? null : last.children.head;
      first.moveChildren(last, ref);
      first.remove();
    }
    this.optimize();
  }

  enable(enabled = true) {
    this.domNode.setAttribute('contenteditable', enabled ? 'true' : 'false');
  }

  formatAt(index, length, format, value) {
    super.formatAt(index, length, format, value);
    this.optimize();
  }

  handleDragStart(event) {
    event.preventDefault();
  }

  insertAt(index: number, value: string, def?: unknown) {
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
      // @ts-expect-error Currently the type is not enforced
      const wrapper: Parent = this.scroll.create(
        this.statics.defaultChild.blotName,
      );
      wrapper.appendChild(blot);
      super.insertBefore(wrapper, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }

  isEnabled() {
    return this.domNode.getAttribute('contenteditable') === 'true';
  }

  leaf(index: number): [LeafBlot, number] | [null, -1] {
    const last = this.path(index).pop();
    if (!last) {
      return [null, -1];
    }

    const [blot, offset] = last;
    if (!(blot instanceof LeafBlot)) {
      return [null, -1];
    }
    return [blot, offset];
  }

  line(index: number): [Block | BlockEmbed | null, number] {
    if (index === this.length()) {
      return this.line(index - 1);
    }
    // @ts-expect-error TODO: make descendant() generic
    return this.descendant(isLine, index);
  }

  lines(index = 0, length = Number.MAX_VALUE): (Block | BlockEmbed)[] {
    const getLines = (
      blot: ParentBlot,
      blotIndex: number,
      blotLength: number,
    ) => {
      let lines = [];
      let lengthLeft = blotLength;
      blot.children.forEachAt(
        blotIndex,
        blotLength,
        (child, childIndex, childLength) => {
          if (isLine(child)) {
            lines.push(child);
          } else if (child instanceof ContainerBlot) {
            lines = lines.concat(getLines(child, childIndex, lengthLeft));
          }
          lengthLeft -= childLength;
        },
      );
      return lines;
    };
    return getLines(this, index, length);
  }

  optimize(mutations = [], context = {}) {
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

  update(source?: EmitterSource);
  update(mutations?: MutationRecord[]);
  update(mutations?: MutationRecord[] | EmitterSource) {
    if (this.batch) {
      if (Array.isArray(mutations)) {
        this.batch = this.batch.concat(mutations);
      }
      return;
    }
    let source: EmitterSource = Emitter.sources.USER;
    if (typeof mutations === 'string') {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    mutations = mutations.filter(({ target }) => {
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
}

export interface ScrollConstructor {
  new (
    registry: Registry,
    domNode: HTMLDivElement,
    options: { emitter: Emitter },
  ): Scroll;
}

export default Scroll;
