class Picker
  @TEMPLATE: '<span class="ql-picker-label"></span><span class="ql-picker-options"></span>'

  constructor: (@select) ->
    @container = document.createElement('span')
    this.buildPicker()
    @container.classList.add('ql-picker')
    @select.style.display = 'none'
    @select.parentNode.insertBefore(@container, @select)
    document.body.addEventListener('click', (e) =>
      this.close() if e.target != @label
    )
    @label.addEventListener('click', =>
      @container.classList.toggle('ql-expanded')
    )
    @select.addEventListener('change', =>
      if @select.selectedIndex > -1
        item = @container.querySelectorAll('.ql-picker-item')[@select.selectedIndex]
        option = @select.options[@select.selectedIndex]
      this.selectItem(item, false)
      active = option != @select.querySelector('option[selected]')
      if @label.classList.contains('ql-active') != active
        @label.classList.toggle('ql-active')
    )

  buildItem: (picker, option, index) ->
    item = document.createElement('span')
    item.setAttribute('data-value', option.getAttribute('value'))
    item.classList.add('ql-picker-item')
    item.textContent = option.textContent
    item.addEventListener('click', =>
      this.selectItem(item, true)
      this.close()
    )
    return item

  buildPicker: ->
    [].slice.call(@select.attributes).forEach((item) =>
      @container.setAttribute(item.name, item.value)
    )
    @container.innerHTML = Picker.TEMPLATE
    @label = @container.querySelector('.ql-picker-label')
    picker = @container.querySelector('.ql-picker-options')
    [].slice.call(@select.options).forEach((option, i) =>
      item = this.buildItem(picker, option, i)
      picker.appendChild(item)
      this.selectItem(item, false) if @select.selectedIndex == i
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
      @select.selectedIndex = [].indexOf.call(item.parentNode.children, item)
      @label.setAttribute('data-value', value)
      @select.dispatchEvent(new Event('change')) if trigger
    else
      @label.innerHTML = '&nbsp;'
      @label.removeAttribute('data-value')


module.exports = Picker
