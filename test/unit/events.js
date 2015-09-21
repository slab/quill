import Delta from 'rich-text/lib/delta';
import Quill from '../../src/quill';


describe('Events', function() {
  xdescribe('Editor', function() {
    beforeEach(function() {
      this.setContainer('<p>0123</p>');
      this.quill = new Quill(this.container);
      this.spy = {
        onText: function() {}
      };
      this.quill.on(Quill.events.TEXT_CHANGE, this.spy.onText);
      spyOn(this.spy, 'onText');
    });

    it('insert text', function() {
      this.quill.insertText(2, '!');
      expect(this.spy.onText.calls.count()).toBe(1);
      expect(this.spy.onText.calls.mostRecent().args[0]).toEqual(
        new Delta().retain(2).insert('!')
      );
      expect(this.spy.onText.calls.mostRecent().args[1]).toBe(Quill.sources.API);
    });
  });
});
