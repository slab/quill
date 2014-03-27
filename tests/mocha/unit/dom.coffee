describe('DOM', ->
  testContainer = $('#test-container').get(0)
  expectContainer = $('#expected-container').get(0)

  afterEach( ->
    $(testContainer).html('')
  )

  describe('classes', ->
    afterEach( ->
      $(testContainer).removeClass()
    )

    it('addClass', ->
      Scribe.DOM.addClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(true)
    )

    it('getClasses', ->
      $(testContainer).addClass('custom')
      $(testContainer).addClass('another')
      classes = Scribe.DOM.getClasses(testContainer)
      expect(_.union(classes, ['custom', 'another']).length).to.equal(2)
    )

    it('hasClass', ->
      $(testContainer).addClass('custom')
      expect(Scribe.DOM.hasClass(testContainer, 'custom')).to.be(true)
    )

    it('removeClass', ->
      $(testContainer).addClass('custom')
      Scribe.DOM.removeClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(false)
    )

    it('toggleClass', ->
      Scribe.DOM.toggleClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(true)
      Scribe.DOM.toggleClass(testContainer, 'custom')
      expect($(testContainer).hasClass('custom')).to.be(false)
    )
  )

  describe('attributes', ->
    beforeEach( ->
      $(testContainer).html('<div class="custom" style="color: red;"></div>')
      @node = testContainer.firstChild
    )

    it('getAttributes', ->
      attributes = Scribe.DOM.getAttributes(@node)
      expect(_.keys(attributes).length).to.equal(2)
      expect(attributes['class']).to.equal('custom')
      expect(attributes['style']).to.equal('color: red;')
    )

    it('clearAttributes', ->
      Scribe.DOM.clearAttributes(@node)
      expect(@node.outerHTML).to.equal('<div></div>')
    )

    it('clearAttributes with exception', ->
      Scribe.DOM.clearAttributes(@node, 'class')
      expect(@node.outerHTML).to.equal('<div class="custom"></div>')
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
      @button = testContainer.firstChild.firstElementChild
      @select = testContainer.firstChild.lastElementChild
    )

    it('addEventListener click', (done) ->
      Scribe.DOM.addEventListener(@button, 'click', _.partial(done, null))
      $(@button).trigger('click')
    )

    it('addEventListener bubble', (done) ->
      Scribe.DOM.addEventListener(@button.parentNode, 'click', _.partial(done, null))
      $(@button).trigger('click')
    )

    it('addEventListener prevent bubble', (done) ->
      Scribe.DOM.addEventListener(@button, 'click', ->
        _.defer(done)
        return false
      )
      Scribe.DOM.addEventListener(@button.parentNode, 'click', ->
        throw new Error('Bubble not prevented')
      )
      $(@button).trigger('click')
    )

    it('triggerEvent', (done) ->
      $(@button).on('click', _.partial(done, null))
      Scribe.DOM.triggerEvent(@button, 'click')
    )

    it('addEventListener change', (done) ->
      Scribe.DOM.addEventListener(@select, 'change', _.partial(done, null))
      Scribe.DOM.triggerEvent(@select, 'change')
    )
  )

  describe('text', ->
    beforeEach( ->
      $(testContainer).html('0<span>1</span><!-- Comment --><b><i>2</i></b>3<br>')
    )

    it('should retrieve text', ->
      expect(Scribe.DOM.getText(testContainer)).to.equal('0123')
    )

    it('should set element text', ->
      Scribe.DOM.setText(testContainer, 'test')
      expect($(testContainer).text()).to.equal('test')
    )

    it('should set text node text', ->
      Scribe.DOM.setText(testContainer.firstChild, 'A')
      expect($(testContainer).text()).to.equal('A123')
    )
  )

  describe('manipulation', ->
    beforeEach( ->
      $(testContainer).html('<div>One</div><div><span>Two</span><b>Bold</b></div>')
    )

    it('mergeNodes', ->
      Scribe.DOM.mergeNodes(testContainer.firstChild, testContainer.lastChild)
      expect($(testContainer).html()).to.equal('<div>One<span>Two</span><b>Bold</b></div>')
    )

    it('moveChildren', ->
      Scribe.DOM.moveChildren(testContainer.firstChild, testContainer.lastChild)
      expect($(testContainer).html()).to.equal('<div>One<span>Two</span><b>Bold</b></div><div></div>')
    )

    it('removeNode', ->
      Scribe.DOM.removeNode(testContainer.lastChild.firstChild)
      expect($(testContainer).html()).to.equal('<div>One</div><div><b>Bold</b></div>')
    )

    it('switchTag', ->
      Scribe.DOM.switchTag(testContainer.firstChild, 'span')
      expect($(testContainer).html()).to.equal('<span>One</span><div><span>Two</span><b>Bold</b></div>')
    )

    it('unwrap', ->
      Scribe.DOM.unwrap(testContainer.lastChild)
      expect($(testContainer).html()).to.equal('<div>One</div><span>Two</span><b>Bold</b>')
    )

    it('wrap', ->
      wrapper = testContainer.ownerDocument.createElement('div')
      Scribe.DOM.wrap(wrapper, testContainer.firstChild)
      expect($(testContainer).html()).to.equal('<div><div>One</div></div><div><span>Two</span><b>Bold</b></div>')
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
      @select = testContainer.firstElementChild
      $(@select).val('one')
    )

    it('getDefaultOption', ->
      expect(Scribe.DOM.getDefaultOption(@select)).to.equal(@select.lastElementChild)
    )

    it('resetSelect', ->
      expect($(@select).val()).to.equal('one')
      Scribe.DOM.resetSelect(@select)
      expect($(@select).val()).to.equal('two')
    )
  )

  describe('children', ->
    beforeEach( ->
      $(testContainer).html('<b>0</b><i>1</i><u>2</u><br>')
    )

    it('getChildNodes', ->
      nodes = Scribe.DOM.getChildNodes(testContainer)
      _.each(nodes, (node, i) ->
        expect(node).to.equal(testContainer.childNodes[i])
      )
    )

    it('getChildIndex', ->
      _.each(Scribe.DOM.getChildNodes(testContainer), (node, i) ->
        expect(Scribe.DOM.getChildIndex(node)).to.equal(i)
      )
    )
  )
)
