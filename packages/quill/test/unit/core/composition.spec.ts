import Emitter from '../../../src/core/emitter.js';
import Composition from '../../../src/core/composition.js';
import Scroll from '../../../src/blots/scroll.js';
import { DOMRoot } from '../../../src/core/dom-root.js';
import { describe, expect, test, vitest } from 'vitest';
import { createRegistry } from '../__helpers__/factory.js';
import Quill from '../../../src/core.js';

describe('Composition', () => {
  test('triggers events on compositionstart', async () => {
    const emitter = new Emitter();
    const domRoot = DOMRoot(document.body);
    const scroll = new Scroll(createRegistry(), document.createElement('div'), {
      emitter,
      domRoot,
    });
    new Composition(scroll, emitter);

    vitest.spyOn(emitter, 'emit');

    const event = new CompositionEvent('compositionstart');
    scroll.domNode.dispatchEvent(event);
    expect(emitter.emit).toHaveBeenCalledWith(
      Quill.events.COMPOSITION_BEFORE_START,
      event,
    );
    expect(emitter.emit).toHaveBeenCalledWith(
      Quill.events.COMPOSITION_START,
      event,
    );
  });
});
