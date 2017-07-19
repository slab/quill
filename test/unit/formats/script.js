import Editor from '../../../core/editor';


describe('Script', function() {
  it('add', function() {
    let editor = this.initialize(Editor, '<p>a<sup>2</sup> + b2 = c<sup>2</sup></p>');
    editor.formatText(6, 1, { script: 'super' });
    expect(editor.scroll.domNode).toEqualHTML('<p>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></p>');
  });

  it('remove', function() {
    let editor = this.initialize(Editor, '<p>a<sup>2</sup> + b<sup>2</sup></p>');
    editor.formatText(1, 1, { script: false });
    expect(editor.scroll.domNode).toEqualHTML('<p>a2 + b<sup>2</sup></p>');
  });

  it('replace', function() {
    let editor = this.initialize(Editor, '<p>a<sup>2</sup> + b<sup>2</sup></p>');
    editor.formatText(1, 1, { script: 'sub' });
    expect(editor.scroll.domNode).toEqualHTML('<p>a<sub>2</sub> + b<sup>2</sup></p>');
  });
});
