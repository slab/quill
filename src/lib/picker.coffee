_          = require('lodash')
dom        = require('./dom')
Normalizer = require('./normalizer')


class Picker
  @TEMPLATE: '<span class="ql-picker-label"></span><span class="ql-picker-options"></span>'

  constructor: (@select) ->
    @container = document.createElement('span')
    this.buildPicker()
    dom(@container).addClass('ql-picker')
    @select.style.display = 'none'
    @select.parentNode.insertBefore(@container, @select)
    dom(document).on('click', =>
      this.close()
      return true
    )
    dom(@label).on('click', =>
      _.defer( =>
        dom(@container).toggleClass('ql-expanded')
      )
      return false
    )
    dom(@select).on('change', =>
      if @select.selectedIndex > -1
        item = @container.querySelectorAll('.ql-picker-item')[@select.selectedIndex]
        option = @select.options[@select.selectedIndex]
      this.selectItem(item, false)
      dom(@label).toggleClass('ql-active', option != dom(@select).default())
    )

  buildItem: (picker, option, index) ->
    item = document.createElement('span')
    item.setAttribute('data-value', option.getAttribute('value'))
    dom(item).addClass('ql-picker-item').text(dom(option).text()).on('click', =>
      this.selectItem(item, true)
      this.close()
    )
    this.selectItem(item, false) if @select.selectedIndex == index
    return item

  buildPicker: ->
    _.each(dom(@select).attributes(), (value, name) =>
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
    dom(@container).removeClass('ql-expanded')

  selectItem: (item, trigger) ->
    selected = @container.querySelector('.ql-selected')
    dom(selected).removeClass('ql-selected') if selected?
    if item?
      value = item.getAttribute('data-value')
      dom(item).addClass('ql-selected')
      dom(@label).text(dom(item).text())
      dom(@select).option(value, trigger)
      @label.setAttribute('data-value', value)
    else
      @label.innerHTML = '&nbsp;'
      @label.removeAttribute('data-value')


module.exports = Picker
