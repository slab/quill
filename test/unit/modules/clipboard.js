import Delta from 'rich-text/lib/delta';
import { Range } from 'quill/selection';
import Quill from 'quill/quill';


describe('Clipboard', function() {
  describe('events', function() {
    beforeEach(function() {
      this.event = {
        clipboardData: {
          getData: function() {},
          setData: function() {}
        },
        preventDefault: function() {}
      };
      this.quill = this.initialize(Quill, '<h1>0123</h1><p>5<em>67</em>8</p>');
      this.quill.setSelection(2, 5);
    });

    it('copy', function() {
      spyOn(this.event.clipboardData, 'setData');
      this.quill.clipboard.onCopy(this.event);
      let jsonString = JSON.stringify(this.quill.getContents(2, 5));
      let text = this.quill.getText(2, 5);
      expect(this.event.clipboardData.setData).toHaveBeenCalledWith('application/json', jsonString);
      expect(this.event.clipboardData.setData).toHaveBeenCalledWith('text', text);
    });

    it('cut', function() {
      spyOn(this.event.clipboardData, 'setData');
      let text = this.quill.getText(2, 5);
      this.quill.clipboard.onCut(this.event);
      expect(this.event.clipboardData.setData).toHaveBeenCalledWith('text', text);
      expect(this.quill.root).toEqualHTML('<h1 id="0178">01<em>7</em>8</h1>');
      expect(this.quill.getSelection()).toEqual(new Range(2));
    });

    it('paste delta', function() {
      let jsonString = JSON.stringify(new Delta().insert('|', { bold: true }));
      this.event.clipboardData.types = ['text', 'application/json'];
      spyOn(this.event.clipboardData, 'getData').and.returnValue(jsonString);
      this.quill.clipboard.onPaste(this.event);
      expect(this.quill.root).toEqualHTML('<h1 id="01-78">01<strong>|</strong><em>7</em>8</h1>');
      expect(this.event.clipboardData.getData).toHaveBeenCalledWith('application/json');
      expect(this.quill.getSelection()).toEqual(new Range(3));
    });

    it('paste from external', function(done) {
      this.event.clipboardData.types = ['text'];
      spyOn(this.event.clipboardData, 'getData').and.returnValue('|');
      this.quill.clipboard.container.innerHTML = '<strong>|</strong>';
      this.quill.clipboard.onPaste(this.event);
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML('<h1 id="01-78">01<strong>|</strong><em>7</em>8</h1>');
        expect(this.quill.getSelection()).toEqual(new Range(3));
        done();
      }, 2);
    });
  });
});
