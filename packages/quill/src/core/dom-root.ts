// Not yet part of the TypeScript DOM lib.
type CaretPosition = { offsetNode: Node; offset: number };
type DocumentWithCaretPosition = Document & {
  caretPositionFromPoint?: (
    x: number,
    y: number,
    options?: { shadowRoots?: ShadowRoot[] },
  ) => CaretPosition | null;
};

/**
 * Scopes the DOM queries Quill needs (selection, focus, element lookup and
 * event delegation) to the root node the editor lives in, so that they also
 * work when the editor is rendered inside a shadow root.
 */
abstract class DOMRoot {
  protected ownerDocument: Document;

  constructor(protected container: Element) {
    this.ownerDocument = container.ownerDocument;
  }

  abstract getRoot(): Document | ShadowRoot;
  abstract isInShadowDOM(): boolean;
  abstract getSelection(): Selection | null;
  abstract getActiveElement(): Element | null;

  querySelector<E extends Element = Element>(selector: string): E | null {
    return this.getRoot().querySelector<E>(selector);
  }

  querySelectorAll<E extends Element = Element>(
    selector: string,
  ): NodeListOf<E> {
    return this.getRoot().querySelectorAll<E>(selector);
  }

  getNativeRange(): Range | null {
    const selection = this.getSelection();
    if (selection == null || selection.rangeCount <= 0) return null;
    return selection.getRangeAt(0);
  }

  getRangeFromPoint(x: number, y: number): Range | null {
    const doc = this.ownerDocument as DocumentWithCaretPosition;
    if (doc.caretRangeFromPoint) {
      return doc.caretRangeFromPoint(x, y);
    }
    const position = doc.caretPositionFromPoint?.(x, y);
    return position ? this.createCollapsedRange(position) : null;
  }

  protected createCollapsedRange({ offsetNode, offset }: CaretPosition) {
    const range = this.ownerDocument.createRange();
    range.setStart(offsetNode, offset);
    range.setEnd(offsetNode, offset);
    return range;
  }

  setNativeRange(
    startNode: Node,
    startOffset: number,
    endNode: Node = startNode,
    endOffset: number = startOffset,
  ): boolean {
    const selection = this.getSelection();
    if (!selection) return false;

    const range = this.ownerDocument.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }
}

class DocumentRoot extends DOMRoot {
  getRoot(): Document {
    return this.ownerDocument;
  }

  isInShadowDOM(): boolean {
    return false;
  }

  getSelection(): Selection | null {
    return this.ownerDocument.getSelection();
  }

  getActiveElement(): Element | null {
    return this.ownerDocument.activeElement;
  }
}

type ShadowRootWithSelection = ShadowRoot & {
  getSelection?: () => Selection | null;
};

// Not yet part of the TypeScript DOM lib.
type SelectionWithComposedRanges = Selection & {
  getComposedRanges?: (...args: unknown[]) => StaticRange[];
};

// Without the shadow root, getComposedRanges() rescopes a selection inside it
// to its host. The spec takes `{ shadowRoots }`, while Safari 17 shipped a
// variadic signature that throws a TypeError for the dictionary form.
// Returns null when the browser does not support getComposedRanges().
const getComposedRanges = (
  selection: Selection,
  shadowRoot: ShadowRoot,
): StaticRange[] | null => {
  const { getComposedRanges: getRanges } =
    selection as SelectionWithComposedRanges;
  if (typeof getRanges !== 'function') return null;
  try {
    return getRanges.call(selection, { shadowRoots: [shadowRoot] });
  } catch {
    return getRanges.call(selection, shadowRoot);
  }
};

const getNodeLength = (node: Node) =>
  node instanceof CharacterData ? node.length : node.childNodes.length;

class ShadowDOMRoot extends DOMRoot {
  private root: ShadowRoot;

  constructor(container: Element, shadowRoot: ShadowRoot) {
    super(container);
    this.root = shadowRoot;
  }

  getRoot(): ShadowRoot {
    return this.root;
  }

  isInShadowDOM(): boolean {
    return true;
  }

  getSelection(): Selection | null {
    // Chromium exposes the selection scoped to the shadow tree on the
    // ShadowRoot itself; other engines only have the document selection.
    const { getSelection } = this.root as ShadowRootWithSelection;
    if (typeof getSelection === 'function') {
      return getSelection.call(this.root);
    }
    return this.ownerDocument.getSelection();
  }

  getActiveElement(): Element | null {
    let activeElement = this.root.activeElement;

    // Traverse shadow boundaries to find the actual focused element
    while (activeElement?.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement;
  }

  override getNativeRange(): Range | null {
    const selection = this.ownerDocument.getSelection();
    const ranges = selection && getComposedRanges(selection, this.root);
    if (ranges == null) return super.getNativeRange();
    const [staticRange] = ranges;
    // WebKit does not update composed ranges after mutations inside the shadow
    // tree, so the offsets can be out of bounds until the selection is reset.
    if (
      staticRange == null ||
      staticRange.startOffset > getNodeLength(staticRange.startContainer) ||
      staticRange.endOffset > getNodeLength(staticRange.endContainer)
    ) {
      return null;
    }
    const range = this.ownerDocument.createRange();
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
    return range;
  }

  // Without the shadow root, caretPositionFromPoint() and caretRangeFromPoint()
  // return a position next to its host instead of the one inside it.
  override getRangeFromPoint(x: number, y: number): Range | null {
    const doc = this.ownerDocument as DocumentWithCaretPosition;
    const position = doc.caretPositionFromPoint?.(x, y, {
      shadowRoots: [this.root],
    });
    if (position && this.root.contains(position.offsetNode)) {
      return this.createCollapsedRange(position);
    }
    return super.getRangeFromPoint(x, y);
  }

  // Selection#setBaseAndExtent on the document selection accepts nodes inside
  // shadow trees in all engines, whereas addRange does not work in Safari.
  override setNativeRange(
    startNode: Node,
    startOffset: number,
    endNode: Node = startNode,
    endOffset: number = startOffset,
  ): boolean {
    const selection = this.ownerDocument.getSelection();
    if (!selection) return false;
    selection.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    return true;
  }
}

const isShadowRoot = (node: Node): node is ShadowRoot =>
  node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in node;

function createDOMRoot(container: Element): DOMRoot {
  const rootNode = container.getRootNode();
  return isShadowRoot(rootNode)
    ? new ShadowDOMRoot(container, rootNode)
    : new DocumentRoot(container);
}

export { createDOMRoot, isShadowRoot, DocumentRoot, ShadowDOMRoot };
export default DOMRoot;
