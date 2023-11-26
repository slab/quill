import Emitter from '../../../src/core/emitter';
import Composition from '../../../src/core/composition';
import Scroll from '../../../src/blots/scroll';
import { describe, expect, test, vitest } from 'vitest';
import { createRegistry } from '../__helpers__/factory';
import Quill from '../../../src/core';

describe('Composition', function () {
  test('triggers events on compositionstart', async () => {
    const emitter = new Emitter();
    const scroll = new Scroll(createRegistry(), document.createElement('div'), {
      emitter,
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
