import Delta from 'rich-text/lib/delta';
import Quill from 'quill/quill';


describe('Quill', function() {
  describe('setContents()', function() {
    it('empty', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML('<p><br></p>');
    });

    it('single line', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('Hello World!\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML('<p>Hello World!</p>');
    });

    it('multiple lines', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('Hello\n\nWorld!\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML('<p>Hello</p><p><br></p><p>World!</p>');
    });

    it('basic formats', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('Welcome').insert('\n', { header: 1 })
                             .insert('Hello\n')
                             .insert('World')
                             .insert('!', { bold: true })
                             .insert('\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML(`
        <h1 id="welcome">Welcome</h1>
        <p>Hello</p>
        <p>World<strong>!</strong></p>
      `);
    });
  });
});
