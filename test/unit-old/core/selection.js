import CursorBlot from '../../../blots/cursor';
import Delta from 'rich-text/lib/delta';
import Selection, { Range, findLeaf } from '../../../core/selection';
import Scroll from '../../../blots/scroll';


describe('Selection', function() {
  beforeEach(function() {
    this.setup = (html, index) => {
      this.selection = this.initialize(Selection, html);
      this.selection.setRange(new Range(index));
    };
  });

  xdescribe('getBounds()', function() {
    beforeEach(function() {
      this.container.classList.add('ql-editor');
      this.container.style.fontFamily = 'monospace';
      this.container.style.position = 'relative';
      this.initialize(HTMLElement, '<div></div><div>&nbsp;</div>');
      this.div = this.container.firstChild;
      this.div.style.border = '1px solid #777';
      this.float = this.container.lastChild;
      this.float.style.backgroundColor = 'red';
      this.float.style.position = 'absolute';
      this.float.style.width = '1px';
      if (this.reference != null) return;
      this.initialize(HTMLElement, '<p><span>0</span></p>', this.div);
      let text = this.div.firstChild.firstChild;
      this.reference = {
        height: text.offsetHeight,
        left: text.offsetLeft,
        lineHeight: text.parentNode.offsetHeight,
        width: text.offsetWidth,
        top: text.offsetTop,
      };
      this.initialize(HTMLElement, '', this.div);
    });

    afterEach(function() {
      this.float.style.left = this.bounds.left + 'px';
      this.float.style.top = this.bounds.top + 'px';
      this.float.style.height = this.bounds.height + 'px';
    });

    it('empty document', function() {
      let selection = this.initialize(Selection, '<p><br></p>', this.div);
      this.bounds = selection.getBounds(0);
      expect(this.bounds.left).toBeApproximately(this.reference.left, 1);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });

    it('empty line', function() {
      let selection = this.initialize(Selection, `
        <p>0000</p>
        <p><br></p>
        <p>0000</p>`
      , this.div);
      this.bounds = selection.getBounds(5);
      expect(this.bounds.left).toBeApproximately(this.reference.left, 1);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.lineHeight, 1);
    });

    it('plain text', function() {
      let selection = this.initialize(Selection, '<p>0123</p>', this.div);
      this.bounds = selection.getBounds(2);
      expect(this.bounds.left).toBeApproximately(this.reference.left + this.reference.width * 2, 2);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });

    it('start of line', function() {
      let selection = this.initialize(Selection, `
        <p>0000</p>
        <p>0000</p>`
      , this.div);
      this.bounds = selection.getBounds(5);
      expect(this.bounds.left).toBeApproximately(this.reference.left, 1);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.lineHeight, 1);
    });

    it('end of line', function() {
      let selection = this.initialize(Selection, `
        <p>0000</p>
        <p>0000</p>
        <p>0000</p>`
      , this.div);
      this.bounds = selection.getBounds(9);
      expect(this.bounds.left).toBeApproximately(this.reference.left + this.reference.width * 4, 4);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.lineHeight, 1);
    });

    it('large text', function() {
      let selection = this.initialize(Selection, '<p><span class="ql-size-large">0000</span></p>', this.div);
      this.bounds = selection.getBounds(2);
      expect(this.bounds.left).toBeApproximately(this.reference.left + this.div.querySelector('span').offsetWidth / 2, 1);
      expect(this.bounds.height).toBeApproximately(this.div.querySelector('span').offsetHeight, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });

    it('image', function() {
      let selection = this.initialize(Selection, `
        <p>
          <img src="/assets/favicon.png" width="32px" height="32px">
          <img src="/assets/favicon.png" width="32px" height="32px">
        </p>`
      , this.div);
      this.bounds = selection.getBounds(1);
      expect(this.bounds.left).toBeApproximately(this.reference.left + 32, 1);
      expect(this.bounds.height).toBeApproximately(32, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });
  });
});
