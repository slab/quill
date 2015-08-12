dom = Quill.Lib.DOM

describe('DOM', ->
  beforeEach( ->
    @container = jasmine.clearContainer()
  )

  describe('classes', ->
    afterEach( ->
      $(@container).removeClass()
    )

    it('addClass()', ->
      dom(@container).addClass('custom')
      expect($(@container).hasClass('custom')).toBe(true)
    )

    it('addClass() existing', ->
      dom(@container).addClass('custom')
      dom(@container).addClass('custom')
      expect($(@container).attr('class')).toEqual('custom')
    )

    it('get classes', ->
      $(@container).addClass('custom')
      $(@container).addClass('another')
      classes = dom(@container).classes().sort()
      expect(classes.length).toEqual(2)
      expect(classes[0]).toEqual('another')
      expect(classes[1]).toEqual('custom')
    )

    it('hasClass()', ->
      $(@container).addClass('custom')
      expect(dom(@container).hasClass('custom')).toBe(true)
    )

    it('removeClass()', ->
      $(@container).addClass('custom')
      dom(@container).removeClass('custom')
      expect($(@container).hasClass('custom')).toBe(false)
      expect(@container.outerHTML).toEqual('<div></div>')
    )

    it('removeClass() nonexistent', ->
      dom(@container).removeClass('custom')
      expect(@container.outerHTML).toEqualHTML('<div></div>')
    )

    it('toggleClass()', ->
      dom(@container).toggleClass('custom')
      expect($(@container).hasClass('custom')).toBe(true)
      dom(@container).toggleClass('custom')
      expect($(@container).hasClass('custom')).toBe(false)
    )
  )

  describe('attributes', ->
    beforeEach( ->
      $(@container).html('<div class="custom" style="color: red;"></div>')
      @node = @container.firstChild
    )

    it('get attributes none', ->
      $(@container).html('<div></div>')
      attributes = dom(@container.firstChild).attributes()
      expect(Object.keys(attributes).length).toEqual(0)
    )

    it('get attributes multiple', ->
      attributes = dom(@node).attributes()
      expect(Object.keys(attributes).length).toEqual(2)
      expect(attributes['class']).toEqual('custom')
      expect(attributes['style'].toLowerCase()).toContain('color: red')
    )

    it('set attributes', ->
      attributes =
        'class': 'test'
        'style': 'font-size: 13px;'
      dom(@node).attributes(attributes)
      expect(dom(@node).attributes()).toEqual(attributes)
    )
  )

  describe('styles', ->
    html = '<span style="color: red; display: inline;">Test</span>'
    styles =
      'color': 'red'
      'display': 'inline'

    it('get styles', ->
      $(@container).html(html)
      result = dom(@container.firstChild).styles()
      expect(result).toEqual(styles)
    )

    it('set styles', ->
      $(@container).html('<span style="cursor: pointer;">Test</span>')
      dom(@container.firstChild).styles(styles, true)
      _.each(styles, (value, name) =>
        expect(@container.firstChild.style[name]).toEqual(value)
      )
      expect(@container.firstChild.style.pointer).toBeUndefined()
    )

    it('add styles', ->
      $(@container).html(html)
      dom(@container.firstChild).styles(
        color: 'blue'
        cursor: 'pointer'
      )
      expect(@container.firstChild.style.display).toEqual('inline')
      expect(@container.firstChild.style.color).toEqual('blue')
      expect(@container.firstChild.style.cursor).toEqual('pointer')
    )
  )

  describe('events', ->
    describe('on()', ->
      beforeEach( ->
        $(@container).html('<div><button type="button">Button</button></div>')
        @button = @container.querySelector('button')
      )

      it('click', (done) ->
        dom(@button).on('click', _.partial(done, null))
        $(@button).trigger('click')
      )

      it('bubble', (done) ->
        dom(@button.parentNode).on('click', _.partial(done, null))
        $(@button).trigger('click')
      )

      it('prevent bubble', (done) ->
        dom(@button).on('click', ->
          _.defer(done)
          return false
        )
        dom(@button.parentNode).on('click', ->
          throw new Error('Bubble not prevented')
        )
        $(@button).trigger('click')
      )
    )

    describe('trigger()', ->
      it('click', ->
        $(@container).html('<button type="button" onclick="window._triggerClick = true;">Button</button>')
        @button = @container.querySelector('button')
        expect(window._triggerClick).not.toBeTruthy()
        dom(@button).trigger('click')
        expect(window._triggerClick).toBe(true)
        window._triggerClick = undefined
      )

      it('change', (done) ->
        $(@container).html('
          <select>
            <option value="one" selected>One</option>
            <option value="two">Two</option>
          </select>'
        )
        select = @container.querySelector('select')
        # Only testing event handler is fired, actually changing select is tested in select section below
        dom(select).on('change', ->
          expect(select.selectedIndex).toEqual(0)
          done()
        )
        dom(select).trigger('change')
      )

      it('keydown', (done) ->
        $(@container).html('<div contenteditable=true></div>')
        @container.firstChild.focus()
        dom(@container.firstChild).on('keydown', (event) ->
          expect(event.key).toEqual('A')
          expect(event.altKey).not.toBeTruthy()
          expect(event.ctrlKey).not.toBeTruthy()
          expect(event.metaKey).toBeTruthy()
          expect(event.shiftKey).toBeTruthy()
          done()
        )
        dom(@container.firstChild).trigger('keydown', { key: 'A', shiftKey: true, metaKey: true })
      )
    )
  )

  describe('text', ->
    beforeEach( ->
      $(@container).html('0<span>1</span><!-- Comment --><b><i>2</i></b>3<img><br>')
    )

    it('get text from element', ->
      expect(dom(@container).text()).toEqual('0123')
    )

    it('get text from break', ->
      expect(dom(@container.lastChild).text()).toEqual('')
    )

    it('get text from comment', ->
      expect(dom(@container.childNodes[2]).text()).toEqual('')
    )

    it('get text embed tag', ->
      expect(dom(@container.querySelector('img')).text()).toEqual('!')
    )

    it('set text on element', ->
      dom(@container).text('test')
      expect($(@container).text()).toEqual('test')
    )

    it('set text on text node', ->
      dom(@container.firstChild).text('A')
      expect($(@container).text()).toEqual('A123')
    )

    it('get text nodes', ->
      textNodes = dom(@container).textNodes()
      expect(textNodes.length).toEqual(4)
    )
  )

  describe('select', ->
    beforeEach( ->
      $(@container).html('\
        <select>\
          <option value="one">One</option>\
          <option value="two" selected>Two</option>\
          <option value="three">Three</option>\
        </select>\
      ')
      @select = @container.firstChild
      $(@select).val('one')
    )

    it('default option', ->
      expect(dom(@select).default()).toEqual(@select.children[1])
    )

    it('reset', ->
      expect($(@select).val()).toEqual('one')
      dom(@select).reset()
      expect($(@select).val()).toEqual('two')
    )

    it('option() dom', ->
      dom(@select).option(@select.children[2])
      expect($(@select).val()).toEqual('three')
    )

    it('option() value', ->
      dom(@select).option('three')
      expect($(@select).val()).toEqual('three')
    )

    it('value() option', ->
      dom(@select).option(@select.children[2])
      expect(dom(@select).value()).toEqual('three')
    )

    it('value() value', ->
      dom(@select).option('three')
      expect(dom(@select).value()).toEqual('three')
    )

    it('value() blank', ->
      dom(@select).option('')
      expect(dom(@select).value()).toEqual('')
    )
  )

  describe('get nodes', ->
    it('get child nodes', ->
      @container.innerHTML = '<b>0</b><i>1</i><u>2</u><br>'
      nodes = dom(@container).childNodes()
      expect(nodes.length).toEqual(4)
    )
  )
)
