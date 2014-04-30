Tooltip = require('./tooltip')


class ImageTooltip extends Tooltip
  constructor: ->
    # set styles and template

  initToolbar: ->
    @quill.onModuleLoad('toolbar', (toolbar) =>
      toolbar.initFormat(@button, 'click', (range, value) ->
        if value
          this.show()
        else
          @quill.deleteText(range, 'user')
      )
    )


module.exports = ImageTooltip
