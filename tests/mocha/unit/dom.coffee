describe('DOM', ->
  testContainer = $('#test-container').get(0)
  expectContainer = $('#expected-container').get(0)

  beforeEach( ->
    $(testContainer).html('')
  )

  describe('classes', ->
    afterEach( ->
      $(testContainer).removeClass()
    )

    it('addClass', ->
      Quill.DOM.addClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(true)
    )

    it('getClasses', ->
      $(testContainer).addClass('custom')
      $(testContainer).addClass('another')
      classes = Quill.DOM.getClasses(testContainer)
      expect(_.union(classes, ['custom', 'another']).length).to.equal(2)
    )

    it('hasClass', ->
      $(testContainer).addClass('custom')
      expect(Quill.DOM.hasClass(testContainer, 'custom')).to.be(true)
    )

    it('removeClass', ->
      $(testContainer).addClass('custom')
      Quill.DOM.removeClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(false)
    )

    it('toggleClass', ->
      Quill.DOM.toggleClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(true)
      Quill.DOM.toggleClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(false)
    )
  )

  describe('attributes', ->
    beforeEach( ->
      $(testContainer).html('<div class="custom" style="color: red;"></div>')
      @node = testContainer.firstChild
    )

    it('getAttributes', ->
      attributes = Quill.DOM.getAttributes(@node)
      expect(_.keys(attributes).length).to.equal(2)
      expect(attributes['class']).to.equal('custom')
      expect(attributes['style'].toLowerCase()).to.contain('color: red')
    )

    it('clearAttributes', ->
      Quill.DOM.clearAttributes(@node)
      expect.equalHTML(@node.outerHTML, '<div></div>')
    )

    it('clearAttributes with exception', ->
      Quill.DOM.clearAttributes(@node, 'class')
      expect.equalHTML(@node.outerHTML, '<div class="custom"></div>')
    )
  )

  describe('styles', ->
    html = '<span style="color: red; background-color: blue; display: inline;">Test</span>'
    styles =
      'color': 'red'
      'background-color': 'blue'
      'display': 'inline'

    it('should retrieve styles', ->
      $(testContainer).html(html)
      result = Quill.DOM.getStyles(testContainer.firstChild)
      expect(result).to.eql(styles)
    )

    it('should set styles', ->
      $(testContainer).html('<span>Test</span>')
      Quill.DOM.setStyles(testContainer.firstChild, styles)
      expect.equalHTML(testContainer.firstChild.outerHTML, html)
    )
  )

  describe('events', ->
    beforeEach( ->
      $(testContainer).html('
        <div>
          <button type="button">Button</button>
          <select>
            <option value="one" selected>One</option>
            <option value="two">Two</option>
          </select>
        </div>'
      )
      # IE8 does not define firstElementChild
      @button = testContainer.firstChild.children[0]
      @select = testContainer.firstChild.children[1]
    )

    it('addEventListener click', (done) ->
      Quill.DOM.addEventListener(@button, 'click', _.partial(done, null))
      $(@button).trigger('click')
    )

    it('addEventListener bubble', (done) ->
      Quill.DOM.addEventListener(@button.parentNode, 'click', _.partial(done, null))
      $(@button).trigger('click')
    )

    it('addEventListener prevent bubble', (done) ->
      Quill.DOM.addEventListener(@button, 'click', ->
        _.defer(done)
        return false
      )
      Quill.DOM.addEventListener(@button.parentNode, 'click', ->
        throw new Error('Bubble not prevented')
      )
      $(@button).trigger('click')
    )

    it('triggerEvent', (done) ->
      $(@button).on('click', _.partial(done, null))
      Quill.DOM.triggerEvent(@button, 'click')
    )

    it('addEventListener change', (done) ->
      Quill.DOM.addEventListener(@select, 'change', _.partial(done, null))
      Quill.DOM.triggerEvent(@select, 'change')
    )
  )

  describe('text', ->
    beforeEach( ->
      $(testContainer).html('0<span>1</span><!-- Comment --><b><i>2</i></b>3<br>')
    )

    it('should retrieve text', ->
      expect(Quill.DOM.getText(testContainer)).to.equal('0123')
    )

    it('should set element text', ->
      Quill.DOM.setText(testContainer, 'test')
      expect($(testContainer).text()).to.equal('test')
    )

    it('should set text node text', ->
      Quill.DOM.setText(testContainer.firstChild, 'A')
      expect($(testContainer).text()).to.equal('A123')
    )

    it('should get all text nodes', ->
      textNodes = Quill.DOM.getTextNodes(testContainer)
      expect(textNodes.length).to.equal(4)
    )
  )

  describe('manipulation', ->
    beforeEach( ->
      $(testContainer).html('<div style="cursor: pointer">One</div><div><span>Two</span><b>Bold</b></div>')
    )

    it('moveChildren', ->
      Quill.DOM.moveChildren(testContainer.firstChild, testContainer.lastChild)
      expect.equalHTML(testContainer, '<div style="cursor: pointer>One<span>Two</span><b>Bold</b></div><div></div>')
    )

    it('removeNode', ->
      Quill.DOM.removeNode(testContainer.lastChild.firstChild)
      expect.equalHTML(testContainer, '<div style="cursor: pointer>One</div><div><b>Bold</b></div>')
    )

    it('switchTag', ->
      Quill.DOM.switchTag(testContainer.firstChild, 'span')
      expect.equalHTML(testContainer, '<span style="cursor: pointer>One</span><div><span>Two</span><b>Bold</b></div>')
    )

    it('unwrap', ->
      Quill.DOM.unwrap(testContainer.lastChild)
      expect.equalHTML(testContainer, '<div style="cursor: pointer>One</div><span>Two</span><b>Bold</b>')
    )

    it('wrap', ->
      wrapper = testContainer.ownerDocument.createElement('div')
      Quill.DOM.wrap(wrapper, testContainer.firstChild)
      expect.equalHTML(testContainer, '<div><div style="cursor: pointer>One</div></div><div><span>Two</span><b>Bold</b></div>')
    )
  )

  describe('select', ->
    beforeEach( ->
      $(testContainer).html('
        <select>
          <option value="one">One</option>
          <option value="two" selected>Two</option>
        </select>
      ')
      @select = testContainer.children[0]
      $(@select).val('one')
    )

    it('getDefaultOption', ->
      expect(Quill.DOM.getDefaultOption(@select)).to.equal(@select.children[1])
    )

    it('resetSelect', ->
      expect($(@select).val()).to.equal('one')
      Quill.DOM.resetSelect(@select)
      expect($(@select).val()).to.equal('two')
    )
  )

  describe('children', ->
    beforeEach( ->
      $(testContainer).html('<b>0</b><i>1</i><u>2</u><br>')
    )

    it('getChildNodes', ->
      nodes = Quill.DOM.getChildNodes(testContainer)
      _.each(nodes, (node, i) ->
        expect(node).to.equal(testContainer.childNodes[i])
      )
    )
  )
)
