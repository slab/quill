import Quill, { overload } from '../../core/quill';
import { Range } from '../../core/selection';
import Emitter from '../../core/emitter';
import Delta from 'rich-text/lib/delta';


describe('Quill', function() {
  beforeEach(function() {
    this.quill = this.initialize(Quill, '<p>01234567</p>');
  });

  describe('deleteText', function() {
    it('should delete text at given index and length', function() {
      this.quill.deleteText(1, 2);
      expect(this.container.firstChild.innerHTML).toEqualHTML('<p>034567</p>');
    });

    it('should emit a TEXT_CHANGE event with the diff delta', function(done) {
      this.quill.emitter.on(Emitter.events.TEXT_CHANGE, function(change, oldDelta, source) {
        expect(change).toEqual(new Delta().retain(1).delete(2));
        done();
      });
      this.quill.deleteText(1, 2);
    });

    it('should emit a TEXT_CHANGE event with the old delta', function(done) {
      this.quill.emitter.on(Emitter.events.TEXT_CHANGE, function(change, oldDelta, source) {
        expect(oldDelta).toEqual(new Delta().insert('01234567\n'));
        done();
      });
      this.quill.deleteText(1, 2);
    });

    it('should mark the delete with a default source', function(done) {
      this.quill.emitter.on(Emitter.events.TEXT_CHANGE, function(change, oldDelta, source) {
        expect(source).toEqual(Emitter.sources.API);
        done();
      });
      this.quill.deleteText(1, 2);
    });

    it('should mark the delete with the passed in source', function(done) {
      this.quill.emitter.on(Emitter.events.TEXT_CHANGE, function(change, oldDelta, source) {
        expect(source).toEqual('bob');
        done();
      });
      this.quill.deleteText(1, 2, 'bob');
    });
  });

  describe('overload', function() {
    it('(start:number, end:number)', function() {
      let [start, end, formats, source] = overload(0, 1);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(start:number, end:number, format:string, value:boolean, source:string)', function() {
      let [start, end, formats, source] = overload(0, 1, 'bold', true, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(start:number, end:number, format:string, value:string, source:string)', function() {
      let [start, end, formats, source] = overload(0, 1, 'color', Quill.sources.USER, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(start:number, end:number, format:string, value:string)', function() {
      let [start, end, formats, source] = overload(0, 1, 'color', Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(start:number, end:number, format:object)', function() {
      let [start, end, formats, source] = overload(0, 1, { bold: true });
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(start:number, end:number, format:object, source:string)', function() {
      let [start, end, formats, source] = overload(0, 1, { bold: true }, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(start:number, end:number, source:string)', function() {
      let [start, end, formats, source] = overload(0, 1, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(start:number, source:string)', function() {
      let [start, end, formats, source] = overload(0, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(0);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1));
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:string, value:boolean, source:string)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1), 'bold', true, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string, source:string)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1), 'color', Quill.sources.USER, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1), 'color', Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1), { bold: true });
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object, source:string)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1), { bold: true }, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, source:string)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1), Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [start, end, formats, source] = overload(new Range(0, 1));
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number)', function() {
      let [start, end, formats, source] = overload(new Range(10, 11), 0);
      expect(start).toBe(10);
      expect(end).toBe(11);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:string, value:boolean)', function() {
      let [start, end, formats, source] = overload(new Range(10, 11), 0, 'bold', true);
      expect(start).toBe(10);
      expect(end).toBe(11);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:object, source:string)', function() {
      let [start, end, formats, source] = overload(new Range(10, 11), 0, { bold: true }, Quill.sources.USER);
      expect(start).toBe(10);
      expect(end).toBe(11);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });
  });

  xdescribe('selection preservation', function() {
    beforeEach(function() {
      this.quill = this.initialize(Quill, '<p><strong>0123</strong><em>4567</em></p>');
    });

    it('format surround', function() {
      this.quill.setSelection(1, 3);
      this.quill.formatText(0, 4, 'italic', true);
      expect(this.quill.getSelection()).toEqual(new Range(1, 3));
    });

    it('user text change', function() {
      this.quill.setSelection(1, 3);
      let text = document.createTextNode('!');
      this.quill.scroll.domNode.firstChild.firstChild.appendChild(text);
      expect(this.quill.getSelection()).toEqual(new Range(1, 3));
    });

    it('user dom text change', function() {
      this.quill.setSelection(2, 3);
      let textNode = this.quill.scroll.domNode.firstChild.firstChild.firstChild;
      textNode.splitText(1);
      textNode.parentNode.removeChild(textNode);
      expect(this.quill.getSelection()).toEqual(new Range(1, 2));
    });
  });

  describe('setText()', function() {
    it('overwrite', function() {
      this.quill.setText('abc');
      expect(this.quill.root.innerHTML).toEqualHTML('<p>abc</p>');
    });

    it('set to newline', function() {
      this.quill.setText('\n');
      expect(this.quill.root.innerHTML).toEqualHTML('<p><br></p>');
    });

    it('multiple newlines', function() {
      this.quill.setText('\n\n');
      expect(this.quill.root.innerHTML).toEqualHTML('<p><br></p><p><br></p>');
    });

    it('content with trailing newline', function() {
      this.quill.setText('abc\n');
      expect(this.quill.root.innerHTML).toEqualHTML('<p>abc</p>');
    });
  });
});
