import Scroll from '../../../blots/scroll';


describe('Inline', function() {
  it('format order', function() {
    let scroll = this.initialize(Scroll, '<p>Hello World!</p>');
    scroll.formatAt(0, 1, 'bold', true);
    scroll.formatAt(0, 1, 'italic', true);
    scroll.formatAt(2, 1, 'italic', true);
    scroll.formatAt(2, 1, 'bold', true);
    expect(scroll.domNode).toEqualHTML(
      '<p><strong><em>H</em></strong>e<strong><em>l</em></strong>lo World!</p>'
    );
  });
});
