/**
 * Abstract base class for DOM operations that works correctly
 * in both regular DOM and Shadow DOM contexts.
 */
abstract class DOMRoot {
  protected ownerDocument: Document;

  constructor(protected container: Element) {
    this.ownerDocument = container.ownerDocument || document;
  }

  // Abstract methods that must be implemented by subclasses
  abstract getRoot(): Document | ShadowRoot;
  abstract isInShadowDOM(): boolean;
  abstract getSelection(): Selection | null;
  abstract getActiveElement(): Element | null;
  abstract addEventListener(
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions,
  ): void;
  abstract removeEventListener(type: string, listener: EventListener): void;

  // Common element queries (can be overridden if needed)
  querySelector(selector: string): Element | null {
    return this.getRoot().querySelector(selector);
  }

  querySelectorAll(selector: string): NodeListOf<Element> {
    return this.getRoot().querySelectorAll(selector);
  }

  getElementById(id: string): Element | null {
    // Shadow roots don't have getElementById, so we use querySelector for consistency
    return this.getRoot().querySelector(`#${CSS.escape(id)}`);
  }

  // Common element creation
  createElement(tagName: string): Element {
    return this.ownerDocument.createElement(tagName);
  }

  createTextNode(text: string): Text {
    return this.ownerDocument.createTextNode(text);
  }

  createRange(): Range {
    return this.ownerDocument.createRange();
  }

  // Common style injection (can be overridden for different behavior)
  injectCSS(css: string, id?: string): void {
    // Check for existing style element if ID provided
    if (id) {
      const existing = this.querySelector(`style[data-quill-id="${id}"]`);
      if (existing) {
        return; // Style already injected
      }
    }

    const style = this.createElement('style') as HTMLStyleElement;
    style.textContent = css;

    if (id) {
      style.setAttribute('data-quill-id', id);
    }

    this.appendStyleToRoot(style);
  }

  injectStylesheet(href: string, id?: string): void {
    // Check for existing link element if ID provided
    if (id) {
      const existing = this.querySelector(`link[data-quill-id="${id}"]`);
      if (existing) {
        return; // Stylesheet already loaded
      }
    }

    const link = this.createElement('link') as HTMLLinkElement;
    link.rel = 'stylesheet';
    link.href = href;

    if (id) {
      link.setAttribute('data-quill-id', id);
    }

    this.appendStyleToRoot(link);
  }

  // Protected helper methods
  protected abstract appendStyleToRoot(element: HTMLElement): void;

  /**
   * Gets a native range with browser-specific optimizations.
   * Base implementation - can be overridden by subclasses.
   */
  getNativeRange(): Range | null {
    const selection = this.getSelection();
    if (selection == null || selection.rangeCount <= 0) return null;
    return selection.getRangeAt(0);
  }

  /**
   * Sets a native range with browser-specific optimizations.
   * Base implementation - can be overridden by subclasses.
   */
  setNativeRange(
    startNode: Node,
    startOffset: number,
    endNode: Node = startNode,
    endOffset: number = startOffset,
  ): boolean {
    const selection = this.getSelection();
    if (!selection) return false;

    const range = this.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }

}

/**
 * DOM operations for regular document context.
 */
class DocumentRoot extends DOMRoot {
  private root: Document;

  constructor(container: Element) {
    super(container);
    this.root = container.ownerDocument || document;
  }

  getRoot(): Document {
    return this.root;
  }

  isInShadowDOM(): boolean {
    return false;
  }

  getSelection(): Selection | null {
    return this.ownerDocument.defaultView?.getSelection() || null;
  }

  getActiveElement(): Element | null {
    return this.root.activeElement;
  }

  addEventListener(
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions,
  ): void {
    this.root.addEventListener(type, listener, options);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.root.removeEventListener(type, listener);
  }

  protected appendStyleToRoot(element: HTMLElement): void {
    this.root.head.appendChild(element);
  }
}

