_   = require('lodash')
DOM = require('../dom')


class Picker
  constructor: (@select) ->
    @container = @select.ownerDocument.createElement('div')
    _.each(DOM.getClasses(@select), (css) =>
      DOM.addClass(@container, css)
    )
    title = @select.getAttribute('title')
    @container.setAttribute('title', title) if title
    DOM.addClass(@container, 'sc-picker')
    @label = @select.ownerDocument.createElement('div')
    DOM.addClass(@label, 'sc-picker-label')
    @container.appendChild(@label)
    picker = this.buildPicker()
    @container.appendChild(picker)
    selected = picker.querySelector('.sc-selected')
    DOM.setText(@label, DOM.getText(selected)) if selected?
    DOM.addEventListener(@label, 'click', =>
      # Defer to avoid document click handler that closes all dropdowns
      hasClass = DOM.hasClass(@container, 'sc-expanded')
      _.defer( =>
        DOM.toggleClass(@container, 'sc-expanded', !hasClass)
      )
    )
    DOM.addEventListener(@select.ownerDocument, 'click', =>
      DOM.removeClass(@container, 'sc-expanded')
    )
    DOM.addEventListener(@select, 'change', =>
      option = @container.querySelectorAll('.sc-picker-item')[@select.selectedIndex]
      this.selectItem(option)
      DOM.toggleClass(@label, 'sc-active', option != selected)
    )
    @select.parentNode.insertBefore(@container, @select)

  buildItem: (picker, option, index) ->
    item = @select.ownerDocument.createElement('div')
    DOM.addClass(item, 'sc-picker-item')
    DOM.setText(item, DOM.getText(option))
    DOM.addClass(item, 'sc-selected') if @select.selectedIndex == index
    DOM.addEventListener(item, 'click', =>
      this.selectItem(item)
      @select.selectedIndex = index
      DOM.triggerEvent(@select, 'change', true, true)
      return true
    )
    return item

  buildPicker: ->
    picker = @select.ownerDocument.createElement('div')
    DOM.addClass(picker, 'sc-picker-options')
    _.each(@select.querySelectorAll('option'), (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )
    @select.style.display = 'none'
    return picker

  close: ->
    DOM.removeClass(@container, 'sc-expanded')

  selectItem: (item) ->
    selected = @container.querySelector('.sc-selected')
    DOM.removeClass(selected, 'sc-selected') if selected?
    if item?
      DOM.addClass(item, 'sc-selected')
      DOM.setText(@label, DOM.getText(item))
    else
      @label.innerHTML = '&nbsp;'


module.exports = Picker
