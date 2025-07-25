import { EmbedBlot, Scope } from 'parchment';
import type { Parent, ScrollBlot } from 'parchment';
import type Selection from '../core/selection.js';
import TextBlot from './text.js';
import type { EmbedContextRange } from './embed.js';
import type { DOMRootType } from '../core/dom-root.js';

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
    // Access DOMRoot through scroll (enhanced with domRoot property)
    const domRoot = (scroll as any).domRoot as DOMRootType;
    this.textNode = domRoot.createTextNode(Cursor.CONTENTS);
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

  restore(): EmbedContextRange | null {
    if (this.selection.composing || this.parent == null) return null;
    const range = this.selection.getNativeRange();
    // Browser may push down styles/nodes inside the cursor blot.
    // https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#push-down-values
    while (
      this.domNode.lastChild != null &&
      this.domNode.lastChild !== this.textNode
    ) {
      // @ts-expect-error Fix me later
      this.domNode.parentNode.insertBefore(
        this.domNode.lastChild,
        this.domNode,
      );
    }

    const prevTextBlot = this.prev instanceof TextBlot ? this.prev : null;
    const prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
    const nextTextBlot = this.next instanceof TextBlot ? this.next : null;
    // @ts-expect-error TODO: make TextBlot.text public
    const nextText = nextTextBlot ? nextTextBlot.text : '';
    const { textNode } = this;
    // take text from inside this blot and reset it
    const newText = textNode.data.split(Cursor.CONTENTS).join('');
    textNode.data = Cursor.CONTENTS;

    // proactively merge TextBlots around cursor so that optimization
    // doesn't lose the cursor.  the reason we are here in cursor.restore
    // could be that the user clicked in prevTextBlot or nextTextBlot, or
    // the user typed something.
    let mergedTextBlot;
    if (prevTextBlot) {
      mergedTextBlot = prevTextBlot;
      if (newText || nextTextBlot) {
        prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);
        if (nextTextBlot) {
          nextTextBlot.remove();
        }
      }
    } else if (nextTextBlot) {
      mergedTextBlot = nextTextBlot;
      nextTextBlot.insertAt(0, newText);
    } else {
      const domRoot = (this.scroll as any).domRoot as DOMRootType;
      const newTextNode = domRoot.createTextNode(newText);
      mergedTextBlot = this.scroll.create(newTextNode);
      this.parent.insertBefore(mergedTextBlot, this);
    }

    this.remove();
    if (range) {
      // calculate selection to restore
      const remapOffset = (node: Node, offset: number) => {
        if (prevTextBlot && node === prevTextBlot.domNode) {
          return offset;
        }
        if (node === textNode) {
          return prevTextLength + offset - 1;
        }
        if (nextTextBlot && node === nextTextBlot.domNode) {
          return prevTextLength + newText.length + offset;
        }
        return null;
      };

      const start = remapOffset(range.start.node, range.start.offset);
      const end = remapOffset(range.end.node, range.end.offset);
      if (start !== null && end !== null) {
        return {
          startNode: mergedTextBlot.domNode,
          startOffset: start,
          endNode: mergedTextBlot.domNode,
          endOffset: end,
        };
      }
    }
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
