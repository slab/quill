import Delta from 'rich-text/lib/delta';
import Quill, { overload } from 'quill/quill';
import Emitter from 'quill/emitter';
import { Range } from 'quill/selection';


describe('Quill', function() {
  describe('construction', function() {
    it('empty', function() {
      let quill = this.initialize(Quill, '');
      expect(quill.getContents()).toEqual(new Delta().insert('\n'));
      expect(quill.root).toEqualHTML('<p><br></p>');
    });

    it('text', function() {
      let quill = this.initialize(Quill, '0123');
      expect(quill.getContents()).toEqual(new Delta().insert('0123\n'));
      expect(quill.root).toEqualHTML('<p>0123</p>');
    });
  });

  fdescribe('manipulation', function() {
    beforeEach(function() {
      this.quill = this.initialize(Quill, '<p>01234567</p>');
      this.oldDelta = this.quill.getContents();
      spyOn(this.quill.emitter, 'emit').and.callThrough();
    });

    it('deleteText()', function() {
      this.quill.deleteText(1, 2);
      expect(this.quill.root).toEqualHTML('<p>034567</p>');
      let change = new Delta().retain(1).delete(2);
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });

    it('format', function() {
      this.quill.setSelection(2, 4);
      this.quill.format('bold', true);
      let change = new Delta().retain(2).retain(4, { bold: true });
      expect(this.quill.root).toEqualHTML('<p>01<strong>2345</strong>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
      expect(this.quill.getSelection()).toEqual(new Range(2, 4));
    });

    it('insertEmbed()', function() {
      this.quill.insertEmbed(0, 'image', '/assets/favicon.png');
      let change = new Delta().insert({ image: '/assets/favicon.png'});
      expect(this.quill.root).toEqualHTML('<p><img src="/assets/favicon.png">01234567</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });
  });

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

    it('array of operations', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('test').insert('123', { bold: true }).insert('\n');
      quill.setContents(delta.ops);
      expect(quill.getContents()).toEqual(delta);
    });

    it('json', function() {
      let quill = this.initialize(Quill, '');
      let delta = { ops: [{ insert: 'test\n'}] };
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(new Delta(delta));
    });

    it('no trailing newline', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setContents(new Delta().insert('0123'));
      expect(quill.getContents()).toEqual(new Delta().insert('0123\n'));
    });
  });

  describe('setText()', function() {
    it('overwrite', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('abc');
      expect(quill.root).toEqualHTML('<p>abc</p>');
    });

    it('set to newline', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('\n');
      expect(quill.root).toEqualHTML('<p><br></p>');
    });

    it('multiple newlines', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('\n\n');
      expect(quill.root).toEqualHTML('<p><br></p><p><br></p>');
    });

    it('content with trailing newline', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('abc\n');
      expect(quill.root).toEqualHTML('<p>abc</p>');
    });
  });

  describe('overload', function() {
    it('(index:number, length:number)', function() {
      let [index, length, formats, source] = overload(0, 1);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(index:number, length:number, format:string, value:boolean, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, 'bold', true, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, length:number, format:string, value:string, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, 'color', Quill.sources.USER, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, length:number, format:string, value:string)', function() {
      let [index, length, formats, source] = overload(0, 1, 'color', Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(index:number, length:number, format:object)', function() {
      let [index, length, formats, source] = overload(0, 1, { bold: true });
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(index:number, length:number, format:object, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, { bold: true }, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, length:number, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, source:string)', function() {
      let [index, length, formats, source] = overload(0, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(0);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1));
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:string, value:boolean, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), 'bold', true, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), 'color', Quill.sources.API, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.API });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), 'color', Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), { bold: true });
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), { bold: true }, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1));
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number)', function() {
      let [index, length, formats, source] = overload(new Range(10, 1), 0);
      expect(index).toBe(10);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:string, value:boolean)', function() {
      let [index, length, formats, source] = overload(new Range(10, 1), 0, 'bold', true);
      expect(index).toBe(10);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:object, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(10, 1), 0, { bold: true }, Quill.sources.USER);
      expect(index).toBe(10);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });
  });
});
