_          = require('lodash')
DOM        = require('../dom')
Normalizer = require('../normalizer')


class Picker
  @TEMPLATE: '
    <div class="sc-picker-label"></div>
    <div class="sc-picker-options"></div>'

  constructor: (@select) ->
    @container = @select.ownerDocument.createElement('div')
    this.buildPicker()
    DOM.addClass(@container, 'sc-picker')
    @select.style.display = 'none'
    @select.parentNode.insertBefore(@container, @select)
    DOM.addEventListener(@select.ownerDocument, 'click', _.bind(this.close, this))
    DOM.addEventListener(@label, 'click', =>
      DOM.toggleClass(@container, 'sc-expanded')
      return false    # Avoid document click handler that closes all dropdowns
    )
    DOM.addEventListener(@select, 'change', =>
      if @select.selectedIndex > -1
        item = @container.querySelectorAll('.sc-picker-item')[@select.selectedIndex]
        option = @select.options[@select.selectedIndex]
      this.selectItem(item, option, false)
      DOM.toggleClass(@label, 'sc-active', option != DOM.getDefaultOption(@select))
    )

  buildItem: (picker, option, index) ->
    item = @select.ownerDocument.createElement('div')
    DOM.addClass(item, 'sc-picker-item')
    DOM.setText(item, DOM.getText(option))
    this.selectItem(item, option, false) if @select.selectedIndex == index
    DOM.addEventListener(item, 'click', =>
      this.selectItem(item, option, true)
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

  selectItem: (item, option, trigger) ->
    selected = @container.querySelector('.sc-selected')
    DOM.removeClass(selected, 'sc-selected') if selected?
    if item?
      DOM.addClass(item, 'sc-selected')
      DOM.setText(@label, DOM.getText(item))
      DOM.selectOption(@select, option, trigger)
    else
      @label.innerHTML = '&nbsp;'


module.exports = Picker
