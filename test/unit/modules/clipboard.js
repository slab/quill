import Delta from 'quill-delta';
import { Range } from '../../../core/selection';
import Quill from '../../../core';


describe('Clipboard', function() {
  describe('events', function() {
    beforeEach(function() {
      this.quill = this.initialize(Quill, '<h1>0123</h1><p>5<em>67</em>8</p>');
      this.quill.setSelection(2, 5);
    });

    it('paste', function(done) {
      this.quill.clipboard.container.innerHTML = '<strong>|</strong>';
      this.quill.clipboard.onPaste({});
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML('<p>01<strong>|</strong><em>7</em>8</p>');
        expect(this.quill.getSelection()).toEqual(new Range(3));
        done();
      }, 2);
    });

    it('selection-change', function(done) {
      let handler = {
        change: function() {}
      };
      spyOn(handler, 'change');
      this.quill.on('selection-change', handler.change);
      this.quill.clipboard.container.innerHTML = '0';
      this.quill.clipboard.onPaste({});
      setTimeout(function() {
        expect(handler.change).not.toHaveBeenCalled();
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
        '<div> 0 </div><div> <div> 1 2 <span> 3 </span> 4 </div> </div>' +
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
      let html = '<span>0&nbsp;<strong>1</strong>&nbsp;2</span>';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert('0\u00a0').insert('1', { bold: true }).insert('\u00a02'));
    });

    it('consecutive intentional whitespace', function() {
      let html = '<strong>&nbsp;&nbsp;1&nbsp;&nbsp;</strong>';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert('\u00a0\u00a01\u00a0\u00a0', { bold: true }));
    });

    it('break', function() {
      let html = '<div>0<br>1</div><div>2<br></div><div>3</div><div><br>4</div><div><br></div><div>5</div>';
      let delta = this.clipboard.convert(html);
      expect(delta).toEqual(new Delta().insert('0\n1\n2\n3\n\n4\n\n5'));
    });

    it('mixed inline and block', function() {
      let delta = this.clipboard.convert('<div>One<div>Two</div></div>');
      expect(delta).toEqual(new Delta().insert('One\nTwo'));
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

    it('html nested list', function() {
      let delta = this.clipboard.convert('<ol><li>One<ol><li>Alpha</li><li>Beta</li></ol></li></ol>');
      expect(delta).toEqual(new Delta().insert('One\nAlpha', { list: 'ordered' })
                                       .insert('\n', { list: 'ordered', indent: 1 })
                                       .insert('Beta', { list: 'ordered' })
                                       .insert('\n', { list: 'ordered', indent: 1 }));
    });

    it('embeds', function() {
      let delta = this.clipboard.convert('<div>01<img src="/assets/favicon.png" height="200" width="300">34</div>');
      let expected = new Delta()
        .insert('01')
        .insert({ image: '/assets/favicon.png' }, { height: '200', width: '300' })
        .insert('34');
      expect(delta).toEqual(expected);
    });

    it('block embed', function() {
      let delta = this.clipboard.convert('<p>01</p><iframe src="#"></iframe><p>34</p>');
      expect(delta).toEqual(new Delta().insert('01\n').insert({ video: '#' }).insert('34'));
    });

    it('attributor and style match', function() {
      let delta = this.clipboard.convert('<p style="direction:rtl;">Test</p>');
      expect(delta).toEqual(new Delta().insert('Test\n', { direction: 'rtl' }));
    });

    it('nested styles', function() {
      let delta = this.clipboard.convert('<span style="color: red;"><span style="color: blue;">Test</span></span>');
      expect(delta).toEqual(new Delta().insert('Test', { color: 'blue' }));
    })

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
