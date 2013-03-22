Scribe = require('../scribe')


initButtonFormats = ->
  _.each(Scribe.Toolbar.BUTTON_FORMATS, (format) =>
    button = @container.querySelector(".#{format}")
    return unless button?
    button.addEventListener('click', =>
      value = !button.classList.contains('active')
      @editor.selection.format(format, value)
      this.emit(Scribe.Toolbar.events.FORMAT, format, value)
    )
  )

initLinkFormat = ->
  linkButton = @container.querySelector('.link')
  return unless linkButton?
  linkButton.addEventListener('click', =>
    value = false
    if !linkButton.classList.contains('active')
      range = @editor.selection.getRange()
      value = range.getText()
    @editor.selection.format('link', value)
    this.emit(Scribe.Toolbar.events.FORMAT, 'link', value)
  )

initSelectFormats = ->
  _.each(Scribe.Toolbar.SELECT_FORMATS, (format) =>
    select = @container.querySelector(".#{format}")
    return unless select?
    select.addEventListener('change', =>
      value = select.options[select.selectedIndex].value
      @editor.selection.format(format, value)
      this.emit(Scribe.Toolbar.events.FORMAT, format, value)
    )
  )

initSelectionListener = ->
  @editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) =>
    formats = selection.getFormats()
    _.each(@container.querySelectorAll('.active'), (button) =>
      button.classList.remove('active')
    )
    _.each(formats, (value, key) =>
      if value?
        elem = @container.querySelector(".#{key}")
        return unless elem?
        if elem.tagName == 'SELECT'
          value = '' if _.isArray(value)
          elem.value = value
        else
          elem.classList.add('active')
    )
  )


class Scribe.Toolbar extends EventEmitter2
  @BUTTON_FORMATS: ['bold', 'italic', 'strike', 'underline', 'bullet', 'list', 'indent', 'outdent']
  @SELECT_FORMATS: ['background', 'color', 'family', 'size']

  @events:
    FORMAT: 'format'

  constructor: (@container, @editor) ->
    @container = document.getElementById(@container) if _.isString(@container)
    initButtonFormats.call(this)
    initLinkFormat.call(this)
    initSelectFormats.call(this)
    initSelectionListener.call(this)


module.exports = Scribe
