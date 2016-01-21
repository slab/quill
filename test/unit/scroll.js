import Scroll from '../../src/scroll';


describe('Scroll', function() {
  describe('path()', function() {
    it('middle', function() {
      let scroll = this.initialize(Scroll, '<p><em>01<strong>23<u>45</u>67</strong>89</em></p>');
      let path = scroll.path(7);
      let expected = [
        [ 'block', 0 ],
        [ 'italic', 2 ],
        [ 'bold', 4 ],
        [ 'text', 1 ]
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i][0].statics.blotName).toEqual(pos[0]);
        expect(path[i][1]).toEqual(pos[1]);
      });
    });

    it('end of line', function() {
      let scroll = this.initialize(Scroll, '<p><em>01</em><strong>23</strong></p><h1>5</h1>');
      let path = scroll.path(4);
      let expected = [
        [ 'block', 2 ],
        [ 'bold', 0 ],
        [ 'text', 2 ]
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i][0].statics.blotName).toEqual(pos[0]);
        expect(path[i][1]).toEqual(pos[1]);
      });
    });

    it('newline boundary', function() {
      let scroll = this.initialize(Scroll, '<p><em>01</em><strong>23</strong></p><h1>5</h1>');
      let path = scroll.path(5);
      let expected = [
        [ 'header', 0 ],
        [ 'text', 0 ]
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i][0].statics.blotName).toEqual(pos[0]);
        expect(path[i][1]).toEqual(pos[1]);
      });
    });

    it('beyond document', function() {
      let scroll = this.initialize(Scroll, '<p><em>01</em><strong>23</strong></p>');
      let path = scroll.path(5);
      expect(path.length).toEqual(0);
    });

    it('empty line', function() {
      let scroll = this.initialize(Scroll, '<p><br></p>');
      let path = scroll.path(0);
      let expected = [
        [ 'block', 0 ],
        [ 'break', 0 ]
      ];
      expect(path.length).toEqual(expected.length);
      expected.forEach(function(pos, i) {
        expect(path[i][0].statics.blotName).toEqual(pos[0]);
        expect(path[i][1]).toEqual(pos[1]);
      });
    });
  });
});
