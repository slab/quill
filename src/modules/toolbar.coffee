ScribeDOM         = require('../dom')
ScribeRange       = require('../range')
#ScribeLinkTooltip = require('./link-tooltip')


initFormats = ->
  _.each(ScribeToolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      input = @container.querySelector(".#{format}")
      if input? and input.tagName != 'SELECT' and formatGroup == 'SELECT'
        input = input.querySelector('select')
      return unless input?
      #return new ScribeLinkTooltip(input, this) if format == 'link'
      return if format == 'link'
      eventName = if formatGroup == 'SELECT' then 'change' else 'click'
      ScribeDOM.addEventListener(input, eventName, =>
        value = if input.tagName == 'SELECT' then input.options[input.selectedIndex].value else !ScribeDOM.hasClass(input, 'active')
        @editor.root.focus()
        range = @editor.getSelection()
        if range
          range.format(format, value, { source: 'user' })
          @editor.emit(@editor.constructor.events.PREFORMAT, format, value)
        this.update()
      )
    )
  )


class ScribeToolbar
  @DEFAULTS:
    container: null     # required

  @formats:
    BUTTON: ['bold', 'italic', 'strike', 'underline', 'link', 'indent', 'outdent']
    SELECT: ['back-color', 'fore-color', 'font-name', 'font-size']

  constructor: (@editor, options = {}) ->
    @options = _.defaults(options, ScribeToolbar.DEFAULTS)
    @container = if _.isString(@options.container) then document.getElementById(@options.container) else @options.container
    initFormats.call(this)
    @editor.on(@editor.constructor.events.POST_EVENT, (eventName) =>
      return unless eventName == @editor.constructor.events.API_TEXT_CHANGE or eventName == @editor.constructor.events.USER_TEXT_CHANGE or eventName == @editor.constructor.events.SELECTION_CHANGE
      this.update()
    )
    @editor.on(@editor.constructor.events.PREFORMAT, (format, value) =>
      if value == true
        ScribeDOM.addClass(@container.querySelector(".#{format}"), 'active')
      else if value == false
        ScribeDOM.removeClass(@container.querySelector(".#{format}"), 'active')
      # Non-boolean values implies SELECT input instead of BUTTON
    )

  update: ->
    range = @editor.getSelection()
    _.each(@container.querySelectorAll('.active'), (button) =>
      ScribeDOM.removeClass(button, 'active')
    )
    _.each(@container.querySelectorAll('select'), (select) =>
      ScribeDOM.resetSelect(select)
    )
    return unless range?
    _.each(range.getFormats(), (value, key) =>
      if value?
        elem = @container.querySelector(".#{key}")
        return unless elem?
        if elem.tagName == 'SELECT'
          value = '' if _.isArray(value)
          elem.value = value
        else
          ScribeDOM.addClass(elem, 'active')
    )



module.exports = ScribeToolbar
