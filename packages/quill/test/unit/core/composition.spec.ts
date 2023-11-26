import Emitter from '../../../core/emitter';
import Composition from '../../../core/composition';
import Scroll from '../../../blots/scroll';
import { describe, expect, test, vitest } from 'vitest';
import { createRegistry } from '../__helpers__/factory';
import Quill from '../../../core';

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
