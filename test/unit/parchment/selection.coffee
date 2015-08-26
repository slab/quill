Editor = require('../../../src/editor')
Selection = require('../../../src/selection')


describe('Selection', ->
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

    it('end of line', ->
      @container.innerHTML = '\
        <p><br></p>\
        <p>12</p>'
      selection = new Selection(new Editor(@container))
      selection.setNativeRange(@container.firstChild, 1, @container.lastChild, 1)
      range = selection.getRange()
      expect(range.start).toEqual(1)
      expect(range.end).toEqual(4)
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
          <img src="http://quilljs.com/images/cloud.png">\
          <img src="http://quilljs.com/images/cloud.png">\
        </p>\
        <ul>\
          <li>\
            <img src="http://quilljs.com/images/cloud.png">\
            <img src="http://quilljs.com/images/cloud.png">\
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
          <img src="http://quilljs.com/images/cloud.png">\
          <img src="http://quilljs.com/images/cloud.png">\
        </p>\
        <ul>\
          <li>\
            <img src="http://quilljs.com/images/cloud.png">\
            <img src="http://quilljs.com/images/cloud.png">\
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
      expect(selection.checkFocus()).not.toBe(true)
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
