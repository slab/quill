import Scroll from '../../../blots/scroll';


describe('Block Embed', function() {
  it('insert', function() {
    let scroll = this.initialize(Scroll, '<p>0123</p>');
    scroll.insertAt(2, 'video', '#');
    expect(scroll.domNode).toEqualHTML(`
      <p>01</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p>23</p>
    `);
  });

  it('split newline', function() {
    let scroll = this.initialize(Scroll, '<p>0123</p>');
    scroll.insertAt(4, 'video', '#');
    expect(scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p><br></p>
    `);
  });

  it('insert end of document', function() {
    let scroll = this.initialize(Scroll, '<p>0123</p>');
    scroll.insertAt(5, 'video', '#');
    expect(scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  it('insert text before', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(0, 'Test');
    expect(scroll.domNode).toEqualHTML(`
      <p>Test</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  it('insert text after', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(1, 'Test');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p>Test</p>
    `);
  });

  it('insert inline embed before', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(0, 'image', '/assets/favicon.png');
    expect(scroll.domNode).toEqualHTML(`
      <p><img src="/assets/favicon.png"></p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  it('insert inline embed after', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(1, 'image', '/assets/favicon.png');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p><img src="/assets/favicon.png"></p>
    `);
  });

  it('insert block embed before', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(0, 'video', '#1');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#1" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  it('insert block embed after', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(1, 'video', '#1');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <iframe src="#1" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  it('insert newline before', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(0, '\n');
    scroll.optimize();
    expect(scroll.domNode).toEqualHTML(`
      <p><br></p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  it('insert newline after', function() {
    let scroll = this.initialize(Scroll, '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.insertAt(1, '\n');
    scroll.optimize();
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p><br></p>
    `);
  });

  it('delete preceding newline', function() {
    let scroll = this.initialize(Scroll, '<p>0123</p><iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>');
    scroll.deleteAt(4, 1);
    expect(scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });
});
