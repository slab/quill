import Embed from '../blots/embed.js';
import type Scroll from '../blots/scroll.js';
import Emitter from './emitter.js';

class Composition {
  isComposing = false;

  constructor(
    private scroll: Scroll,
    private emitter: Emitter,
  ) {
    this.setupListeners();
  }

  private setupListeners() {
    this.scroll.domNode.addEventListener('compositionstart', (event) => {
      if (!this.isComposing) {
        this.handleCompositionStart(event);
      }
    });

    this.scroll.domNode.addEventListener('compositionupdate', (event) => {
      this.handleCompositionUpdate(event);
    });

    this.scroll.domNode.addEventListener('compositionend', (event) => {
      if (this.isComposing) {
        // HACK: There is a bug in the safari browser in mobile devices and when we finish typing
        // composition symbol MutationObserver dispatches part of events after firing compositionend event
        // In normal behaviour MutationObserver dispatches all event before firing compositionend event
        // https://bugs.webkit.org/show_bug.cgi?id=238013
        // Webkit makes DOM changes after compositionend, so we use microtask to
        // ensure the order.
        // https://bugs.webkit.org/show_bug.cgi?id=31902
        queueMicrotask(() => {
          this.handleCompositionEnd(event);
        });
      }
    });
  }

  private handleCompositionStart(event: CompositionEvent) {
    const blot =
      event.target instanceof Node
        ? this.scroll.find(event.target, true)
        : null;

    if (blot && !(blot instanceof Embed)) {
      this.emitter.emit(Emitter.events.COMPOSITION_BEFORE_START, event);
      this.scroll.batchStart();
      this.emitter.emit(Emitter.events.COMPOSITION_START, event);
      this.isComposing = true;
    }
  }

  private handleCompositionUpdate(event: CompositionEvent) {
    this.emitter.emit(Emitter.events.COMPOSITION_UPDATE, event);
  }

  private handleCompositionEnd(event: CompositionEvent) {
    this.emitter.emit(Emitter.events.COMPOSITION_BEFORE_END, event);
    this.scroll.batchEnd();
    this.emitter.emit(Emitter.events.COMPOSITION_END, event);
    this.isComposing = false;
  }
}

export default Composition;
