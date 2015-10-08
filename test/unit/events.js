import Delta from 'rich-text/lib/delta';
import Quill from '../../src/quill';


describe('Events', function() {
  describe('Editor', function() {
    beforeEach(function() {
      this.setContainer('<p>0123</p>');
      this.quill = new Quill(this.container);
      this.handler = function() {};
      this.quill.on(Quill.events.TEXT_CHANGE, (delta, source) => {
        this.handler(delta, source);
      });
    });

    it('api text insert', function(callback) {
      this.handler = function(delta, source) {
        expect(delta).toEqual(new Delta().retain(2).insert('!'));
        expect(source).toBe(Quill.sources.API);
        callback();
      }
      this.quill.insertText(2, '!');
    });

    it('user text insert', function(callback) {
      this.handler = function(delta, source) {
        expect(delta).toEqual(new Delta().retain(2).insert('!'));
        expect(source).toBe(Quill.sources.USER);
        callback();
      };
      $(this.quill.root.firstChild).text('01!23');
    });
  });
});
