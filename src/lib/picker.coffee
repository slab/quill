_          = require('lodash')
DOM        = require('../dom')
Normalizer = require('../normalizer')


class Picker
  @TEMPLATE: '<span class="sc-picker-label"></span><span class="sc-picker-options"></span>'

  constructor: (@select) ->
    @container = @select.ownerDocument.createElement('span')
    this.buildPicker()
    DOM.addClass(@container, 'sc-picker')
    @select.style.display = 'none'
    @select.parentNode.insertBefore(@container, @select)
    DOM.addEventListener(@select.ownerDocument, 'click', =>
      this.close()
      return true
    )
    DOM.addEventListener(@label, 'click', =>
      _.defer( =>
        DOM.toggleClass(@container, 'sc-expanded')
      )
    )
    DOM.addEventListener(@select, 'change', =>
      if @select.selectedIndex > -1
        item = @container.querySelectorAll('.sc-picker-item')[@select.selectedIndex]
        option = @select.options[@select.selectedIndex]
      this.selectItem(item, false)
      DOM.toggleClass(@label, 'sc-active', option != DOM.getDefaultOption(@select))
    )

  buildItem: (picker, option, index) ->
    item = @select.ownerDocument.createElement('span')
    item.setAttribute('data-value', option.getAttribute('value'))
    DOM.addClass(item, 'sc-picker-item')
    DOM.setText(item, DOM.getText(option))
    this.selectItem(item, false) if @select.selectedIndex == index
    DOM.addEventListener(item, 'click', =>
      this.selectItem(item, true)
      this.close()
    )
    return item

  buildPicker: ->
    _.each(DOM.getAttributes(@select), (value, name) =>
      @container.setAttribute(name, value)
    )
    @container.innerHTML = Normalizer.stripWhitespace(Picker.TEMPLATE)
    @label = @container.querySelector('.sc-picker-label')
    picker = @container.querySelector('.sc-picker-options')
    _.each(@select.options, (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )

  close: ->
    DOM.removeClass(@container, 'sc-expanded')

  selectItem: (item, trigger) ->
    selected = @container.querySelector('.sc-selected')
    DOM.removeClass(selected, 'sc-selected') if selected?
    if item?
      value = item.getAttribute('data-value')
      DOM.addClass(item, 'sc-selected')
      DOM.setText(@label, DOM.getText(item))
      DOM.selectOption(@select, value, trigger)
      @label.setAttribute('data-value', value)
    else
      @label.innerHTML = '&nbsp;'
      @label.removeAttribute('data-value')


module.exports = Picker
