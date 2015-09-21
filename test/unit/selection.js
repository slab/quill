import Editor from '../../src/editor';
import Selection from '../../src/selection';


describe('Selection', function() {
  describe('focus()', function() {
    beforeEach(function() {
      this.setContainer('<textarea>Test</textarea><div><p>0123</p></div>');
      this.selection = new Selection(new Editor(this.container.lastChild));
      this.textarea = this.container.querySelector('textarea');
      this.textarea.focus();
      this.textarea.select();
    });

    it('initial focus', function() {
      expect(this.selection.checkFocus()).toBe(false);
      this.selection.focus();
      expect(this.selection.checkFocus()).toBe(true);
    });

    it('restore last range', function() {
      let range = new Selection.Range(1, 3);
      this.selection.setRange(range);
      this.textarea.focus();
      this.textarea.select();
      expect(this.selection.checkFocus()).toBe(false);
      this.selection.focus();
      expect(this.selection.checkFocus()).toBe(true);
      expect(this.selection.getRange()).toEqual(range);
    });
  });

  describe('getRange()', function() {
    it('empty document', function() {
      this.setContainer('');
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(this.container.querySelector('br'), 0);
      let range = selection.getRange();
      expect(range.start).toEqual(0);
      expect(range.end).toEqual(0);
    });

    it('empty line', function() {
      this.setContainer('<p>0</p><p><br></p><p>3</p>');
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(this.container.querySelector('br'), 0);
      let range = selection.getRange();
      expect(range.start).toEqual(2);
      expect(range.end).toEqual(2);
    });

    it('text node', function() {
      this.setContainer('<p>0123</p>');
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(this.container.firstChild.firstChild, 1);
      let range = selection.getRange();
      expect(range.start).toEqual(1);
      expect(range.end).toEqual(1);
    });

    it('line boundaries', function() {
      this.setContainer('<p><br></p><p>12</p>');
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(this.container.firstChild, 0, this.container.lastChild.lastChild, 2);
      let range = selection.getRange();
      expect(range.start).toEqual(0);
      expect(range.end).toEqual(3);
    });

    it('nested text node', function() {
      this.setContainer(`
        <p><em><strong>01</strong></em></p>
        <ul>
          <li><em><u>34</u></em></li>
        </ul>`
      );
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(
        this.container.querySelector('strong').firstChild, 1,
        this.container.querySelector('u').firstChild, 1
      );
      let range = selection.getRange();
      expect(range.start).toEqual(1);
      expect(range.end).toEqual(4);
    });

    it('between embed', function() {
      this.setContainer(`
        <p>
          <img src="/favicon.png">
          <img src="/favicon.png">
        </p>
        <ul>
          <li>
            <img src="/favicon.png">
            <img src="/favicon.png">
          </li>
        </ul>`
      );
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(this.container.firstChild, 1, this.container.lastChild.lastChild, 1);
      let range = selection.getRange();
      expect(range.start).toEqual(1);
      expect(range.end).toEqual(4);
    });

    it('between inlines', function() {
      this.setContainer('<p><em>01</em><s>23</s><u>45</u></p>');
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(this.container.firstChild, 1, this.container.firstChild, 2);
      let range = selection.getRange();
      expect(range.start).toEqual(2);
      expect(range.end).toEqual(4);
    });

    it('between blocks', function() {
      this.setContainer(`
        <p>01</p>
        <p><br></p>
        <ul>
          <li>45</li>
          <li>78</li>
        </ul>`
      );
      let selection = new Selection(new Editor(this.container));
      selection.setNativeRange(this.container, 1, this.container.lastChild, 1);
      let range = selection.getRange();
      expect(range.start).toEqual(3);
      expect(range.end).toEqual(7);
    });

    it('no focus', function() {
      this.setContainer('');
      let selection = new Selection(new Editor(this.container));
      let range = selection.getRange();
      expect(range).toEqual(null);
    });

    it('wrong input', function() {
      this.setContainer(`
        <textarea>Test</textarea>
        <div>
          <p>0123</p>
        </div>`
      );
      let selection = new Selection(new Editor(this.container.lastChild));
      this.container.firstChild.select();
      let range = selection.getRange();
      expect(range).toEqual(null);
    });
  });

  describe('setRange()', function() {
    it('empty document', function() {
      this.setContainer('');
      let expected = new Selection.Range(0);
      let selection = new Selection(new Editor(this.container));
      selection.setRange(expected);
      let range = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.checkFocus()).toBe(true);
    });

    it('empty lines', function() {
      this.setContainer(`
        <p><br></p>
        <ul>
          <li><br></li>
        </ul>`
      );
      let selection = new Selection(new Editor(this.container));
      let expected = new Selection.Range(0, 1);
      selection.setRange(expected);
      let range = selection.getRange();
      expect(range).toEqual(range);
      expect(selection.checkFocus()).toBe(true);
    });

    it('nested text node', function() {
      this.setContainer(`
        <p><em><strong>01</strong></em></p>
        <ul>
          <li><em><u>34</u></em></li>
        </ul>`
      );
      let selection = new Selection(new Editor(this.container));
      let expected = new Selection.Range(1, 4);
      selection.setRange(expected);
      let range = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.checkFocus()).toBe(true);
    });

    it('between inlines', function() {
      this.setContainer('<p><em>01</em><s>23</s><u>45</u></p>');
      let selection = new Selection(new Editor(this.container));
      let expected = new Selection.Range(2, 4);
      selection.setRange(expected);
      let range = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.checkFocus()).toBe(true);
    });

    it('between embeds', function() {
      this.setContainer(`
        <p>
          <img src="/favicon.png">
          <img src="/favicon.png">
        </p>
        <ul>
          <li>
            <img src="/favicon.png">
            <img src="/favicon.png">
          </li>
        </ul>`
      );
      let expected = new Selection.Range(1, 4);
      let selection = new Selection(new Editor(this.container));
      selection.setRange(expected);
      let range = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.checkFocus()).toBe(true);
    });

    return it('null', function() {
      this.setContainer('<p>0123</p>');
      let selection = new Selection(new Editor(this.container));
      selection.setRange(new Selection.Range(1));
      let range = selection.getRange();
      expect(range).not.toEqual(null);
      selection.setRange(null);
      range = selection.getRange();
      expect(range).toEqual(null);
      expect(selection.checkFocus()).toBe(false);
    });
  });

  describe('getBounds()', function() {
    beforeEach(function() {
      $(this.container).addClass('ql-editor');
      $(this.container).css({
        fontFamily: 'monospace',
        position: 'relative'
      });
      this.setContainer('<div></div><div>&nbsp;</div>');
      this.div = this.container.firstChild;
      $(this.div).css('border', '1px solid #777');
      this.float = this.container.lastChild;
      $(this.float).css({
        backgroundColor: 'red',
        position: 'absolute',
        width: '1px'
      });
      if (this.reference != null) return;
      this.setContainer('<p><span>0</span></p>', this.div);
      this.reference = {
        height: this.div.firstChild.firstChild.offsetHeight,
        width: this.div.firstChild.firstChild.offsetWidth,
        top: this.div.firstChild.firstChild.offsetTop
      };
      this.setContainer('', this.div);
    });

    afterEach(function() {
      this.float.style.left = this.bounds.left + 'px';
      this.float.style.top = this.bounds.top + 'px';
      this.float.style.height = this.bounds.height + 'px';
    });

    it('empty document', function() {
      this.setContainer('<p><br></p>', this.div);
      let selection = new Selection(new Editor(this.div));
      this.bounds = selection.getBounds(0);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.left).toBeApproximately(0, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });

    it('empty line', function() {
      this.setContainer(`
        <p>0000</p>
        <p><br></p>
        <p>0000</p>`
      , this.div);
      let selection = new Selection(new Editor(this.div));
      this.bounds = selection.getBounds(5);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.left).toBeApproximately(0, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.height, 1);
    });

    it('plain text', function() {
      this.setContainer('<p>0123</p>', this.div);
      let selection = new Selection(new Editor(this.div));
      this.bounds = selection.getBounds(2);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.left).toBeApproximately(this.reference.width * 2, 2);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });

    it('start of line', function() {
      this.setContainer(`
        <p>0000</p>
        <p>0000</p>`
      , this.div);
      let selection = new Selection(new Editor(this.div));
      this.bounds = selection.getBounds(5);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.left).toBeApproximately(0, 1);
      return expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.height, 1);
    });

    it('end of line', function() {
      this.setContainer(`
        <p>0000</p>
        <p>0000</p>
        <p>0000</p>`
      , this.div);
      let selection = new Selection(new Editor(this.div));
      this.bounds = selection.getBounds(9);
      expect(this.bounds.height).toBeApproximately(this.reference.height, 1);
      expect(this.bounds.left).toBeApproximately(this.reference.width * 4, 4);
      return expect(this.bounds.top).toBeApproximately(this.reference.top + this.reference.height, 1);
    });

    it('large text', function() {
      this.setContainer('<p><span style="font-size: 32px;">0000</span></p>', this.div);
      let selection = new Selection(new Editor(this.div));
      this.bounds = selection.getBounds(2);
      expect(this.bounds.height).toBeApproximately(this.div.querySelector('span').offsetHeight, 1);
      expect(this.bounds.left).toBeApproximately(this.div.querySelector('span').offsetWidth / 2, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });

    return it('image', function() {
      this.setContainer(`
        <p>
          <img src="/favicon.png" width="32px" height="32px">
          <img src="/favicon.png" width="32px" height="32px">
        </p>`
      , this.div);
      let selection = new Selection(new Editor(this.div));
      this.bounds = selection.getBounds(1);
      expect(this.bounds.height).toBeApproximately(32, 1);
      expect(this.bounds.left).toBeApproximately(32, 1);
      expect(this.bounds.top).toBeApproximately(this.reference.top, 1);
    });
  });

  describe('prepare()', function() {
    it('delta', function() {

    });

    it('split nodes', function() {

    });

    it('empty line', function() {

    });

    it('split nodes', function() {

    });

    it('multiple', function() {

    });

    it('false', function() {

    });

    it('preserve on enter', function() {

    });

    it('remove on blur', function() {

    });

    it('remove on backspace', function() {

    });
  });
});

