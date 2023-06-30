import Emitter from '../../../core/emitter';
import Composition from '../../../core/composition';
import Scroll from '../../../blots/scroll';

describe('Selection', function () {
  it('triggers events on compositionstart', function (done) {
    const scroll = this.initialize(Scroll, '<p></p>');
    const emitter = new Emitter();
    new Composition(scroll, emitter);

    emitter.on(Emitter.events.COMPOSITION_BEFORE_START, () => {
      done();
    });

    scroll.domNode.dispatchEvent(new CompositionEvent('compositionstart'));
  });
});
