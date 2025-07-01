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
        this.isComposing = true;
        this.scroll.batchStart();
        this.handleCompositionStart(event);
      }
    });

    this.scroll.domNode.addEventListener('compositionend', (event) => {
      if (this.isComposing) {
        setTimeout(() => {
          this.handleCompositionEnd(event);
          this.scroll.batchEnd();                 // <-- End the batch to flush the IME text
          this.isComposing = false;
        }, 0);
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
