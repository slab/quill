# Inject fixtures into DOM
html = _.map(window.__html__, (html) ->
  return html
).join('')

$div = $('<div>').attr('id', 'test-container')
$(document.body).prepend($div)

jasmine.clearContainer = ->
  return $div.html('<div></div>').get(0).firstChild

jasmine.resetEditor = ->
  return $div.html(html).get(0).querySelector('#editor-container')