/**
 * DOM operations for Shadow DOM context with Safari-specific optimizations.
 */
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
    // Try shadow root selection first (newer browsers)
    if (
      'getSelection' in this.root &&
      typeof this.root.getSelection === 'function'
    ) {
      const shadowSelection = this.root.getSelection();
      if (shadowSelection) {
        return shadowSelection;
      }
    }

    // Fallback to document selection (but this is often incorrect in Shadow DOM)
    return this.ownerDocument.defaultView?.getSelection() || null;
  }

  getActiveElement(): Element | null {
    let activeElement = this.root.activeElement;

    // Traverse shadow boundaries to find the actual focused element
    while (activeElement?.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement;
  }

  addEventListener(
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions,
  ): void {
    this.root.addEventListener(type, listener, options);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.root.removeEventListener(type, listener);
  }

  protected appendStyleToRoot(element: HTMLElement): void {
    this.root.appendChild(element);
  }

  /**
   * Safari-optimized range detection for Shadow DOM.
   * Uses getComposedRanges when available for better compatibility.
   */
  override getNativeRange(): Range | null {
    const isSafari = this.isSafari();

    // For Safari in Shadow DOM, always try getComposedRanges first
    if (isSafari && document.getSelection) {
      const docSelection = document.getSelection();
      if ((docSelection as any).getComposedRanges) {
        try {
          const composedRanges = (docSelection as any).getComposedRanges(
            this.root,
          );
          if (composedRanges && composedRanges.length > 0) {
            const composedRange = composedRanges[0];
            const range = this.createRange();
            range.setStart(
              composedRange.startContainer,
              composedRange.startOffset,
            );
            range.setEnd(composedRange.endContainer, composedRange.endOffset);
            return range;
          }
        } catch (error) {
          // Silently fall back to regular selection
        }
      }
    }

    // Fallback to base implementation
    return super.getNativeRange();
  }

  /**
   * Safari-optimized range setting for Shadow DOM.
   * Uses setBaseAndExtent for better Safari compatibility.
   */
  override setNativeRange(
    startNode: Node,
    startOffset: number,
    endNode: Node = startNode,
    endOffset: number = startOffset,
  ): boolean {
    const selection = this.getSelection();
    if (!selection) return false;

    // Create the range
    const range = this.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    selection.removeAllRanges();

    // Safari-specific Shadow DOM workaround
    const isSafari = this.isSafari();
    const docSelection = document.getSelection();

    if (isSafari && docSelection?.setBaseAndExtent) {
      // Use document selection for Safari workaround in Shadow DOM
      selection.removeAllRanges();
      docSelection.removeAllRanges();
      docSelection.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
      return true;
    } else if (
      docSelection &&
      (docSelection as any).getComposedRanges &&
      docSelection.setBaseAndExtent
    ) {
      // Use setBaseAndExtent for other browsers with composed ranges support
      selection.removeAllRanges();
      docSelection.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
      return true;
    } else {
      // Standard addRange approach
      selection.addRange(range);
      return true;
    }
  }

  /**
   * Detects if the current browser is Safari,  which has specific quirks related to shadow DOM.
   */
  protected isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

}

/**
 * Factory function to create the appropriate DOMRoot instance based on context.
 */
function createDOMRoot(container: Element): DOMRoot {
  // Detect if container is within a shadow DOM
  const shadowRoot = findShadowRoot(container);
  if (shadowRoot) {
    return new ShadowDOMRoot(container, shadowRoot);
  } else {
    return new DocumentRoot(container);
  }
}

/**
 * Traverses up the DOM tree to find the nearest shadow root.
 */
function findShadowRoot(element: Element): ShadowRoot | null {
  let current: Node | null = element;

  while (current) {
    // Check if current node is a shadow root
    if (
      current.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
      (current as ShadowRoot).host
    ) {
      return current as ShadowRoot;
    }

    // Check if current element is a shadow host (has shadowRoot)
    if (current.nodeType === Node.ELEMENT_NODE) {
      const shadowRoot = (current as Element).shadowRoot;
      if (shadowRoot && shadowRoot.contains(element)) {
        return shadowRoot;
      }
    }

    current = current.parentNode;
  }

  return null;
}

// Export the factory function as the default export
export { createDOMRoot as DOMRoot };
export { DocumentRoot, ShadowDOMRoot };
export default createDOMRoot;

// Export the base class type for use in type annotations
export { DOMRoot as DOMRootType };
