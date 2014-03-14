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
      this.initFormat(format, formatGroup)
    )
  )

class ScribeToolbar
  @DEFAULTS:
    container: null

  @formats:
    BUTTON: ['bold', 'italic', 'strike', 'underline', 'indent', 'outdent']
    SELECT: ['back-color', 'fore-color', 'font-name', 'font-size']

  constructor: (@scribe, @editorContainer, @options) ->
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
    _initFormats.call(this)
    @scribe.editor.on(@scribe.editor.constructor.events.POST_EVENT, (eventName) =>
      return unless eventName == @scribe.editor.constructor.events.TEXT_CHANGE or eventName == @scribe.editor.constructor.events.SELECTION_CHANGE
      this.updateActive()
    )
    _.defer(ScribeDOM.addClass.bind(this, @container, 'sc-toolbar-container'))
    _.each(['BOLD', 'ITALIC', 'UNDERLINE'], (key) =>
      @scribe.editor.keyboard.addHotkey(ScribeKeyboard.hotkeys[key], =>
        activeFormats = {}
        input = _findInput.call(this, key.toLowerCase())
        activeFormats[key.toLowerCase()] = !ScribeDOM.hasClass(input, 'sc-active') if input?
        this.updateActive(activeFormats)
      )
    )

  initFormat: (format, group) ->
    input = _findInput.call(this, format)
    return unless input?
    @scribe.editor.logger.debug('Toolbar binding', format, input)
    return @scribe.addModule('link-tooltip', { button: input }) if format == 'link'
    eventName = if group == 'SELECT' then 'change' else 'click'
    ScribeDOM.addEventListener(input, eventName, =>
      return if @triggering
      @scribe.editor.logger.debug('Toolbar event', eventName, format, input)
      value = if input.tagName == 'SELECT' then input.options[input.selectedIndex].value else !ScribeDOM.hasClass(input, 'sc-active')
      range = @scribe.editor.getSelection()
      if range?
        if ScribeUtils.isIE(8)
          @editorContainer.focus()
          @scribe.editor.setSelection(range)
        range.format(format, value, { source: 'user' })
      activeFormats = {}
      activeFormats[format] = value
      this.updateActive(activeFormats)
      return false
    )
    ScribeDOM.addEventListener(input, 'mousedown', =>
      # Save selection before click is registered
      @scribe.editor.checkUpdate()
      return true
    )

  updateActive: (activeFormats = {}) ->
    @triggering = true
    range = @scribe.editor.getSelection()
    _.each(@container.querySelectorAll('select'), ScribeDOM.resetSelect.bind(this))
    _.each(@container.querySelectorAll('.sc-active'), (button) =>
      ScribeDOM.removeClass(button, 'sc-active')
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
