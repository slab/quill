import Delta from 'rich-text/lib/delta';
import { Range } from '../../../core/selection';
import Quill from '../../../core';


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
      expect(this.quill.root).toEqualHTML('<h1>01<em>7</em>8</h1>');
      expect(this.quill.getSelection()).toEqual(new Range(2));
    });

    it('paste delta', function() {
      let jsonString = JSON.stringify(new Delta().insert('|', { bold: true }));
      this.event.clipboardData.types = ['text', 'application/json'];
      spyOn(this.event.clipboardData, 'getData').and.returnValue(jsonString);
      this.quill.clipboard.onPaste(this.event);
      expect(this.quill.root).toEqualHTML('<h1>01<strong>|</strong><em>7</em>8</h1>');
      expect(this.event.clipboardData.getData).toHaveBeenCalledWith('application/json');
      expect(this.quill.getSelection()).toEqual(new Range(3));
    });

    it('paste from external', function(done) {
      this.event.clipboardData.types = ['text'];
      spyOn(this.event.clipboardData, 'getData').and.returnValue('|');
      this.quill.clipboard.container.innerHTML = '<strong>|</strong>';
      this.quill.clipboard.onPaste(this.event);
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML('<h1>01<strong>|</strong><em>7</em>8</h1>');
        expect(this.quill.getSelection()).toEqual(new Range(3));
        done();
      }, 2);
    });
  });

  describe('convert', function() {
    beforeEach(function() {
      let quill = this.initialize(Quill, '');
      this.clipboard = quill.clipboard;
    });

    it('plain text', function() {
      let delta = this.clipboard.convert('simple plain text');
      expect(delta).toEqual(new Delta().insert('simple plain text'));
    });

    it('whitespace', function() {
      let html =
        '<div> 0 </div> <div> <div> 1 2 <span> 3 </span> 4 </div> </div>' +
        '<div><span>5 </span><span>6 </span><span> 7</span><span> 8</span></div>';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert('0\n1 2  3  4\n5 6  7 8'));
    });

    it('inline whitespace', function() {
      let html = '<p>0 <strong>1</strong> 2</p>';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert('0 ').insert('1', { bold: true }).insert(' 2'));
    });

    it('intentional whitespace', function() {
      let html = '0&nbsp;<strong>1</strong>&nbsp;2';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert('0\u00a0').insert('1', { bold: true }).insert('\u00a02'));
    });

    it('consecutive intentional whitespace', function() {
      let html = '<strong>&nbsp;&nbsp;1&nbsp;&nbsp;</strong>';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert('\u00a0\u00a01\u00a0\u00a0', { bold: true }));
    });

    it('alias', function() {
      let delta = this.clipboard.convert('<b>Bold</b><i>Italic</i>');
      expect(delta).toEqual(new Delta().insert('Bold', { bold: true }).insert('Italic', { italic: true }));
    });

    it('pre', function() {
      let html = '<div style="white-space: pre;"> 01 \n 23 </div>';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert(' 01 \n 23 '));
    });

    it('nested list', function() {
      let delta = this.clipboard.convert('<ol><li>One</li><li class="ql-indent-1">Alpha</li></ol>');
      expect(delta).toEqual(new Delta().insert('One\n', { list: 'ordered' })
                                       .insert('Alpha\n', { list: 'ordered', indent: 1 }));
    });

    it('embeds', function() {
      let delta = this.clipboard.convert('<div>01<img src="/assets/favicon.png">34</div>');
      expect(delta).toEqual(new Delta().insert('01').insert({ image: '/assets/favicon.png' }).insert('34'));
    });

    it('custom matcher', function() {
      this.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
        let index = 0;
        let regex = /https?:\/\/[^\s]+/g;
        let match = null;
        let composer = new Delta();
        while ((match = regex.exec(node.data)) !== null) {
          composer.retain(match.index - index);
          index = regex.lastIndex;
          composer.retain(match[0].length, { link: match[0] });
        }
        return delta.compose(composer);
      });
      let delta = this.clipboard.convert('http://github.com https://quilljs.com');
      let expected = new Delta().insert('http://github.com', { link: 'http://github.com' })
                                .insert(' ')
                                .insert('https://quilljs.com', { link: 'https://quilljs.com' });
      expect(delta).toEqual(expected);
    });
  });
});
