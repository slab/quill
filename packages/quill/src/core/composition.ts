import Embed from '../blots/embed.js';
import type Scroll from '../blots/scroll.js';
import Emitter from './emitter.js';
import { findOrCreateSubscriber } from './subscriber.js';

class Composition {
  isComposing = false;

  constructor(
    private scroll: Scroll,
    private emitter: Emitter,
  ) {
    this.setupListeners();
  }

  private setupListeners() {
    const subscriber = findOrCreateSubscriber(this.scroll.domNode);
    subscriber.on(this, this.scroll.domNode, 'compositionstart', (event) => {
      if (!this.isComposing) {
        this.handleCompositionStart(event);
      }
    });

    subscriber.on(this, this.scroll.domNode, 'compositionend', (event) => {
      if (this.isComposing) {
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

  private handleCompositionEnd(event: CompositionEvent) {
    this.emitter.emit(Emitter.events.COMPOSITION_BEFORE_END, event);
    this.scroll.batchEnd();
    this.emitter.emit(Emitter.events.COMPOSITION_END, event);
    this.isComposing = false;
  }
}

export default Composition;
