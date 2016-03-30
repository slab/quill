import Parchment from 'parchment';
import Emitter from 'quill/emitter';
import Scroll from 'quill/blots/scroll';


describe('Scroll', function() {
  it('initialize empty document', function() {
    let scroll = this.initialize(Scroll, '');
    expect(scroll.domNode).toEqualHTML('<p><br></p>');
  });

  it('api change', function() {
    let scroll = this.initialize(Scroll, this.initialStates['single line']);
    spyOn(scroll.emitter, 'emit').and.callThrough();
    scroll.insertAt(5, '!');
    expect(scroll.emitter.emit).toHaveBeenCalledWith(Emitter.events.SCROLL_CHANGE);
  });

  it('user change', function(done) {
    let scroll = this.initialize(Scroll, this.initialStates['single line']);
    spyOn(scroll.emitter, 'emit').and.callThrough();
    scroll.domNode.firstChild.appendChild(document.createTextNode('!'));
    setTimeout(function() {
      expect(scroll.emitter.emit).toHaveBeenCalledWith(Emitter.events.SCROLL_CHANGE);
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
});
