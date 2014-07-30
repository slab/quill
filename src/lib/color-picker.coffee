DOM    = require('../core/dom')
Picker = require('./picker')


class ColorPicker extends Picker
  constructor: ->
    super
    DOM.addClass(@container, 'ql-color-picker')

  buildItem: (picker, option, index) ->
    item = super(picker, option, index)
    item.style.backgroundColor = option.value
    return item


module.exports = ColorPicker
