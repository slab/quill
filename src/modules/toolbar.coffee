_     = require('lodash')
DOM   = require('../dom')
Utils = require('../utils')


class Toolbar
  @DEFAULTS:
    container: null

  @formats:
    BUTTON: { 'bold', 'italic', 'strike', 'underline' }
    SELECT: { 'align', 'background', 'color', 'font', 'size' }

  constructor: (@quill, @editorContainer, @options) ->
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
    @activeFormats = {}
    _.each(@quill.options.formats, (format) =>
      if Toolbar.formats.BUTTON[format]?
        this.initFormat(format, 'click')
      else if Toolbar.formats.SELECT[format]?
        this.initFormat(format, 'change')
    )
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, _.bind(this.updateActive, this))
    DOM.addClass(@container, 'sc-toolbar-container')

  initFormat: (format, eventName) ->
    input = this._getInput(format)
    return unless input?
    triggering = false
    DOM.addEventListener(input, eventName, =>
      return if triggering
      triggering = true
      value = if eventName == 'change' then input.options[input.selectedIndex].value else !DOM.hasClass(input, 'sc-active')
      @quill.focus()
      range = @quill.getSelection()
      if range?
        if range.isCollapsed()
          @quill.prepareFormat(format, value)
        else
          @quill.formatText(range, format, value, 'user')
      this.setActive(format, value)
      triggering = false
      return false
    )

  setActive: (format, value) ->
    if value
      @activeFormats[format] = value
    else
      delete @activeFormats[format]
    input = this._getInput(format)
    return unless input?
    if input.tagName == 'SELECT'
      if value
        value = '' if _.isArray(value)
        DOM.selectOption(input, value)
      else
        DOM.resetSelect(input, false)
    else
      DOM.toggleClass(input, 'sc-active', value)

  updateActive: (range) ->
    activeFormats = this._getActive(range)
    _.each(_.keys(@activeFormats), (name) =>
      if activeFormats[name]?
        this.setActive(name, activeFormats[name]) if activeFormats[name] != @activeFormats[name]
      else
        this.setActive(name, false)
    )
    _.each(activeFormats, (value, name) =>
      this.setActive(name, value) unless @activeFormats[name]?
    )

  _getInput: (format) ->
    selector = ".sc-#{format}"
    if _.indexOf(Toolbar.formats.SELECT, format) > -1
      selector = 'select' + selector
    input = @container.querySelector(selector)

  _getActive: (range) ->
    if range?
      if range.isCollapsed()
        contents = @quill.getContents(range)
      else
        index = Math.max(0, range.start - 1)
        contents = @quill.getContents(index, index)
      formatsArr = _.pluck(contents, 'attributes')
      activeFormats = formatsArr[0] or {}
      _.each(formatsArr.slice(1), (formats) ->
        _.each(_.keys(activeFormats), (name) ->
          if formats[name]
            if _.isArray(activeFormats[name])
              activeFormats[name].push(formats[name]) if _.indexOf(activeFormats[name], formats[name]) > -1
            else if activeFormats[name] != formats[name]
              activeFormats[name] = [activeFormats[name], formats[name]]
          else
            delete activeFormats[name]
        )
        return _.keys(activeFormats).length > 0
      )
      return activeFormats
    else
      return {}


module.exports = Toolbar
