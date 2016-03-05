import Parchment from 'parchment';
import Scroll from '../../../blots/scroll';


describe('Block', function() {
  it('default break', function() {
    let block = Parchment.create('block');
    expect(block.children.length).toEqual(1);
    expect(block.children.head.statics.blotName).toEqual('break');
  });

  it('format', function() {
    let scroll = this.initialize(Scroll, '<p>Test</p>');
    scroll.children.head.format('header', 1);
    expect(scroll.domNode).toEqualHTML('<h1>Test</h1>');
    expect(scroll.children.head.statics.blotName).toEqual('header');
    expect(scroll.children.head.children.length).toEqual(1);
  });
});
