describe('Scroll', function() {
  describe('findPath()', function() {
    it('middle', function() {
      let editor = this.setEditor('<p><em>01<strong>23<u>45</u>67</strong>89</em></p>');
      let path = editor.scroll.findPath(7);
      let expected = [
        { blot: 'block', offset: 0 },
        { blot: 'italic', offset: 2 },
        { blot: 'bold', offset: 4 },
        { blot: 'text', offset: 1 }
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i].blot.statics.blotName).toEqual(pos.blot);
        expect(path[i].offset).toEqual(pos.offset);
      });
    });

    it('inclusive default', function() {
      let editor = this.setEditor('<p><em>01<strong>23<u>45</u>67</strong>89</em></p>');
      let path = editor.scroll.findPath(6);
      let expected = [
        { blot: 'block', offset: 0 },
        { blot: 'italic', offset: 2 },
        { blot: 'bold', offset: 2 },
        { blot: 'underline', offset: 0 },
        { blot: 'text', offset: 2 }
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i].blot.statics.blotName).toEqual(pos.blot);
        expect(path[i].offset).toEqual(pos.offset);
      });
    });

    it('end of line', function() {
      let editor = this.setEditor('<p><em>01</em><strong>23</strong></p><h1>5</h1>');
      let path = editor.scroll.findPath(4);
      let expected = [
        { blot: 'block', offset: 2 },
        { blot: 'bold', offset: 0 },
        { blot: 'text', offset: 2 }
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i].blot.statics.blotName).toEqual(pos.blot);
        expect(path[i].offset).toEqual(pos.offset);
      });
    });

    it('newline boundary', function() {
      let editor = this.setEditor('<p><em>01</em><strong>23</strong></p><h1>5</h1>');
      let path = editor.scroll.findPath(5);
      let expected = [
        { blot: 'header', offset: 0 },
        { blot: 'text', offset: 0 }
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i].blot.statics.blotName).toEqual(pos.blot);
        expect(path[i].offset).toEqual(pos.offset);
      });
    });

    it('beyond document', function() {
      let editor = this.setEditor('<p><em>01</em><strong>23</strong></p>');
      let path = editor.scroll.findPath(5);
      expect(path.length).toEqual(0);
    });

    it('empty line', function() {
      let editor = this.setEditor('<p><br></p>');
      let path = editor.scroll.findPath(0);
      let expected = [
        { blot: 'block', offset: 0 },
        { blot: 'break', offset: 0 }
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i].blot.statics.blotName).toEqual(pos.blot);
        expect(path[i].offset).toEqual(pos.offset);
      });
    });
  });
});
