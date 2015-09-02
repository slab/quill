Quill = require('../quill')
_     = Quill.require('lodash')
dom   = Quill.require('dom')


class Toolbar
  @DEFAULTS:
    container: null

  constructor: (@quill, @options) ->
    @options = { container: @options } if _.isString(@options) or _.isElement(@options)
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container = if _.isString(@options.container) then document.querySelector(@options.container) else @options.container
    dom(@container).addClass('ql-toolbar')
    dom(@container).addClass('ios') if dom.isIOS()  # Fix for iOS not losing hover state after click
    this.initFormats()

  initFormats: ->
    @quill.options.formats.forEach((format) =>
      input = @container.querySelector('.ql-' + format)
      return unless input?
      eventName = if input.tagName == 'SELECT' then 'change' else 'click'
      dom(input).on(eventName, =>
        value = if input.tagName == 'SELECT' then dom(input).value() else !dom(input).hasClass('ql-active')
        range = @quill.getSelection(true)
        if range?
          if range.isCollapsed()
            @quill.prepareFormat(format, value)
          else
            @quill.formatText(range, format, value, @quill.constructor.sources.USER)
            @quill.setSelection(range)
            @quill.selection.scrollIntoView() if dom.isIE(11)
          if eventName == 'click'
            dom(input).toggleClass('ql-active')
        return false
      )
    )


Quill.registerModule('toolbar', Toolbar)
module.exports = Toolbar
