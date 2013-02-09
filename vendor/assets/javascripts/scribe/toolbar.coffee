class ScribeToolbar
  @BUTTON_FORMATS: ['bold', 'italic', 'strike', 'underline', 'bullet', 'list', 'indent', 'outdent']
  @SELECT_FORMATS: ['background', 'color', 'family', 'size']

  constructor: (@container, @editor) ->
    _.each(ScribeToolbar.BUTTON_FORMATS, (format) =>
      button = @container.querySelector(".#{format}")
      button.addEventListener('click', =>
        @editor.selection.format(format, !button.classList.contains('active')) if button?.classList?
      )
    )
    _.each(ScribeToolbar.SELECT_FORMATS, (format) =>
      select = @container.querySelector(".#{format}")
      select.addEventListener('change', =>
        @editor.selection.format(format, select.options[select.selectedIndex].value)
      )
    )
    @editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) =>
      formats = selection.getFormats()
      _.each(@container.querySelectorAll('.active'), (button) =>
        button.classList.remove('active')
      )
      _.each(formats, (value, key) =>
        if value?
          elem = @container.querySelector(".#{key}")
          if elem.tagName == 'SELECT'
            elem.value = value
          else
            elem.classList.add('active')
      )
    )


window.Scribe ||= {}
window.Scribe.Toolbar = ScribeToolbar
