_     = require('lodash')
DOM   = require('../dom')
Utils = require('../utils')


_findInput = (format) ->
  selector = ".sc-#{format}"
  if _.indexOf(Toolbar.formats.SELECT, format) > -1
    selector = 'select' + selector
  input = @container.querySelector(selector)

_initFormats = ->
  _.each(Toolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      this.initFormat(format, formatGroup)
    )
  )

class Toolbar
  @DEFAULTS:
    container: null

  @formats:
    BUTTON: ['bold', 'italic', 'strike', 'underline', 'link']
    SELECT: ['background', 'color', 'font', 'size']

  constructor: (@quill, @editorContainer, @options) ->
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
    _initFormats.call(this)
    @quill.on(@quill.constructor.events.POST_EVENT, (eventName) =>
      return unless eventName == @quill.constructor.events.TEXT_CHANGE or eventName == @quill.constructor.events.SELECTION_CHANGE
      this.updateActive()
    )
    _.defer(_.bind(DOM.addClass, this, @container, 'sc-toolbar-container'))
    @quill.onModuleLoad('keyboard', (keyboard) =>
      _.each(['BOLD', 'ITALIC', 'UNDERLINE'], (key) =>
        keyboard.addHotkey(keyboard.constructor.hotkeys[key], =>
          activeFormats = {}
          input = _findInput.call(this, key.toLowerCase())
          activeFormats[key.toLowerCase()] = DOM.hasClass(input, 'sc-active') if input?
          this.updateActive(activeFormats)
        )
      )
    )

  initFormat: (format, group) ->
    input = _findInput.call(this, format)
    return unless input?
    if format == 'link' then return @quill.addModule('link-tooltip', { button: input })
    eventName = if group == 'SELECT' then 'change' else 'click'
    DOM.addEventListener(input, eventName, =>
      return if @triggering
      value = if input.tagName == 'SELECT' then input.options[input.selectedIndex].value else !DOM.hasClass(input, 'sc-active')
      range = @quill.getSelection()
      if range?
        if Utils.isIE(8)
          @editorContainer.focus()
          @quill.setSelection(range)
        if range.isCollapsed()
          @quill.setFormat(format, value)
        else
          @quill.formatText(range, format, value, { source: 'user' })
      activeFormats = {}
      activeFormats[format] = value
      this.updateActive(activeFormats)
      return false
    )
    DOM.addEventListener(input, 'mousedown', =>
      # Save selection before click is registered
      @quill.editor.checkUpdate()
      return true
    )

  updateActive: (activeFormats = {}) ->
    @triggering = true
    range = @quill.getSelection()
    _.each(@container.querySelectorAll('select'), _.bind(DOM.resetSelect))
    _.each(@container.querySelectorAll('.sc-active'), (button) =>
      DOM.removeClass(button, 'sc-active')
    )
    if range?
      _.each(_.extend(range.getFormats(), activeFormats), (value, key) =>
        if value
          elem = _findInput.call(this, key)
          return unless elem?
          if elem.tagName == 'SELECT'
            value = '' if _.isArray(value)
            elem.value = value
            DOM.triggerEvent(elem, 'change')
          else
            DOM.addClass(elem, 'sc-active')
      )
    @triggering = false


module.exports = Toolbar
