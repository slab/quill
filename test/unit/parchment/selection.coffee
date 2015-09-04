Editor = require('../../../src/editor')
Selection = require('../../../src/selection')


describe('Selection', ->
  describe('focus()', ->
    beforeEach( ->
      @container.innerHTML = '\
        <textarea>Test</textarea>\
        <div>\
          <p>0123</p>\
        </div>'
      @selection = new Selection(new Editor(@container.lastChild))
      @textarea = @container.querySelector('textarea')
      @textarea.focus()
      @textarea.select()
    )

    it('initial focus', ->
      expect(@selection.checkFocus()).toBe(false)
      @selection.focus()
      expect(@selection.checkFocus()).toBe(true)
    )

    it('restore last range', ->
      range = new Selection.Range(1, 3)
      @selection.setRange(range)
      @textarea.focus()
      @textarea.select()
      expect(@selection.checkFocus()).toBe(false)
      @selection.focus()
      expect(@selection.checkFocus()).toBe(true)
      expect(@selection.getRange()).toEqual(range)
    )
  )

  describe('getRange()', ->
    it('empty document', ->
      @container.innerHTML = ''
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(@container.querySelector('br'), 0)
      range = selection.getRange()
      expect(range.start).toEqual(0)
      expect(range.end).toEqual(0)
    )

    it('empty line', ->
      @container.innerHTML = '\
        <p>0</p>\
        <p><br></p>\
        <p>3</p>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(@container.querySelector('br'), 0)
      range = selection.getRange()
      expect(range.start).toEqual(2)
      expect(range.end).toEqual(2)
    )

    it('text node', ->
      @container.innerHTML = '<p>0123</p>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(@container.firstChild.firstChild, 1)
      range = selection.getRange()
      expect(range.start).toEqual(1)
      expect(range.end).toEqual(1)
    )

    it('line boundaries', ->
      @container.innerHTML = '\
        <p><br></p>\
        <p>12</p>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(@container.firstChild, 0, @container.lastChild.lastChild, 2)
      range = selection.getRange()
      expect(range.start).toEqual(0)
      expect(range.end).toEqual(3)
    )

    it('nested text node', ->
      @container.innerHTML = '\
        <p><em><strong>01</strong></em></p>\
        <ul>\
          <li><em><u>34</u></em></li>\
        </ul>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(
        @container.querySelector('strong').firstChild, 1,
        @container.querySelector('u').firstChild, 1
      )
      range = selection.getRange()
      expect(range.start).toEqual(1)
      expect(range.end).toEqual(4)
    )

    it('between embed', ->
      @container.innerHTML = '\
        <p>\
          <img src="/favicon.png">\
          <img src="/favicon.png">\
        </p>\
        <ul>\
          <li>\
            <img src="/favicon.png">\
            <img src="/favicon.png">\
          </li>\
        </ul>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(
        @container.firstChild, 1,
        @container.lastChild.lastChild, 1
      )
      range = selection.getRange()
      expect(range.start).toEqual(1)
      expect(range.end).toEqual(4)
    )

    it('between inlines', ->
      @container.innerHTML = '<p><em>01</em><s>23</s><u>45</u></p>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(@container.firstChild, 1, @container.firstChild, 2)
      range = selection.getRange()
      expect(range.start).toEqual(2)
      expect(range.end).toEqual(4)
    )

    it('between blocks', ->
      @container.innerHTML = '\
        <p>01</p>\
        <p><br></p>\
        <ul>\
          <li>45</li>\
          <li>78</li>\
        </ul>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(@container, 1, @container.lastChild, 1)
      range = selection.getRange()
      expect(range.start).toEqual(3)
      expect(range.end).toEqual(7)
    )

    it('no focus', ->
      @container.innerHTML = ''
      selection = new Selection(new Editor(@container))
      range = selection.getRange()
      expect(range).toEqual(null)
    )

    it('wrong input', ->
      @container.innerHTML = '\
        <textarea>Test</textarea>\
        <div>\
          <p>0123</p>\
        </div>'
      selection = new Selection(new Editor(@container.lastChild))
      @container.firstChild.select()
      range = selection.getRange()
      expect(range).toEqual(null)
    )
  )

  describe('setRange()', ->
    it('empty document', ->
      @container.innerHTML = ''
      expected = new Selection.Range(0)
      selection = new Selection(new Editor(@container))
      selection.setRange(expected)
      range = selection.getRange()
      expect(range).toEqual(expected)
      expect(selection.checkFocus()).toBe(true)
    )

    it('empty lines', ->
      @container.innerHTML = '\
        <p><br></p>\
        <ul>\
          <li><br></li>\
        </ul>'
      selection = new Selection(new Editor(@container))
      expected = new Selection.Range(0, 1)
      selection.setRange(expected)
      range = selection.getRange()
      expect(range).toEqual(range)
      expect(selection.checkFocus()).toBe(true)
    )

    it('nested text node', ->
      @container.innerHTML = '\
        <p><em><strong>01</strong></em></p>\
        <ul>\
          <li><em><u>34</u></em></li>\
        </ul>'
      selection = new Selection(new Editor(@container))
      expected = new Selection.Range(1, 4)
      selection.setRange(expected)
      range = selection.getRange()
      expect(range).toEqual(expected)
      expect(selection.checkFocus()).toBe(true)
    )

    it('between inlines', ->
      @container.innerHTML = '<p><em>01</em><s>23</s><u>45</u></p>'
      selection = new Selection(new Editor(@container))
      expected = new Selection.Range(2, 4)
      selection.setRange(expected)
      range = selection.getRange()
      expect(range).toEqual(expected)
      expect(selection.checkFocus()).toBe(true)
    )

    it('between embeds', ->
      @container.innerHTML = '\
        <p>\
          <img src="/favicon.png">\
          <img src="/favicon.png">\
        </p>\
        <ul>\
          <li>\
            <img src="/favicon.png">\
            <img src="/favicon.png">\
          </li>\
        </ul>'
      expected = new Selection.Range(1, 4)
      selection = new Selection(new Editor(@container))
      selection.setRange(expected)
      range = selection.getRange()
      expect(range).toEqual(expected)
      expect(selection.checkFocus()).toBe(true)
    )

    it('null', ->
      @container.innerHTML = '<p>0123</p>'
      selection = new Selection(new Editor(@container))
      selection.setRange(new Selection.Range(1))
      range = selection.getRange()
      expect(range).not.toEqual(null)
      selection.setRange(null)
      range = selection.getRange()
      expect(range).toEqual(null)
      expect(selection.checkFocus()).toBe(false)
    )
  )

  describe('getBounds()', ->
    beforeEach( ->
      $(@container).addClass('ql-editor')
      $(@container).css(
        fontFamily: 'monospace'
        position: 'relative'
      )
      @container.innerHTML = '<div></div><div>&nbsp;</div>'
      @div = @container.firstChild
      $(@div).css('border', '1px solid #777')
      @float = @container.lastChild
      $(@float).css(
        backgroundColor: 'red'
        position: 'absolute'
        width: '1px'
      )
      return if @reference?
      @div.innerHTML = '<p><span>0</span></p>'
      @reference =
        height: @div.firstChild.firstChild.offsetHeight
        width: @div.firstChild.firstChild.offsetWidth
      @div.innerHTML = ''
    )

    afterEach( ->
      @float.style.left = @bounds.left + 'px'
      @float.style.top = @bounds.top + 'px'
      @float.style.height = @bounds.height + 'px'
    )

    it('empty document', ->
      @div.innerHTML = '<p><br></p>'
      selection = new Selection(new Editor(@div))
      @bounds = selection.getBounds(0)
      expect(@bounds.height).toBeApproximately(@reference.height, 1)
      expect(@bounds.left).toBeApproximately(0, 1)
      expect(@bounds.top).toBeApproximately(0, 1)
    )

    it('empty line', ->
      @div.innerHTML = '\
        <p>0000</p>\
        <p><br></p>\
        <p>0000</p>'
      selection = new Selection(new Editor(@div))
      @bounds = selection.getBounds(5)
      expect(@bounds.height).toBeApproximately(@reference.height, 1)
      expect(@bounds.left).toBeApproximately(0, 1)
      expect(@bounds.top).toBeApproximately(@reference.height, 2)
    )

    it('plain text', ->
      @div.innerHTML = '<p>0123</p>'
      selection = new Selection(new Editor(@div))
      @bounds = selection.getBounds(2)
      expect(@bounds.height).toBeApproximately(@reference.height, 1)
      expect(@bounds.left).toBeApproximately(@reference.width*2, 1)
      expect(@bounds.top).toBeApproximately(0, 1)
    )

    it('start of line', ->
      @div.innerHTML = '\
        <p>0000</p>\
        <p>0000</p>'
      selection = new Selection(new Editor(@div))
      @bounds = selection.getBounds(5)
      expect(@bounds.height).toBeApproximately(@reference.height, 1)
      expect(@bounds.left).toBeApproximately(0, 1)
      expect(@bounds.top).toBeApproximately(@reference.height, 2)
    )

    it('end of line', ->
      @div.innerHTML = '\
        <p>0000</p>\
        <p>0000</p>\
        <p>0000</p>'
      selection = new Selection(new Editor(@div))
      @bounds = selection.getBounds(9)
      expect(@bounds.height).toBeApproximately(@reference.height, 1)
      expect(@bounds.left).toBeApproximately(@reference.width*4, 1)
      expect(@bounds.top).toBeApproximately(@reference.height, 2)
    )

    it('large text', ->
      @div.innerHTML = '<p><span style="font-size: 32px;">0000</span></p>'
      selection = new Selection(new Editor(@div))
      @bounds = selection.getBounds(2)
      expect(@bounds.height).toBeApproximately(@div.querySelector('span').offsetHeight, 1)
      expect(@bounds.left).toBeApproximately(@div.querySelector('span').offsetWidth/2, 1)
      expect(@bounds.top).toBeApproximately(0, 1)
    )

    it('image', ->
      @div.innerHTML = '\
        <p>\
          <img src="/favicon.png" width="32px" height="32px">\
          <img src="/favicon.png" width="32px" height="32px">\
        </p>'
      selection = new Selection(new Editor(@div))
      @bounds = selection.getBounds(1)
      expect(@bounds.height).toBeApproximately(32, 1)
      expect(@bounds.left).toBeApproximately(32, 1)
      expect(@bounds.top).toBeApproximately(0, 1)
    )
  )

  describe('prepare()', ->
    it('delta', ->

    )

    it('split nodes', ->

    )

    it('empty line', ->

    )

    it('split nodes', ->

    )

    it('multiple', ->

    )

    it('false', ->

    )

    it('preserve on enter', ->

    )

    it('remove on blur', ->

    )

    it('remove on backspace', ->

    )
  )
)

