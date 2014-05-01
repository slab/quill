_     = require('lodash')
DOM   = require('../dom')
Utils = require('../utils')


class Toolbar
  @DEFAULTS:
    container: null

  @formats:
    BUTTON: { 'bold', 'image', 'italic', 'link', 'strike', 'underline' }
    SELECT: { 'align', 'background', 'color', 'font', 'size' }
    TOOLTIP: { 'image', 'link' }

  constructor: (@quill, @options) ->
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
    @activeFormats = {}
    _.each(@quill.options.formats, (format) =>
      return if Toolbar.formats.TOOLTIP[format]?
      eventName = if Toolbar.formats.SELECT[format]? then 'change' else 'click'
      this.initFormat(format, eventName, (range, value) =>
        if range.isCollapsed()
          @quill.prepareFormat(format, value)
        else
          @quill.formatText(range, format, value, 'user')
        this.setActive(format, value)
      )
    )
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, _.bind(this.updateActive, this))
    DOM.addClass(@container, 'sc-toolbar-container')

  initFormat: (format, eventName, callback) ->
    input = @container.querySelector(".sc-#{format}")
    return unless input?
    triggering = false
    DOM.addEventListener(input, eventName, =>
      return if triggering
      triggering = true
      value = if eventName == 'change' then DOM.getSelectValue(input) else !DOM.hasClass(input, 'sc-active')
      @quill.focus()
      range = @quill.getSelection()
      callback(range, value) if range?
      triggering = false
      return true
    )

  setActive: (format, value) ->
    if value
      @activeFormats[format] = value
    else
      delete @activeFormats[format]
    input = @container.querySelector(".sc-#{format}")
    return unless input?
    if input.tagName == 'SELECT'
      if value
        value = '' if _.isArray(value)
        DOM.selectOption(input, value, false)
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

  _getActive: (range) ->
    if range?
      if range.isCollapsed()
        start = Math.max(0, range.start - 1)
        contents = @quill.getContents(start, range.end)
      else
        contents = @quill.getContents(range)
      formatsArr = _.map(contents.ops, 'attributes')
      return this._intersectFormats(formatsArr)
    else
      return {}

  _intersectFormats: (formatsArr) ->
    return _.reduce(formatsArr.slice(1), (activeFormats, formats) ->
      activeKeys = _.keys(activeFormats)
      formatKeys = _.keys(formats)
      intersection = _.intersection(activeKeys, formatKeys)
      missing = _.difference(activeKeys, formatKeys)
      added = _.difference(formatKeys, activeKeys)
      _.each(intersection, (name) ->
        if Toolbar.formats.SELECT[name]?
          if _.isArray(activeFormats[name])
            activeFormats[name].push(formats[name]) if _.indexOf(activeFormats[name], formats[name]) < 0
          else if activeFormats[name] != formats[name]
            activeFormats[name] = [activeFormats[name], formats[name]]
      )
      _.each(missing, (name) ->
        if Toolbar.formats.BUTTON[name]?
          delete activeFormats[name]
        else if Toolbar.formats.SELECT[name]? and !_.isArray(activeFormats[name])
          activeFormats[name] = [activeFormats[name]]
      )
      _.each(added, (name) ->
        activeFormats[name] = [formats[name]] if Toolbar.formats.SELECT[name]?
      )
      return activeFormats
    , formatsArr[0] or {})


module.exports = Toolbar
