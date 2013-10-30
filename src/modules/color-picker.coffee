ScribeDOM = require('../dom')

buildPalette = (select) ->
  palette = select.ownerDocument.createElement('div')
  ScribeDOM.addClass(palette, 'color-palette')
  _.each(select.querySelectorAll('option'), (option) ->
    color = select.ownerDocument.createElement('span')
    color.style.backgroundColor = option.getAttribute('value')
    ScribeDOM.addClass(color, 'color')
    ScribeDOM.addEventListener(color, 'click', ->
      _.each(palette.querySelectorAll('.active'), (activeColor) ->
        ScribeDOM.removeClass(activeColor, 'active')
      )
      ScribeDOM.addClass(color, 'active')
    )
    palette.appendChild(color)
  )
  select.parentNode.insertBefore(palette, select)
  select.style.display = 'none'
  return palette


ScribeColorPicker =
  init: (container) ->
    container.style.position = 'relative'
    palette = buildPalette(container.querySelector('select'))
    ScribeDOM.addEventListener(palette, 'blur', ->
      ScribeDOM.removeClass(palette, 'active')
    )
    ScribeDOM.addEventListener(container, 'click', ->
      ScribeDOM.toggleClass(palette, 'active')
    )


module.exports = ScribeColorPicker
