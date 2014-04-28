_     = require('lodash')
DOM   = require('../dom')
Utils = require('../utils')


class Toolbar
  @DEFAULTS:
    container: null

  @formats:
    BUTTON: {'bold', 'italic', 'strike', 'underline'}
    SELECT: {'align', 'background', 'color', 'font', 'size'}

  constructor: (@quill, @editorContainer, @options) ->
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
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
    DOM.addEventListener(input, eventName, =>
      value = if eventName == 'change' then input.options[input.selectedIndex].value else !DOM.hasClass(input, 'sc-active')
      @quill.focus()
      range = @quill.getSelection()
      if range?
        if range.isCollapsed()
          @quill.prepareFormat(format, value)
        else
          @quill.formatText(range, format, value, 'user')
      this.setActive(input, value)
      return false
    )

  setActive: (input, value) ->
    if input.tagName == 'SELECT'
      value = '' if _.isArray(value)
      input.value = value
    else
      DOM.addClass(input, 'sc-active')

  updateActive: (range) ->
    return
    activeFormats = this._getActive(range)
    _.each(@container.querySelectorAll('select'), _.bind(DOM.resetSelect))
    _.each(@container.querySelectorAll('.sc-active'), (button) =>
      DOM.removeClass(button, 'sc-active')
    )
    _.each(activeFormats, (value, key) =>
      return unless value
      input = this._getInput(key)
      return unless input?
      this.setActive(input, value)
    )

  _getInput: (format) ->
    selector = ".sc-#{format}"
    if _.indexOf(Toolbar.formats.SELECT, format) > -1
      selector = 'select' + selector
    input = @container.querySelector(selector)

  _getActive: (range) ->
    if range?
      contents = @quill.getContents(range)
      formatsArr = _.pluck(contents, 'attributes')
      return {} unless formatsArr.length > 0
      activeFormats = formatsArr[0]
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
