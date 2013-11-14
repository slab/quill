ScribeDOM    = require('../dom')
ScribePicker = require('./picker')


class ScribeColorPicker extends ScribePicker
  constructor: ->
    super
    ScribeDOM.addClass(@container, 'color-picker')

  buildItem: (picker, option, index) ->
    item = super(picker, option, index)
    item.style.backgroundColor = option.value
    ScribeDOM.setText(item, '')
    return item

  selectItem: (item) ->
    super(item)
    @label.innerHTML = ''


module.exports = ScribeColorPicker
