import Delta from 'rich-text/lib/delta';
import Editor from 'quill/core/editor';
import Emitter from 'quill/core/emitter';
import Selection, { Range } from 'quill/core/selection';


describe('Editor', function() {
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
      editor.insertEmbed(2, 'image', '/assets/favicon.png');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01', { bold: true })
        .insert({ image: '/assets/favicon.png'}, { bold: true })
        .insert('23', { bold: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><strong>01<img src="/assets/favicon.png">23</strong></p>');
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
      let editor = this.initialize(Editor, '<p><strong><em>0123</em></strong></p>');
      editor.deleteText(1, 2);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('03', { bold: true, italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><strong><em>03</em></strong></p>');
    });

    it('parts of multiple lines', function() {
      let editor = this.initialize(Editor, '<p><em>0123</em></p><p><em>5678</em></p>');
      editor.deleteText(2, 5);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0178', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><em>0178</em></p>');
    });

    it('entire line keeping newline', function() {
      let editor = this.initialize(Editor, '<p><strong><em>0123</em></strong></p>');
      editor.deleteText(0, 4);
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container.innerHTML).toEqualHTML('<p><br></p>');
    });

    it('newline', function() {
      let editor = this.initialize(Editor, '<p><em>0123</em></p><p><em>5678</em></p>');
      editor.deleteText(4, 1);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01235678', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><em>01235678</em></p>');
    });

    it('entire document', function() {
      let editor = this.initialize(Editor, '<p><strong><em>0123</em></strong></p>');
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

  describe('format', function() {
    it('line', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.formatLine(1, 1, { header: 1 });
      expect(editor.scroll.domNode).toEqualHTML('<h1 id="0123">0123</h1>');
    });
  });

  describe('applyDelta', function() {
    it('insert', function() {
      let editor = this.initialize(Editor, '<p></p>');
      editor.applyDelta(new Delta().insert('01'));
      expect(this.container.innerHTML).toEqualHTML('<p>01</p>');
    });

    it('attributed insert', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(2).insert('|', { bold: true }));
      expect(this.container.innerHTML).toEqualHTML('<p>01<strong>|</strong>23</p>');
    });

    it('format', function() {
      let editor = this.initialize(Editor, '<p>01</p>');
      editor.applyDelta(new Delta().retain(2, { bold: true }));
      expect(this.container.innerHTML).toEqualHTML('<p><strong>01</strong></p>');
    });

    it('unformatted insert', function() {
      let editor = this.initialize(Editor, '<p><em>01</em></p>');
      editor.applyDelta(new Delta().retain(1).insert('|'));
      expect(this.container.innerHTML).toEqualHTML('<p><em>0</em>|<em>1</em></p>');
    });

    it('insert at format boundary', function() {
      let editor = this.initialize(Editor, '<p><em>0</em><u>1</u></p>');
      editor.applyDelta(new Delta().retain(1).insert('|', { strike: true }));
      expect(this.container.innerHTML).toEqualHTML('<p><em>0</em><s>|</s><u>1</u></p>');
    });

    it('unformatted newline', function() {
      let editor = this.initialize(Editor, '<h1>01</h1>');
      editor.applyDelta(new Delta().retain(2).insert('\n'));
      expect(this.container.innerHTML).toEqualHTML('<p>01</p><h1><br></h1>');
    });

    it('formatted embed', function() {
      let editor = this.initialize(Editor, '');
      editor.applyDelta(new Delta().insert({ image: '/assets/favicon.png'}, { italic: true }));
      expect(this.container.innerHTML).toEqualHTML('<p><em><img src="/assets/favicon.png"></em>');
    });

    it('old embed', function() {
      let editor = this.initialize(Editor, '');
      editor.applyDelta(new Delta().insert(1, { image: '/assets/favicon.png', italic: true }));
      expect(this.container.innerHTML).toEqualHTML('<p><em><img src="/assets/favicon.png"></em>');
    });
  });

  describe('getFormat()', function() {
    it('unformatted', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      expect(editor.getFormat(1)).toEqual({});
    })

    it('formatted', function() {
      let editor = this.initialize(Editor, '<h1><em>0123</em></h1>');
      expect(editor.getFormat(1)).toEqual({ header: 1, italic: true });
    })

    it('cursor', function() {
      let editor = this.initialize(Editor, '<h1><strong><em>0123</em></strong></h1><h2><u>5678</u></h2>');
      expect(editor.getFormat(2)).toEqual({ bold: true, italic: true, header: 1 });
    });

    it('cursor with preformat', function() {
      let [editor, selection] = this.initialize([Editor, Selection], '<h1><strong><em>0123</em></strong></h1>');
      selection.setRange(new Range(2));
      selection.format('underline', true);
      selection.format('color', 'red');
      expect(editor.getFormat(2)).toEqual({ bold: true, italic: true, header: 1, color: 'red', underline: true });
    });

    it('across leaves', function() {
      let editor = this.initialize(Editor, `
        <h1>
          <strong class="ql-size-small"><em>01</em></strong>
          <em class="ql-size-large"><u>23</u></em>
          <em class="ql-size-huge"><u>45</u></em>
        </h1>
      `);
      expect(editor.getFormat(1, 4)).toEqual({ italic: true, header: 1, size: ['small', 'large', 'huge'] });
    });

    it('across lines', function() {
      let editor = this.initialize(Editor, `
        <h1 class="ql-align-right"><em>01</em></h1>
        <h1 class="ql-align-center"><em>34</em></h1>
      `);
      expect(editor.getFormat(1, 3)).toEqual({ italic: true, header: 1, align: ['right', 'center'] });
    });
  });

  describe('events', function() {
    beforeEach(function() {
      this.editor = this.initialize(Editor, '<p>0123</p>');
      this.editor.update();
      spyOn(this.editor.emitter, 'emit').and.callThrough();
    });

    it('api text insert', function() {
      let old = this.editor.getDelta();
      this.editor.insertText(2, '!');
      let delta = new Delta().retain(2).insert('!');
      expect(this.editor.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, old, Emitter.sources.API);
    });

    it('user text insert', function(done) {
      let old = this.editor.getDelta();
      this.container.firstChild.firstChild.data = '01!23';
      let delta = new Delta().retain(2).insert('!');
      setTimeout(() => {
        expect(this.editor.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, old, Emitter.sources.USER);
        done();
      }, 1);
    });
  });
});
