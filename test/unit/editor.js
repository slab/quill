import Delta from 'rich-text/lib/delta';
import Editor from '../../core/editor';
import Selection, { Range } from '../../core/selection';


describe('Editor', function() {
  describe('delta', function() {
    it('empty', function() {
      let editor = this.initialize(Editor, '');
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container.innerHTML).toEqualHTML('<p><br></p>');
    });

    it('empty line', function() {
      let editor = this.initialize(Editor, '<p><br></p>');
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container.innerHTML).toEqualHTML('<p><br></p>');
    });

    it('empty line no break', function() {
      let editor = this.initialize(Editor, '<p></p>');
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container.innerHTML).toEqualHTML('<p><br></p>');
    });

    it('full document', function() {
      let editor = this.initialize(Editor, `
        <h1>Quill Rich Text Editor</h1>
        <p><br></p>
        <p>Quill is a free, <a href="https://github.com/quilljs/quill/">open source</a> WYSIWYG editor built for the modern web.</p>
        <p><br></p>
        <ul>
          <li>Fast and lightweight</li>
          <li>Semantic markup</li>
          <li>Standardized HTML between browsers</li>
          <li>Cross browser support including Chrome, Firefox, Safari, and IE 9+</li>
        </ul>
        <p><br></p>
        <p class="ql-align-center">
          <img src="http://quilljs.com/images/quill-photo.jpg">
        </p>
        <p class="ql-align-center">
          <a class="ql-size-large" href="https://github.com/quilljs/quill/releases/download/v0.20.0/quill.tar.gz">Download Quill</a>
        </p>
        <p><br></p>`
      );
      let expected = editor.scroll.domNode.innerHTML;
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('Quill Rich Text Editor')
        .insert('\n', { header: 1 })
        .insert('\nQuill is a free, ')
        .insert('open source', { link: 'https://github.com/quilljs/quill/' })
        .insert(' WYSIWYG editor built for the modern web.\n\nFast and lightweight')
        .insert('\n', { list: 'bullet' })
        .insert('Semantic markup')
        .insert('\n', { list: 'bullet' })
        .insert('Standardized HTML between browsers')
        .insert('\n', { list: 'bullet' })
        .insert('Cross browser support including Chrome, Firefox, Safari, and IE 9+')
        .insert('\n', { list: 'bullet' })
        .insert('\n')
        .insert({ image: 'http://quilljs.com/images/quill-photo.jpg' })
        .insert('\n', { align: 'center' })
        .insert('Download Quill', { size: 'large', link: 'https://github.com/quilljs/quill/releases/download/v0.20.0/quill.tar.gz' })
        .insert('\n', { align: 'center' })
        .insert('\n'));
      expect(this.container.innerHTML).toEqualHTML(expected);
    });
  });

  describe('insert', function() {
    it('text', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertText(2, '!!');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01!!23', { bold: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><strong>01!!23</strong></p>');
    });

    it('embed', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertEmbed(2, 'image', '/favicon.png');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01', { bold: true })
        .insert({ image: '/favicon.png'}, { bold: true })
        .insert('23', { bold: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><strong>01<img src="/favicon.png">23</strong></p>');
    });

    it('on empty line', function() {
      let editor = this.initialize(Editor, '<p>0</p><p><br></p><p>3</p>');
      editor.insertText(2, '!');
      expect(editor.getDelta()).toEqual(new Delta().insert('0\n!\n3\n'));
      expect(this.container.innerHTML).toEqualHTML('<p>0</p><p>!</p><p>3</p>');
    });

    it('newline splitting', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertText(2, '\n');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01', { bold: true })
        .insert('\n')
        .insert('23', { bold: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML(`
        <p><strong>01</strong></p>
        <p><strong>23</strong></p>`
      );
    });

    it('prepend newline', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertText(0, '\n');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('\n')
        .insert('0123', { bold: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML(`
        <p><br></p>
        <p><strong>0123</strong></p>`
      );
    });

    it('append newline', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertText(4, '\n');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0123', { bold: true })
        .insert('\n\n')
      );
      expect(this.container.innerHTML).toEqualHTML(`
        <p><strong>0123</strong></p>
        <p><br></p>`
      );
    });

    it('multiline text', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertText(2, '\n!!\n!!\n');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01', { bold: true })
        .insert('\n')
        .insert('!!', { bold: true })
        .insert('\n')
        .insert('!!', { bold: true })
        .insert('\n')
        .insert('23', { bold: true })
        .insert('\n'));
      expect(this.container.innerHTML).toEqualHTML(`
        <p><strong>01</strong></p>
        <p><strong>!!</strong></p>
        <p><strong>!!</strong></p>
        <p><strong>23</strong></p>`
      );
    });

    it('multiple newlines', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertText(2, '\n\n');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01', { bold: true })
        .insert('\n\n')
        .insert('23', { bold: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML(`
        <p><strong>01</strong></p>
        <p><br></p>
        <p><strong>23</strong></p>`
      );
    });
  });

  describe('delete', function() {
    it('inner node', function() {
      let editor = this.initialize(Editor, '<p><em><strong>0123</strong></em></p>');
      editor.deleteText(1, 3);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('03', { bold: true, italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><em><strong>03</strong></em></p>');
    });

    it('parts of multiple lines', function() {
      let editor = this.initialize(Editor, '<p><em>0123</em></p><p><em>5678</em></p>');
      editor.deleteText(2, 7);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0178', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><em>0178</em></p>');
    });

    it('entire line keeping newline', function() {
      let editor = this.initialize(Editor, '<p><em><strong>0123</strong></em></p>');
      editor.deleteText(0, 4);
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container.innerHTML).toEqualHTML('<p><br></p>');
    });

    it('newline', function() {
      let editor = this.initialize(Editor, '<p><em>0123</em></p><p><em>5678</em></p>');
      editor.deleteText(4, 5);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01235678', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><em>01235678</em></p>');
    });

    it('entire document', function() {
      let editor = this.initialize(Editor, '<p><em><strong>0123</strong></em></p>');
      editor.deleteText(0, 5);
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container.innerHTML).toEqualHTML('<p><br></p>');
    });

    it('multiple complete lines', function() {
      let editor = this.initialize(Editor, '<p><em>012</em></p><p><em>456</em></p><p><em>890</em></p>');
      editor.deleteText(0, 8);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('890', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><em>890</em></p>');
    });
  });

  describe('getFormat', function() {
    it('unformatted', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      expect(editor.getFormat(1, 2)).toEqual({});
    })

    it('formatted', function() {
      let editor = this.initialize(Editor, '<h1><em>0123</em></h1>');
      expect(editor.getFormat(1, 2)).toEqual({ header: 1, italic: true });
    })

    it('cursor', function() {
      let editor = this.initialize(Editor, '<h1><em><strong>0123</strong></em></h1><h2><u>5678</u></h2>');
      expect(editor.getFormat(2, 2)).toEqual({ bold: true, italic: true, header: 1 });
    });

    it('cursor with preformat', function() {
      let [editor, selection] = this.initialize([Editor, Selection], '<h1><em><strong>0123</strong></em></h1>');
      selection.setRange(new Range(2));
      selection.format('underline', true);
      selection.format('color', 'red');
      expect(editor.getFormat(2, 2)).toEqual({ bold: true, italic: true, header: 1, color: 'red', underline: true });
    });

    it('across leaves', function() {
      let editor = this.initialize(Editor, `
        <h1>
          <em class="ql-size-small"><strong>01</strong></em>
          <strong class="ql-size-large"><u>23</u></strong>
          <strong class="ql-size-huge"><u>45</u></strong>
        </h1>
      `);
      expect(editor.getFormat(1, 5)).toEqual({ bold: true, header: 1, size: ['small', 'large', 'huge'] });
    });

    it('across lines', function() {
      let editor = this.initialize(Editor, `
        <h1 class="ql-align-right"><em>01</em></h1>
        <h1 class="ql-align-center"><em>34</em></h1>
      `);
      expect(editor.getFormat(1, 4)).toEqual({ italic: true, header: 1, align: ['right', 'center'] });
    });
  });
});