describe('Range', function() {
  describe('shift()', function() {
    it('before', function() {
      let range = new Selection.Range(10, 20);
      range.shift(5, 5);
      expect(range.start).toEqual(10 + 5);
      expect(range.end).toEqual(20 + 5);
    });

    it('between', function() {
      let range = new Selection.Range(10, 20);
      range.shift(15, 2);
      expect(range.start).toEqual(10);
      expect(range.end).toEqual(20 + 2);
    });

    it('after', function() {
      let range = new Selection.Range(10, 20);
      range.shift(25, 5);
      expect(range.start).toEqual(10);
      expect(range.end).toEqual(20);
    });

    it('on cursor', function() {
      let range = new Selection.Range(10, 10);
      range.shift(10, 5);
      expect(range.start).toEqual(10 + 5);
      expect(range.end).toEqual(10 + 5);
    });

    it('on start', function() {
      let range = new Selection.Range(10, 20);
      range.shift(10, 5);
      expect(range.start).toEqual(10 + 5);
      expect(range.end).toEqual(20 + 5);
    });

    it('on end', function() {
      let range = new Selection.Range(10, 20);
      range.shift(20, 5);
      expect(range.start).toEqual(10);
      expect(range.end).toEqual(20 + 5);
    });

    it('between remove', function() {
      let range = new Selection.Range(10, 20);
      range.shift(15, -2);
      expect(range.start).toEqual(10);
      expect(range.end).toEqual(20 - 2);
    });

    it('before remove beyond start', function() {
      let range = new Selection.Range(10, 20);
      range.shift(5, -10);
      expect(range.start).toEqual(5);
      expect(range.end).toEqual(20 - 10);
    });

    it('after remove', function() {
      let range = new Selection.Range(10, 20);
      range.shift(25, -20);
      expect(range.start).toEqual(10);
      expect(range.end).toEqual(20);
    });

    it('remove on cursor', function() {
      let range = new Selection.Range(10, 10);
      range.shift(10, -5);
      expect(range.start).toEqual(10);
      expect(range.end).toEqual(10);
    });

    it('after remove beyond start', function() {
      let range = new Selection.Range(10, 10);
      range.shift(5, -50);
      expect(range.start).toEqual(5);
      expect(range.end).toEqual(5);
    });
  });
});
