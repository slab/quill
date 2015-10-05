import Quill from '../../src/quill';
import { Range } from '../../src/selection';


describe('Quill', function() {
  beforeEach(function() {
    this.setContainer('<p>01234567</p>');
    this.quill = new Quill(this.container);
  });

  describe('_buildParams', function() {
    it('(start:number, end:number)', function() {
      let [start, end, formats, source] = this.quill._buildParams(0, 1);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(start:number, end:number, format:string, value:boolean, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(0, 1, 'bold', true, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(start:number, end:number, format:string, value:string, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(0, 1, 'color', Quill.sources.USER, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(start:number, end:number, format:string, value:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(0, 1, 'color', Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(start:number, end:number, format:object)', function() {
      let [start, end, formats, source] = this.quill._buildParams(0, 1, { bold: true });
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(start:number, end:number, format:object, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(0, 1, { bold: true }, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(start:number, end:number, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(0, 1, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1));
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:string, value:boolean, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1), 'bold', true, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1), 'color', Quill.sources.USER, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1), 'color', Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1), { bold: true });
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1), { bold: true }, Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1), Quill.sources.USER);
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(0, 1));
      expect(start).toBe(0);
      expect(end).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(10, 11), 0);
      expect(start).toBe(10);
      expect(end).toBe(11);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:string, value:boolean)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(10, 11), 0, 'bold', true);
      expect(start).toBe(10);
      expect(end).toBe(11);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:object, source:string)', function() {
      let [start, end, formats, source] = this.quill._buildParams(new Range(10, 11), 0, { bold: true }, Quill.sources.USER);
      expect(start).toBe(10);
      expect(end).toBe(11);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });
  });
});
