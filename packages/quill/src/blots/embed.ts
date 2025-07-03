import type { ScrollBlot } from 'parchment';
import { EmbedBlot } from 'parchment';
import TextBlot from './text.js';
import type { DOMRootType } from '../core/dom-root.js';

const GUARD_TEXT = '\uFEFF';

export interface EmbedContextRange {
  startNode: Node | Text;
  startOffset: number;
  endNode?: Node | Text;
  endOffset?: number;
}

class Embed extends EmbedBlot {
  contentNode: HTMLSpanElement;
  leftGuard: Text;
  rightGuard: Text;

  constructor(scroll: ScrollBlot, node: Node) {
    super(scroll, node);
    // Access DOMRoot through scroll (enhanced with domRoot property)
    const domRoot = (scroll as any).domRoot as DOMRootType;
    this.contentNode = domRoot.createElement('span') as HTMLSpanElement;
    this.contentNode.setAttribute('contenteditable', 'false');
    Array.from(this.domNode.childNodes).forEach((childNode) => {
      this.contentNode.appendChild(childNode);
    });
    this.leftGuard = domRoot.createTextNode(GUARD_TEXT);
    this.rightGuard = domRoot.createTextNode(GUARD_TEXT);
    this.domNode.appendChild(this.leftGuard);
    this.domNode.appendChild(this.contentNode);
    this.domNode.appendChild(this.rightGuard);
  }

  index(node: Node, offset: number) {
    if (node === this.leftGuard) return 0;
    if (node === this.rightGuard) return 1;
    return super.index(node, offset);
  }

  restore(node: Text): EmbedContextRange | null {
    let range: EmbedContextRange | null = null;
    let textNode: Text;
    const text = node.data.split(GUARD_TEXT).join('');
    const domRoot = (this.scroll as any).domRoot as DOMRootType;

    if (node === this.leftGuard) {
      if (this.prev instanceof TextBlot) {
        const prevLength = this.prev.length();
        this.prev.insertAt(prevLength, text);
        range = {
          startNode: this.prev.domNode,
          startOffset: prevLength + text.length,
        };
      } else {
        textNode = domRoot.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this);
        range = {
          startNode: textNode,
          startOffset: text.length,
        };
      }
    } else if (node === this.rightGuard) {
      if (this.next instanceof TextBlot) {
        this.next.insertAt(0, text);
        range = {
          startNode: this.next.domNode,
          startOffset: text.length,
        };
      } else {
        textNode = domRoot.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this.next);
        range = {
          startNode: textNode,
          startOffset: text.length,
        };
      }
    }
    node.data = GUARD_TEXT;
    return range;
  }

  update(mutations: MutationRecord[], context: Record<string, unknown>) {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'characterData' &&
        (mutation.target === this.leftGuard ||
          mutation.target === this.rightGuard)
      ) {
        const range = this.restore(mutation.target as Text);
        if (range) context.range = range;
      }
    });
  }
}

export default Embed;
