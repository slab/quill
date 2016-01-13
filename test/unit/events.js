import Delta from 'rich-text/lib/delta';
import Editor from '../../src/editor';
import Emitter from '../../src/emitter';


describe('Events', function() {
  describe('Editor', function() {
    beforeEach(function() {
      this.editor = this.initialize(Editor, '<p>0123</p>');
      spyOn(this.editor.emitter, 'emit').and.callThrough();
    });

    it('api text insert', function() {
      this.editor.insertText(2, '!');
      let delta = new Delta().retain(2).insert('!');
      expect(this.editor.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, Emitter.sources.API);
    });

    it('user text insert', function(callback) {
      this.container.firstChild.firstChild.data = '01!23';
      setTimeout(() => {
        let delta = new Delta().retain(2).insert('!');
        expect(this.editor.emitter.emit.calls.mostRecent().args).toEqual([Emitter.events.TEXT_CHANGE, delta, Emitter.sources.USER]);
        callback();
      }, 1000);
    });
  });
});
