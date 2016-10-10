import Parchment from 'parchment';
import Scroll from '../../../blots/scroll';


describe('Block', function() {
  it('childless', function() {
    let block = Parchment.create('block');
    block.optimize();
    expect(block.domNode).toEqualHTML('<br>');
  });

  it('insert into empty', function() {
    let block = Parchment.create('block');
    block.insertAt(0, 'Test');
    expect(block.domNode).toEqualHTML('Test');
  });

  it('insert newlines', function() {
    let scroll = this.initialize(Scroll, '<p><br></p>');
    scroll.insertAt(0, '\n\n\n');
    expect(scroll.domNode).toEqualHTML('<p><br></p><p><br></p><p><br></p><p><br></p>');
  });

  it('insert multiline', function() {
    let scroll = this.initialize(Scroll, '<p>Hello World!</p>');
    scroll.insertAt(6, 'pardon\nthis\n\ninterruption\n');
    expect(scroll.domNode).toEqualHTML(`
      <p>Hello pardon</p>
      <p>this</p>
      <p><br></p>
      <p>interruption</p>
      <p>World!</p>
    `);
  });

  it('insert into formatted', function() {
    let scroll = this.initialize(Scroll, '<h1>Welcome</h1>');
    scroll.insertAt(3, 'l\n');
    expect(scroll.domNode.firstChild.outerHTML).toEqualHTML('<h1>Well</h1>');
    expect(scroll.domNode.childNodes[1].outerHTML).toEqualHTML('<h1>come</h1>');
  });

  it('delete line contents', function() {
    let scroll = this.initialize(Scroll, '<p>Hello</p><p>World!</p>');
    scroll.deleteAt(0, 5);
    expect(scroll.domNode).toEqualHTML('<p><br></p><p>World!</p>');
  });

  it('join lines', function() {
    let scroll = this.initialize(Scroll, '<h1>Hello</h1><h2>World!</h2>');
    scroll.deleteAt(5, 1);
    expect(scroll.domNode).toEqualHTML('<h2>HelloWorld!</h2>');
  });

  it('join line with empty', function() {
    let scroll = this.initialize(Scroll, '<p>Hello<strong>World</strong></p><p><br></p>');
    scroll.deleteAt(10, 1);
    expect(scroll.domNode).toEqualHTML('<p>Hello<strong>World</strong></p>');
  });

  it('join empty lines', function() {
    let scroll = this.initialize(Scroll, '<h1><br></h1><p><br></p>');
    scroll.deleteAt(1, 1);
    expect(scroll.domNode).toEqualHTML('<h1><br></h1>');
  });

  it('format empty', function() {
    let scroll = this.initialize(Scroll, '<p><br></p>');
    scroll.formatAt(0, 1, 'header', 1);
    expect(scroll.domNode).toEqualHTML('<h1><br></h1>');
  });

  it('format newline', function() {
    let scroll = this.initialize(Scroll, '<h1>Hello</h1>');
    scroll.formatAt(5, 1, 'header', 2);
    expect(scroll.domNode).toEqualHTML('<h2>Hello</h2>');
  });

  it('remove unnecessary break', function() {
    let scroll = this.initialize(Scroll, '<p>Test</p>');
    scroll.children.head.domNode.appendChild(document.createElement('br'));
    scroll.update();
    expect(scroll.domNode).toEqualHTML('<p>Test</p>');
  });
});
