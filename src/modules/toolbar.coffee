Scribe = require('../scribe')


initActiveFormatListener = ->
  @editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) =>
    formats = selection.getFormats()
    _.each(@container.querySelectorAll('.active'), (button) =>
      Scribe.DOM.removeClass(button, 'active')
    )
    _.each(formats, (value, key) =>
      if value?
        elem = @container.querySelector(".#{key}")
        return unless elem?
        if elem.tagName == 'SELECT'
          value = '' if _.isArray(value)
          elem.value = value
        else
          Scribe.DOM.addClass(elem, 'active')
    )
  )

initLinkFormat = ->
  linkButton = @container.querySelector('.link')
  return unless linkButton?
  linkButton.addEventListener('click', =>
    value = false
    if !Scribe.DOM.hasClass(linkButton, 'active')
      range = @editor.selection.getRange()
      value = range.getText()
    @editor.selection.format('link', value, false)
    this.emit(Scribe.Toolbar.events.FORMAT, 'link', value)
  )

initFormats = ->
  _.each(Scribe.Toolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      input = @container.querySelector(".#{format}")
      return unless input?
      eventName = if formatGroup == 'SELECT' then 'change' else 'click'
      input.addEventListener(eventName, =>
        value = if formatGroup == 'SELECT' then input.options[input.selectedIndex].value else Scribe.DOM.hasClass(input, 'active')
        @editor.selection.format(format, value, { source: 'user' })
        this.emit(Scribe.Toolbar.events.FORMAT, format, value)
      )
    )
  )


class Scribe.Toolbar extends EventEmitter2
  @formats:
    BUTTON: ['bold', 'italic', 'strike', 'underline', 'bullet', 'indent', 'outdent']
    SELECT: ['background', 'color', 'family', 'size']

  @events:
    FORMAT: 'format'

  constructor: (@container, @editor) ->
    @container = document.getElementById(@container) if _.isString(@container)
    initFormats.call(this)
    initLinkFormat.call(this)
    initActiveFormatListener.call(this)
    this.on(Scribe.Toolbar.events.FORMAT, =>
      @editor.root.focus()
    )


module.exports = Scribe
