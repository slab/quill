import Scroll from '../../../blots/scroll';

describe('Inline', function() {
  it('format order', function() {
    const scroll = this.initialize(Scroll, '<p>Hello World!</p>');
    scroll.formatAt(0, 1, 'bold', true);
    scroll.formatAt(0, 1, 'italic', true);
    scroll.formatAt(2, 1, 'italic', true);
    scroll.formatAt(2, 1, 'bold', true);
    expect(scroll.domNode).toEqualHTML(
      '<p><strong><em>H</em></strong>e<strong><em>l</em></strong>lo World!</p>',
    );
  });

  it('reorder', function() {
    const scroll = this.initialize(Scroll, '<p>0<strong>12</strong>3</p>');
    const p = scroll.domNode.firstChild;
    const em = document.createElement('em');
    Array.from(p.childNodes).forEach(function(node) {
      em.appendChild(node);
    });
    p.appendChild(em);
    expect(scroll.domNode).toEqualHTML('<p><em>0<strong>12</strong>3</em></p>');
    scroll.update();
    expect(scroll.domNode).toEqualHTML(
      '<p><em>0</em><strong><em>12</em></strong><em>3</em></p>',
    );
  });
});
