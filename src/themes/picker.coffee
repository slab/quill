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
    picker = this.buildPicker()
    @container.appendChild(picker)
    selected = picker.querySelector('.selected')
    Scribe.DOM.setText(@label, Scribe.DOM.getText(selected)) if selected?
    Scribe.DOM.addEventListener(@label, 'click', =>
      # Defer to avoid document click handler that closes all dropdowns
      hasClass = Scribe.DOM.hasClass(@container, 'expanded')
      _.defer( =>
        Scribe.DOM.toggleClass(@container, 'expanded', !hasClass)
      )
    )
    Scribe.DOM.addEventListener(@select.ownerDocument, 'click', =>
      Scribe.DOM.removeClass(@container, 'expanded')
    )
    Scribe.DOM.addEventListener(@select, 'change', =>
      this.selectItem(@container.querySelectorAll('.picker-item')[@select.selectedIndex])
    )
    @select.parentNode.insertBefore(@container, @select)

  buildItem: (picker, option, index) ->
    item = @select.ownerDocument.createElement('div')
    Scribe.DOM.addClass(item, 'picker-item')
    Scribe.DOM.setText(item, Scribe.DOM.getText(option))
    Scribe.DOM.addClass(item, 'selected') if option.hasAttribute('selected')
    Scribe.DOM.addEventListener(item, 'click', =>
      this.selectItem(item)
      @select.selectedIndex = index
      Scribe.DOM.triggerEvent(@select, 'change', true, true)
    )
    return item

  buildPicker: ->
    picker = @select.ownerDocument.createElement('div')
    Scribe.DOM.addClass(picker, 'picker-options')
    _.each(@select.querySelectorAll('option'), (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )
    @select.style.display = 'none'
    return picker

  selectItem: (item) ->
    selected = @container.querySelector('.selected')
    Scribe.DOM.removeClass(selected, 'selected') if selected?
    if item?
      Scribe.DOM.addClass(item, 'selected')
      Scribe.DOM.setText(@label, Scribe.DOM.getText(item))
    else
      Scribe.DOM.setText(@label, '')


module.exports = ScribePicker
