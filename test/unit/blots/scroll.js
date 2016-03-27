import Parchment from 'parchment';
import Scroll from '../../../blots/scroll';


describe('Scroll', function() {
  describe('descendant()', function() {
    beforeEach(function() {
      this.scroll = this.initialize(Scroll, '<h1>01<em>23</em></h1><p><u>56</u><img></p>');
    });

    it('text', function() {
      let [leaf, offset] = this.scroll.descendant(Parchment.Leaf, 1);
      expect(leaf.value()).toEqual('01');
      expect(offset).toEqual(1);
    });

    it('newline', function() {
      let [leaf, offset] = this.scroll.descendant(Parchment.Leaf, 4);
      expect(leaf).toEqual(null);
      expect(offset).toEqual(-1);
    });

    it('next line', function() {
      let [leaf, offset] = this.scroll.descendant(Parchment.Leaf, 5);
      expect(leaf.value()).toEqual('56');
      expect(offset).toEqual(0);
    });

    it('embed', function() {
      let [leaf, offset] = this.scroll.descendant(Parchment.Leaf, 7);
      expect(leaf.value()).toEqual({ image: true });
      expect(offset).toEqual(0);
    });

    it('end of document', function() {
      let [leaf, offset] = this.scroll.descendant(Parchment.Leaf, 9);
      expect(leaf).toEqual(null);
      expect(offset).toEqual(-1);
    });
  });
});
