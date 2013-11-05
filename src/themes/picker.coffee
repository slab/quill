# Add global listener for clicks anywhere in the document


class ScribePicker
  constructor: (@select) ->
    this.buildPicker()
    Scribe.DOM.addEventListener(@picker, 'click', ->
      Scribe.DOM.toggleClass(@picker, 'expanded')
    )
    Scribe.DOM.addEventListener(@picker, 'blur', ->
      Scribe.DOM.removeClass(@picker, 'expanded')
    )

  buildItem: (option, index) ->
    li = @select.ownerDocument.createElement('li')
    Scribe.DOM.setText(li, Scribe.DOM.getText(option))
    Scribe.DOM.addClass(li, 'selected') if option.hasAttribute('selected')
    Scribe.DOM.addEventListener(li, 'click', =>
      _.each(@picker.querySelectorAll('.selected'), (activeColor) =>
        Scribe.DOM.removeClass(activeColor, 'selected')
      )
      Scribe.DOM.addClass(li, 'selected')
      @select.selectedIndex = index
      Scribe.DOM.triggerEvent(@select, 'change', false, true)
      return false
    )
    return li

  buildPicker: ->
    @picker = @select.ownerDocument.createElement('ul')
    _.each(Scribe.DOM.getClasses(@select), (css) =>
      Scribe.DOM.addClass(@picker, css)
    )
    Scribe.DOM.addClass(@picker, 'picker')
    _.each(@select.querySelectorAll('option'), (option, i) =>
      item = this.buildItem(option, i)
      @picker.appendChild(item)
    )
    @select.parentNode.insertBefore(@picker, @select)
    @select.style.display = 'none'


module.exports = ScribePicker
