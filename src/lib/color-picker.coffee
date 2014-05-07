DOM    = require('../dom')
Picker = require('./picker')


class ColorPicker extends Picker
  constructor: ->
    super
    DOM.addClass(@container, 'sc-color-picker')
    DOM.addClass(@container.querySelector('.sc-picker-label'), 'sc-format-button')

  buildItem: (picker, option, index) ->
    item = super(picker, option, index)
    item.style.backgroundColor = option.value
    return item


module.exports = ColorPicker
