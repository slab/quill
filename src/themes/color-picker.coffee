ScribePicker = require('./picker')


class ScribeColorPicker extends ScribePicker
  constructor: ->
    super
    Scribe.DOM.addClass(@container, 'color-picker')

  buildItem: (picker, option, index) ->
    item = super(picker, option, index)
    item.style.backgroundColor = option.value
    Scribe.DOM.setText(item, '')
    return item


module.exports = ScribeColorPicker
