(function() {
  describe('Keyboard', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').get(0);
    });
    describe('toggleFormat()', function() {
      beforeEach(function() {
        this.container.innerHTML = '<div> <p><s>01</s><b>23</b>45</p> </div>';
        this.quill = new Quill(this.container.firstChild);
        return this.keyboard = this.quill.getModule('keyboard');
      });
      it('set if all unset', function() {
        this.keyboard.toggleFormat(new Quill.Lib.Range(3, 6), 'strike');
        return expect(this.quill.root.firstChild).toEqualHTML('<s>01</s><b>2<s>3</s></b><s>45</s>');
      });
      it('unset if all set', function() {
        this.keyboard.toggleFormat(new Quill.Lib.Range(2, 4), 'bold');
        return expect(this.quill.root.firstChild).toEqualHTML('<s>01</s>2345');
      });
      return it('set if partially set', function() {
        this.keyboard.toggleFormat(new Quill.Lib.Range(3, 5), 'bold');
        return expect(this.quill.root.firstChild).toEqualHTML('<s>01</s><b>234</b>5');
      });
    });
    return describe('hotkeys', function() {
      beforeEach(function() {
        this.container.innerHTML = '<div><p>0123</p></div>';
        this.quill = new Quill(this.container.firstChild);
        return this.keyboard = this.quill.getModule('keyboard');
      });
      it('trigger', function(done) {
        var hotkey;
        hotkey = {
          key: 'B',
          metaKey: true
        };
        this.keyboard.addHotkey(hotkey, function(range) {
          expect(range.start).toEqual(1);
          expect(range.end).toEqual(2);
          return done();
        });
        this.quill.setSelection(1, 2);
        return Quill.DOM.triggerEvent(this.quill.root, 'keydown', hotkey);
      });
      it('format', function() {
        this.quill.setSelection(0, 4);
        Quill.DOM.triggerEvent(this.quill.root, 'keydown', Quill.Module.Keyboard.hotkeys.BOLD);
        return expect(this.quill.root).toEqualHTML('<p><b>0123</b></p>', true);
      });
      it('tab', function() {
        this.quill.setSelection(1, 3);
        Quill.DOM.triggerEvent(this.quill.root, 'keydown', Quill.Module.Keyboard.hotkeys.INDENT);
        return expect(this.quill.root).toEqualHTML('<p>0\t3</p>', true);
      });
      return it('shift + tab', function() {
        this.quill.setSelection(0, 2);
        Quill.DOM.triggerEvent(this.quill.root, 'keydown', Quill.Module.Keyboard.hotkeys.OUTDENT);
        return expect(this.quill.root).toEqualHTML('<p>0123</p>', true);
      });
    });
  });

}).call(this);
