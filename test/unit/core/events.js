import Delta from 'rich-text/lib/delta';
import Editor from '../../../core/editor';
import Emitter from '../../../core/emitter';


describe('Events', function() {
  describe('Editor', function() {
    beforeEach(function() {
      this.editor = this.initialize(Editor, '<p>0123</p>');
      spyOn(this.editor.emitter, 'emit').and.callThrough();
    });

    it('api text insert', function() {
      let old = this.editor.getDelta();
      this.editor.insertText(2, '!');
      let delta = new Delta().retain(2).insert('!');
      expect(this.editor.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, old, Emitter.sources.API);
    });

    it('user text insert', function(callback) {
      this.container.firstChild.firstChild.data = '01!23';
      this.editor.emitter.on(Emitter.events.TEXT_CHANGE, function(delta, old, source) {
        expect(delta).toEqual(new Delta().retain(2).insert('!'));
        expect(old).toEqual(new Delta().insert('0123\n'));
        expect(source).toEqual(Emitter.sources.USER);
        callback();
      });
    });
  });
});
