DOM    = require('../dom')
Picker = require('./picker')


class ColorPicker extends Picker
  constructor: ->
    super
    DOM.addClass(@container, 'sc-color-picker')

  buildItem: (picker, option, index) ->
    item = super(picker, option, index)
    item.style.backgroundColor = option.value
    DOM.setText(item, '')
    return item

  selectItem: (item, option, trigger) ->
    super(item, option, trigger)
    @label.innerHTML = ''


module.exports = ColorPicker
