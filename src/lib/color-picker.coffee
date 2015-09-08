Picker = require('./picker')


class ColorPicker extends Picker
  constructor: ->
    super
    @container.classList.add('ql-color-picker')

  buildItem: (picker, option, index) ->
    item = super(picker, option, index)
    item.style.backgroundColor = option.value
    return item


module.exports = ColorPicker
