import Parchment from 'parchment';
import Emitter from '../../../core/emitter';
import Selection, { Range } from '../../../core/selection';
import Cursor from '../../../blots/cursor';
import Scroll from '../../../blots/scroll';


describe('Scroll', function() {
  it('initialize empty document', function() {
    let scroll = this.initialize(Scroll, '');
    expect(scroll.domNode).toEqualHTML('<p><br></p>');
  });

  it('api change', function() {
    let scroll = this.initialize(Scroll, '<p>Hello World!</p>');
    spyOn(scroll.emitter, 'emit').and.callThrough();
    scroll.insertAt(5, '!');
    expect(scroll.emitter.emit).toHaveBeenCalledWith(Emitter.events.SCROLL_OPTIMIZE, jasmine.any(Array), jasmine.any(Object));
  });

  it('user change', function(done) {
    let scroll = this.initialize(Scroll, '<p>Hello World!</p>');
    spyOn(scroll.emitter, 'emit').and.callThrough();
    scroll.domNode.firstChild.appendChild(document.createTextNode('!'));
    setTimeout(function() {
      expect(scroll.emitter.emit).toHaveBeenCalledWith(Emitter.events.SCROLL_OPTIMIZE, jasmine.any(Array), jasmine.any(Object));
      expect(scroll.emitter.emit).toHaveBeenCalledWith(Emitter.events.SCROLL_UPDATE, Emitter.sources.USER, jasmine.any(Array));
      done();
    }, 1);
  });

  it('whitelist', function() {
    let scroll = Parchment.create('scroll', { emitter: new Emitter(), whitelist: ['bold'] });
    scroll.insertAt(0, 'Hello World!');
    scroll.formatAt(0, 5, 'bold', true);
    scroll.formatAt(6, 5, 'italic', true);
    expect(scroll.domNode.firstChild).toEqualHTML('<strong>Hello</strong> World!');
  });

  describe('leaf()', function() {
    it('text', function() {
      let scroll = this.initialize(Scroll, '<p>Tests</p>');
      let [leaf, offset] = scroll.leaf(2);
      expect(leaf.value()).toEqual('Tests');
      expect(offset).toEqual(2);
    });

    it('precise', function() {
      let scroll = this.initialize(Scroll, '<p><u>0</u><s>1</s><u>2</u><s>3</s><u>4</u></p>');
      let [leaf, offset] = scroll.leaf(3);
      expect(leaf.value()).toEqual('2');
      expect(offset).toEqual(1);
    });

    it('newline', function() {
      let scroll = this.initialize(Scroll, '<p>0123</p><p>5678</p>');
      let [leaf, offset] = scroll.leaf(4);
      expect(leaf.value()).toEqual('0123');
      expect(offset).toEqual(4);
    });

    it('cursor', function() {
      let selection = this.initialize(Selection, '<p><u>0</u>1<u>2</u></p>');
      selection.setRange(new Range(2));
      selection.format('strike', true);
      let [leaf, offset] = selection.scroll.leaf(2);
      expect(leaf instanceof Cursor).toBe(true);
      expect(offset).toEqual(0);
    });

    it('beyond document', function() {
      let scroll = this.initialize(Scroll, '<p>Test</p>');
      let [leaf, offset] = scroll.leaf(10);
      expect(leaf).toEqual(null);
      expect(offset).toEqual(-1);
    });
  });
});
