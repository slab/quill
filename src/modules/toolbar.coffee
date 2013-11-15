ScribeDOM         = require('../dom')
ScribeKeyboard    = require('../keyboard')
ScribeRange       = require('../range')
ScribeLinkTooltip = require('./link-tooltip')
ScribeUtils       = require('../utils')


_findInput = (format) ->
  selector = ".#{format}"
  if _.indexOf(ScribeToolbar.formats.SELECT, format) > -1
    selector = 'select' + selector
  input = @container.querySelector(selector)

_initFormats = ->
  _.each(ScribeToolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      input = _findInput.call(this, format)
      return unless input?
      return @editor.theme.addModule('link-tooltip', { button: input }) if format == 'link'
      return if format == 'link'
      eventName = if formatGroup == 'SELECT' then 'change' else 'click'
      ScribeDOM.addEventListener(input, eventName, =>
        return if @triggering
        value = if input.tagName == 'SELECT' then input.options[input.selectedIndex].value else !ScribeDOM.hasClass(input, 'active')
        range = @editor.getSelection()
        if range
          @editor.root.focus()
          @editor.setSelection(range) if ScribeUtils.isIE(9)
          range.format(format, value, { source: 'user' })
        activeFormats = {}
        activeFormats[format] = value
        this.updateActive(activeFormats)
      )
    )
  )
  _.each(['BOLD', 'ITALIC', 'UNDERLINE'], (key) =>
    @editor.keyboard.addHotkey(ScribeKeyboard.hotkeys[key], =>
      activeFormats = {}
      input = _findInput.call(this, key.toLowerCase())
      activeFormats[key.toLowerCase()] = !ScribeDOM.hasClass(input, 'active') if input?
      this.updateActive(activeFormats)
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
    _initFormats.call(this)
    @editor.on(@editor.constructor.events.POST_EVENT, (eventName) =>
      return unless eventName == @editor.constructor.events.API_TEXT_CHANGE or eventName == @editor.constructor.events.USER_TEXT_CHANGE or eventName == @editor.constructor.events.SELECTION_CHANGE
      this.updateActive()
    )

  updateActive: (activeFormats = {}) ->
    @triggering = true
    range = @editor.getSelection()
    _.each(@container.querySelectorAll('.active'), (button) =>
      ScribeDOM.removeClass(button, 'active')
    )
    _.each(@container.querySelectorAll('select'), (select) =>
      ScribeDOM.resetSelect(select)
    )
    return unless range?
    _.each(_.extend(range.getFormats(), activeFormats), (value, key) =>
      if value
        elem = _findInput.call(this, key)
        return unless elem?
        if elem.tagName == 'SELECT'
          value = '' if _.isArray(value)
          elem.value = value
          ScribeDOM.triggerEvent(elem, 'change')
        else
          ScribeDOM.addClass(elem, 'active')
    )
    @triggering = false



module.exports = ScribeToolbar