describe('Range', ->
  describe('shift()', ->
    it('before', ->
      range = new Selection.Range(10, 20)
      range.shift(5, 5)
      expect(range.start).toEqual(10 + 5)
      expect(range.end).toEqual(20 + 5)
    )

    it('between', ->
      range = new Selection.Range(10, 20)
      range.shift(15, 2)
      expect(range.start).toEqual(10)
      expect(range.end).toEqual(20 + 2)
    )

    it('after', ->
      range = new Selection.Range(10, 20)
      range.shift(25, 5)
      expect(range.start).toEqual(10)
      expect(range.end).toEqual(20)
    )

    it('on cursor', ->
      range = new Selection.Range(10, 10)
      range.shift(10, 5)
      expect(range.start).toEqual(10 + 5)
      expect(range.end).toEqual(10 + 5)
    )

    it('on start', ->
      range = new Selection.Range(10, 20)
      range.shift(10, 5)
      expect(range.start).toEqual(10 + 5)
      expect(range.end).toEqual(20 + 5)
    )

    it('on end', ->
      range = new Selection.Range(10, 20)
      range.shift(20, 5)
      expect(range.start).toEqual(10)
      expect(range.end).toEqual(20 + 5)
    )

    it('between remove', ->
      range = new Selection.Range(10, 20)
      range.shift(15, -2)
      expect(range.start).toEqual(10)
      expect(range.end).toEqual(20 - 2)
    )

    it('before remove beyond start', ->
      range = new Selection.Range(10, 20)
      range.shift(5, -10)
      expect(range.start).toEqual(5)
      expect(range.end).toEqual(20 - 10)
    )

    it('after remove', ->
      range = new Selection.Range(10, 20)
      range.shift(25, -20)
      expect(range.start).toEqual(10)
      expect(range.end).toEqual(20)
    )

    it('remove on cursor', ->
      range = new Selection.Range(10, 10)
      range.shift(10, -5)
      expect(range.start).toEqual(10)
      expect(range.end).toEqual(10)
    )

    it('after remove beyond start', ->
      range = new Selection.Range(10, 10)
      range.shift(5, -50)
      expect(range.start).toEqual(5)
      expect(range.end).toEqual(5)
    )
  )
)
