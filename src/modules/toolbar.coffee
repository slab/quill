_                 = require('lodash')
ScribeDOM         = require('../dom')
ScribeKeyboard    = require('../keyboard')
ScribeRange       = require('../range')
ScribeLinkTooltip = require('./link-tooltip')
ScribeUtils       = require('../utils')


_findInput = (format) ->
  selector = ".sc-#{format}"
  if _.indexOf(ScribeToolbar.formats.SELECT, format) > -1
    selector = 'select' + selector
  input = @container.querySelector(selector)

_initFormats = ->
  _.each(ScribeToolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      input = _findInput.call(this, format)
      return unless input?
      @editor.logger.debug('Toolbar binding', format, input)
      return @editor.scribe.addModule('link-tooltip', { button: input }) if format == 'link'
      return if format == 'link'
      eventName = if formatGroup == 'SELECT' then 'change' else 'click'
      ScribeDOM.addEventListener(input, eventName, =>
        return if @triggering
        @editor.logger.debug('Toolbar event', eventName, format, input)
        value = if input.tagName == 'SELECT' then input.options[input.selectedIndex].value else !ScribeDOM.hasClass(input, 'sc-active')
        range = @editor.getSelection()
        if range?
          if ScribeUtils.isIE(8)
            @editor.root.focus()
            @editor.setSelection(range)
          range.format(format, value, { source: 'user' })
        activeFormats = {}
        activeFormats[format] = value
        this.updateActive(activeFormats)
        return false
      )
      ScribeDOM.addEventListener(input, 'mousedown', =>
        # Save selection before click is registered
        @editor.checkUpdate()
        # Prevent from losing focus, needed for bug in mobile Safari
        return false
      )
    )
  )
  _.each(['BOLD', 'ITALIC', 'UNDERLINE'], (key) =>
    @editor.keyboard.addHotkey(ScribeKeyboard.hotkeys[key], =>
      activeFormats = {}
      input = _findInput.call(this, key.toLowerCase())
      activeFormats[key.toLowerCase()] = !ScribeDOM.hasClass(input, 'sc-active') if input?
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
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
    _initFormats.call(this)
    @editor.on(@editor.constructor.events.POST_EVENT, (eventName) =>
      return unless eventName == @editor.constructor.events.TEXT_CHANGE or eventName == @editor.constructor.events.SELECTION_CHANGE
      this.updateActive()
    )

  updateActive: (activeFormats = {}) ->
    @triggering = true
    range = @editor.getSelection()
    _.each(@container.querySelectorAll('.sc-active'), (button) =>
      ScribeDOM.removeClass(button, 'sc-active')
    )
    _.each(@container.querySelectorAll('sc-select'), (select) =>
      ScribeDOM.resetSelect(select)
    )
    if range?
      _.each(_.extend(range.getFormats(), activeFormats), (value, key) =>
        if value
          elem = _findInput.call(this, key)
          return unless elem?
          if elem.tagName == 'SELECT'
            value = '' if _.isArray(value)
            elem.value = value
            ScribeDOM.triggerEvent(elem, 'change')
          else
            ScribeDOM.addClass(elem, 'sc-active')
      )
    @triggering = false



module.exports = ScribeToolbar
