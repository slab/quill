_         = require('lodash')
ScribeDOM = require('../dom')


class ScribePicker
  constructor: (@select) ->
    @container = @select.ownerDocument.createElement('div')
    _.each(ScribeDOM.getClasses(@select), (css) =>
      ScribeDOM.addClass(@container, css)
    )
    title = @select.getAttribute('title')
    @container.setAttribute('title', title) if title
    ScribeDOM.addClass(@container, 'sc-picker')
    @label = @select.ownerDocument.createElement('div')
    ScribeDOM.addClass(@label, 'sc-picker-label')
    @container.appendChild(@label)
    picker = this.buildPicker()
    @container.appendChild(picker)
    selected = picker.querySelector('.sc-selected')
    ScribeDOM.setText(@label, ScribeDOM.getText(selected)) if selected?
    ScribeDOM.addEventListener(@label, 'click', =>
      # Defer to avoid document click handler that closes all dropdowns
      hasClass = ScribeDOM.hasClass(@container, 'sc-expanded')
      _.defer( =>
        ScribeDOM.toggleClass(@container, 'sc-expanded', !hasClass)
      )
    )
    ScribeDOM.addEventListener(@select.ownerDocument, 'click', =>
      ScribeDOM.removeClass(@container, 'sc-expanded')
    )
    ScribeDOM.addEventListener(@select, 'change', =>
      option = @container.querySelectorAll('.sc-picker-item')[@select.selectedIndex]
      this.selectItem(option)
      ScribeDOM.toggleClass(@label, 'sc-active', option != selected)
    )
    @select.parentNode.insertBefore(@container, @select)

  buildItem: (picker, option, index) ->
    item = @select.ownerDocument.createElement('div')
    ScribeDOM.addClass(item, 'sc-picker-item')
    ScribeDOM.setText(item, ScribeDOM.getText(option))
    ScribeDOM.addClass(item, 'sc-selected') if @select.selectedIndex == index
    ScribeDOM.addEventListener(item, 'click', =>
      this.selectItem(item)
      @select.selectedIndex = index
      ScribeDOM.triggerEvent(@select, 'change', true, true)
      return true
    )
    return item

  buildPicker: ->
    picker = @select.ownerDocument.createElement('div')
    ScribeDOM.addClass(picker, 'sc-picker-options')
    _.each(@select.querySelectorAll('option'), (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )
    @select.style.display = 'none'
    return picker

  close: ->
    ScribeDOM.removeClass(@container, 'sc-expanded')

  selectItem: (item) ->
    selected = @container.querySelector('.sc-selected')
    ScribeDOM.removeClass(selected, 'sc-selected') if selected?
    if item?
      ScribeDOM.addClass(item, 'sc-selected')
      ScribeDOM.setText(@label, ScribeDOM.getText(item))
    else
      @label.innerHTML = '&nbsp;'


module.exports = ScribePicker
