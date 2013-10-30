ScribeDOM = require('../dom')

buildPalette = (select) ->
  palette = select.ownerDocument.createElement('div')
  ScribeDOM.addClass(palette, 'color-palette')
  _.each(select.querySelectorAll('option'), (option, i) ->
    color = select.ownerDocument.createElement('span')
    color.style.backgroundColor = option.getAttribute('value')
    ScribeDOM.addClass(color, 'color')
    ScribeDOM.addEventListener(color, 'click', ->
      _.each(palette.querySelectorAll('.active'), (activeColor) ->
        ScribeDOM.removeClass(activeColor, 'active')
      )
      ScribeDOM.addClass(color, 'active')
      select.selectedIndex = i
      ScribeDOM.triggerEvent(select, 'change', false, true)
      return false
    )
    palette.appendChild(color)
  )
  select.parentNode.insertBefore(palette, select)
  select.style.display = 'none'
  return palette


ScribeColorPicker =
  init: (container) ->
    container.style.position = 'relative'
    select = container.querySelector('select')
    palette = buildPalette(select)
    ScribeDOM.addEventListener(container, 'click', ->
      ScribeDOM.toggleClass(palette, 'active')
    )
    ScribeDOM.addEventListener(palette, 'blur', ->
      ScribeDOM.removeClass(palette, 'active')
    )
    ScribeDOM.addEventListener(select, 'change', ->
      if select.selectedIndex != 0
        ScribeDOM.addClass(container, 'active')
      else
        ScribeDOM.removeClass(container, 'active')
      ScribeDOM.triggerEvent(palette, 'blur', true, true)
    )


module.exports = ScribeColorPicker
