import Delta from 'quill-delta';
import Editor from '../../../core/editor';
import Link from '../../../formats/link';


describe('Link', function() {
  it('add', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(1, 2, { link:  'https://quilljs.com' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0')
      .insert('12', { link: 'https://quilljs.com' })
      .insert('3\n')
    );
    expect(editor.scroll.domNode).toEqualHTML('<p>0<a href="https://quilljs.com" target="_blank">12</a>3</p>');
  });

  it('add invalid', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(1, 2, { link: 'javascript:alert(0);' });  // eslint-disable-line no-script-url
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0')
      .insert('12', { link: Link.SANITIZED_URL })
      .insert('3\n')
    );
  });

  it('add non-whitelisted protocol', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(1, 2, { link: 'gopher://quilljs.com' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0')
      .insert('12', { link: Link.SANITIZED_URL })
      .insert('3\n')
    );
    expect(editor.scroll.domNode).toEqualHTML('<p>0<a href="about:blank" target="_blank">12</a>3</p>');
  });

  it('change', function() {
    let editor = this.initialize(Editor, '<p>0<a href="https://github.com" target="_blank">12</a>3</p>');
    editor.formatText(1, 2, { link:  'https://quilljs.com' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0')
      .insert('12', { link: 'https://quilljs.com' })
      .insert('3\n')
    );
    expect(editor.scroll.domNode).toEqualHTML('<p>0<a href="https://quilljs.com" target="_blank">12</a>3</p>');
  });

  it('remove', function() {
    let editor = this.initialize(Editor, '<p>0<a class="ql-size-large" href="https://quilljs.com" target="_blank">12</a>3</p>');
    editor.formatText(1, 2, { link: false });
    let delta = new Delta().insert('0').insert('12', { size: 'large' }).insert('3\n');
    expect(editor.getDelta()).toEqual(delta);
    expect(editor.scroll.domNode).toEqualHTML('<p>0<span class="ql-size-large">12</span>3</p>');
  });
});
