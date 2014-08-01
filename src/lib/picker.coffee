_          = require('lodash')
DOM        = require('./dom')
Normalizer = require('./normalizer')


class Picker
  @TEMPLATE: '<span class="ql-picker-label"></span><span class="ql-picker-options"></span>'

  constructor: (@select) ->
    @container = @select.ownerDocument.createElement('span')
    this.buildPicker()
    DOM.addClass(@container, 'ql-picker')
    @select.style.display = 'none'
    @select.parentNode.insertBefore(@container, @select)
    DOM.addEventListener(@select.ownerDocument, 'click', =>
      this.close()
      return true
    )
    DOM.addEventListener(@label, 'click', =>
      _.defer( =>
        DOM.toggleClass(@container, 'ql-expanded')
      )
    )
    DOM.addEventListener(@select, 'change', =>
      if @select.selectedIndex > -1
        item = @container.querySelectorAll('.ql-picker-item')[@select.selectedIndex]
        option = @select.options[@select.selectedIndex]
      this.selectItem(item, false)
      DOM.toggleClass(@label, 'ql-active', option != DOM.getDefaultOption(@select))
    )

  buildItem: (picker, option, index) ->
    item = @select.ownerDocument.createElement('span')
    item.setAttribute('data-value', option.getAttribute('value'))
    DOM.addClass(item, 'ql-picker-item')
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
    @label = @container.querySelector('.ql-picker-label')
    picker = @container.querySelector('.ql-picker-options')
    _.each(@select.options, (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )

  close: ->
    DOM.removeClass(@container, 'ql-expanded')

  selectItem: (item, trigger) ->
    selected = @container.querySelector('.ql-selected')
    DOM.removeClass(selected, 'ql-selected') if selected?
    if item?
      value = item.getAttribute('data-value')
      DOM.addClass(item, 'ql-selected')
      DOM.setText(@label, DOM.getText(item))
      DOM.selectOption(@select, value, trigger)
      @label.setAttribute('data-value', value)
    else
      @label.innerHTML = '&nbsp;'
      @label.removeAttribute('data-value')


module.exports = Picker
