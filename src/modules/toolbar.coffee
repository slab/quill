Quill = require('../quill')
_     = Quill.require('lodash')
dom   = Quill.require('dom')


class Toolbar
  @DEFAULTS:
    container: null

  @formats:
    LINE    : { 'align', 'bullet', 'list' }
    SELECT  : { 'align', 'background', 'color', 'font', 'size' }
    TOGGLE  : { 'bold', 'bullet', 'image', 'italic', 'link', 'list', 'strike', 'underline' }
    TOOLTIP : { 'image', 'link' }

  constructor: (@quill, @options) ->
    @options = { container: @options } if _.isString(@options) or _.isElement(@options)
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
    @inputs = {}
    @preventUpdate = false
    @triggering = false
    _.each(@quill.options.formats, (name) =>
      return if Toolbar.formats.TOOLTIP[name]?
      this.initFormat(name, _.bind(this._applyFormat, this, name))
    )
    @quill.on(Quill.events.FORMAT_INIT, (name) =>
      return if Toolbar.formats.TOOLTIP[name]?
      this.initFormat(name, _.bind(this._applyFormat, this, name))
    )
    @quill.on(Quill.events.SELECTION_CHANGE, (range) =>
      this.updateActive(range) if range?
    )
    @quill.on(Quill.events.TEXT_CHANGE, => this.updateActive())
    @quill.onModuleLoad('keyboard', (keyboard) =>
      keyboard.addHotkey([dom.KEYS.BACKSPACE, dom.KEYS.DELETE], =>
        _.defer(_.bind(this.updateActive, this))
      )
    )
    dom(@container).addClass('ql-toolbar')
    dom(@container).addClass('ios') if dom.isIOS()  # Fix for iOS not losing hover state after click

  initFormat: (format, callback) ->
    selector = ".ql-#{format}"
    if Toolbar.formats.SELECT[format]?
      selector = "select#{selector}"    # Avoid selecting the picker container
      eventName = 'change'
    else
      eventName = 'click'
    input = @container.querySelector(selector)
    return unless input?
    @inputs[format] = input
    dom(input).on(eventName, =>
      value = if eventName == 'change' then dom(input).value() else !dom(input).hasClass('ql-active')
      @preventUpdate = true
      @quill.focus()
      range = @quill.getSelection()
      callback(range, value) if range?
      @quill.editor.selection.scrollIntoView() if dom.isIE(11)
      @preventUpdate = false
      return false
    )

  setActive: (format, value) ->
    value = false if format == 'image'  # TODO generalize to all embeds
    input = @inputs[format]
    return unless input?
    $input = dom(input)
    if input.tagName == 'SELECT'
      @triggering = true
      selectValue = $input.value(input)
      value = $input.default()?.value unless value?
      value = '' if Array.isArray(value)  # Must be a defined falsy value
      if value != selectValue
        if value?
          $input.option(value)
        else
          $input.reset()
      @triggering = false
    else
      $input.toggleClass('ql-active', value or false)

  updateActive: (range, formats = null) ->
    range or= @quill.getSelection()
    return unless range? and !@preventUpdate
    activeFormats = this._getActive(range)
    _.each(@inputs, (input, format) =>
      if !Array.isArray(formats) or formats.indexOf(format) > -1
        this.setActive(format, activeFormats[format])
      return true
    )

  _applyFormat: (format, range, value) ->
    return if @triggering
    if range.isCollapsed()
      @quill.prepareFormat(format, value, 'user')
    else if Toolbar.formats.LINE[format]?
      @quill.formatLine(range, format, value, 'user')
    else
      @quill.formatText(range, format, value, 'user')
    _.defer( =>
      this.updateActive(range, ['bullet', 'list'])  # Clear exclusive formats
      this.setActive(format, value)
    )

  _getActive: (range) ->
    leafFormats = this._getLeafActive(range)
    lineFormats = this._getLineActive(range)
    return _.defaults({}, leafFormats, lineFormats)

  _getLeafActive: (range) ->
    if range.isCollapsed()
      [line, offset] = @quill.editor.doc.findLineAt(range.start)
      if offset == 0
        contents = @quill.getContents(range.start, range.end + 1)
      else
        contents = @quill.getContents(range.start - 1, range.end)
    else
      contents = @quill.getContents(range)
    formatsArr = _.map(contents.ops, 'attributes')
    return this._intersectFormats(formatsArr)

  _getLineActive: (range) ->
    formatsArr = []
    [firstLine, offset] = @quill.editor.doc.findLineAt(range.start)
    [lastLine, offset] = @quill.editor.doc.findLineAt(range.end)
    lastLine = lastLine.next if lastLine? and lastLine == firstLine
    while firstLine? and firstLine != lastLine
      formatsArr.push(_.clone(firstLine.formats))
      firstLine = firstLine.next
    return this._intersectFormats(formatsArr)

  _intersectFormats: (formatsArr) ->
    return _.reduce(formatsArr.slice(1), (activeFormats, formats = {}) ->
      activeKeys = Object.keys(activeFormats)
      formatKeys = if formats? then Object.keys(formats) else {}
      intersection = _.intersection(activeKeys, formatKeys)
      missing = _.difference(activeKeys, formatKeys)
      added = _.difference(formatKeys, activeKeys)
      _.each(intersection, (name) ->
        if Toolbar.formats.SELECT[name]?
          if Array.isArray(activeFormats[name])
            activeFormats[name].push(formats[name]) if activeFormats[name].indexOf(formats[name]) < 0
          else if activeFormats[name] != formats[name]
            activeFormats[name] = [activeFormats[name], formats[name]]
      )
      _.each(missing, (name) ->
        if Toolbar.formats.TOGGLE[name]?
          delete activeFormats[name]
        else if Toolbar.formats.SELECT[name]? and !Array.isArray(activeFormats[name])
          activeFormats[name] = [activeFormats[name]]
      )
      _.each(added, (name) ->
        activeFormats[name] = [formats[name]] if Toolbar.formats.SELECT[name]?
      )
      return activeFormats
    , formatsArr[0] or {})


Quill.registerModule('toolbar', Toolbar)
module.exports = Toolbar
