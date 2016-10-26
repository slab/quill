import Delta from 'quill-delta';
import Editor from '../../../core/editor';
import Selection, { Range } from '../../../core/selection';


describe('Editor', function() {
  describe('insert', function() {
    it('text', function() {
      let editor = this.initialize(Editor, '<p><strong>0123</strong></p>');
      editor.insertText(2, '!!');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01!!23', { bold: true })
        .insert('\n')
      );
      expect(this.container).toEqualHTML('<p><strong>01!!23</strong></p>');
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
      expect(this.container).toEqualHTML('<p><strong>01<img src="/assets/favicon.png">23</strong></p>');
    });

    it('on empty line', function() {
      let editor = this.initialize(Editor, '<p>0</p><p><br></p><p>3</p>');
      editor.insertText(2, '!');
      expect(editor.getDelta()).toEqual(new Delta().insert('0\n!\n3\n'));
      expect(this.container).toEqualHTML('<p>0</p><p>!</p><p>3</p>');
    });

    it('end of document', function() {
      let editor = this.initialize(Editor, '<p>Hello</p>');
      editor.insertText(6, 'World!');
      expect(editor.getDelta()).toEqual(new Delta().insert('Hello\nWorld!\n'));
      expect(this.container).toEqualHTML('<p>Hello</p><p>World!</p>');
    });

    it('end of document with newline', function() {
      let editor = this.initialize(Editor, '<p>Hello</p>');
      editor.insertText(6, 'World!\n');
      expect(editor.getDelta()).toEqual(new Delta().insert('Hello\nWorld!\n'));
      expect(this.container).toEqualHTML('<p>Hello</p><p>World!</p>');
    });

    it('embed at end of document with newline', function() {
      let editor = this.initialize(Editor, '<p>Hello</p>');
      editor.insertEmbed(6, 'image', '/assets/favicon.png');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('Hello\n')
        .insert({ image: '/assets/favicon.png' })
        .insert('\n'));
      expect(this.container).toEqualHTML('<p>Hello</p><p><img src="/assets/favicon.png"></p>');
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
      expect(this.container).toEqualHTML(`
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
      expect(this.container).toEqualHTML(`
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
      expect(this.container).toEqualHTML(`
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
      expect(this.container).toEqualHTML(`
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
      expect(this.container).toEqualHTML(`
        <p><strong>01</strong></p>
        <p><br></p>
        <p><strong>23</strong></p>`
      );
    });

    it('text removing formatting', function() {
      let editor = this.initialize(Editor, '<p><s>01</s></p>');
      editor.insertText(2, '23', { bold: false, strike: false });
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01', { strike: true })
        .insert('23\n')
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
      expect(this.container).toEqualHTML('<p><strong><em>03</em></strong></p>');
    });

    it('parts of multiple lines', function() {
      let editor = this.initialize(Editor, '<p><em>0123</em></p><p><em>5678</em></p>');
      editor.deleteText(2, 5);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0178', { italic: true })
        .insert('\n')
      );
      expect(this.container).toEqualHTML('<p><em>0178</em></p>');
    });

    it('entire line keeping newline', function() {
      let editor = this.initialize(Editor, '<p><strong><em>0123</em></strong></p>');
      editor.deleteText(0, 4);
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container).toEqualHTML('<p><br></p>');
    });

    it('newline', function() {
      let editor = this.initialize(Editor, '<p><em>0123</em></p><p><em>5678</em></p>');
      editor.deleteText(4, 1);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01235678', { italic: true })
        .insert('\n')
      );
      expect(this.container).toEqualHTML('<p><em>01235678</em></p>');
    });

    it('entire document', function() {
      let editor = this.initialize(Editor, '<p><strong><em>0123</em></strong></p>');
      editor.deleteText(0, 5);
      expect(editor.getDelta()).toEqual(new Delta().insert('\n'));
      expect(this.container).toEqualHTML('<p><br></p>');
    });

    it('multiple complete lines', function() {
      let editor = this.initialize(Editor, '<p><em>012</em></p><p><em>456</em></p><p><em>890</em></p>');
      editor.deleteText(0, 8);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('890', { italic: true })
        .insert('\n')
      );
      expect(this.container).toEqualHTML('<p><em>890</em></p>');
    });
  });

  describe('format', function() {
    it('line', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.formatLine(1, 1, { header: 1 });
      expect(editor.scroll.domNode).toEqualHTML('<h1>0123</h1>');
    });
  });

  describe('removeFormat', function() {
    it('unwrap', function() {
      let editor = this.initialize(Editor, '<p>0<em>12</em>3</p>');
      editor.removeFormat(1, 2);
      expect(this.container).toEqualHTML('<p>0123</p>');
    });

    it('split inline', function() {
      let editor = this.initialize(Editor, '<p>0<strong><em>12</em></strong>3</p>');
      editor.removeFormat(1, 1);
      expect(this.container).toEqualHTML('<p>01<strong><em>2</em></strong>3</p>');
    });

    it('partial line', function() {
      let editor = this.initialize(Editor, '<ul><li>01</li></ul><ol><li>34</li></ol>');
      editor.removeFormat(1, 3);
      expect(this.container).toEqualHTML('<p>01</p><p>34</p>');
    });

    it('remove embed', function() {
      let editor = this.initialize(Editor, '<p>0<img src="/assets/favicon.png">2</p>')
      editor.removeFormat(1, 1);
      expect(this.container).toEqualHTML('<p>02</p>');
    });

    it('combined', function() {
      let editor = this.initialize(Editor, `
        <ul>
          <li>01<img src="/assets/favicon.png">3</li>
        </ul>
        <ol>
          <li>5<strong>6<em>78</em>9</strong>0</li>
        </ol>
      `);
      editor.removeFormat(1, 7);
      expect(this.container).toEqualHTML(`
        <p>013</p>
        <p>567<strong><em>8</em>9</strong>0</p>
      `);
    });

    it('end of document', function() {
      let editor = this.initialize(Editor, `
        <ul>
          <li>0123</li>
          <li>5678</li>
        </ol>
      `);
      editor.removeFormat(0, 12);
      expect(this.container).toEqualHTML(`
        <p>0123</p>
        <p>5678</p>
      `);
    });
  });

  describe('applyDelta', function() {
    it('insert', function() {
      let editor = this.initialize(Editor, '<p></p>');
      editor.applyDelta(new Delta().insert('01'));
      expect(this.container).toEqualHTML('<p>01</p>');
    });

    it('attributed insert', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(2).insert('|', { bold: true }));
      expect(this.container).toEqualHTML('<p>01<strong>|</strong>23</p>');
    });

    it('format', function() {
      let editor = this.initialize(Editor, '<p>01</p>');
      editor.applyDelta(new Delta().retain(2, { bold: true }));
      expect(this.container).toEqualHTML('<p><strong>01</strong></p>');
    });

    it('discontinuous formats', function() {
      let editor = this.initialize(Editor, '');
      let delta = new Delta()
        .insert('ab', { bold: true })
        .insert('23\n45')
        .insert('cd', { bold: true });
      editor.applyDelta(delta);
      expect(this.container).toEqualHTML('<p><strong>ab</strong>23</p><p>45<strong>cd</strong></p>');
    });

    it('unformatted insert', function() {
      let editor = this.initialize(Editor, '<p><em>01</em></p>');
      editor.applyDelta(new Delta().retain(1).insert('|'));
      expect(this.container).toEqualHTML('<p><em>0</em>|<em>1</em></p>');
    });

    it('insert at format boundary', function() {
      let editor = this.initialize(Editor, '<p><em>0</em><u>1</u></p>');
      editor.applyDelta(new Delta().retain(1).insert('|', { strike: true }));
      expect(this.container).toEqualHTML('<p><em>0</em><s>|</s><u>1</u></p>');
    });

    it('unformatted newline', function() {
      let editor = this.initialize(Editor, '<h1>01</h1>');
      editor.applyDelta(new Delta().retain(2).insert('\n'));
      expect(this.container).toEqualHTML('<p>01</p><h1><br></h1>');
    });

    it('formatted embed', function() {
      let editor = this.initialize(Editor, '');
      editor.applyDelta(new Delta().insert({ image: '/assets/favicon.png'}, { italic: true }));
      expect(this.container).toEqualHTML('<p><em><img src="/assets/favicon.png"></em>');
    });

    it('old embed', function() {
      let editor = this.initialize(Editor, '');
      editor.applyDelta(new Delta().insert(1, { image: '/assets/favicon.png', italic: true }));
      expect(this.container).toEqualHTML('<p><em><img src="/assets/favicon.png"></em>');
    });

    it('old list', function() {
      let editor = this.initialize(Editor, '');
      editor.applyDelta(new Delta().insert('\n', { bullet: true }).insert('\n', { list: true }));
      expect(this.container).toEqualHTML('<ul><li><br></li></ul><ol><li><br></li></ol><p><br></p>');
    });

    it('improper block embed insert', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(2).insert({ video: '#' }));
      expect(this.container).toEqualHTML('<p>01</p><iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe><p>23</p>');
    });

    it('append formatted block embed', function() {
      let editor = this.initialize(Editor, '<p>0123</p><p><br></p>');
      editor.applyDelta(new Delta()
        .retain(5)
        .insert({ video: '#' }, { align: 'right' })
      );
      expect(this.container).toEqualHTML('<p>0123</p><iframe src="#" class="ql-video ql-align-right" frameborder="0" allowfullscreen="true"></iframe><p><br></p>');
    });

    it('append', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(5).insert('5678'));
      expect(this.container).toEqualHTML('<p>0123</p><p>5678</p>');
    });

    it('append newline', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(5).insert('\n', { header: 2 }));
      expect(this.container).toEqualHTML('<p>0123</p><h2><br></h2>');
    })

    it('append text with newline', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(5).insert('5678').insert('\n', { header: 2 }));
      expect(this.container).toEqualHTML('<p>0123</p><h2>5678</h2>');
    });

    it('append non-isolated newline', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(5).insert('5678\n', { header: 2 }));
      expect(this.container).toEqualHTML('<p>0123</p><h2>5678</h2>');
    });

    it('eventual append', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(2).insert('ab\n', { header: 1 }).retain(3).insert('cd\n', { header: 2 }));
      expect(this.container).toEqualHTML('<h1>01ab</h1><p>23</p><h2>cd</h2>');
    });

    it('append text, embed and newline', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(5).insert('5678').insert({ image: '/assets/favicon.png' }).insert('\n', { header: 2 }));
      expect(this.container).toEqualHTML('<p>0123</p><h2>5678<img src="/assets/favicon.png"></h2>');
    });

    it('append multiple lines', function() {
      let editor = this.initialize(Editor, '<p>0123</p>');
      editor.applyDelta(new Delta().retain(5)
        .insert('56').insert('\n', { header: 1 })
        .insert('89').insert('\n', { header: 2 })
      );
      expect(this.container).toEqualHTML('<p>0123</p><h1>56</h1><h2>89</h2>');
    });

    it('code', function() {
      let editor = this.initialize(Editor, { html: '<p>0</p><pre>1\n23\n</pre><p><br></p>' });
      editor.applyDelta(new Delta().delete(4).retain(1).delete(2));
      expect(editor.scroll.domNode.innerHTML).toEqual('<p>2</p>');
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
});
