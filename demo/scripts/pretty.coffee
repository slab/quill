curLink = linkTooltip = null

showLinkEditor = (editor, link, change = false) ->
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
  linkTooltip = $('.link-tooltip').appendTo(editor.doc.root.parentNode)
  $('a', editor.doc.root).on('click', (event) ->
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

initToolbar = (editor) ->
  _.each(['family', 'size'], (format) ->
    $(".formatting-container .#{format}").dropkick({
      change: (value) ->
        editor.selection.format(format, $(this).val())
      width: 75
    })
  )
  $('.dk_container').click( ->
    that = this
    $('.dk_container.dk_open').each( ->
      $(this).removeClass('dk_open') if that != this
    )
  )
  _.each(['bold', 'italic', 'strike', 'underline', 'list', 'bullet', 'outdent', 'indent'], (format) ->
    $(".formatting-container .#{format}").click( ->
      editor.selection.format(format, !$(this).parent().hasClass('active'))
    )
  )
  $(".formatting-container .link").click( ->
    selection = editor.getSelection()
    link = if $(this).parent().hasClass('active') then false else selection.getText()
    editor.selection.format('link', link)
    selection = editor.getSelection()
    boundries = [selection.start.leafNode, selection.end.leafNode]
    _.each(boundries, (node, index) ->
      while node.parentNode?.childNodes.length == 1
        boundries[index] = node.parentNode
        node = node.parentNode
    )
    unless _.any(boundries, (node) ->
      if node.tagName == 'A'
        showLinkEditor(editor, node)
        return true
      return false
    )
      $link = $('a', boundries[0]).first() or $('a', boundries[0]).first()
      showLinkEditor(editor, $link.get(0)) if $link
  )
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) ->
    formats = selection.getFormats()
    $(".formatting-container .format-button").removeClass('active')
    $(".formatting-container .format-dropdown .default").each(->
      $(this).parent().val($(this).val()).change()
    )
    for key,value of formats
      container = $(".formatting-container .#{key}")
      if container.is('select')
        if !_.isArray(value)
          container.val(value).change()
        else
          $(".formatting-container .#{key}").dropkick('set', ' ')
      else
        container.parent().addClass('active')
  )


$(document).ready( ->
  editor = new Scribe.Editor("editor-container", {
    styles: {
      'a': { 'color': '#06c' }
      '.editor': { 'min-height': '95%' }
    }
  })
  
  initToolbar(editor)
  initLinkEditor(editor)
)