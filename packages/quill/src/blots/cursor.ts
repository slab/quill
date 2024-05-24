import { EmbedBlot, Scope } from 'parchment';
import type { Parent, ScrollBlot } from 'parchment';
import type Selection from '../core/selection.js';
import type { EmbedContextRange } from './embed.js';

class Cursor extends EmbedBlot {
  static blotName = 'cursor';
  static className = 'ql-cursor';
  static tagName = 'span';
  static CONTENTS = '\uFEFF'; // Zero width no break space

  static value() {
    return undefined;
  }

  selection: Selection;
  textNode: Text;
  savedLength: number;

  constructor(scroll: ScrollBlot, domNode: HTMLElement, selection: Selection) {
    super(scroll, domNode);
    this.selection = selection;
    this.textNode = document.createTextNode(Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this.savedLength = 0;
  }

  detach() {
    // super.detach() will also clear domNode.__blot
    if (this.parent != null) this.parent.removeChild(this);
  }

  format(name: string, value: unknown) {
    if (this.savedLength !== 0) {
      super.format(name, value);
      return;
    }
    // TODO: Fix this next time the file is edited.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let target: Parent | this = this;
    let index = 0;
    while (target != null && target.statics.scope !== Scope.BLOCK_BLOT) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      this.savedLength = Cursor.CONTENTS.length;
      // @ts-expect-error TODO: allow empty context in Parchment
      target.optimize();
      target.formatAt(index, Cursor.CONTENTS.length, name, value);
      this.savedLength = 0;
    }
  }

  index(node: Node, offset: number) {
    if (node === this.textNode) return 0;
    return super.index(node, offset);
  }

  length() {
    return this.savedLength;
  }

  position(): [Text, number] {
    return [this.textNode, this.textNode.data.length];
  }

  remove() {
    super.remove();
    // @ts-expect-error Fix me later
    this.parent = null;
  }

  resetText() {
    const newText = this.textNode.data.split(Cursor.CONTENTS).join('');
    this.textNode.data = Cursor.CONTENTS;
    return newText;
  }

  restore(): EmbedContextRange | null {
    return null;
  }

  update(mutations: MutationRecord[], context: Record<string, unknown>) {
    if (
      mutations.some((mutation) => {
        return (
          mutation.type === 'characterData' && mutation.target === this.textNode
        );
      })
    ) {
      const range = this.restore();
      if (range) context.range = range;
    }
  }

  // Avoid .ql-cursor being a descendant of `<a/>`.
  // The reason is Safari pushes down `<a/>` on text insertion.
  // That will cause DOM nodes not sync with the model.
  //
  // For example ({I} is the caret), given the markup:
  //    <a><span class="ql-cursor">\uFEFF{I}</span></a>
  // When typing a char "x", `<a/>` will be pushed down inside the `<span>` first:
  //    <span class="ql-cursor"><a>\uFEFF{I}</a></span>
  // And then "x" will be inserted after `<a/>`:
  //    <span class="ql-cursor"><a>\uFEFF</a>d{I}</span>
  optimize(context?: unknown) {
    // @ts-expect-error Fix me later
    super.optimize(context);

    let { parent } = this;
    while (parent) {
      if (parent.domNode.tagName === 'A') {
        this.savedLength = Cursor.CONTENTS.length;
        // @ts-expect-error TODO: make isolate generic
        parent.isolate(this.offset(parent), this.length()).unwrap();
        this.savedLength = 0;
        break;
      }
      parent = parent.parent;
    }
  }

  value() {
    return '';
  }
}

export default Cursor;
