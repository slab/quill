import Delta from 'rich-text/lib/delta';
import Editor from '../../../src/editor';


describe('Formats', function() {
  describe('Inline', function() {
    it('definition', function() {
      this.setContainer(`
        <p>
          <strong>0</strong>
          <em>1</em>
          <s>2</s>
          <u>3</u>
          <a href="http://quilljs.com/">4</a>
          <code>5</code>
          <sup>6</sup>
          <sub>7</sub>
        </p>`
      );
      let editor = new Editor(this.container);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0', { bold: true })
        .insert('1', { italic: true })
        .insert('2', { strike: true })
        .insert('3', { underline: true })
        .insert('4', { link: 'http://quilljs.com/' })
        .insert('5', { 'inline-code': true })
        .insert('6', { script: 'super' })
        .insert('7', { script: 'sub' })
        .insert('\n')
      );
    });

    it('inner node', function() {
      this.setContainer('<p><em>0123</em></p>');
      let editor = new Editor(this.container);
      editor.formatAt(1, 2, 'bold', true);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0', { italic: true })
        .insert('12', { italic: true, bold: true })
        .insert('3', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><em>0<strong>12</strong>3</em></p>');
    });

    it('outer node', function() {
      this.setContainer('<p><strong>0123</strong></p>');
      let editor = new Editor(this.container);
      editor.formatAt(1, 2, 'italic', true);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0', { bold: true })
        .insert('12', { italic: true, bold: true })
        .insert('3', { bold: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML(`
        <p>
          <strong>0</strong>
          <em><strong>12</strong></em>
          <strong>3</strong>
        </p>`
      );
    });

    it('ordering', function() {
      this.setContainer('<p>012</p><p>456</p>');
      let editor = new Editor(this.container);
      editor.formatAt(0, 2, 'bold', true);
      editor.formatAt(1, 2, 'italic', true);
      editor.formatAt(5, 2, 'italic', true);
      editor.formatAt(4, 2, 'bold', true);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0', { bold: true })
        .insert('1', { italic: true, bold: true })
        .insert('2', { italic: true })
        .insert('\n')
        .insert('4', { bold: true })
        .insert('5', { italic: true, bold: true })
        .insert('6', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML(`
        <p><strong>0</strong><em><strong>1</strong>2</em></p>
        <p><strong>4</strong><em><strong>5</strong>6</em></p>
      `);
    });

    it('parts of multiple lines', function() {
      this.setContainer(`
        <p><em>0123</em></p>
        <p><em>5678</em></p>`
      );
      let editor = new Editor(this.container);
      editor.formatAt(2, 5, 'bold', true);
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('01', { italic: true })
        .insert('23', { italic: true, bold: true })
        .insert('\n')
        .insert('56', { italic: true, bold: true })
        .insert('78', { italic: true })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML(`
        <p><em>01<strong>23</strong></em></p>
        <p><em><strong>56</strong>78</em></p>`
      );
    });

    it('subscript exclusitivity', function() {
      this.setContainer('<p><sub>0123</sub></p>');
      let editor = new Editor(this.container);
      editor.formatAt(1, 2, 'script', 'super');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0', { script: 'sub' })
        .insert('12', { script: 'super' })
        .insert('3', { script: 'sub' })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><sub>0</sub><sup>12</sup><sub>3</sub></p>');
    });

    it('superscript exclusitivity', function() {
      this.setContainer('<p><sup>0123</sup></p>');
      let editor = new Editor(this.container);
      editor.formatAt(1, 2, 'script', 'sub');
      expect(editor.getDelta()).toEqual(new Delta()
        .insert('0', { script: 'super' })
        .insert('12', { script: 'sub' })
        .insert('3', { script: 'super' })
        .insert('\n')
      );
      expect(this.container.innerHTML).toEqualHTML('<p><sup>0</sup><sub>12</sub><sup>3</sup></p>');
    });
  });
});
