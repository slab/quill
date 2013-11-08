ScribeDOM = require('../dom')


class ScribePicker
  constructor: (@select) ->
    @container = @select.ownerDocument.createElement('div')
    _.each(ScribeDOM.getClasses(@select), (css) =>
      ScribeDOM.addClass(@container, css)
    )
    ScribeDOM.addClass(@container, 'picker')
    @label = @select.ownerDocument.createElement('div')
    ScribeDOM.addClass(@label, 'picker-label')
    @container.appendChild(@label)
    picker = this.buildPicker()
    @container.appendChild(picker)
    selected = picker.querySelector('.selected')
    ScribeDOM.setText(@label, ScribeDOM.getText(selected)) if selected?
    ScribeDOM.addEventListener(@label, 'click', =>
      # Defer to avoid document click handler that closes all dropdowns
      hasClass = ScribeDOM.hasClass(@container, 'expanded')
      _.defer( =>
        ScribeDOM.toggleClass(@container, 'expanded', !hasClass)
      )
    )
    ScribeDOM.addEventListener(@select.ownerDocument, 'click', =>
      ScribeDOM.removeClass(@container, 'expanded')
    )
    ScribeDOM.addEventListener(@select, 'change', =>
      option = @container.querySelectorAll('.picker-item')[@select.selectedIndex]
      this.selectItem(option)
      ScribeDOM.toggleClass(@label, 'active', option != selected)
    )
    @select.parentNode.insertBefore(@container, @select)

  buildItem: (picker, option, index) ->
    item = @select.ownerDocument.createElement('div')
    ScribeDOM.addClass(item, 'picker-item')
    ScribeDOM.setText(item, ScribeDOM.getText(option))
    ScribeDOM.addClass(item, 'selected') if option.hasAttribute('selected')
    ScribeDOM.addEventListener(item, 'click', =>
      this.selectItem(item)
      @select.selectedIndex = index
      ScribeDOM.triggerEvent(@select, 'change', true, true)
    )
    return item

  buildPicker: ->
    picker = @select.ownerDocument.createElement('div')
    ScribeDOM.addClass(picker, 'picker-options')
    _.each(@select.querySelectorAll('option'), (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )
    @select.style.display = 'none'
    return picker

  close: ->
    ScribeDOM.removeClass(@container, 'expanded')

  selectItem: (item) ->
    selected = @container.querySelector('.selected')
    ScribeDOM.removeClass(selected, 'selected') if selected?
    if item?
      ScribeDOM.addClass(item, 'selected')
      ScribeDOM.setText(@label, ScribeDOM.getText(item))
    else
      @label.innerHTML = '&nbsp;'


module.exports = ScribePicker
