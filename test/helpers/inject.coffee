# Inject fixtures into DOM
html = _.map(window.__html__, (html) ->
  return html
).join('')

$div = $('<div>').attr('id', 'test-container')
$(document.body).prepend($div)

window.resetContainer = ->
  return $div.html(html).get(0)

window.resetContainer()
