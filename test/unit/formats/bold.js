import Scroll from '../../../blots/scroll';


describe('Bold', function() {
  it('optimize and merge', function() {
    let scroll = this.initialize(Scroll, '<p><strong>a</strong>b<strong>c</strong></p>');
    let bold = document.createElement('b');
    bold.appendChild(scroll.domNode.firstChild.childNodes[1]);
    scroll.domNode.firstChild.insertBefore(bold, scroll.domNode.firstChild.lastChild);
    scroll.update();
    expect(scroll.domNode).toEqualHTML('<p><strong>abc</strong></p>');
  });
});
