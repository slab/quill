Scribe = require('../scribe')


initFormats = ->
  _.each(Scribe.Toolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      input = @container.querySelector(".#{format}")
      return unless input?
      return new Scribe.LinkTooltip(input, this) if format == 'link'
      eventName = if formatGroup == 'SELECT' then 'change' else 'click'
      Scribe.DOM.addEventListener(input, eventName, =>
        value = if input.tagName == 'SELECT' then input.options[input.selectedIndex].value else !Scribe.DOM.hasClass(input, 'active')
        range = @editor.getSelection()
        range.formatContents(format, value, { source: 'user' })
        this.emit(Scribe.Toolbar.events.FORMAT, format, value) unless range.isCollapsed()
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
    @editor.on(Scribe.Editor.events.POST_EVENT, (eventName) =>
      return unless eventName == Scribe.Editor.events.API_TEXT_CHANGE or eventName == Scribe.Editor.events.USER_TEXT_CHANGE or eventName == Scribe.Editor.events.SELECTION_CHANGE
      this.update()
    )
    this.on(Scribe.Toolbar.events.FORMAT, =>
      @editor.root.focus()
    )

  update: ->
    range = @editor.getSelection()
    _.each(@container.querySelectorAll('.active'), (button) =>
      Scribe.DOM.removeClass(button, 'active')
    )
    _.each(@container.querySelectorAll('select'), (select) =>
      Scribe.DOM.resetSelect(select)
    )
    return unless range?
    _.each(range.getFormats(), (value, key) =>
      if value?
        elem = @container.querySelector(".#{key}")
        return unless elem?
        if elem.tagName == 'SELECT'
          value = '' if _.isArray(value)
          elem.value = value
        else
          Scribe.DOM.addClass(elem, 'active')
    )



module.exports = Scribe
