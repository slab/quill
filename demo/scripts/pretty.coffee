curLink = linkTooltip = null

showLinkEditor = (editor, link) ->
  curLink = link
  url = $(link).attr('href')
  $('.url', linkTooltip).text(url).attr('href', url)
  $('.url-editor', linkTooltip).val(url)
  linkTooltip.show()
  offset = $(link).offset()
  left = offset.left + $(link).width() / 2 - linkTooltip.width() / 2
  left = Math.min(Math.max(10, left), $(editor.doc.root).width() - linkTooltip.width())
  top = offset.top + $(link).height() + 5
  if top > $('#editor-container').height() - linkTooltip.height()
    top = offset.top - linkTooltip.height() - $(link).height() - 5
  linkTooltip.css({ left: left, top: top })
  $('.change', linkTooltip).click()

initLinkEditor = (editor) ->
  editor.renderer.addStyles(
    '.link-tooltip':
      'background-color': '#fff'
      'border': '1px solid #ccc'
      'box-shadow': '0px 0px 5px #ddd'
      'color': '#222'
      'display': 'none'
      'font-family': 'Helvetica, Arial, san-serif'
      'font-size': '13px'
      'padding': '5px 10px'
      'position': 'absolute'
      'white-space': 'nowrap'
    '.link-tooltip a':
      'color': '#06c'
      'cursor': 'pointer'
    '.link-tooltip .title':
      'margin-right': '5px'
    '.link-tooltip .url-editor':
      'display': 'none'
    '.link-tooltip.editing .url':
      'display': 'none'
    '.link-tooltip.editing .url-editor':
      'display': 'inline'
  )
  linkTooltip = $('.link-tooltip')
  $(editor.doc.root).on('click', 'a', (event) ->
    showLinkEditor(editor, this)
  )
  $('.url-editor', linkTooltip).keyup((event) ->
    $('.change', linkTooltip).trigger('click') if event.which == 13
  )
  $('.change', linkTooltip).toggler({
    target: linkTooltip
    toggleClass: 'editing'
    before: (event, hasClass) ->
      if hasClass
        $('.url-editor', linkTooltip).width($('.url', linkTooltip).width() + 10)
    after: (event, hasClass) ->
      if hasClass
        $('.url-editor', linkTooltip).focus()
        $('.change', linkTooltip).text('Done')
      else
        url = $('.url-editor', linkTooltip).val()
        url = 'https://' + url unless url.match(/http[s]{0,1}:\/\//)
        if curLink?
          $(curLink).attr('href', url)
          protocol = $(curLink).get(0).protocol
          $(curLink).attr('about:blank') if $(curLink).get(0).protocol
        $('.url', linkTooltip).text(url).attr('href', url)
        $('.change', linkTooltip).text('Change')
        editor.update()
  })
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) ->
    formats = selection.getFormats()
    linkTooltip.hide() unless formats['link']?
  )
  _.defer( ->
    linkTooltip.appendTo(editor.doc.root.parentNode)
  )

initToolbar = (editor) ->
  toolbar = new Scribe.Toolbar('formatting-container', editor)
  dropkickFormats = ['family', 'size']
  $('.dk_container').click( ->
    that = this
    $('.dk_container.dk_open').each( ->
      $(this).removeClass('dk_open') if that != this
    )
  )
  _.each(dropkickFormats, (format) ->
    $(".formatting-container .#{format}").dropkick({
      change: (value) -> editor.selection.format(format, value)
      width: 75
    })
  )
  toolbar.on(Scribe.Toolbar.events.FORMAT, (format, value) ->
    if _.indexOf(dropkickFormats, format) > -1
      $("#formatting-container .#{format}").dropkick('set', ' ')
    else if format == 'link'
      selection = editor.getSelection()
      node = selection.start.leafNode or selection.end.leafNode
      $(node).click() if node?
  )
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) ->
    formats = selection.getFormats()
    _.each(formats, (value, key) =>
      if _.indexOf(dropkickFormats, key) > -1
        if _.isArray(value)
          $("#formatting-container .#{key}").dropkick('set', ' ')
        else
          $("#formatting-container .#{key}").val(value).change()
    )
  )


$(document).ready( ->
  editor = new Scribe.Editor("editor-container", {
    styles: {
      'a': { 'color': '#06c' }
    }
  })

  initToolbar(editor)
  initLinkEditor(editor)
)