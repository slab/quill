Scribe = require('../scribe')


getValue = (input) ->
  if input.tagName == 'SELECT'
    return input.options[input.selectedIndex].value
  else if Scribe.DOM.hasClass(input, 'link')
    if !Scribe.DOM.hasClass(input, 'active')
      range = @editor.selection.getRange()
      return range.getText()
    else
      return false
  else
    return Scribe.DOM.hasClass(input, 'active')

initActiveFormatListener = ->
  @editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) =>
    _.each(@container.querySelectorAll('.active'), (button) =>
      Scribe.DOM.removeClass(button, 'active')
    )
    _.each(@container.querySelectorAll('select'), (select) =>
      select.querySelector('option[selected]').selected = true
    )
    return unless selection?
    _.each(selection.getFormats(), (value, key) =>
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

initFormats = ->
  _.each(Scribe.Toolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      input = @container.querySelector(".#{format}")
      return unless input?
      eventName = if formatGroup == 'SELECT' then 'change' else 'click'
      input.addEventListener(eventName, =>
        @editor.selection.format(format, getValue(input), { source: 'user' })
        this.emit(Scribe.Toolbar.events.FORMAT, format, value)
      )
    )
  )


class Scribe.Toolbar extends EventEmitter2
  @formats:
    BUTTON: ['bold', 'italic', 'strike', 'underline', 'link', 'bullet', 'indent', 'outdent']
    SELECT: ['background', 'color', 'family', 'size']

  @events:
    FORMAT: 'format'

  constructor: (@container, @editor) ->
    @container = document.getElementById(@container) if _.isString(@container)
    initFormats.call(this)
    initActiveFormatListener.call(this)
    this.on(Scribe.Toolbar.events.FORMAT, =>
      @editor.root.focus()
    )


module.exports = Scribe
