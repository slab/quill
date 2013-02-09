initButtonFormats = ->
  _.each(ScribeToolbar.BUTTON_FORMATS, (format) =>
    button = @container.querySelector(".#{format}")
    return unless button?
    button.addEventListener('click', =>
      @editor.selection.format(format, !button.classList.contains('active')) if button?.classList?
    )
  )

initLinkFormat = ->
  linkButton = @container.querySelector('.link')
  return unless linkButton?
  linkButton.addEventListener('click', =>
    if linkButton.classList.contains('active')
      @editor.selection.format('link', false)
    else
      range = @editor.selection.getRange()
      @editor.selection.format('link', range.getText())
  )

initSelectFormats = ->
  _.each(ScribeToolbar.SELECT_FORMATS, (format) =>
    select = @container.querySelector(".#{format}")
    return unless select?
    select.addEventListener('change', =>
      @editor.selection.format(format, select.options[select.selectedIndex].value)
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
          elem.value = value
        else
          elem.classList.add('active')
    )
  )


class ScribeToolbar
  @BUTTON_FORMATS: ['bold', 'italic', 'strike', 'underline', 'bullet', 'list', 'indent', 'outdent']
  @SELECT_FORMATS: ['background', 'color', 'family', 'size']

  constructor: (@container, @editor) ->
    initButtonFormats.call(this)
    initLinkFormat.call(this)
    initSelectFormats.call(this)
    initSelectionListener.call(this)


window.Scribe ||= {}
window.Scribe.Toolbar = ScribeToolbar
