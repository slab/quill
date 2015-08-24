fdescribe('Selection', ->
  beforeEach( ->
    @container = jasmine.resetEditor()
  )

  describe('helpers', ->
    beforeEach( ->
      @container.innerHTML = '\
        <div>\
          <p>0123</p>\
          <p><br></p>\
          <p><img src="http://quilljs.com/images/cloud.png"></p>\
          <ul>\
            <li>890</li>\
            <li>234</li>\
          </ul>\
          <p><strong><s>67</s></strong><em>89</em></p>\
        </div>'
      @doc = new Quill.Document(@container.firstChild)
      @selection = new Quill.Selection(@doc, new Quill.Lib.EventEmitter2())
    )

    tests =
      'text node':
        native: ->
          return [@container.querySelector('s').firstChild, 1]
        encoded: ->
          return [@container.querySelector('s').firstChild, 1]
        index: 17
      'between leaves':
        native: ->
          return [@container.querySelector('s').firstChild, 2]
        encoded: ->
          return [@container.querySelector('s').firstChild, 2]
        index: 18
      'break node':
        native: ->
          return [@container.querySelector('br').parentNode, 0]
        encoded: ->
          return [@container.querySelector('br'), 0]
        index: 5
      'before image':
        native: ->
          return [@container.querySelector('img').parentNode, 0]
        encoded: ->
          return [@container.querySelector('img'), 0]
        index: 6
      'after image':
        native: ->
          return [@container.querySelector('img').parentNode, 1]
        encoded: ->
          return [@container.querySelector('img'), 1]
        index: 7
      'bullet':
        native: ->
          return [@container.querySelectorAll('li')[1].firstChild, 1]
        encoded: ->
          return [@container.querySelectorAll('li')[1].firstChild, 1]
        index: 13
      'last node':
        native: ->
          return [@container.querySelector('em').firstChild, 2]
        encoded: ->
          return [@container.querySelector('em').firstChild, 2]
        index: 20

    describe('_decodePosition()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = test.encoded.call(this)
          [resultNode, resultOffset] = @selection._decodePosition(node, offset)
          [expectedNode, expectedOffset] = test.native.call(this)
          expect(resultNode).toEqual(expectedNode)
          expect(resultOffset).toEqual(expectedOffset)
        )
      )
    )

    describe('_encodePosition()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = test.native.call(this)
          [resultNode, resultOffset] = @selection._encodePosition(node, offset)
          [expectedNode, expectedOffset] = test.encoded.call(this)
          expect(resultNode).toEqual(expectedNode)
          expect(resultOffset).toEqual(expectedOffset)
        )
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        quill.root.innerHTML = ''
        quill.editor.doc.build()
        [resultNode, resultIndex] = quill.editor.selection._encodePosition(quill.root, 0)
        expect(resultNode).toEqual(quill.root)
        expect(resultIndex).toEqual(0)
      )

      it('end of document', ->
        [resultNode, resultOffset] = @selection._encodePosition(@doc.domNode, 5)
        expect(resultNode).toEqual(@doc.domNode.querySelector('em').firstChild)
        expect(resultOffset).toEqual(2)
      )
    )

    describe('_positionToIndex()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = test.native.call(this)
          index = @selection._positionToIndex(node, offset)
          expect(index).toEqual(test.index)
        )
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        index = quill.editor.selection._positionToIndex(quill.root, 0)
        expect(index).toEqual(0)
      )
    )

    describe('_indexToPosition()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = @selection._indexToPosition(test.index)
          [expectedNode, expectedOffset] = test.native.call(this)
          expect(node).toEqual(expectedNode)
          expect(offset).toEqual(expectedOffset)
        )
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        quill.root.innerHTML = ''
        quill.editor.doc.build()
        [node, offset] = quill.editor.selection._indexToPosition(0)
        expect(node).toEqual(quill.root)
        expect(offset).toEqual(0)
      )

      it('multiple consecutive images', ->
        @container.innerHTML = '\
          <div>\
            <p><img src="http://quilljs.com/images/cloud.png"><img src="http://quilljs.com/images/cloud.png"></p>\
          </div>'
        quill = new Quill(@container.firstChild)
        [node, offset] = quill.editor.selection._indexToPosition(1)
        expect(node).toEqual(quill.root.firstChild)
        expect(offset).toEqual(1)
      )
    )

    describe('get/set range', ->
      _.each(tests, (test, name) ->
        it(name, ->
          @selection.setRange(new Quill.Lib.Range(test.index, test.index))
          expect(@selection.checkFocus()).toBe(true)
          range = @selection.getRange()
          expect(range).not.toEqual(null)
          expect(range.start).toEqual(test.index)
          expect(range.end).toEqual(test.index)
        )
      )

      it('entire document', ->
        @selection.setRange(new Quill.Lib.Range(0, 20))
        expect(@selection.checkFocus()).toBe(true)
        range = @selection.getRange()
        expect(range).not.toEqual(null)
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(20)
      )

      it('null range', ->
        @selection.setRange(new Quill.Lib.Range(0, 0))
        expect(@selection.checkFocus()).toBe(true)
        @selection.setRange(null)
        expect(@selection.checkFocus()).toBe(false)
        range = @selection.getRange()
        expect(range).toBe(null)
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        quill.editor.selection.setRange(new Quill.Lib.Range(0, 0))
        expect(quill.editor.selection.checkFocus()).toBe(true)
        range = quill.editor.selection.getRange()
        expect(range).not.toEqual(null)
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(0)
      )

      it('empty line', ->
        @container.innerHTML = '<div><p><br></p></div>'
        quill = new Quill(@container.firstChild)
        quill.editor.selection.setRange(new Quill.Lib.Range(0, 0))
        range = quill.editor.selection.getRange()
        expect(range.start).toEqual(0)
      )
    )
  )

  # TODO No more Normalizer
  xdescribe('preserve', ->
    describe('shiftAfter()', ->
      it('line optimization', ->
        @container.innerHTML = '
          <div>\
            <p><br></p>\
            <p>1234</p>\
          </div>'
        quill = new Quill(@container.firstChild)
        quill.editor.selection.setRange(new Quill.Lib.Range(0, 3))
        quill.editor.insertEmbed(0, 'image', 'http://quilljs.com/images/cloud.png')
        debugger
        quill.editor.formatText(2, 6, { bold: true })
        expect(quill.root).toEqualHTML('\
          <p><img src="http://quilljs.com/images/cloud.png"></p>\
          <p><strong>1234</strong></p>\
        ', true)
        range = quill.editor.selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
        quill.editor.selection.shiftAfter(0, 0, _.bind(quill.editor.doc.optimizeLines, quill.editor.doc))
        range = quill.editor.selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )
    )

    describe('preserve()', ->
      beforeEach( ->
        @container.innerHTML = '<div></div>'
        @quill = new Quill(@container.firstChild)
        @doc = @quill.editor.doc
        @selection = @quill.editor.selection
      )

      it('wrapInline() text', ->
        @quill.root.innerHTML = 'Test'
        textNode = @quill.root.firstChild
        @selection._setNativeRange(textNode, 0, textNode, 4)
        @selection.preserve(_.bind(@doc.build, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(4)
      )

      it('wrapInline() image', ->
        @quill.root.innerHTML = '<img src="http://quilljs.com/images/cloud.png">'
        @selection._setNativeRange(@quill.root, 0, @quill.root, 1)
        @selection.preserve(_.bind(@doc.build, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(1)
      )

      it('handleBreaks()', ->
        @quill.root.innerHTML = '<p>01<br>34</p>'
        firstTextNode = @quill.root.firstChild.firstChild
        lastTextNode = @quill.root.firstChild.lastChild
        @selection._setNativeRange(firstTextNode, 1, lastTextNode, 1)
        @selection.preserve(_.bind(@doc.build, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )

      it('pullBlocks()', ->
        @quill.root.innerHTML = '<div><p>01</p><p>34</p></div>'
        firstTextNode = @quill.root.firstChild.firstChild.firstChild
        lastTextNode = @quill.root.firstChild.lastChild.firstChild
        @selection._setNativeRange(firstTextNode, 1, lastTextNode, 1)
        @selection.preserve(_.bind(@doc.build, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )

      it('wrapText()', ->
        @quill.root.innerHTML = '<p>0123</p><p>5678</p>'
        firstTextNode = @quill.root.firstChild.firstChild
        lastTextNode = @quill.root.lastChild.firstChild
        @selection._setNativeRange(firstTextNode, 2, lastTextNode, 2)
        @selection.preserve(_.bind(@doc.build, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(2)
        expect(range.end).toEqual(7)
      )

      it('no range', ->
        @quill.root.innerHTML = '<p>Test</p>'
        textNode = @quill.root.querySelector('p').firstChild
        @selection._setNativeRange(null)
        @selection.preserve(_.bind(@doc.build, @doc))
        range = @selection.getRange()
        expect(range).toBe(null)
      )
    )
  )

  describe('save / restore selection', ->
    it('focus on another input', (done) ->
      @container.innerHTML = '<input type="textbox"><div><p>0123</p></div>'
      @quill = new Quill(@container.lastChild)
      @quill.setSelection(2, 3)
      @container.firstChild.focus()
      _.defer( =>
        expect(@quill.editor.selection.checkFocus()).not.toBeTruthy()
        expect(@quill.getSelection()).not.toBeTruthy()
        savedRange = @quill.editor.selection.getRange(true)
        expect(savedRange).toBeTruthy()
        expect(savedRange.start).toEqual(2)
        expect(savedRange.end).toEqual(3)
        @quill.focus()
        range = @quill.getSelection()
        expect(range).not.toEqual(null)
        expect(range.start).toEqual(2)
        expect(range.end).toEqual(3)
        done()
      )
    )
  )

  xdescribe('getBounds()', ->
    reference = null

    beforeEach( ->
      @quill.editor.root.style.fontFamily = 'monospace'
      # Normally handled by theme
      if dom.isIE(10)
        version = if dom.isIE(9) then '9' else '10'
        dom(@editor.root).addClass('ql-ie-' + version).addClass('ql-editor')
      unless reference?
        @quill.editor.root.innerHTML = '<p><span>0</span></p>'
        reference =
          normal:
            height: @editor.root.firstChild.firstChild.offsetHeight
            width: @editor.root.firstChild.firstChild.offsetWidth
        @quill.editor.root.innerHTML = '<p><span style="font-size: 32px;">0</span></p>'
        reference.large =
          height: @editor.root.firstChild.firstChild.offsetHeight
          width: @editor.root.firstChild.firstChild.offsetWidth
      @quill.editor.root.innerHTML = '<p>01</p><p>34<span style="font-size: 32px;">56</span>78</p>'
    )

    it('empty line', ->
      @quill.editor.root.innerHTML = "<p><br></p>"
      bounds = @editor.getBounds(0)
      expect(bounds.height).toBeApproximately(reference.normal.height, 1)
      expect(bounds.left).toBeApproximately(0, 1)
      expect(bounds.top).toBeApproximately(0, 1)
    )

    it('start of line', ->
      bounds = @quill.editor.getBounds(0)
      expect(bounds.height).toBeApproximately(reference.normal.height, 1)
      expect(bounds.left).toBeApproximately(0, 1)
      expect(bounds.top).toBeApproximately(0, 1)
    )

    it('end of line', ->
      bounds = @quill.editor.getBounds(2)
      expect(bounds.height).toBeApproximately(reference.normal.height, 1)
      expect(bounds.left).toBeApproximately(2*reference.normal.width, 2)
      expect(bounds.top).toBeApproximately(0, 1)
    )

    it('middle of plain text', ->
      bounds = @quill.editor.getBounds(1)
      expect(bounds.height).toBeApproximately(reference.normal.height, 1)
      expect(bounds.left).toBeApproximately(reference.normal.width, 1)
      expect(bounds.top).toBeApproximately(0, 1)
    )

    it('middle of formatted text', ->
      bounds = @quill.editor.getBounds(6)
      expect(bounds.height).toBeApproximately(reference.large.height, 1)
      expect(bounds.left).toBeApproximately(2*reference.normal.width + reference.large.width, 2)
      expect(bounds.top).toBeApproximately(reference.normal.height, 2)
    )

    it('end of plain text start of formatted text', ->
      bounds = @quill.editor.getBounds(5)
      expect(bounds.left).toBeApproximately(2*reference.normal.width, 2)
      # IE takes height of line
      if Quill.Lib.DOM.isIE(11)
        expect(bounds.height).toBeApproximately(reference.large.height, 1)
      else
        expect(bounds.height).toBeApproximately(reference.normal.height, 1)
    )

    it('end of formatted text start of plain text', ->
      bounds = @quill.editor.getBounds(7)
      expect(bounds.height).toBeApproximately(reference.large.height, 1)
      expect(bounds.left).toBeApproximately(2*reference.normal.width + 2*reference.large.width, 3)
    )

    describe('with image', ->
      beforeEach( ->
        @quill.editor.root.innerHTML = '<div><img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACf0lEQVR42r2XS2gTURSG04K2VReilorEECVKiJk8EYuurIgPEFddKW4El1J3FbRUEOzKKuhKdy4Uql0H0UVxoYIKkoWCrxaKz1qKTayNYv0O3IEhzNzecSYz8HNnJpPz3XPm3HPuxGIRHNlstqdQKBwul8tDpVLpDprg/BV63hJgPB7vAngU0HX0BtCSh76FCs7n89sBjqJZDfS343whFHCxWNyEsZvojwb8jok9YKw77tUDwzF6CtW8wPw2zwQvMN51+f3jf4MzmcwaDIxpPBb4S8Zd6JHHM9UgIa/q4OgqObFDQq+Z4G3fcLJ77TLwBSZ4gueSACaXmeRZv2FfidGHGo9+MO7N5XJbDOBLRKjoN+Eu69Y0Xu80haO3mGzzAz+I/np4Pk3YMwLnesoALv8ZMIYnk8lOTTLNCNyyrK2mcPQerTKeAA8PenhRQ70+4T95Vbv9rvcZF0MNPD/EmNDBmeB3qYDSF7geAb7fb+KdcTMM/CTjBtXVnMAv6BY6ThfcHLjUYvS1i1ejKjJPm+7PomP8rT2UJiPvygVekXbL+X3Ne37BcwfCaDRXmuCT6XR6vWwqDJdaRVZQkAl8cPZxIrKHe9cM4Z9RX5DwF5qMnlcygY+TpN1Bwz/sMPpEst6rEjqTUBpRKAmIscfK6C/G07LuNfCG5AsrY10ocGr6ahsoPZtxzsPjRcYbUglD3VwSxn12b0efXMBfVWdMtGRbLXs4j7o/Ltttrle07CNCdT57xyNldkSWUyqV6ojiI6YN2D17wyi5EIvyIPTnFHyOUG+LFA60X9a50pGo4ZZ8QCjvL0Ud9m675kvzCK2V+qh4F9Ez+Xqhkm2MRXz8AzAAXszjgRshAAAAAElFTkSuQmCC"/></div>'
        reference.image =
          height: @quill.editor.root.firstChild.firstChild.offsetHeight
          width: @quill.editor.root.firstChild.firstChild.offsetWidth
      )

      it('directly before image', ->
        bounds = @quill.editor.getBounds(0)
        expect(bounds.height).toBeApproximately(reference.image.height, 1)
        expect(bounds.left).toBeApproximately(0, 1)
      )

      it('directly after image', ->
        bounds = @quill.editor.getBounds(1)
        expect(bounds.height).toBeApproximately(reference.image.height, 1)
        expect(bounds.left).toBeApproximately(reference.image.width, 1)
      )
    )
  )

  describe('scrollIntoView()', ->
    beforeEach( ->
      @container.innerHTML = '<div><span style="font-size: 36px;">a<br>b<br>c<br>d</span></div>'
      @quill = new Quill(@container.firstChild)
      @editor = @quill.editor
      @selection = @editor.selection
      @height = 80
      @editor.root.parentNode.style.height = @height.toString() + "px"
      @editor.root.parentNode.style.overflow = "auto"
    )

    it('scrolls down when cursor too low', ->
      @selection.setRange(new Quill.Lib.Range(7, 7))
      bounds = @editor.getBounds(7)
      expect(bounds.top).toBeGreaterThan(@height)
      @selection.scrollIntoView()
      bounds = @editor.getBounds(7)
      expect(bounds.top).not.toBeLessThan(0)
      expect(bounds.top + bounds.height).not.toBeGreaterThan(@height)
    )

    it('scrolls up when cursor too high', ->
      @selection.setRange(new Quill.Lib.Range(1, 1))
      @editor.root.parentNode.scrollTop = 100
      bounds = @editor.getBounds(1)
      expect(bounds.top + bounds.height).toBeLessThan(0)
      @selection.scrollIntoView()
      bounds = @editor.getBounds(1)
      expect(bounds.top).not.toBeLessThan(0)
      expect(bounds.top + bounds.height).not.toBeGreaterThan(@height)
    )

    it('does not scroll if cursor in view', ->
      @selection.setRange(new Quill.Lib.Range(1, 1))
      bounds = @editor.getBounds(1)
      expect(bounds.top).not.toBeLessThan(0)
      expect(bounds.top + bounds.height).not.toBeGreaterThan(@height)
      @selection.scrollIntoView()
      newBounds = @editor.getBounds(1)
      expect(bounds.top).toBeApproximately(newBounds.top, 1)
      expect(bounds.height).toBeApproximately(newBounds.height, 1)
      expect(bounds.left).toBeApproximately(newBounds.left, 1)
    )
  )
)
