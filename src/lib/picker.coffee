_          = require('lodash')
dom        = require('./dom')


class Picker
  @TEMPLATE: '<span class="ql-picker-label"></span><span class="ql-picker-options"></span>'

  constructor: (@select) ->
    @container = document.createElement('span')
    this.buildPicker()
    @container.classList.add('ql-picker')
    @select.style.display = 'none'
    @select.parentNode.insertBefore(@container, @select)
    dom(document).on('click', =>
      this.close()
      return true
    )
    dom(@label).on('click', =>
      _.defer( =>
        @container.classList.toggle('ql-expanded')
      )
      return false
    )
    dom(@select).on('change', =>
      if @select.selectedIndex > -1
        item = @container.querySelectorAll('.ql-picker-item')[@select.selectedIndex]
        option = @select.options[@select.selectedIndex]
      this.selectItem(item, false)
      active = option != dom(@select).default()
      if @label.classList.contains('ql-active') != active
        @label.classList.toggle('ql-active')
    )

  buildItem: (picker, option, index) ->
    item = document.createElement('span')
    item.setAttribute('data-value', option.getAttribute('value'))
    item.classList.add('ql-picker-item')
    item.textContent = option.textContent
    dom(item).on('click', =>
      this.selectItem(item, true)
      this.close()
    )
    this.selectItem(item, false) if @select.selectedIndex == index
    return item

  buildPicker: ->
    _.each(dom(@select).attributes(), (value, name) =>
      @container.setAttribute(name, value)
    )
    @container.innerHTML = Picker.TEMPLATE
    @label = @container.querySelector('.ql-picker-label')
    picker = @container.querySelector('.ql-picker-options')
    _.each(@select.options, (option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
    )

  close: ->
    @container.classList.remove('ql-expanded')

  selectItem: (item, trigger) ->
    selected = @container.querySelector('.ql-selected')
    selected.classList.remove('ql-selected') if selected?
    if item?
      value = item.getAttribute('data-value')
      item.classList.add('ql-selected')
      @label.textContent = item.textContent
      dom(@select).option(value, trigger)
      @label.setAttribute('data-value', value)
    else
      @label.innerHTML = '&nbsp;'
      @label.removeAttribute('data-value')


module.exports = Picker
