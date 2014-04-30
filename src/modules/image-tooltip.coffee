_       = require('lodash')
DOM     = require('../dom')
Tooltip = require('./tooltip')


class ImageTooltip extends Tooltip
  @DEFAULTS:
    styles: {}
    template:
     '<input class="input" type="text">
      <span>&nbsp;&#45;&nbsp;</span>
      <a href="javascript:;" class="cancel">Cancel</a>
      <a href="javascript:;" class="done">Done</a>'

  constructor: (@quill, @editorContainer, @options) ->
    @options.styles = _.defaults(@options.styles, Tooltip.DEFAULTS.styles)
    @options = _.defaults(@options, Tooltip.DEFAULTS)
    super(@quill, @editorContainer, @options)
    @textbox = @container.querySelector('.input')
    DOM.addClass(@container, 'image-tooltip-container')
    this.initToolbar()
    DOM.addEventListener(@container.querySelector('.done'), 'click', =>
      url = this._normalizeURL(@textbox.value)
      if @range
        @quill.insertEmbed(@range.end, 'image', url, 'user')
        @quill.setSelection(@range.end + 1, @range.end + 1)
      @textbox.value = ''
      this.hide()
    )
    DOM.addEventListener(@container.querySelector('.cancel'), 'click', _.bind(this.hide, this))

  initToolbar: ->
    @quill.onModuleLoad('toolbar', (toolbar) =>
      toolbar.initFormat('image', 'click', (range, value) =>
        if value
          this.show()
          @textbox.focus()
          _.defer( =>
            @textbox.setSelectionRange(@textbox.value.length, @textbox.value.length)
          )
        else
          @quill.deleteText(range, 'user')
      )
    )

  _normalizeURL: (url) ->
    # For now identical to link-tooltip but will change when we allow data uri
    url = 'http://' + url unless /^https?:\/\//.test(url)
    return url


module.exports = ImageTooltip
