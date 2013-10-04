ScribeDOM         = require('../dom')
ScribeEditor      = require('../editor')
ScribeRange       = require('../range')
ScribeLinkTooltip = require('./link-tooltip')


initFormats = ->
  _.each(ScribeToolbar.formats, (formats, formatGroup) =>
    _.each(formats, (format) =>
      input = @container.querySelector(".#{format}")
      return unless input?
      return new ScribeLinkTooltip(input, this) if format == 'link'
      eventName = if formatGroup == 'SELECT' then 'change' else 'click'
      ScribeDOM.addEventListener(input, eventName, =>
        value = if input.tagName == 'SELECT' then input.options[input.selectedIndex].value else !ScribeDOM.hasClass(input, 'active')
        @editor.root.focus()
        range = @editor.getSelection()
        if range
          range.format(format, value, { source: 'user' })
          this.emit(ScribeToolbar.events.FORMAT, format, value)
          if value == true
            ScribeDOM.addClass(@container.querySelector(".#{format}"), 'active')
          else if value == false
            ScribeDOM.removeClass(@container.querySelector(".#{format}"), 'active')
          # Non-boolean values implies SELECT input instead of BUTTON
      )
    )
  )


class ScribeToolbar extends EventEmitter2
  @formats:
    BUTTON: ['bold', 'italic', 'strike', 'underline', 'link', 'indent', 'outdent']
    SELECT: ['back-color', 'fore-color', 'font-name', 'size']

  @events:
    FORMAT: 'format'

  constructor: (@container, @editor) ->
    @container = document.getElementById(@container) if _.isString(@container)
    initFormats.call(this)
    @editor.on(ScribeEditor.events.POST_EVENT, (eventName) =>
      return unless eventName == ScribeEditor.events.API_TEXT_CHANGE or eventName == ScribeEditor.events.USER_TEXT_CHANGE or eventName == ScribeEditor.events.SELECTION_CHANGE
      this.update()
    )

  update: ->
    range = @editor.getSelection()
    _.each(@container.querySelectorAll('.active'), (button) =>
      ScribeDOM.removeClass(button, 'active')
    )
    _.each(@container.querySelectorAll('select'), (select) =>
      ScribeDOM.resetSelect(select)
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
          ScribeDOM.addClass(elem, 'active')
    )



module.exports = ScribeToolbar
