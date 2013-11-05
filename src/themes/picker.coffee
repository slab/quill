class ScribePicker
  constructor: (@select) ->
    @container = @select.ownerDocument.createElement('div')
    _.each(Scribe.DOM.getClasses(@select), (css) =>
      Scribe.DOM.addClass(@container, css)
    )
    Scribe.DOM.addClass(@container, 'picker')
    @label = @select.ownerDocument.createElement('div')
    Scribe.DOM.addClass(@label, 'picker-label')
    @container.appendChild(@label)
    ul = this.buildPicker()
    @container.appendChild(ul)
    selected = ul.querySelector('.selected')
    Scribe.DOM.setText(@label, Scribe.DOM.getText(selected)) if selected?
    Scribe.DOM.addEventListener(@label, 'click', =>
      # Defer to avoid document click handler that closes all dropdowns
      _.defer( =>   
        Scribe.DOM.toggleClass(@container, 'expanded')
      )
    )
    Scribe.DOM.addEventListener(@select.ownerDocument, 'click', =>
      Scribe.DOM.removeClass(@container, 'expanded')
    )
    Scribe.DOM.addEventListener(@select, 'change', =>
      this.selectItem(@select.options[@select.selectedIndex])
    )
    @select.parentNode.insertBefore(@container, @select)

  buildItem: (picker, option, index) ->
    li = @select.ownerDocument.createElement('li')
    Scribe.DOM.setText(li, Scribe.DOM.getText(option))
    Scribe.DOM.addClass(li, 'selected') if option.hasAttribute('selected')
    Scribe.DOM.addEventListener(li, 'click', =>
      this.selectItem(li)
      @select.selectedIndex = index
      Scribe.DOM.triggerEvent(@select, 'change', true, true)
    )
    return li

  buildPicker: ->
    picker = @select.ownerDocument.createElement('ul')
    Scribe.DOM.addClass(picker, 'picker-options')
    _.each(@select.querySelectorAll('option'), (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )
    @select.style.display = 'none'
    return picker

  selectItem: (li) ->
    selected = @container.querySelector('.selected')
    Scribe.DOM.removeClass(selected, 'selected') if selected?
    if li?
      Scribe.DOM.addClass(li, 'selected')
      Scribe.DOM.setText(@label, Scribe.DOM.getText(li))
    else
      Scribe.DOM.setText(@label, '')


module.exports = ScribePicker
