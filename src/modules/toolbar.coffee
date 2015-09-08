Quill = require('../quill')
platform = require('../lib/platform')


class Toolbar
  @DEFAULTS:
    container: null

  constructor: (@quill, @options = {}) ->
    @container = if typeof @options.container == 'string' then document.querySelector(@options.container) else @options.container
    throw new Error('container required for toolbar', @options) unless @options.container?
    @container.classList.add('ql-toolbar')
    @container.classList.add('ios') if platform.isIOS()  # Fix for iOS not losing hover state after click
    this.initFormats()

  initFormats: ->
    @quill.options.formats.forEach((format) =>
      input = @container.querySelector('.ql-' + format)
      return unless input?
      eventName = if input.tagName == 'SELECT' then 'change' else 'click'
      input.addEventListener(eventName, =>
        if input.tagName == 'SELECT'
          value = if input.selectedIndex > -1 then input.options[input.selectedIndex].value else ''
        else
          value = !input.classList.contains('ql-active')
        range = @quill.getSelection(true)
        if range?
          if range.isCollapsed()
            @quill.prepareFormat(format, value)
          else
            @quill.formatText(range, format, value, @quill.constructor.sources.USER)
            @quill.setSelection(range)
            @quill.selection.scrollIntoView() if platform.isIE(10)
          if eventName == 'click'
            input.classList.toggle('ql-active')
        return false
      )
    )


Quill.registerModule('toolbar', Toolbar)
module.exports = Toolbar
